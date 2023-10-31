
const getDirection = (originItem, destinationItem) => {
    let destinationObject = getComputedStyle(destinationItem);
    let originObject = getComputedStyle(originItem);

    let destinationY = parseFloat(destinationObject.top);
    let destinationX = parseFloat(destinationObject.left);
    let originItemY = parseFloat(originObject.top);
    let originItemX = parseFloat(originObject.left);

    let angle = Math.atan2(destinationY - originItemY, destinationX - originItemX) * 180 / Math.PI + 90;
    console.log(angle);
    return angle
}

const scissors = document.getElementById('1');
const paper = document.getElementById('2');
const rock = document.getElementById('3');

getDirection(rock, scissors);
getDirection(scissors, paper);

const getTarget = (item) => {
    let theClassList = item.classList;
    console.log(theClassList);
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


//const moveItem = (item) => {}