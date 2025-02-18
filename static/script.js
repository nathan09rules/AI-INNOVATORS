console.log("start");
        
let symptoms = [];

async function load_symptoms(){
    const response = await fetch('/static/data.json');
    symptoms = await response.json();
    symptoms = symptoms.symptoms
    const datalist = document.getElementById("symptoms");
    symptoms.forEach(symptom => {
        const option = document.createElement("option");
        option.value = symptom;
        datalist.appendChild(option)
        
    });
}

load_symptoms();

document.getElementById("add").onclick = function(){
    const ninput = document.createElement("input");
    ninput.setAttribute('list' ,  "symptoms");
    ninput.classList.add('inputed');
    ninput.placeholder = "symptom";

    document.getElementById('input_container').appendChild(ninput);
}

document.getElementById("form").onsubmit = function(e){
    e.preventDefault();

    const entered = ["nan"];
    document.querySelectorAll('.inputed').forEach(input =>{
        entered.push(input.value)
    })

    list = symptoms.map(sym => entered.includes(sym)? 1 : 0);
    fetch('http://127.0.0.1:5000/predict' , {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({inputed: list})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.getElementById("result").textContent = data.result;
    })
}