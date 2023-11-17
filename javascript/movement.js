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

 

const getNearestPredPreySame = (item) => {
    let { theClass, preyClass, predatorClass} = getPredatorPrey(item);

    let itemObject = getComputedStyle(item);
    let itemX = parseFloat(itemObject.left);
    let itemY = parseFloat(itemObject.top);
    
    //determines who should be chased and who should be run from
    let chaseTargetList;
    let sameTargetList;
    if(item.classList[2] == "unaligned") {
        chaseTargetList = [...document.getElementsByClassName(preyClass), ...document.getElementsByClassName(predatorClass)];
        sameTargetList = [...document.getElementsByClassName(theClass)];
    } else {
        //creates chaseTargetList by getting an array of all predators and prey classes, and then filtering out the ones that are on the same team
        //creates sameTargetList by getting elements of the same class as the item and adding all items of the same team, then removes values listed twice
        chaseTargetList = [...document.getElementsByClassName(preyClass), ...document.getElementsByClassName(predatorClass)].filter((ArrayItem) => item.classList[2] != ArrayItem.classList[2]);
        sameTargetList = [...new Set([...document.getElementsByClassName(theClass), ...document.getElementsByClassName(item.classList[2])])];
        //console.log('sameTargetList is for a '+ item.classList[1] + ' ' + item.classList[2] + ' is ' + sameTargetList.map((item) => item.classList[1] + ' ' + item.classList[2]));
        //console.log('chaseTargetList is for a '+ item.classList[1] + ' ' + item.classList[2] + ' is ' + chaseTargetList.map((item) => item.classList[1] + ' ' + item.classList[2]));
    }
    let closestPredator = null;
    let closestPredatorDistance = 100000;
    let closestPrey = null;
    let closestPreyDistance = 100000;
    let closestSame = null;
    let closestSameDistance = 100000;
    
    //loop through predators and prey in chaseTargetList to find closest target
    for (let i = 0; i < chaseTargetList.length; i++) {
        let targetObject = getComputedStyle(chaseTargetList[i]);
        let targetClass = chaseTargetList[i].classList[1];
        let targetX = parseFloat(targetObject.left);
        let targetY = parseFloat(targetObject.top);
        let distance = Math.sqrt(Math.pow(targetX - itemX, 2) + Math.pow(targetY - itemY, 2));
        
        if (targetClass === predatorClass) {
            if (distance < closestPredatorDistance || closestPredatorDistance === null) {
                closestPredatorDistance = distance;
                closestPredator = chaseTargetList[i];
            }
        } else {
            if (distance < closestPreyDistance || closestPreyDistance === null) {
                closestPreyDistance = distance;
                closestPrey = chaseTargetList[i];
            }
        }
    }     

    //loop through targets of the same class in sameTargetList to find closest same
    for (let i = 0; i < sameTargetList.length; i++) {
        let targetObject = getComputedStyle(sameTargetList[i]);
        let targetClass = sameTargetList[i].classList[1];
        let targetX = parseFloat(targetObject.left);
        let targetY = parseFloat(targetObject.top);
        let distance = Math.sqrt(Math.pow(targetX - itemX, 2) + Math.pow(targetY - itemY, 2));
        
        if (targetClass === theClass && sameTargetList[i] != item) {
            if (distance < closestSameDistance || closestSameDistance === null) {
                closestSameDistance = distance;
                closestSame = sameTargetList[i];
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



const collisionPredPreyAction = (item, target) => {
    
    const collisionDetected = collisionDetection(item, target);
    let { theClass, preyClass, predatorClass } = getPredatorPrey(item);
    let targetClass;
    try {
        targetClass = target.classList[1];
    } catch (error) {
        return true;
    }

    //check if item is colliding with target
    let team;
    if (collisionDetected && targetClass == preyClass) {   //the target is to loose
        if (data.captureKill == "capture") {
            //this fuckery is because you can't splice a class list and we need to maintain the order
            if (item.classList[2] === "unaligned") {    //if the item is unaligned, duplicate the unaligned item
                //console.log(`The target ${target.classList[2]} ${target.classList[1]}, has struck the a ${item.classList[2]} ${item.classList[1]}.`);
                target.classList.remove(target.classList[2]);
                target.classList.remove(target.classList[1]);
                target.classList.add(item.classList[1]);
                target.classList.add(item.classList[2]);
                //console.log(`The target is now a ${target.classList[2]} ${target.classList[1]}.`);
            } else {                                    //if the item is on a team, swap targets team
                target.classList.remove(target.classList[2]);
                target.classList.add(item.classList[2]);
            }
        } else {
            target.remove();
        }
    }
    if (collisionDetected && targetClass == predatorClass) {    //the item is to loose
        if (data.captureKill == "capture") {
            //this fuckery is because you can't splice a class list and we need to maintain the order
            if (item.classList[2] === "unaligned") {    //if the item is unaligned, duplicate the unaligned item
                //console.log(`The item ${item.classList[2]} ${item.classList[1]}, has struck the a ${target.classList[2]} ${target.classList[1]}.`);
                item.classList.remove(item.classList[2]);
                item.classList.remove(item.classList[1]);
                item.classList.add(target.classList[1]);
                item.classList.add(target.classList[2]);
                //console.log(`The item is now a ${item.classList[2]} ${item.classList[1]}.`);
            } else {                                    //if the item is on a team, swap targets team
                item.classList.remove(item.classList[2]);
                item.classList.add(target.classList[2]);
            }
        } else {
            item.remove();
        }
    }

    //check if there is only one class left
    let classesPresent = [];
    let items = data.field.children;
    for (let i = 0; i < items.length; i++) {
        if (!classesPresent.includes(items[i].classList[1])) {
            classesPresent.push(items[i].classList[1]);
            if (classesPresent.length > 1) {
                return false;
            }
        }
    }
    data.startDetails.innerHTML = `<h1>${classesPresent[0]} wins!</h1>`;
    //console.log(`${classesPresent[0]} wins!`);
    return true;
} 

export const moveItem = (item, screenWidth, screenHeight, field) => {
    let distance = data.distance;
    let { closestPredator, closestPreyDistance, closestPrey, closestPredatorDistance, closestSame } = getNearestPredPreySame(item);
    let target;

    //determine if the item is moving to predator or prey
    if (closestPredatorDistance < closestPreyDistance) {
        target = closestPredator;
    } else {
        target = closestPrey;
    }

    //get the angle to the nearest predator or prey
    let angle = getDirection(item, target);
    if (closestPredatorDistance < closestPreyDistance * 0.8) {
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

    if(collisionPredPreyAction(item, target)) {
        //only returns true if all items are the same classe
        return true;
    }
    return false;
}