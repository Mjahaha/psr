let operationsBF = 0;
let operationsSplitting = 0;


const generateNumber = () => {
    let num = Math.floor(Math.random() * 100);
    return num;
}

const addIntoSortedArrayByLookingFromStart = (array, num) => {
    // if array is empty, just add the number
    if (array.length === 0) {
        array.push(num);
        return;
    } 

    //if array has only one element, compare the number with the element
    if (array.length === 1) {
        if (num < array[0]) {
            array.unshift(num);
            return;
        } else {
            array.push(num);
            return;
        }
    }

    // if array has more than one element, compare the number with the elements
    if (array.length > 1) {
        for (let i = 0; i < array.length; i++) {
            if(num <= array[i]) {
                array.splice(i, 0, num);
                return;
            } 
        }
        array.push(num);
    }
}

const addIntoSortedBinarySearch = (array, num) => {
    // if array is empty, just add the number
    if (array.length === 0) {
        array.push(num);
        return;
    } 

    //if array has only one element, compare the number with the element
    if (array.length === 1) {
        if (num < array[0]) {
            array.unshift(num);
            return;
        } else {
            array.push(num);
            return;
        }
    }

    //checking array edges
    if (num <= array[0]) {
        array.splice(0, 0, num);
        return;
    } 
    if (array[array.length - 1] < num) {
        array.push(num);
        return;
    }

    //going through splitting array each way
    const getPosition = (lowerIndex, higherIndex) => {

        const middleIndex = Math.floor((higherIndex + lowerIndex) / 2);
        const middleIndexNumber = array[middleIndex];

        //case where the recursion has converged on an index
        if (middleIndex === lowerIndex || middleIndex === higherIndex) {
            if (num < array[lowerIndex]) {
                array.splice(lowerIndex, 0, num);
            } else {
                array.splice(lowerIndex + 1, 0, num);
            }
            return;
        }

        //case where recursion is necessary, split the array and decide where to do
        if (num < middleIndexNumber) {
            getPosition(lowerIndex, middleIndex);
        } else {
            getPosition(middleIndex, higherIndex);
        }

    }  
    getPosition(0, array.length - 1 );
}

//adds an item into a sorted array with binary search for the position
export const addItemIntoSortedBinarySearch = (array, item, xOrY) => {
    
    //THIS DOESNT WORK YET
    const getXOrYOfItem = (itemNested) => {
        let itemObject = getComputedStyle(itemNested);
        let numNested;
        if (xOrY == 'x' || xOrY == 'X') {
            numNested = parseFloat(itemObject.left);
        }  
        if (xOrY == 'y' || xOrY == 'Y') {
            numNested = parseFloat(itemObject.top);
        }
        console.log("numNested: " + numNested);
        return numNested;
    }

    //get item details
    let num = getXOrYOfItem(item);
    
    // if array is empty, just add the number
    if (array.length === 0) {
        console.log(1);
        array.push(item);
        return;
    } 

    let beginningOfArrayNum = getXOrYOfItem(array[0]);
    let endOfArrayNum = getXOrYOfItem(array[array.length - 1]);
    console.log("num: " + num + " beginningOfArrayNum: " + beginningOfArrayNum + " endOfArrayNum: " + endOfArrayNum);


    //if array has only one element, compare the number with the element
    if (array.length === 1) {
        if (num < beginningOfArrayNum) {
            console.log(2);
            array.unshift(item);
            return;
        } else {
            console.log(3);
            array.push(item);
            return;
        }
    }

    //checking array edges
    if (num <= beginningOfArrayNum) {
        console.log(4);
        array.splice(0, 0, item);
        return;
    } 
    if (endOfArrayNum < num) {
        console.log(5);
        array.push(item);
        return;
    }

    //going through splitting array each way
    const getPosition = (lowerIndex, higherIndex) => {

        const middleIndex = Math.floor((higherIndex + lowerIndex) / 2);
        const middleIndexNumber = getXOrYOfItem(array[middleIndex]); 
        const lowerIndexNumber = getXOrYOfItem(array[lowerIndex]);
        const higherIndexNumber = getXOrYOfItem(array[higherIndex]);

        //case where the recursion has converged on an index
        if (middleIndex === lowerIndex || middleIndex === higherIndex) {
            console.log("lowerIndex: " + lowerIndex + " higherIndex: " + higherIndex);
            console.log(`higerIndexNumber: ${higherIndexNumber} lowerIndexNumber: ${lowerIndexNumber} num: ${num}`);
            if (num < lowerIndexNumber) {
                console.log(6);
                array.splice(lowerIndex, 0, item);
            } else {
                console.log(7);
                array.splice(lowerIndex + 1, 0, item);
            }
            return;
        }

        //case where recursion is necessary, split the array and decide where to do
        if (num < middleIndexNumber) {
            getPosition(lowerIndex, middleIndex);
        } else {
            getPosition(middleIndex, higherIndex);
        }

    }  
    getPosition(0, array.length - 1 );
}

//replaces item in array with addItemIntoSortedBinarySearch
export const replaceItemInSortedBinarySearch = (array, item, xOrY) => {
    const itemIndex = array.indexOf(item);
    array.splice(itemIndex, 1);
    addItemIntoSortedBinarySearch(array, item, xOrY);
}


const generateArrayForTest = num => {
    let newArray1 = [];
    let newArray2 = [];
    for (let i = 0; i < num; i++) {
        let thisNum = generateNumber();
        addIntoSortedArrayByLookingFromStart(newArray1, thisNum);
        addIntoSortedBinarySearch(newArray2, thisNum);
    }

    return { newArray1, newArray2 };
}

const { newArray1: test1, newArray2: test2 } = generateArrayForTest(30);
//console.log("We made this by going left to right! Its length is: " + test1.length + " and it looks like: " + test1);
//console.log("We made this by splitting! Its length is: " + test2.length + " and it looks like: " + test2);
