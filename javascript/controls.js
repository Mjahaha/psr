import { populateFieldClassic } from "./menu.js";
import { data } from "./data.js";

// Get the canvas element
let element = document.createElement('div');
populateFieldClassic(2);

// Variables to store the starting position and radius
let startClickX, startClickY, radius;
let lagPreventionStopper;
let prePushedItemInfo, pushedBros = [];
let mouseMoveCounter = 0;

// Add event listeners for mouse down, move, and up events
document.body.addEventListener('mousedown', handleMouseDown);
document.body.addEventListener('mousemove', handleMouseMove);
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
    prePushedItemInfo = [...data.allItems];
    lagPreventionStopper = setInterval(() => {
      data.lagPreventionStopper = false;
      
    }, 1000/60);
  }
  

function handleMouseMove(event) {
  mouseMoveCounter++;

    // Sets the properties of the circle element
    element.style.position = "absolute"; // Set the element position to absolute
    element.style.top = `${startClickY - radius}px`;     // Set the top edge of the circle
    element.style.left = `${startClickX - radius}px`;    // Set the left edge of the circle
    element.style.width = `${radius * 2}px`;       // Set the width of the circle
    element.style.height = `${radius * 2}px`;      // Set the height of the circle
    element.style.border = "5px solid black"; // Set a thick border with black color
    element.style.borderRadius = "50%";  // This makes it a circle
    element.style.boxSizing = "border-box"; // This ensures the border is included in the width/height

  if (data.lagPreventionStopper) { return; }
  data.lagPreventionStopper = true;


  if (startClickX && startClickY) {
    // Calculate the distance from the starting position to the current mouse position
    const dx = event.clientX - startClickX;
    const dy = event.clientY - startClickY;
    radius = Math.sqrt(dx * dx + dy * dy);

  //checks each item to see if it was originally within the radius of the circle, and then moves it to circle edge
  for (let i = 0; i < data.allItems.length; i++) {
    data.allItems[i].element.style.transition = "none";  
    const thisItem = data.allItems[i];
      if (!thisItem.alive) { continue; } 

      //find the item in prePushedItemInfo array with the same id property as data.allItems[i]
      const thisItemWithOriginalState = prePushedItemInfo.find(item => item.id === data.allItems[i].id);
      const originalX = thisItemWithOriginalState.x;
      const originalY = thisItemWithOriginalState.y;
      let angle = Math.atan2(originalY - startClickY, originalX - startClickX);
      
      //find the distance of the item from the center of the circle
      let itemOriginalDistanceFromOrigin = Math.sqrt((originalX - startClickX) ** 2 + (originalY - startClickY) ** 2);
      let newX = startClickX + radius * Math.cos(angle);
      let newY = startClickY + radius * Math.sin(angle);
      let proposedItemDistanceFromOrigin = Math.sqrt((newX - startClickX) ** 2 + (newY - startClickY) ** 2); 
      //console.log(`${mouseMoveCounter} the startClickX is ${startClickX}, the startClickY is ${startClickY}, the radius is ${radius}, the angle is ${angle}`); 
      //console.log(`${mouseMoveCounter} the originalX is ${originalX}, the originalY is ${originalY}`); 
      //console.log(`${mouseMoveCounter} so newX is ${newX} and newY is ${newY}`);
      
      //maintain an array of items that are within the circle and hence should be pushed 
      if (itemOriginalDistanceFromOrigin <= proposedItemDistanceFromOrigin && !pushedBros.includes(data.allItems[i])) {
        pushedBros.push(data.allItems[i]);  //adds to array if its not there
      }
      if (itemOriginalDistanceFromOrigin > proposedItemDistanceFromOrigin && pushedBros.includes(data.allItems[i])) {
        pushedBros.splice(pushedBros.indexOf(data.allItems[i]), 1);
        data.allItems[i].x = originalX;
        data.allItems[i].y = originalY;
      } //removes from array if its there
      

      if (!pushedBros.includes(data.allItems[i])) { continue; }   //exit if item outside the circle
      //if item is within the circle, move it way from the center
      
      data.allItems[i].x = newX;
      data.allItems[i].y = newY;
      console.log(`The newX is ${newX} and the real x is ${data.allItems[i].x}, the newY is ${newY} and the real y is ${data.allItems[i].y}`);
    }
  }
}

function handleMouseUp() {
  // Reset the starting position and radius
  startClickX = null; 
  startClickY = null; 
  radius = null; 
  prePushedItemInfo = []; 
  pushedBros = []; 
  clearInterval(lagPreventionStopper); 
  document.body.removeChild(element); 
  element = document.createElement('div'); 
  console.log(`cycle complete`); 
}
