import { data } from "./data.js";
import { addItemIntoSortedBinarySearch } from "./arrayFunctions.js";


import { setUpStartDetails, populateFieldClassic, populateFieldTeams } from "./menu.js";

setUpStartDetails();
//populateField(30);

let runTimestep;
const runTimestepFunction = () => {
    runTimestep = setInterval(() => {
        //loops over the moveItem function for each item
        for (let i = 0; i < data.allItems.length; i++) {
            if (data.gameOver === true) { clearInterval(runTimestep); }
            if (data.allItems[i].alive) {
                data.allItems[i].moveItem();
            }
        }
    }, data.timestep);
}

document.getElementById('startBattle').addEventListener('click', (event) => {
    event.preventDefault();
    let num = document.getElementById('num').value;
    data.captureKill = document.querySelector('input[name="captureKill"]:checked').value;
    data.gameMode = document.querySelector('input[name="gameMode"]:checked').value;
    num = num * 3;
    data.startDetails.innerHTML = "";
    if (data.gameMode === "FFA") {
        populateFieldClassic(num);
    } else {
        populateFieldTeams(num); 
    }
    runTimestepFunction();
});

document.getElementById('stopBattle').addEventListener('click', (event) => {
    console.log("stop");
    event.preventDefault();
    clearInterval(runTimestep);
});
