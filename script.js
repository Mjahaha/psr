
const field = document.getElementById('theField');


const populateField = (num) => {
    for (let i = 0; i < num; i++) {
        let whichItem = i % 3;
        let itemX = Math.random() * window.innerWidth;
        let itemY = Math.random() * window.innerHeight;
        if (whichItem === 0) {
            field.innerHTML += `<div class="item rock" id="${i}" style="left:${itemX}px; top:${itemY}px;"></div>`;
        }
        else if (whichItem === 1) {
            field.innerHTML += `<div class="item paper" id="${i}" style="left:${itemX}px; top:${itemY}px;"></div>`;
        }
        else {
            field.innerHTML += `<div class="item scissors" id="${i}" style="left:${itemX}px; top:${itemY}px;"></div>`;
        }
    }
}
populateField(30);
const exampleItem = document.getElementById('1');



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
    return {preyClass, predatorClass};
}

const getTarget = (item) => {
    let theClass = item.classList[1];
    let {preyClass, predatorClass} = getPredatorPrey(item);

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
    if (closestTarget.classList[1] === predatorClass) {
        instruction = "flee";
    }


    return {closestTarget, instruction};
    
}

const moveItem = (item) => {
    let distance = 1;
    let {closestTarget, instruction} = getTarget(item);
    let target = closestTarget;
    console.log(target);
    let angle = getDirection(item, target);

    
    if (instruction === "flee") {
        angle += 180;
    }


    let x = distance * Math.cos(angle * Math.PI / 180);
    let y = distance * Math.sin(angle * Math.PI / 180);

    let newPosX = parseFloat(getComputedStyle(item).left) + x;
    let newPosY = parseFloat(getComputedStyle(item).top) + y;
    item.style.left = newPosX + 'px';
    item.style.top = newPosY + 'px';
}


const runTimestep = () => {
    let items = field.children;
    items[0].style.backgroundColor = 'red';
    setInterval(() => {
        //loops over the moveItem function for each item
        for (let i = 0; i < items.length; i++) {
            moveItem(items[i]);
        }
    }, 1000/60);
}
runTimestep(); 
