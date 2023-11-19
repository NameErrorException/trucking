import json
import math
import heapq
import time
import numpy as np
from collections import defaultdict
import datetime
from scipy.optimize import linear_sum_assignment
import paho.mqtt.client as mqtt
import threading
import queue
import random

# Constants
TIME_WINDOW = datetime.timedelta(minutes=240)  # 6 hours time window
COST_PER_MILE = 1.38
MILES_PER_GALLON = 7
SHORT_TRIP_MAX_MILEAGE = 200  # Define what constitutes a 'short' trip

# Data structures
trucks = {}
trucks_by_type = defaultdict(set)
loads_by_type = defaultdict(list)
unassigned_trucks = set()

all_events = []

# Helper functions
def parse_timestamp(timestamp_str):
    return datetime.datetime.fromisoformat(timestamp_str)

def calculate_distance(lat1, lon1, lat2, lon2):
    return math.sqrt((lat1 - lat2)**2 + (lon1 - lon2)**2)

def calculate_deadhead_cost(truck_position, load_origin):
    distance = calculate_distance(*truck_position, *load_origin)
    return (distance / MILES_PER_GALLON) * COST_PER_MILE

def does_preference_match(truck, load):
    load_mileage = load['mileage']
    if (truck['tripLengthPreference'] == "Short" and load_mileage >= SHORT_TRIP_MAX_MILEAGE) or \
       (truck['tripLengthPreference'] == "Long" and load_mileage < SHORT_TRIP_MAX_MILEAGE):
        return False
    return True

# Event processing function
def process_event(event):
    event_type = event['type']

    if event_type == "Start":
        trucks.clear()
        trucks_by_type.clear()
        loads_by_type.clear()
        unassigned_trucks.clear()

    elif event_type == "Truck":
        truck_id = event['truckId']
        event_id = event['seq']
        equip_type = event['equipType']
        truck_key = (truck_id, event_id)
        trucks[truck_key] = {
            'position': (event['positionLatitude'], event['positionLongitude']),
            'equipType': equip_type,
            'tripLengthPreference': event['nextTripLengthPreference']
        }
        trucks_by_type[equip_type].add(truck_key)
        unassigned_trucks.add(truck_key)

    elif event_type == "Load":
        load_type = event['equipmentType']
        event_time = parse_timestamp(event['timestamp'])
        heapq.heappush(loads_by_type[load_type], (event_time, event['seq'], event))

    elif event_type == "End":
        print("The day is over")

def calculate_score(load, truck, profit_weight = 0.5, deadhead_weight = 0.5, other_weights = 0):
    deadhead_cost = calculate_deadhead_cost(truck['position'], (load['originLatitude'], load['originLongitude']))
    fuel_cost = load['mileage'] / MILES_PER_GALLON * COST_PER_MILE
    total_cost = deadhead_cost + fuel_cost

    # Example of incorporating other weights (education, safety, etc.)
    # Modify as per actual weights and their calculations
    education_weight, safety_weight = 0, 0

    score = (load['price'] - total_cost) * profit_weight - deadhead_cost * deadhead_weight
    score += education_weight + safety_weight
    return score

profit_weight, deadhead_weight, other_weights = 0.5, 0.5, 0

matching_pairs = []

def perform_batch_matching(events, batch_number):
    global matching_pairs
    #matching_pairs = []  # Reset for the new batch

    # Initialize the set for keeping track of matched load IDs
    matched_load_ids = set()
    matched_truck_keys = set()  # Store (truck_id, event_id)
    total_cost = 0  # Initialize total cost for the batch
    
    # Process events and update data structures
    for event in events:
        process_event(event)

    trucks_list = list(unassigned_trucks)
    loads_list = [load for loads in loads_by_type.values() for _, _, load in loads]
    num_trucks = len(trucks_list)
    num_loads = len(loads_list)
    max_dim = max(num_trucks, num_loads)

    # Initialize a square cost matrix with a large cost value
    large_cost = 1e7  # A large cost value to fill dummy rows/columns
    cost_matrix = np.full((max_dim, max_dim), large_cost)

    # Fill the cost matrix with actual costs for available trucks and loads
    for i, truck_id in enumerate(trucks_list):
        for j, load in enumerate(loads_list):
            cost_matrix[i, j] = calculate_score(load, trucks[truck_id], profit_weight, deadhead_weight, other_weights)

    truck_indices, load_indices = linear_sum_assignment(cost_matrix)

    # Assign loads to trucks based on the optimization result and remove them
    for truck_idx, load_idx in zip(truck_indices, load_indices):
        if truck_idx < num_trucks and load_idx < num_loads:
            truck_key = trucks_list[truck_idx]
            load = loads_list[load_idx]
            if truck_key in unassigned_trucks:
                print(f"Batch {batch_number} Assignment: Truck {truck_key[0]} (Event {truck_key[1]}) assigned to Load {load['loadId']} (Event {load['seq']})")
                matching_pairs.append({
                    'truck_id': truck_key[0],
                    'truck_event_id': truck_key[1],
                    'load_id': load['loadId'],
                    'load_event_id': load['seq']
                })
                unassigned_trucks.remove(truck_key)
                remove_assigned_load(load)
                matched_load_ids.add(load['loadId'])
                matched_truck_keys.add(truck_key)

                # Add the cost of this assignment to the total cost
                total_cost += cost_matrix[truck_idx, load_idx]

    if len(matched_truck_keys) > 0:
        print(f"Total Cost for Batch {batch_number}: {total_cost}")
        average_cost = total_cost / len(matched_truck_keys)
        print(f"Average Cost for Batch {batch_number}: {average_cost}")
    else:
        print(f"No assignments made in Batch {batch_number}")

    # Clear matched loads and trucks from events
    return [event for event in events if (event['type'] != 'Load' or event['loadId'] not in matched_load_ids) 
            and (event['type'] != 'Truck' or (event['truckId'], event['seq']) not in matched_truck_keys)]


def end_of_day_matching():
    global matching_pairs
    matching_pairs = []  # Reset for the new batch
    
    trucks_list = list(unassigned_trucks)
    loads_list = [load for loads in loads_by_type.values() for _, _, load in loads]
    num_trucks = len(trucks_list)
    num_loads = len(loads_list)

    # Ensure there are both trucks and loads to match
    if num_trucks == 0 or num_loads == 0:
        print("No trucks or loads available for matching.")
        return

    max_dim = max(num_trucks, num_loads)
    cost_matrix = np.full((max_dim, max_dim), 1e7)

    for i, truck_key in enumerate(trucks_list):
        for j, load in enumerate(loads_list):
            cost_matrix[i, j] = calculate_score(load, trucks[truck_key], profit_weight, deadhead_weight, other_weights)

    truck_indices, load_indices = linear_sum_assignment(cost_matrix)

    # Assign loads to trucks based on the optimization result and remove them
    for truck_idx, load_idx in zip(truck_indices, load_indices):
        truck_id = trucks_list[truck_idx]
        load = loads_list[load_idx]
        print(f"End of Day Assignment: Truck {truck_id} assigned to Load {load['loadId']}")
        matching_pairs.append({
                    'truck_id': truck_key[0],
                    'truck_event_id': truck_key[1],
                    'load_id': load['loadId'],
                    'load_event_id': load['seq']
                })
        unassigned_trucks.remove(truck_id)
        remove_assigned_load(load)



def driver_decision(truck_id, load):
    # Implement the logic for driver's decision to accept or reject the load.
    # There is no need to implement this function for the CodeJam as there is no enough data to support.
    # Placeholder implementation:
    return True  # Assuming the driver accepts the job


def remove_assigned_load(assigned_load):
    load_type = assigned_load['equipmentType']
    if load_type in loads_by_type:
        loads_by_type[load_type] = [(time, seq, load) for time, seq, load in loads_by_type[load_type] if load['loadId'] != assigned_load['loadId']]

class MqttClient:
    def __init__(self):
        self.client = mqtt.Client(client_id="NNE" + str(random.randint(0, 1000000)), clean_session=True)
        self.client.username_pw_set("CodeJamUser", "123CodeJam")
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.events = []
        self.start_time = None
        self.batch_number = 0
        self.processing = False
    # For example, return True to accept the job or False to reject it.
        self.buffer = []
        self.event_queue = queue.Queue()
        self.processing_thread = None
        self.event_buffer = []  # Buffer for current batch of events
        self.collect_events = False  # Flag to start/stop collecting events
        self.start_time = None  # Time when the first event of the batch was received
    
    def on_connect(self, client, userdata, flags, rc):
        print("Connected with result code " + str(rc))
        self.client.subscribe("CodeJam", qos=1)
        
    def start_processing(self):
        # Processing logic goes here
    # For example, return True to accept the job or False to reject it.
        while True:
            events, batch_number, is_end_of_day = self.event_queue.get()
            if events is None:
                break  # Stop the thread if None is received
            perform_batch_matching(events, batch_number)
            if is_end_of_day:
                end_of_day_matching()
                print("Assignment done")
                #exit (0)
                break  # Exit the processing after end of day
            
    def on_message(self, client, userdata, msg):
        global matching_pairs, all_events
        try:
            event = json.loads(msg.payload.decode())

            if event['type'] == 'Start':
                self.collect_events = True
                self.event_buffer = []
                matching_pairs = []
                all_events = []
                self.start_time = parse_timestamp(event['timestamp'])
                if self.processing_thread and self.processing_thread.is_alive():
                    self.processing_thread.join()
                self.processing_thread = threading.Thread(target=self.start_processing)
                self.processing_thread.start()

            elif self.collect_events and event['type'] == 'End':
                self.collect_events = False
                self.event_queue.put((self.event_buffer, self.batch_number, True))
                

            if self.collect_events:
                current_time = parse_timestamp(event['timestamp'])
                time_condition = current_time - self.start_time >= TIME_WINDOW
                event_count_condition = len(self.event_buffer) >= 100

                if time_condition or event_count_condition:
                    self.batch_number += 1
                    self.event_queue.put((self.event_buffer, self.batch_number, False))
                    self.event_buffer = []
                    self.start_time = current_time
                else:
                    self.event_buffer.append(event)
                    all_events.append(event)

        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            
    def stop_processing(self):
        self.event_queue.put((None, None, None))  # Signal to stop the processing thread
        if self.processing_thread:
            self.processing_thread.join()
            
    def start(self):
        self.client.connect("fortuitous-welder.cloudmqtt.com", 1883, 60)
        self.client.loop_start()  # Non-blocking start
        try:
            while True:
                time.sleep(1)  # Keep the main thread alive
        except KeyboardInterrupt:
            self.stop_processing()
            self.client.loop_stop()

mqtt_client = MqttClient()

def get_current_batch():
    global all_events 
    return all_events

def get_matching_pairs():
    global matching_pairs
    return matching_pairs

def start_client():
    global mqtt_client
    mqtt_client.start()

#start_client()