import { replaceItemInSortedBinarySearch, addItemIntoSortedBinarySearch } from './arrayFunctions.js';
import { data } from './data.js';

const getDirection = (originItem, destinationItem) => {
    //define object parameters and throw error if not defined
    try {
        let destinationObject = getComputedStyle(destinationItem);
        let originObject = getComputedStyle(originItem);
    } catch (error) {
        return;
    }
    let destinationObject = getComputedStyle(destinationItem);
    let originObject = getComputedStyle(originItem); 

    //get coordinates of objects
    let destinationY = parseFloat(destinationObject.top);
    let destinationX = parseFloat(destinationObject.left);
    let originItemY = parseFloat(originObject.top);
    let originItemX = parseFloat(originObject.left);

    //work out angle between objects
    let angle = Math.atan2(destinationY - originItemY, destinationX - originItemX) * 180 / Math.PI;
    return angle;
}

const getPredatorPrey = (item) => {
    let theClass = item.classList[1];
    let preyClass = "0";
    let predatorClass = "0";
    if (theClass == "rock") 
        {preyClass = "scissors";
        predatorClass = "paper";}
    if (theClass == "paper") 
        {preyClass = "rock";
        predatorClass = "scissors";}
    if (theClass == "scissors") 
        {preyClass = "paper";
        predatorClass = "rock";}
    return { theClass, preyClass, predatorClass };
}

 

const getNearestPredPreySame = (item, field) => {
    let { theClass, preyClass, predatorClass} = getPredatorPrey(item);

    let itemObject = getComputedStyle(item);
    let itemX = parseFloat(itemObject.left);
    let itemY = parseFloat(itemObject.top);
    
    //sets targetList to all children of field
    let targetList = field.children;
    let closestPredator = null;
    let closestPredatorDistance = 100000;
    let closestPrey = null;
    let closestPreyDistance = 100000;
    let closestSame = null;
    let closestSameDistance = 100000;


    //loop through targetList to find closest target
    for (let i = 0; i < targetList.length; i++) {
        let targetObject = getComputedStyle(targetList[i]);
        let targetClass = targetList[i].classList[1];
        let targetX = parseFloat(targetObject.left);
        let targetY = parseFloat(targetObject.top);
        let distance = Math.sqrt(Math.pow(targetX - itemX, 2) + Math.pow(targetY - itemY, 2));
        
        if (targetClass === predatorClass) {
            if (distance < closestPredatorDistance || closestPredatorDistance === null) {
                closestPredatorDistance = distance;
                closestPredator = targetList[i];
            }
        }
        if (targetClass === preyClass) {
            if (distance < closestPreyDistance || closestPreyDistance === null) {
                closestPreyDistance = distance;
                closestPrey = targetList[i];
            }
        }
        if (targetClass === theClass && targetList[i] != item) {
            if (distance < closestSameDistance || closestSameDistance === null) {
                closestSameDistance = distance;
                closestSame = targetList[i];
            }
        }         
    }

    return { closestPredator, closestPreyDistance, closestPrey, closestPredatorDistance, closestSame };
}

const collisionDetection = (item, target) => {

    if (target == null) {
        return false;
    }

    let itemObject = getComputedStyle(item);
    let itemX = parseFloat(itemObject.left);
    let itemY = parseFloat(itemObject.top);
    let itemWidth = parseFloat(itemObject.width);
    let itemHeight = parseFloat(itemObject.height);
    let targetObject = getComputedStyle(target);
    let targetX = parseFloat(targetObject.left);
    let targetY = parseFloat(targetObject.top);
    let targetWidth = parseFloat(targetObject.width);
    let targetHeight = parseFloat(targetObject.height);

    //check if item is colliding with target
    if (itemX < targetX + targetWidth &&
        itemX + itemWidth > targetX &&
        itemY < targetY + targetHeight &&
        itemY + itemHeight > targetY) 
        {
        return true;
        }
    return false;
}



const collisionPredPreyAction = (item, target, field) => {
    
    const collisionDetected = collisionDetection(item, target);
    let { theClass, preyClass, predatorClass } = getPredatorPrey(item);
    let targetClass = target.classList[1];

    //check if item is colliding with target
    if (collisionDetected && targetClass == preyClass) {   
        //console.log(`${item.classList[1]} ate ${target.classList[1]}`)
        //target.remove();
        target.classList.remove(preyClass);
        target.classList.add(item.classList[1]);
    }
    if (collisionDetected && targetClass == predatorClass) {
        //console.log(`${target.classList[1]} ate ${item.classList[1]}`)
        //item.remove();
        item.classList.remove(preyClass);
        item.classList.add(item.classList[1]); 
    }

    //check if there is only one class left
    let classesPresent = [];
    let items = field.children;
    for (let i = 0; i < items.length; i++) {
        if (!classesPresent.includes(items[i].classList[1])) {
            classesPresent.push(items[i].classList[1]);
            if (classesPresent.length > 1) {
                return false;
            }
        }
    }
    console.log(`${classesPresent[0]} wins!`);
    return true;
} 

export const moveItem = (item, screenWidth, screenHeight, field) => {
    let distance = data.distance;
    let { closestPredator, closestPreyDistance, closestPrey, closestPredatorDistance, closestSame } = getNearestPredPreySame(item, field);
    let target;

    //determine if the item is moving to predator or prey
    if (closestPredatorDistance < closestPreyDistance) {
        target = closestPredator;
    } else {
        target = closestPrey;
    }

    //get the angle to the nearest predator or prey
    let angle = getDirection(item, target);
    if (closestPredatorDistance < closestPreyDistance) {
        angle += 180;
    }

    //move the the right distance at the right angle to move toward nearest target
    let x = distance * Math.cos(angle * Math.PI / 180);
    let y = distance * Math.sin(angle * Math.PI / 180);
    let newPosX = parseFloat(getComputedStyle(item).left) + x;
    let newPosY = parseFloat(getComputedStyle(item).top) + y;

    //check if the nearest same class target is collided with
    if (collisionDetection(item, closestSame) ) {
        angle = getDirection(item, closestSame);
        x = distance * Math.cos(angle * Math.PI / 180);
        y = distance * Math.sin(angle * Math.PI / 180);
        newPosX -= x;
        newPosY -= y;
    }

    //check if item is out of bounds
    if (newPosX < 0) {
        newPosX = 0;
    }
    if (newPosX > screenWidth) {
        newPosX = screenWidth;
    }
    if (newPosY < 0) {
        newPosY = 0;
    }
    if (newPosY > screenHeight) {
        newPosY = screenHeight;
    }

    item.style.left = newPosX + 'px';
    item.style.top = newPosY + 'px';

    if(collisionPredPreyAction(item, target, field)) {
        //only returns true if all items are the same classe
        return true;
    }
    return false;
}