console.log("start");

let data;
let symptoms = [];
let symptoms_by_body = {};

async function load_symptoms(){
    const response = await fetch('/static/data.json');
    data = await response.json();

    symptoms = data.symptoms;
    symptoms_by_body = data.body_parts;

    const datalist = document.getElementById("symptoms");
    symptoms.forEach(symptom => {
        const option = document.createElement("option");
        option.value = symptom;
        datalist.appendChild(option);
    });
}
load_symptoms();

const is_form_there = document.getElementById("form");
if (is_form_there){

    document.getElementById("add").onclick = function(){
        const ninput = document.createElement("input");
        ninput.classList.add('inputed');
        ninput.setAttribute('list' ,  "symptoms");
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
}else{
    document.getElementById("search_symp").onsubmit = function(e){
        e.preventDefault();

        const inputed = document.getElementById("s_symp").value;
        target = document.getElementById(inputed.slice(1));

        if(target){
            target.scrollIntoView();
        }else{
            alert("not found")
        }


    }
}
//all the components done 

// all the drawing stuff

const bdDIV = document.createElement("div");
bdDIV.classList.add("border");
document.body.append(bdDIV);


const shader = document.querySelector(".shader");
const human = document.querySelector(".human_body");
const info = document.getElementById("info");
const part = document.getElementById("body_part");

const human_rect = human.getBoundingClientRect();
const scaleX = human_rect.width / human.naturalWidth;
const scaleY = human_rect.height / human.naturalHeight;

function body_clicked(event, body_part) {
    const x = event.clientX;
    const y = event.clientY;
    shader.style.clipPath = `circle(10px at ${x}px ${y}px)`;

    part.textContent = body_part;

    let body_part_symp = symptoms_by_body[body_part] || [];
    let size = 0;
    info.innerHTML = body_part_symp.map((symptom, index) => {
        size += symptom.length + 4;
        loca = document.getElementById(symptom) ? ("<a href='#" + symptom + "'>" + symptom + "</a>" ): symptom
        if (size > 50){ // change value
            size = 0;
            return loca + "<br>"
        }
        return  loca + "    "
    }).join("") ;
}
