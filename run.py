import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

from flask import Flask , request , jsonify , render_template
from flask_cors import CORS
import json

import tensorflow as tf
import numpy as np
import pandas as pd

model = tf.keras.models.load_model("C:/Users/Nathan/Documents/programing/py'/AI INNOVATORS/static/DIS1_small.keras")

with open("C:/Users/Nathan/Documents/programing/py'/AI INNOVATORS/static/data.json","r") as file:
    data = json.load(file)

symptoms = data["symptoms"]
symptoms = [np.nan if x=="nan" else x for x in symptoms]

disease = data["diseases"]

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/predict' , methods = ['POST'])
def predict():
    data = request.get_json()
    inputed = data.get("inputed" , "")
    inputed[73] = 1
    inputed =  pd.DataFrame([inputed], columns=symptoms)


    result = model.predict(inputed)
    top_5 = (np.argsort(result)).tolist()[0][::-1][:5]

    reponse = []
    for i in top_5:
        reponse.append(disease[i])

    return jsonify({"result" : reponse})

if __name__ == "__main__":
    app.run(debug = True)