import { data } from "./data.js";

export const populateField = (num) => {
    for (let i = 0; i < num; i++) {
        let whichItem = i % 3;
        let itemX = Math.random() * data.screenWidth;
        let itemY = Math.random() * data.screenHeight;
        if (whichItem === 0) {
            data.field.innerHTML += `<div class="item rock" id="${i}" style="left:${itemX}px; top:${itemY}px;"></div>`;
        }
        else if (whichItem === 1) {
            data.field.innerHTML += `<div class="item paper" id="${i}" style="left:${itemX}px; top:${itemY}px;"></div>`;
        }
        else {
            data.field.innerHTML += `<div class="item scissors" id="${i}" style="left:${itemX}px; top:${itemY}px;"></div>`;
        }
    }
    console.log(data.allItemsX);
}