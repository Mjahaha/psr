import { data, myData, resetData } from "./data.js";
import { drawCircleToPushItems, addPlayerItem } from "./controls.js";
import { itemClass } from "./itemClass.js";
import { terrainClass } from "./terrainClass.js";

//this function populates the item display box on the skirmish screen to show the correct number of items
const populateItemDisplayBox = () => {
    //sets up the item display box containers
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

    //populates the item display box to show the correct number of items
    const numberOfItems = document.querySelector('#num').value;
    let itemClassToAdd;
    let elementToAdd = document.createElement('div');
    for (let i = 0; i < theBoxes.length; i++) { //for container box, set up a div with the correct classes
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
        //add these classes
        elementToAdd.classList.add("itemDisplay");
        elementToAdd.classList.add(...itemClassToAdd);
        //then add this element to the container box the correct number of times
        for (let j = 0; j < numberOfItems; j++) {
            theBoxes[i].appendChild(elementToAdd.cloneNode(true));
        }
    }
}

//functions that start the show running
const runGameTimestepFunction = () => {
    //let runTimestep;
    data.gameTimestepId = setInterval(() => {
        //loops over the moveItem function for each item
        for (let i = 0; i < data.allItems.length; i++) {
            if (data.gameOver === true) { clearInterval(data.gameTimestepId); }
            if (data.allItems[i].alive) {
                data.allItems[i].moveItem();
            }
        }
    }, data.timestep);
}

export const mainMenu = () => {
    data.field.innerHTML = "";
    data.sidebar.innerHTML = "";
    data.stopButton.style.display = "none";
    resetData();
    data.startDetails.innerHTML = `
    <h1>Welcome to<br>Rock, Paper, Scissors Battle Royale!</h1>
    <form>
        <input id="campaign" type="button" value="Testing">
        <br>
        <input id="skirmish" type="submit" value="Skirmish">        
        <br>
        <input id="credits" type="submit" value="Credits">
    </form>`
    //adds a listener to go to the test screen
    document.getElementById('campaign').addEventListener("click", () => {
        window.location.href = "./test.html";
    });
    //adds a listener to the skirmish button that executes setUpSkirmishDetails
    document.getElementById('skirmish').addEventListener("click", setUpSkirmishDetails);
    //gets credits button to work 
    document.getElementById('credits').addEventListener("click", () => {
        data.startDetails.innerHTML = `
        <img src="images/credits.jpg" style="position: absolute; top: 100px;">
        <input id="mainMenu" type="submit" value="mainMenu" style="z-index: 3; position: absolute; top: 100px;">`;
        document.getElementById('mainMenu').addEventListener("click", mainMenu);
    });
}


export const setUpSkirmishDetails = () => {
    //adds the start details to the DOM
    data.startDetails.innerHTML = `
    <h1>Welcome to<br>Skirmish Mode!</h1>
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

    //populates the item display box to show the correct number of items
    populateItemDisplayBox();   
    //adds a listeners to the gameMode radio buttons that executes populateDisplayBox
    document.querySelectorAll('input[name="gameMode"]').forEach((radio) => {
        radio.addEventListener("change", populateItemDisplayBox);
    });
    document.getElementById('num').addEventListener("change", populateItemDisplayBox);

    //Starts the skirmish
    document.getElementById('startBattle').addEventListener('click', (event) => {
        console.log(data)
        event.preventDefault();
        let num = document.getElementById('num').value;
        data.captureKill = document.querySelector('input[name="captureKill"]:checked').value;
        data.gameMode = document.querySelector('input[name="gameMode"]:checked').value;
        num = num * 3;
        data.gameStarted = true;
        data.startDetails.innerHTML = "";
        updateSidebar();
        data.stopButton.style.display = "block";
        if (data.gameMode === "FFA") {
            populateFieldClassic(num);
        } else {
            populateFieldTeamsRand(num); 
        }
    });

    document.getElementById('stopBattle').addEventListener('click', (event) => {
        console.log("stop");
        event.preventDefault();
        clearInterval(data.gameTimestepId);
    });

}


const sendItemsToField = (num, functionToAssignItemPos, functionToCreateItems) => {
    let i = 1;
    data.widthOfSidebar = ((data.sidebar && data.sidebar.offsetWidth) || 0);
    data.screenWidth = window.innerWidth - data.widthOfSidebar;

    const createAnItem = setInterval(() => {

        //if this isnt the first run, moves the coords of the previous item to get transition effect
        //if you don't do it after the setInterval timer the transition doesn't work
        if (data.allItems.length > 0) { 
            functionToAssignItemPos(data.allItems[data.allItems.length - 1]);
        }

        //exits loop when 'num' of items have been created
        if (i >= num) {  
            clearInterval(createAnItem); 
            document.getElementById('startDetails').innerHTML = `
            <input id="startActualBattle" type="button" value="Start Battle">`;
            document.getElementById('startActualBattle').addEventListener("click", () => {
                document.getElementById('startDetails').innerHTML = "";
                runGameTimestepFunction();
            });
        }
        
        //creates the item at the position of the mouse
        let argSpecificsForItem = { 
            x: data.mouseX || data.screenWidth / 2, 
            y: data.mouseY || data.screenHeight / 2,
        }
        
        functionToCreateItems(i, argSpecificsForItem);
        updateSidebar();    
        i++;

    }, 10); 
}

//this function populates the field with 'num' of unaligned items
const populateFieldClassic = (num) => {
    new terrainClass("circle", 100, {x: 650, y: 475});  //0
    new terrainClass("circle", 100, {x: 1000, y: 375}); //1
    new terrainClass("circle", 100, {x: 200, y: 575});  //2
    new terrainClass("circle", 100, {x: 1100, y: 775}); //3
    new terrainClass("circle", 100, {x: 200, y: 305});  //4
    new terrainClass("circle", 100, {x: 630, y: 775});  //5
    new terrainClass("circle", 100, {x: 1275, y: 230}); //6
    new terrainClass("circle", 100, {x: 625, y: 190}); //7

    //function to make the items come from the mouse initially 
    const sendItemsToRandomPosition = (itemToSend) => {
        let itemShouldBePlaced = false;

        while (!itemShouldBePlaced) {
            let itemX = Math.random() * data.screenWidth; 
            let itemY = Math.random() * data.screenHeight;
            itemToSend.x = itemX; 
            itemToSend.y = itemY; 

            //assume no collision initially
            let collision = false;
            for(let terrain of data.allTerrain) {
                if (terrain.collisionWithItem(itemToSend.id)) {
                    collision = true;
                    break; //no need to check further, collision found
                }
            }

            // If no collision, we can place the item
            if (!collision) {
                itemShouldBePlaced = true;
            }
        }
    }

    const createEqualNumberOfUnalignedItems = (i, argSpecificsForItem) => {
        let whichItemType = i % 3;
        if (whichItemType === 0) { new itemClass("rock", "unaligned", argSpecificsForItem); }
        else if (whichItemType === 1) { new itemClass("paper", "unaligned", argSpecificsForItem); }
        else { new itemClass("scissors", "unaligned", argSpecificsForItem); }    
    } 

    //run sendItemsToField function with populateFieldClassic specific functions
    sendItemsToField(num, sendItemsToRandomPosition, createEqualNumberOfUnalignedItems);
    
}

//this function populates the field with 'num' of items on each team 
const populateFieldTeamsRand = (num) => {

    const sendItemsToRandomPosition = (itemToSend) => {
        let itemX = Math.random() * data.screenWidth; 
        let itemY = Math.random() * data.screenHeight;

            itemToSend.x = itemX; 
            itemToSend.y = itemY; 
    }

    const createAnEqualNumberOfTeamItems = (i, argSpecificsForItem) => {
        let whichItem = i % 3;
        let teamClass = "blue";
        if (i % 2 === 0) {
            //itemX += data.screenWidth * 0.6;
            teamClass = "red";
        }
        if (whichItem === 0) { new itemClass("scissors", teamClass, argSpecificsForItem) }
        else if (whichItem === 1) { new itemClass("rock", teamClass, argSpecificsForItem) }
        else { new itemClass("paper", teamClass, argSpecificsForItem) }
    }

    sendItemsToField(num, sendItemsToRandomPosition, createAnEqualNumberOfTeamItems);
    
}

export const updateSidebar = () => {
    data.sidebar.style.display = 'block';
    if (data.allItems.length === 0) { return; }    


    //creates an array of data.allItems[0] that makes a list of all unqiue team and types, like this, [{'team': 'red', 'type': 'rock'} ... ]
    let dataToPopulateSidebar = []; 
    data.allItems.map(item => {
        let thisType = item.type;
        let thisTeam = item.team;
        let foundIt = false;
        dataToPopulateSidebar.map(itemInSidebar => {
            if (itemInSidebar.type === thisType && itemInSidebar.team === thisTeam) {
                foundIt = true;
                if (item.alive === true) {
                    itemInSidebar.count += 1;
                }
            }
        });
        if (foundIt === false) {
            dataToPopulateSidebar.push({type: thisType, team: thisTeam, count: 1});
        }
    });

    //creates the div to add to the sidebar 
    let greenDiv = "";
    let unalignedDiv = "";
    let redDiv = "";
    let blueDiv = "";

    dataToPopulateSidebar.map(item => {
        if (item.team === "green") {
            greenDiv += `<div class="sidebarPicture ${item.type} ${item.team}"></div>`;
            greenDiv += `<p>${item.count}</p>`;
        }
        if (item.team === "unaligned") {
            unalignedDiv += `<div class="sidebarPicture ${item.type} ${item.team}"></div>`;
            unalignedDiv += `<p>${item.count}</p>`;
        }
        if (item.team === "red") {
            redDiv += `<div class="sidebarPicture ${item.type} ${item.team}"></div>`;
            redDiv += `<p>${item.count}</p>`;
        }
        if (item.team === "blue") {
            blueDiv += `<div class="sidebarPicture ${item.type} ${item.team}"></div>`;
            blueDiv += `<p>${item.count}</p>`;
        }
    });

    const content = greenDiv + unalignedDiv + redDiv + blueDiv;
    data.sidebar.innerHTML = content;

    addPlayerToolsIntoSidebar();


}

const addPlayerToolsIntoSidebar = () => {
    let containerElement = document.createElement('div');
    containerElement.style.width = "100%";

    let elementHeading = document.createElement('h4');
    elementHeading.innerHTML = "Player Tools";
    containerElement.appendChild(elementHeading);

    let makeButtonUnpressed = () => { return }; // same the function that is assigned to unpush the button, initially does nothing
    function createItemButton(itemType) {
        let addButton = document.createElement('button'); 
        addButton.id = `add${itemType.charAt(0).toUpperCase() + itemType.slice(1)}Button`;
        addButton.value = `add${itemType}`;
        addButton.innerHTML = `<img src='images/${itemType}Green.png' style='width: 50px; height: 50px;'>`;
        containerElement.appendChild(addButton);
        
        const addPlayerItemFunc = () => {
            console.log(`makeButtonUnpressed ${makeButtonUnpressed}`);
            makeButtonUnpressed();
            makeButtonUnpressed = addPlayerItem(itemType);
        };
        
        addButton.addEventListener('mousedown', addPlayerItemFunc); 
    }
    
    // Now we call the function for each item
    createItemButton('rock');
    createItemButton('paper');
    createItemButton('scissors');
    



    //document.body.addEventListener('mousedown', drawCircleToPushItems);

    

    data.sidebar.appendChild(containerElement);
  
  }