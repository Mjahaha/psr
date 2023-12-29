import { populateFieldClassic } from "./menu.js";
import { data } from "./data.js";
import { itemClass } from "./itemClass.js";
import { terrainClass } from "./terrainClass.js";

// Get the canvas element
//populateFieldClassic(100);

/*
new itemClass("rock", "unaligned", {x: 200, y: 450}); 
new itemClass("paper", "unaligned", {x: 750, y: 350}); 
new itemClass("paper", "unaligned", {x: 750, y: 450}); 

//new itemClass("scissors", "unaligned", {x: 300, y: 380});
new terrainClass("circle", 100, {x: 650, y: 475});
//new terrainClass("circle", 80, {x: 900, y: 475});
//new terrainClass("circle", 80, {x: 1200, y: 505});

/*
const intervalId = setInterval(() => {
  data.allItems[1].moveItem();
  data.allItems[2].moveItem();
}, 100);

document.getElementById('stopBattle').addEventListener('click', (event) => {
  console.log("stop");
  event.preventDefault();
  clearInterval(intervalId);
});
*/

/*
new itemClass("rock", "unaligned", {y: 300, x: 490});
new itemClass("rock", "unaligned", {y: 300, x: 250});
new itemClass("paper", "unaligned", {y: 900, x: 450});
new itemClass("scissors", "unaligned", {y: 990, x: 450});
new terrainClass("circle", 100, {y: 650, x: 475});
*/




export const drawCircleToPushItems = (event) => {
  // Store the initial variables starting position
  let startClickX = event.clientX;  //starting position of X coords
  let startClickY = event.clientY;  //starting position of Y coords
  let circleDiv = document.createElement('div');
  let radius;
  let prePushedItemInfo = [];  //creates a duplicate of the data.allItems array to remember coords

  // Sets the properties of the circle element
  document.body.appendChild(circleDiv);
  circleDiv.style.pointerEvents = "none"; 
  circleDiv.style.height = `$1px`;      // Set the height of the circle
  circleDiv.style.width = `1px`;       // Set the width of the circle
  circleDiv.style.top = `${startClickY}px`;     // Set the top edge of the circle
  circleDiv.style.left = `${startClickX}px`;    // Set the left edge of the circle
  circleDiv.style.position = "absolute"; // Set the element position to absolute
  circleDiv.style.border = "5px solid black"; // Set a thick border with black color
  circleDiv.style.borderRadius = "50%";  // This makes it a circle
  circleDiv.style.boxSizing = "border-box"; // This ensures the border is included in the width/height

  //creates a duplicate of the data.allItems array to remember coords    
  prePushedItemInfo = data.allItems.map(item => ({ ...item }));
  //console.log(`cycle started.`)

  //removes transition from all items, the transitions adds a delay to pushing the elements
  data.allItems.forEach(item => {
    item.element.style.transition = "none";
  });

  function mouseMoveChangesCircleSize(event) {
    if (!startClickX && !startClickY) { return; } // Exit if the mouse hasn't been pressed down
  
    // Calculate the distance from the starting position to the current mouse position
    const dx = event.clientX - startClickX;
    const dy = event.clientY - startClickY;
    radius = Math.sqrt(dx * dx + dy * dy);
  
    // Sets the properties of the circle element
    circleDiv.style.height = `${radius * 2}px`;      // Set the height of the circle
    circleDiv.style.width = `${radius * 2}px`;       // Set the width of the circle
    circleDiv.style.top = `${startClickY - radius}px`;     // Set the top edge of the circle
    circleDiv.style.left = `${startClickX - radius}px`;    // Set the left edge of the circle
    circleDiv.style.position = "absolute"; // Set the element position to absolute
    circleDiv.style.border = "5px solid black"; // Set a thick border with black color
    circleDiv.style.borderRadius = "50%";  // This makes it a circle
    circleDiv.style.boxSizing = "border-box"; // This ensures the border is included in the width/height
  
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

  const finishCircleOnMouseUp = () => {
    // Reset the starting position and radius
    startClickX = null; 
    startClickY = null; 
    radius = null; 
    prePushedItemInfo = []; 
    circleDiv.remove();
    //console.log(`cycle complete`); 
    document.body.removeEventListener('mousemove', mouseMoveChangesCircleSize);
  
    //adds transition back to all items
    data.allItems.forEach(item => {
      item.element.style.transition = `all ${data.timestep}ms linear`;
      item.getNearestItemsAndTerrain();
    });
  }

  document.body.addEventListener('mousemove', mouseMoveChangesCircleSize);
  document.body.addEventListener('mouseup', finishCircleOnMouseUp);

}

  
// Add event listeners for mouse down, move, and up events
document.body.addEventListener('mousedown', drawCircleToPushItems);
document.body.style.width = "100vw";
document.body.style.height = "100vh";
  
