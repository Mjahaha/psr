import { data } from "./data.js";
import { itemClass } from "./itemClass.js";

export const drawCircleToPushItems = (event) => {
  console.log("drawCircleToPushItems() called")
  // Store the initial variables starting position
  let startClickX = data.mouseX;  //starting position of X coords
  let startClickY = data.mouseY;  //starting position of Y coords
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
    const dx = data.mouseX - startClickX;
    const dy = data.mouseY - startClickY;
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

  return { mouseMoveChangesCircleSize, finishCircleOnMouseUp};
  //document.body.addEventListener('mousemove', mouseMoveChangesCircleSize);
  //document.body.addEventListener('mouseup', finishCircleOnMouseUp);
  //data.field.addEventListener('mousemove', mouseMoveChangesCircleSize);
  //data.field.addEventListener('mouseup', finishCircleOnMouseUp);

}

export const addPlayerItem = (type) => {
  // add transparent rock that follows mouse
  let item = document.createElement('div');
  item.id = 'transparentItemForPlacement';
  item.classList.add('item', type, 'green'); 
  item.style.cssText = `
    height: 60px;
    width: 60px;
    position: absolute;
    top: ${data.mouseY - 30}px;
    left: ${data.mouseX - 30}px;
    opacity: 0.5;
    z-index: 2;
    transition: all 10ms linear;
  `;
  data.field.appendChild(item);

  // have rock follow the mouse 
  const moveItem = setInterval(() => {
    item.style.top = `${data.mouseY - 30}px`;
    item.style.left = `${data.mouseX - 30}px`;
  }, 10); 
  
  // add actual rock when mouse is clicked
  item.addEventListener('click', () => {
    new itemClass(type, 'green', {x: (data.mouseX), y: (data.mouseY)});
  });  

  // this function removes the transparent item and stops the interval and listeners
  const removeItem = () => {
    item.remove();
    clearInterval(moveItem);
  }
  return removeItem;
}