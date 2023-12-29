import { data } from "./data.js";
import { itemClass } from "./itemClass.js";
import { terrainClass } from "./terrainClass.js";

// Get the canvas element

new itemClass("rock", "unaligned", {x: 200, y: 450}); 
new itemClass("paper", "unaligned", {x: 750, y: 350}); 
new itemClass("paper", "unaligned", {x: 750, y: 450}); 

//new itemClass("scissors", "unaligned", {x: 300, y: 380});
new terrainClass("circle", 100, {x: 650, y: 475});
//new terrainClass("circle", 80, {x: 900, y: 475});
//new terrainClass("circle", 80, {x: 1200, y: 505});


const intervalId = setInterval(() => {
  data.allItems[1].moveItem();
  data.allItems[2].moveItem();
}, 100);

document.getElementById('stopBattle').addEventListener('click', (event) => {
  console.log("stop");
  event.preventDefault();
  clearInterval(intervalId);
});
