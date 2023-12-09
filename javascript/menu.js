import { data } from "./data.js";
import { itemClass } from "./itemClass.js";

const populateItemDisplayBox = () => {
    console.log("populateDisplayBox started")
    const itemDisplayContainer = document.querySelector(".itemDisplayContainer");
    const gameMode = document.querySelector('input[name="gameMode"]:checked').value;
    if (gameMode === "FFA") {
        itemDisplayContainer.innerHTML = `
        <div class="itemDisplayBox unalignedRockDisplayBox"></div>
        <div class="itemDisplayBox unalignedPaperDisplayBox"></div>
        <div class="itemDisplayBox unalignedScissorsDisplayBox"></div>`;
    }
    if (gameMode === "redVBlue") {
        itemDisplayContainer.innerHTML = `
        <div class="itemDisplayBox redRockDisplayBox"></div>
        <div class="itemDisplayBox redPaperDisplayBox"></div>
        <div class="itemDisplayBox redScissorsDisplayBox"></div>
        <div class="itemDisplayBox blueRockDisplayBox"></div>
        <div class="itemDisplayBox bluePaperDisplayBox"></div>
        <div class="itemDisplayBox blueScissorsDisplayBox"></div>`;
    }
    document.getElementById('startDetails').appendChild(itemDisplayContainer);
    const theBoxes = document.getElementsByClassName(`itemDisplayBox`);
    console.log(theBoxes)
    const numberOfItems = document.querySelector('#num').value;
    let itemClassToAdd;
    let elementToAdd = document.createElement('div');
    for (let i = 0; i < theBoxes.length; i++) {
        elementToAdd.classList = "";
        if (theBoxes[i].classList.contains("unalignedRockDisplayBox")) { itemClassToAdd = ["rock"]; }
        if (theBoxes[i].classList.contains("unalignedPaperDisplayBox")) { itemClassToAdd = ["paper"]; }
        if (theBoxes[i].classList.contains("unalignedScissorsDisplayBox")) { itemClassToAdd = ["scissors"]; }
        if (theBoxes[i].classList.contains("redRockDisplayBox")) { itemClassToAdd = ["rock","red"]; }
        if (theBoxes[i].classList.contains("redPaperDisplayBox")) { itemClassToAdd = ["paper","red"]; }
        if (theBoxes[i].classList.contains("redScissorsDisplayBox")) { itemClassToAdd = ["scissors","red"]; }
        if (theBoxes[i].classList.contains("blueRockDisplayBox")) { itemClassToAdd = ["rock","blue"]; }
        if (theBoxes[i].classList.contains("bluePaperDisplayBox")) { itemClassToAdd = ["paper","blue"]; }
        if (theBoxes[i].classList.contains("blueScissorsDisplayBox")) { itemClassToAdd = ["scissors","blue"]; }
        elementToAdd.classList.add("itemDisplay");
        elementToAdd.classList.add(...itemClassToAdd);
        for (let j = 0; j < numberOfItems; j++) {
            theBoxes[i].appendChild(elementToAdd.cloneNode(true));
        }
    }
}

export const setUpStartDetails = () => {
    //adds the start details to the DOM
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
        <br>
        <div class="itemDisplayContainer"></div>
    </form>
    `;
    populateItemDisplayBox();   //populates the item display box to show the correct number of items
    //adds a listeners to the gameMode radio buttons that executes populateDisplayBox
    document.querySelectorAll('input[name="gameMode"]').forEach((radio) => {
        radio.addEventListener("change", populateItemDisplayBox);
    });
    document.getElementById('num').addEventListener("change", populateItemDisplayBox);
}

//this function populates the field with 'num' of items
export const populateFieldClassic = (num) => {
    //code to make the items come from the mouse
    let isMouseInWindow = true;
    let mouseCoordsX, mouseCoordsY;
    const findMousePosition = document.addEventListener('mousemove', (event) => {
        isMouseInWindow = true;
        mouseCoordsX = event.clientX;
        mouseCoordsY = event.clientY;
    });
    const findIfMouseExits = document.addEventListener('mouseout', () => {
        isMouseInWindow = false;
        mouseCoordsX = data.screenWidth / 2;
        mouseCoordsY = data.screenHeight / 2;
    });
    
    //loop that creates 'num' of items
    let i = 0;
    const createItemsOnField = setInterval(() => {      //using set interval to create items to have a transition effect
        let actualItemX = Math.random() * data.screenWidth; 
        let actualItemY = Math.random() * data.screenHeight;
        if (data.allItems.length > 0) {     //moving the coords of the previous item after timer, otherwise it was moving before item entered the DOM so no transition
            data.allItems[data.allItems.length - 1].x = actualItemX; 
            data.allItems[data.allItems.length - 1].y = actualItemY; 
        }

        if (i >= num) { clearInterval(createItemsOnField); }    //exits loop when 'num' of items have been created

        let specificsForItem = { 
            x: mouseCoordsX || data.screenWidth / 2, 
            y: mouseCoordsY || data.screenHeight / 2,
        }
        let whichItemType = i % 3;
        let newItem;
        if (whichItemType === 0) { newItem = new itemClass("rock", "unaligned", specificsForItem); }
        else if (whichItemType === 1) { newItem = new itemClass("paper", "unaligned", specificsForItem); }
        else { newItem = new itemClass("scissors", "unaligned", specificsForItem); }
        console.log(`the start coords are ${actualItemX}, ${actualItemY} and the mouse is at ${mouseCoordsX}, ${mouseCoordsY}`)
        
        i++;
    }, 10); 

    //removes listeners for function
    document.removeEventListener('mousemove', findMousePosition);
    document.removeEventListener('mouseout', findIfMouseExits);

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