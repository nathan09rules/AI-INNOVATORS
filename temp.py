import json

with open("C:/Users/Nathan/Documents/programing/py'/AI INNOVATORS/static/data.json","r") as file:
    data = json.load(file)

al = []
for s in data["symptoms"]:
    al.append(str(s))
print(al)