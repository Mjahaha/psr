
const getDirection = (originItem, destinationItem) => {
    let destinationObject = getComputedStyle(destinationItem);
    let originObject = getComputedStyle(originItem);

    let destinationY = parseFloat(destinationObject.top);
    let destinationX = parseFloat(destinationObject.left);
    let originItemY = parseFloat(originObject.top);
    let originItemX = parseFloat(originObject.left);

    let angle = Math.atan2(destinationY - originItemY, destinationX - originItemX) * 180 / Math.PI;
    return angle
}

const scissors = document.getElementById('1');
const paper = document.getElementById('2');
const rock = document.getElementById('3');

getDirection(rock, scissors);
getDirection(scissors, paper);

const getTarget = (item) => {
    let theClassList = item.classList;
    if (theClassList.contains('rock')) {
        return scissors;
    }
    else if (theClassList.contains('paper')) {
        return rock;
    }
    else if (theClassList.contains('scissors')) {
        return paper;
    }
    else {
        return null;
    }

}


const moveItem = (item) => {
    let distance = 10;
    let target = getTarget(item);
    let angle = getDirection(item, target);

    let x = distance * Math.cos(angle * Math.PI / 180);
    let y = distance * Math.sin(angle * Math.PI / 180);
    let newPosX = parseFloat(getComputedStyle(item).left) + x;
    let newPosY = parseFloat(getComputedStyle(item).top) + y;
    console.log(newPosX, newPosY);
    item.style.left = newPosX + 'px';
    item.style.top = newPosY + 'px';
}

setInterval(
    () => moveItem(rock),
    500
);
setInterval(
    () => moveItem(scissors),
    500
);
setInterval(
    () => moveItem(paper),
    500
);