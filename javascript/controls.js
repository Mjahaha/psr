import { populateFieldClassic } from "./menu.js";
import { data } from "./data.js";

// Get the canvas element
let element = document.createElement('div');
populateFieldClassic(10);

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
    document.body.appendChild(element);
    element.style.pointerEvents = "none"; 
    //creates a duplicate of the data.allItems array to remember coords
    let tempObject = {};
    
    prePushedItemInfo = data.allItems.map(item => ({ ...item }));
    //prePushedItemInfo = JSON.parse(JSON.stringify(data.allItems));

    const dot = document.createElement('div');
    dot.style.position = "absolute";
    dot.style.top = `${event.clientY}px`;
    dot.style.left = `${event.clientX}px`;
    dot.style.width = `3px`;
    dot.style.height = `3px`;
    dot.style.backgroundColor = "red";
    dot.style.zIndex = 9;
    document.body.appendChild(dot);

    console.log(`cycle started.`)
    document.body.addEventListener('mousemove', handleMouseMove);
    lagPreventionStopper = setInterval(() => {
      data.lagPreventionStopper = false;
      
    }, 1000/60);
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


  if (data.lagPreventionStopper) { return; }
  data.lagPreventionStopper = true;



  //checks each item to see if it was originally within the radius of the circle, and then moves it to circle edge
  for (let i = 0; i < data.allItems.length; i++) {
    data.allItems[i].element.style.transition = "none";  
    const originalItem = prePushedItemInfo[i];
    if (!originalItem._alive) { continue; } 

    //find the original distance of the item from the center of the circle
    const thisItemWithOriginalState = prePushedItemInfo.find(item => item.id === originalItem.id); 
    const originalX = thisItemWithOriginalState._x;
    const originalY = thisItemWithOriginalState._y;
    let itemOriginalDistanceFromOrigin = Math.sqrt((originalX - startClickX) ** 2 + (originalY - startClickY) ** 2);

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
  element = document.createElement('div'); 
  console.log(`cycle complete`); 
  document.body.removeEventListener('mousemove', handleMouseMove);
}
