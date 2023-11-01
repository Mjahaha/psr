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
populateField(10);
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

const getTarget = (item) => {
    let theClass = item.classList[1];
    let targetClass = "0";
    if (theClass == "rock") {targetClass = "scissors";}
    if (theClass == "paper") {targetClass = "rock";}
    if (theClass == "scissors") {targetClass = "paper";}

    let itemObject = getComputedStyle(item);
    let itemX = parseFloat(itemObject.left);
    let itemY = parseFloat(itemObject.top);
    
    let targetList = document.getElementsByClassName(targetClass);
    let closestTarget = null;
    let closestDistance = null;

    //loop through targetList to find closest target
    for (let i = 0; i < targetList.length; i++) {
        let targetObject = getComputedStyle(targetList[i]);
        let targetX = parseFloat(targetObject.left);
        let targetY = parseFloat(targetObject.top);
        let distance = Math.sqrt(Math.pow(targetX - itemX, 2) + Math.pow(targetY - itemY, 2));
        console.log({"distance": distance, "target": targetList[i]})
        if (distance < closestDistance || closestDistance === null) {
            closestDistance = distance;
            closestTarget = targetList[i];
        }
    }
    console.log("the closest distance is " + closestDistance);
    return closestTarget;
    
}
getTarget(exampleItem);

const moveItem = (item) => {
    let distance = 1;
    let target = getTarget(item);
    let angle = getDirection(item, target);

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
        moveItem(items[0]);
    }, 100);
}
runTimestep();
