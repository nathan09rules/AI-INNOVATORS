console.log("start");

let data;
let symptoms = [];
let symptoms_by_body = {};

let symptoms_by_age_gender = {};
let age;
let gender;

async function load_symptoms(){
    const response = await fetch('/static/data.json');
    data = await response.json();

    symptoms = data.symptoms;
    symptoms_by_body = data.body_parts;
    symptoms_by_age_gender = data.age_gender;

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

    document.getElementById("page1").onsubmit = function(e){
        e.preventDefault()

        const input_age = document.getElementById("age").value;
        if (input_age < 3){age = "Infant";}
        else if (input_age < 13){age = "Child";}
        else if (input_age < 20){age = "Teen";}
        else if (input_age < 60){age = "Adult";}
        else {age = "Senior"}
        gender = document.getElementById("gender").value;


        document.getElementById("page1").style.display = "none";
        document.getElementById("page2").style.display = "block";

        /* TRANSITION IF NEEDED
        document.getElementById("page1").classList.add("move_up");
        setTimeout(() => {
            document.getElementById("page1").style.display = "none";
            document.getElementById("page2").style.display = "block";
        },400);
        */
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

    part.textContent = `${x - human_rect.left} px by ${y - human_rect.top} px`;

    let body_part_symp = symptoms_by_body[body_part] ;

    /* Gender class not enough data but irt works
    let gender_age_symp = new Set(symptoms_by_age_gender[age][gender]);
    let symp = body_part_symp.filter(i => gender_age_symp.has(i))
    */

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

function move_up(id_hide , id_show){
    document.getElementById(id_hide).style.display = "none";
    document.getElementById(id_show).style.display = "block";

}