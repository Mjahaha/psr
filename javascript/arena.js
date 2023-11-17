import { data } from "./data.js";

export const setUpStartDetails = () => {
    //creates a form input labelled 'How many rocks, papers and scissors in this battle:'  
    //and radio buttons with a choice of 'Capture' and 'Kill'
    //and a button labelled 'Start Battle'
    data.startDetails.innerHTML = `
    <h1>Welcome to<br>Rock, Paper, Scissors Battle Royale!</h1>
    <form>
        <label for="num">How many of each item should we spawn?</label>
        <input type="number" id="num" name="num" min="1" max="90" value="20">
        <br>
        <div>
        <label for="capture">Capture:</label>
        <input type="radio" id="capture" name="captureKill" value="capture" checked>
        <label for="kill">Kill:</label> 
        <input type="radio" id="kill" name="captureKill" value="kill">
        </div>
        <br>
        <input id="startBattle" type="submit" value="Start Battle">
    </form>
    `;
}



export const populateFieldClassic = (num) => {
    for (let i = 0; i < num; i++) {
        let whichItem = i % 3;
        let itemX = Math.random() * data.screenWidth;
        let itemY = Math.random() * data.screenHeight;
        if (whichItem === 0) {
            data.field.innerHTML += `<div class="item rock unaligned" id="${i}" style="left:${itemX}px; top:${itemY}px;"></div>`;
        }
        else if (whichItem === 1) {
            data.field.innerHTML += `<div class="item paper unaligned" id="${i}" style="left:${itemX}px; top:${itemY}px;"></div>`;
        }
        else {
            data.field.innerHTML += `<div class="item scissors unaligned" id="${i}" style="left:${itemX}px; top:${itemY}px;"></div>`;
        }
    }
    console.log(data.allItemsX);
}

export const populateFieldTeams = (num) => {
    for (let i = 0; i < 2 * num; i++) {
        let whichItem = i % 3;
        let itemX = Math.random() * data.screenWidth * 0.4;
        let itemY = Math.random() * data.screenHeight;
        let teamClass = "blue";
        if (i % 2 === 0) {
            itemX += data.screenWidth * 0.6;
            teamClass = "red";
        }
        if (whichItem === 0) {
            data.field.innerHTML += `<div class="item rock ${teamClass}" id="${i}" style="left:${itemX}px; top:${itemY}px;"></div>`;
        }
        else if (whichItem === 1) {
            data.field.innerHTML += `<div class="item paper ${teamClass}" id="${i}" style="left:${itemX}px; top:${itemY}px;"></div>`;
        }
        else {
            data.field.innerHTML += `<div class="item scissors ${teamClass}" id="${i}" style="left:${itemX}px; top:${itemY}px;"></div>`;
        }
    }
}