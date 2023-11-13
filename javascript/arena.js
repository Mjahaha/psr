import { data } from "./data.js";

export const setUpStartDetails = () => {
    //creates a form input labelled 'How many rocks, papers and scissors in this battle:' and a button labelled 'Start Battle'
    data.startDetails.innerHTML = `
    <form>
        <label for="num">How many rocks, papers and scissors in this battle:</label>
        <input type="number" id="num" name="num" min="1" max="100">
        <input id="startBattle" type="submit" value="Start Battle">
    `;
    //when button is clicked, run populateField function
}



export const populateFieldClassic = (num) => {
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