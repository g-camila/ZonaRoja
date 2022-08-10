import json
with open("barrios/barrios_final.json") as d:
    dictData = json.load(d)
    
i = 0
for barrio in dictData["features"]:
    i = i + 1
    dictData["features"][i-1]["properties"]["id"] = i
    print(dictData["features"][i-1]["properties"]["id"] ,barrio["properties"]["Name"] ) 
    
with open("barrios/barrios_id.json", "w") as file:
    json.dump(dictData,file)