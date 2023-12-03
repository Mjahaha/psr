import { data } from "./data.js";
import { itemClass } from "./itemClass.js";

export const setUpStartDetails = () => {
    //creates a form input labelled 'How many rocks, papers and scissors in this battle:'  
    //and radio buttons with a choice of 'Capture' and 'Kill'
    //and a button labelled 'Start Battle'
    data.startDetails.innerHTML = `
    <h1>Welcome to<br>Rock, Paper, Scissors Battle Royale!</h1>
    <form>
        <label for="num">How many of each item should we spawn?</label>
        <input type="number" id="num" name="num" min="1" max="90" value="5">
        <br>
        <div> 
        <label for="capture">Capture:</label>
        <input type="radio" id="capture" name="captureKill" value="capture" checked>
        <label for="kill">Kill:</label> 
        <input type="radio" id="kill" name="captureKill" value="kill">
        </div>
        <div> 
        <label for="FFA">Free for all:</label>
        <input type="radio" id="FFA" name="gameMode" value="FFA" checked>
        <label for="redVBlue">Red v Blue:</label> 
        <input type="radio" id="redVBlue" name="gameMode" value="redVBlue">
        </div>
        <br>
        <input id="startBattle" type="submit" value="Start Battle">
    </form>
    `;
}


//this function populates the field with 'num' of items
export const populateFieldClassic = (num) => {
    for (let i = 0; i < num; i++) {
        let whichItem = i % 3;
        if (whichItem === 0) { new itemClass("rock", "unaligned"); }
        else if (whichItem === 1) { new itemClass("paper", "unaligned"); }
        else { new itemClass("scissors", "unaligned"); }
    }
}

//this function populates the field with 'num' of items on each team 
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
        if (whichItem === 0) { new itemClass("scissors", teamClass) }
        else if (whichItem === 1) { new itemClass("rock", teamClass) }
        else { new itemClass("paper", teamClass) }
    }
}