import json

ranking_data = {}

def update_entry(truckId, safety_score):
    ranking_data[str(truckId)] = safety_score

    with open("./be/safety/data/safety_ranking.json", "w") as f:
        f.write(json.dumps(ranking_data, indent=4))

def get_ranking():
    ranking = sorted(ranking_data.items(), key=lambda x: x[1], reverse=True)
    ranking_dict = {}
    for i in range(len(ranking)):
        data = ranking[i]
        ranking_dict[i + 1] = {
            'truckId': data[0],
            'safety_score': data[1]
        }

    return ranking_dict

# fetch data
with open("./be/safety/data/safety_ranking.json") as f:
    ranking_data = json.loads(f.read())
