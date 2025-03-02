console.log("start");

const is_form_there = document.getElementById("form");
if (is_form_there){

    let symptoms = [];

    async function load_symptoms(){
        const response = await fetch('/static/data.json');
        symptoms = await response.json();
        symptoms = symptoms.symptoms
        const datalist = document.getElementById("symptoms");
        symptoms.forEach(symptom => {
            const option = document.createElement("option");
            option.value = symptom;
            datalist.appendChild(option);
            
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
            document.getElementById("result").textContent = data.result;
        })
    }
}
//all the components done 

// all the drawing stuff

const bdDIV = document.createElement("div");
bdDIV.classList.add("border");
document.body.append(bdDIV);


const shader = document.querySelector(".shader");
const human = document.querySelector(".human_body");

human.addEventListener("click" , (event) => {
    const rect = human.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    shader.style.clipPath = `circle(50px at ${x}px ${y}px)`;
})