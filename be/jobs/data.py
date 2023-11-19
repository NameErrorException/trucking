import paho.mqtt.client as mqtt
import matching
import json
class Data:
    
    events = []
    event_on = False
    
    def __init__(self):
        self.client = mqtt.Client(client_id="NNE02", clean_session=True)
        self.client.username_pw_set("CodeJamUser", "123CodeJam")

        # Assign callback functions
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message

    def on_connect(self, client, userdata, flags, rc):
        print("Connected with result code " + str(rc))
        self.client.subscribe("CodeJam", qos=1)

    def on_message(self, client, userdata, msg):
        try:
            event = json.loads(msg.payload.decode())
            # self.events.append(event)
            
            if event['type'] == 'Start':
                self.event_on = True
                self.events = []
            elif event['type'] == 'End':
                self.event_on = False
            
            if self.event_on:
                self.events.append(event)
                if len(self.events) >= 100:
                    matching.main(self.events)
                    self.events = []
                   
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
        
    def get_data_stream(self):
        self.client.connect("fortuitous-welder.cloudmqtt.com", 1883, 60)
        self.client.loop_forever()

    def get_current_data(self):
        
        temp_data = [
            {"seq":1935,"type":"Truck","timestamp":"2023-11-17T18:43:37","truckId":358,"positionLatitude":36.94601821899414,"positionLongitude":-81.04188537597656,"equipType":"Flatbed","nextTripLengthPreference":"Short"},
            {"seq":1926,"type":"Truck","timestamp":"2023-11-17T18:42:46","truckId":268,"positionLatitude":39.38967514038086,"positionLongitude":-84.36373138427734,"equipType":"Van","nextTripLengthPreference":"Short"},

            {"seq":1921,"type":"Load","timestamp":"2023-11-17T18:41:19","loadId":10408,"originLatitude":42.7893,"originLongitude":-73.9809,"destinationLatitude":41.7761,"destinationLongitude":-72.5213,"equipmentType":"Van","price":497.0,"mileage":129.0},
            {"seq":131,"type":"Load","timestamp":"2023-11-17T09:31:59","loadId":10987,"originLatitude":39.19,"originLongitude":-76.72,"destinationLatitude":41.29,"destinationLongitude":-81.48,"equipmentType":"Van","price":650.0,"mileage":350.0}
        ]
        return temp_data

    def get_filtered(self):
        """
        return the trucks and their notificatons.
        format:
        'truckID': {
            [list of loads]
        }

        notification:
            - return load data without seq and type
            - TODO: add message within the {} for each notification for a truck
        ...
        """
        return [
            {
                "truckId": 358,
                "notifications": [
                    {"timestamp":"2023-11-17T18:41:19","loadId":10408,"originLatitude":42.7893,"originLongitude":-73.9809,"destinationLatitude":41.7761,"destinationLongitude":-72.5213,"equipmentType":"Van","price":497.0,"mileage":129.0},
                ]
            },
            {
                "truckId": 268,
                "notifications": [
                    {"timestamp":"2023-11-17T18:41:19","loadId":10408,"originLatitude":42.7893,"originLongitude":-73.9809,"destinationLatitude":41.7761,"destinationLongitude":-72.5213,"equipmentType":"Van","price":497.0,"mileage":129.0},
                ]
            } 
        ]



if __name__ == "__main__":
    data = Data()
    data.get_data_stream()
