import { populateFieldClassic } from "./menu.js";
import { data } from "./data.js";
import { itemClass } from "./itemClass.js";
import { terrainClass } from "./terrainClass.js";

// Get the canvas element
let element = document.createElement('div');
//populateFieldClassic(1);
new itemClass("rock", "unaligned", {x: 300, y: 450});
new itemClass("paper", "unaligned", {x: 900, y: 450});
new itemClass("scissors", "unaligned", {x: 900, y: 380});
new terrainClass("circle", 100, {x: 650, y: 475});



// Variables to store the starting position and radius
let startClickX, startClickY, radius;
let lagPreventionStopper;
let prePushedItemInfo = [];
let mouseMoveCounter = 0;

// Add event listeners for mouse down, move, and up events
document.body.addEventListener('mousedown', handleMouseDown);
document.body.addEventListener('mouseup', handleMouseUp);
document.body.style.width = "100vw";
document.body.style.height = "100vh";


function handleMouseDown(event) {
    // Store the starting position
    startClickX = event.clientX;
    startClickY = event.clientY;

    // Sets the properties of the circle element
    document.body.appendChild(element);
    element.style.pointerEvents = "none"; 
    element.style.height = `$1px`;      // Set the height of the circle
    element.style.width = `1px`;       // Set the width of the circle
    element.style.top = `${startClickY}px`;     // Set the top edge of the circle
    element.style.left = `${startClickX}px`;    // Set the left edge of the circle
    element.style.position = "absolute"; // Set the element position to absolute
    element.style.border = "5px solid black"; // Set a thick border with black color
    element.style.borderRadius = "50%";  // This makes it a circle
    element.style.boxSizing = "border-box"; // This ensures the border is included in the width/height

    //creates a duplicate of the data.allItems array to remember coords    
    prePushedItemInfo = data.allItems.map(item => ({ ...item }));
    console.log(`cycle started.`)
    document.body.addEventListener('mousemove', handleMouseMove);
    lagPreventionStopper = setInterval(() => {
      data.lagPreventionStopper = false;
    }, 1000/60);
    //removes transition from all items
    data.allItems.forEach(item => {
      item.element.style.transition = "none";
    });
  }
  

function handleMouseMove(event) {
  if (!startClickX && !startClickY) { return; } // Exit if the mouse hasn't been pressed down
  mouseMoveCounter++;

  // Calculate the distance from the starting position to the current mouse position
  const dx = event.clientX - startClickX;
  const dy = event.clientY - startClickY;
  radius = Math.sqrt(dx * dx + dy * dy);

  // Sets the properties of the circle element
  element.style.height = `${radius * 2}px`;      // Set the height of the circle
  element.style.width = `${radius * 2}px`;       // Set the width of the circle
  element.style.top = `${startClickY - radius}px`;     // Set the top edge of the circle
  element.style.left = `${startClickX - radius}px`;    // Set the left edge of the circle
  element.style.position = "absolute"; // Set the element position to absolute
  element.style.border = "5px solid black"; // Set a thick border with black color
  element.style.borderRadius = "50%";  // This makes it a circle
  element.style.boxSizing = "border-box"; // This ensures the border is included in the width/height

  //prevents lag by only running the code once every 1/60 of a second
  if (data.lagPreventionStopper) { return; }
  data.lagPreventionStopper = true;

  //checks each item to see if it was originally within the radius of the circle, and then moves it to circle edge
  for (let i = 0; i < data.allItems.length; i++) {
    const originalItem = prePushedItemInfo[i];
    if (!originalItem._alive) { continue; } 

    //find the original distance of the item from the center of the circle
    const thisItemWithOriginalState = prePushedItemInfo.find(item => item.id === originalItem.id); 
    const originalX = thisItemWithOriginalState._x;
    const originalY = thisItemWithOriginalState._y;
    let itemOriginalDistanceFromOrigin = Math.sqrt((originalX - startClickX) ** 2 + (originalY - startClickY) ** 2);

    //if the item is within the radius of the circle, move it to the edge of the circle
    if (radius < itemOriginalDistanceFromOrigin) { 
      data.allItems[i].x = originalX;
      data.allItems[i].y = originalY;
      continue;
    }
    let angle = Math.atan2(originalY - startClickY, originalX - startClickX);
    data.allItems[i].x = startClickX + radius * Math.cos(angle);
    data.allItems[i].y = startClickY + radius * Math.sin(angle);
    continue;
  }
}

function handleMouseUp() {
  // Reset the starting position and radius
  startClickX = null; 
  startClickY = null; 
  radius = null; 
  prePushedItemInfo = []; 
  clearInterval(lagPreventionStopper); 
  document.body.removeChild(element); 
  console.log(`cycle complete`); 
  document.body.removeEventListener('mousemove', handleMouseMove);
  //adds transition back to all items
  data.allItems.forEach(item => {
    item.element.style.transition = `all ${data.timestep}ms linear`;
  });
}
