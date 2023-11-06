
const getDirection = (originItem, destinationItem) => {
    let destinationObject = getComputedStyle(destinationItem);
    let originObject = getComputedStyle(originItem);

    let destinationY = parseFloat(destinationObject.top);
    let destinationX = parseFloat(destinationObject.left);
    let originItemY = parseFloat(originObject.top);
    let originItemX = parseFloat(originObject.left);

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
    let { preyClass, predatorClass} = getPredatorPrey(item);

    let itemObject = getComputedStyle(item);
    let itemX = parseFloat(itemObject.left);
    let itemY = parseFloat(itemObject.top);
    
    let targetList = document.getElementsByClassName(preyClass);
    targetList = Array.from(targetList).concat(Array.from(document.getElementsByClassName(predatorClass)));
    let closestTarget = null;
    let closestDistance = null;

    //loop through targetList to find closest target
    for (let i = 0; i < targetList.length; i++) {
        let targetObject = getComputedStyle(targetList[i]);
        let targetX = parseFloat(targetObject.left);
        let targetY = parseFloat(targetObject.top);
        let distance = Math.sqrt(Math.pow(targetX - itemX, 2) + Math.pow(targetY - itemY, 2));
        if (distance < closestDistance || closestDistance === null) {
            closestDistance = distance;
            closestTarget = targetList[i];
        }
    }

    let instruction = "chase";
    //closestTarget = null condition there to prevent error when there are no targets
    if (closestTarget == null || closestTarget.classList[1] === predatorClass) {
        instruction = "flee";
    }

    return {closestTarget, instruction};
}

const collisionDetection = (item, target) => {
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
    let distance = 2;
    let {closestTarget, instruction} = getNearestPredPreySame(item, field);
    let target = closestTarget;
    let angle = getDirection(item, target);

    if (instruction === "flee") {
        angle += 180;
    }

    let x = distance * Math.cos(angle * Math.PI / 180);
    let y = distance * Math.sin(angle * Math.PI / 180);

    let newPosX = parseFloat(getComputedStyle(item).left) + x;
    let newPosY = parseFloat(getComputedStyle(item).top) + y;

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