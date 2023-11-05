const field = document.getElementById('theField');
const screenWidth = window.innerWidth - 60;
const screenHeight = window.innerHeight - 60;

import { moveItem } from "./movement.js";


const populateField = (num) => {
    for (let i = 0; i < num; i++) {
        let whichItem = i % 3;
        let itemX = Math.random() * window.innerWidth;
        let itemY = Math.random() * window.innerHeight;
        if (whichItem === 0) {
            field.innerHTML += `<div class="item rock" id="${i}" style="left:${itemX}px; top:${itemY}px;"></div>`;
        }
        else if (whichItem === 1) {
            field.innerHTML += `<div class="item paper" id="${i}" style="left:${itemX}px; top:${itemY}px;"></div>`;
        }
        else {
            field.innerHTML += `<div class="item scissors" id="${i}" style="left:${itemX}px; top:${itemY}px;"></div>`;
        }
    }
}
populateField(30);

let runTimestep;
const runTimestepFunction = () => {
    let items = field.children;
    items[0].style.backgroundColor = 'red';
    runTimestep = setInterval(() => {
        //loops over the moveItem function for each item
        for (let i = 0; i < items.length; i++) {
            if (moveItem(items[i], screenWidth, screenHeight, field)) {
                clearInterval(runTimestep);
            }
        }
    }, 1000/60);
}
runTimestepFunction();
