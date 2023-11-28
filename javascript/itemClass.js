import { data } from "./data.js";

export const itemClass = class {
    constructor(type, team) {
        this.id = data.itemCount;
        data.itemCount++;
        this.element = document.createElement("div");
        this._type = type;
        this._team = team;
        this.x = Math.random() * data.screenWidth;
        this.y = Math.random() * data.screenHeight;
        this.width = 60;
        this.height = 60;
        this.speed = data.distance;
        this.alive = true;
        this.setArrays();
        data.allItems.forEach((item) => { item.setArrays(); });
        //the nearest item details
        this.nearestPrey = null;
        this.nearestPreyDistance = 100000;
        this.nearestPredator = null;
        this.nearestPredatorDistance = 100000;
        this.nearestSame = null;
        this.nearestSameDistance = 100000;
        //the element details
        this.element.classList.add(...["item", this.type, this.team]);
        this.element.id = this.id;
        this.element.style.transition = `all ${data.timestep}ms linear`
        data.field.appendChild(this.element);
        //the class is added to data.allItems
        data.allItems.push(this);
        if (this.type === "rock") { data.allRocks.push(this.id); }
        if (this.type === "paper") { data.allPapers.push(this.id); }
        if (this.type === "scissors") { data.allScissors.push(this.id); }
        if (this.team === "unaligned") { data.allUnaligned.push(this.id); }
        if (this.team === "blue") { data.allBlue.push(this.id); }
        if (this.team === "red") { data.allRed.push(this.id); }
        if (this.team === "green") { data.allGreen.push(this.id); }
        //adds a listener to element on click that does a console log
        this.element.addEventListener('click', (event) => {
            console.log(this); console.log(data);
        });
    }

    get width() { return this._width; }
    set width(pixelsWide) {
        this._width = pixelsWide;
        this.element.style.width = `${this.width}px`;
    }
    get height() { return this._height; }
    set height(pixelsHigh) {
        this._height = pixelsHigh;
        this.element.style.height = `${this.height}px`;
    }

    get x() { return this._x; }
    set x(newX) {
        if (typeof newX != 'number') { newX = this._x; }
        this._x = newX;
        this.element.style.left = `${this.x}px`;
    }
    get y() { return this._y; }
    set y(newY) {
        if (typeof newY != 'number') { newY = this._y; }
        this._y = newY;
        this.element.style.top = `${this.y}px`;
    }

    get alive() { return this._alive; }
    set alive(newAlive) {
        if (this._alive === newAlive) { return; }

        
        if (this._type === "rock" && data.allRocks.includes(this.id)) 
        { data.allRocks.splice(data.allRocks.indexOf(this.id), 1); }
        if (this._type === "paper" && data.allPapers.includes(this.id)) 
        { data.allPapers.splice(data.allPapers.indexOf(this.id), 1); }
        if (this._type === "scissors" && data.allScissors.includes(this.id)) 
        { data.allScissors.splice(data.allScissors.indexOf(this.id), 1); }
        if (this._team === "unaligned" && data.allUnaligned.includes(this.id)) 
        { data.allUnaligned.splice(data.allUnaligned.indexOf(this.id), 1); }
        if (this._team === "blue" && data.allBlue.includes(this.id)) 
        { data.allBlue.splice(data.allBlue.indexOf(this.id), 1); }
        if (this._team === "red" && data.allRed.includes(this.id)) 
        { data.allRed.splice(data.allRed.indexOf(this.id), 1); }
        if (this._team === "green" && data.allGreen.includes(this.id)) 
        { data.allGreen.splice(data.allGreen.indexOf(this.id), 1); }    

        this._alive = newAlive;
        if (this._alive === false) { this.element.remove(); }
        if (this._alive === true) { data.field.appendChild(this.element); }

    }

    get type() { return this._type; }
    //this setter changes this._type, manages arrays, and changes the classList of relevant element
    set type(newType) { 
        if (this._type === newType) { return; }  
        let newTypeArray;
        if (newType === "rock") { data.allRocks.push(this.id); }
        if (newType === "paper") { data.allPapers.push(this.id); }
        if (newType === "scissors") { data.allScissors.push(this.id); }
        if (this._type === "rock") { data.allRocks.splice(data.allRocks.indexOf(this.id), 1); }
        if (this._type === "paper") { data.allPapers.splice(data.allPapers.indexOf(this.id), 1); }
        if (this._type === "scissors") { data.allScissors.splice(data.allScissors.indexOf(this.id), 1); }
        this.element.classList.remove(this._type);
        this.element.classList.add(newType);
        this._type = newType;
        this.setArrays();   
        this.getNearestPredPreySame();     
     }

    get team() { return this._team; }
    //this setter changes this._team, manages arrays, and changes the classList of relevant element
    set team(newTeam) {
        if (this._team === newTeam) { return; }
        let newTeamArray;
        if (newTeam === "unaligned") { newTeamArray = data.allUnaligned; }
        if (newTeam === "blue") { newTeamArray = data.allBlue; }
        if (newTeam === "red") { newTeamArray = data.allRed; }
        if (newTeam === "green") { newTeamArray = data.allGreen; }
        if (this._team === "unaligned") { 
            data.allUnaligned.splice(data.allUnaligned.indexOf(this.id), 1);
            newTeamArray.push(this.id); }
        if (this._team === "blue") { 
            data.allBlue.splice(data.allBlue.indexOf(this.id), 1);
            newTeamArray.push(this.id); }
        if (this._team === "red") { 
            data.allRed.splice(data.allRed.indexOf(this.id), 1); 
            newTeamArray.push(this.id); }
        if (this._team === "green") { 
            data.allGreen.splice(data.allGreen.indexOf(this.id), 1); 
            newTeamArray.push(this.id); }
        this.element.classList.remove(this._team);
        this.element.classList.add(newTeam);
        this._team = newTeam;
    }

    setArrays() {
        if (this.type == "rock") {
            this.preyType = "scissors";
            this.preyTypeArray = data.allScissors;
            this.predatorType = "paper";
            this.predatorTypeArray = data.allPapers;
            this.typeArray = data.allRocks;}
        if (this.type == "paper") {
            this.preyType = "rock";
            this.preyTypeArray = data.allRocks;
            this.predatorType = "scissors";
            this.predatorTypeArray = data.allScissors;
            this.typeArray = data.allPapers;}
        if (this.type == "scissors") {
            this.preyType = "paper";
            this.preyTypeArray = data.allPapers;
            this.predatorType = "rock";
            this.predatorTypeArray = data.allRocks;
            this.typeArray = data.allScissors;}
        if (this.team === "unaligned") { this.myTeamArray = data.allUnaligned; }
        if (this.team === "blue") { 
            this.myTeamArray = data.allBlue; 
            this.enemyTeam1Array = data.allRed;
            this.enemyTeam2Array = data.allGreen;    
        }
        if (this.team === "red") { 
            this.myTeamArray = data.allRed; 
            this.enemyTeam1Array = data.allBlue;
            this.enemyTeam2Array = data.allGreen;    
        }
        if (this.team === "green") { 
            this.myTeamArray = data.allGreen; 
            this.enemyTeam1Array = data.allBlue;
            this.enemyTeam2Array = data.allRed;    
        }
    } 

    //determines who should be chased and who should be run from
    getNearestPredPreySame() {
        let chaseTargetList;
        let sameTargetList;
        this.nearestPredatorDistance = 100000;
        this.nearestPreyDistance = 100000;
        this.nearestSameDistance = 100000;
        this.nearestPredator = null;
        this.nearestPrey = null;
        this.nearestSame = null;
        if(this.team == "unaligned") {
            chaseTargetList = [...this.preyTypeArray, ...this.predatorTypeArray];
            sameTargetList = [...this.typeArray];
            //console.log('this is an unaligned ' + this.type + ' and its preyTypeArray is ' + this.preyTypeArray.join(', ') + ' and its predatorTypeArray is ' + this.predatorTypeArray.join(', ') + ' and its typeArray is ' + this.typeArray.join(', '));
        } else {
            chaseTargetList = [...this.preyTypeArray, ...this.predatorTypeArray].filter((ArrayItemId) => 
                this.team != data.allItems[ArrayItemId].team);
            if (this.team === "blue") { sameTargetList = [...new Set([...this.typeArray, ...data.allBlue])]; }
            else if (this.team === "red") { sameTargetList = [...new Set([...this.typeArray, ...data.allRed])]; }
            else if (this.team === "green") { sameTargetList = [...new Set([...this.typeArray, ...data.allGreen])]; }
            else {sameTargetList = this.typeArray}
            //console.log(`this is ${this.id} ${this.team} ${this.type} and its chaseTargetList is ${chaseTargetList.join(', ')} and its sameTargetList is ${sameTargetList.join(', ')}`);
        }
        if (!chaseTargetList) { return; }
        
        //loop through predators and prey in chaseTargetList to find closest target
        for (let i = 0; i < chaseTargetList.length; i++) {
            let targetX = data.allItems[chaseTargetList[i]].x;
            let targetY = data.allItems[chaseTargetList[i]].y; 
            let distance = Math.sqrt(Math.pow(targetX - this.x, 2) + Math.pow(targetY - this.y, 2));
            let targetClass = data.allItems[chaseTargetList[i]].type;
            //console.log(`for id ${this.id}, the targetX is ${targetX} and targetY is ${targetY} and distance is ${distance}`);
            
            if (targetClass === this.predatorType) {
                if (distance < this.nearestPredatorDistance) {
                    this.nearestPredatorDistance = distance;
                    this.nearestPredator = chaseTargetList[i];
                }
            } 
            else if (targetClass === this.preyType) {
                if (distance < this.nearestPreyDistance) {
                    this.nearestPreyDistance = distance;
                    this.nearestPrey = chaseTargetList[i];
                } 
            } else { 
                console.log('no prey or predator found');
            }
        }     
    
        //loop through targets of the same class in sameTargetList to find closest same
        for (let i = 0; i < sameTargetList.length; i++) {
            let targetX = data.allItems[sameTargetList[i]].x;
            let targetY = data.allItems[sameTargetList[i]].y; 
            let distance = Math.sqrt(Math.pow(targetX - this.x, 2) + Math.pow(targetY - this.y, 2));
            let targetClass = data.allItems[sameTargetList[i]].type;
            
            if (sameTargetList[i] === this.id) { continue; }
            if (targetClass === this.type) {
                if (distance < this.nearestSameDistance) {
                    this.nearestSameDistance = distance;
                    this.nearestSame = sameTargetList[i];
                }
            }         
        }
        //console.log('nearestPredatorDistance is ' + this.nearestPredatorDistance);
        //console.log('nearestPreyDistance is ' + this.nearestPreyDistance);
        //console.log('nearestSameDistance is ' + this.nearestSameDistance);
    }

    getDirection(targetId) {
        if (targetId == null) { return false; }
        let targetX = data.allItems[targetId].x;
        let targetY = data.allItems[targetId].y;
        let angle = Math.atan2(this.y - targetY, this.x - targetX) * 180 / Math.PI;
        return angle;
    }

    collisionDetection(targetId) {

        if (targetId == null || targetId == this.id) { return false; }
    
        let targetX = data.allItems[targetId].x;
        let targetY = data.allItems[targetId].y;
        let targetWidth = data.allItems[targetId].width;
        let targetHeight = data.allItems[targetId].height;
    
        //check if item is colliding with target
        if (this.x < targetX + targetWidth &&
            this.x + this.width > targetX &&
            this.y < targetY + targetHeight &&
            this.y + this.height > targetY) { 
                this.collisionAction(targetId);
                return true; 
            }
        else { return false; }
    }

    collisionAction(targetId) {
        if (targetId == null) { return false; }
        //console.log(`collision between ${this.id} and ${targetId}`);
        //actions for if item is colliding with a predator or prey item
        if (data.captureKill == "kill" && data.allItems[targetId].type == this.preyType)  //the items wins - kill
            { data.allItems[targetId].alive = false; }
        if (data.captureKill == "kill" && data.allItems[targetId].type == this.predatorType) //the target wins - kill
            { this.alive = false; }
        if (data.captureKill == "capture" && data.allItems[targetId].type == this.preyType) //the items wins - catpure
            {
                if (this.team === "unaligned") { data.allItems[targetId].type = this.type; }    //if the item is unaligned, duplicate the unaligned item
                else { data.allItems[targetId].team = this.team; }   //if the item is on a team, swap targets team
            }
        if (data.captureKill == "capture" && data.allItems[targetId].type == this.predatorType) //the target wins - capture
            {
                if (data.allItems[targetId].team === "unaligned") { this.type = data.allItems[targetId].type; }    //if the target is unaligned, duplicate the unaligned target
                else { this.team = data.allItems[targetId].team; }   //if the target is on a team, swap item team
            }
        
        //actions for if item is colliding with a same item
        if (data.allItems[targetId].type == this.type || data.allItems[targetId].team == this.team) {
            const angle = this.getDirection(this.nearestSame);
            const moveX = this.speed * Math.cos(angle * Math.PI / 180);
            const moveY = this.speed * Math.sin(angle * Math.PI / 180);
            if (this.x + moveX < 0) { this.x = 0; } 
            else if (this.x + moveX > data.screenWidth) { this.x = data.screenWidth; } 
            else { this.x += moveX; } 
            if (this.y + moveY < 0) { this.y = 0; } 
            else if (this.y + moveY > data.screenHeight) { this.y = data.screenHeight; } 
            else { this.y += moveY; } 
        }

        //check if there is only one class left
        if (data.allRocks.length === 0 && data.allPapers.length === 0) { 
            data.startDetails.innerHTML = `<h1>Scissors wins!</h1>`;
            data.gameOver = true;
        }
        if (data.allPapers.length === 0 && data.allScissors.length === 0) { 
            data.startDetails.innerHTML = `<h1>Rock wins!</h1>`; 
            data.gameOver = true; 
        }
        if (data.allScissors.length === 0 && data.allRocks.length === 0) { 
            data.startDetails.innerHTML = `<h1>Paper wins!</h1>`; 
            data.gameOver = true; 
        }
        if (data.allBlue.length === 0 && data.allRed.length === 0 && data.allUnaligned.length === 0) { 
            data.startDetails.innerHTML = `<h1>Green wins!</h1>`; 
            data.gameOver = true; 
        }
        if (data.allRed.length === 0 && data.allGreen.length === 0 && data.allUnaligned.length === 0) { 
            data.startDetails.innerHTML = `<h1>Blue wins!</h1>`; 
            data.gameOver = true; 
        }
        if (data.allGreen.length === 0 && data.allBlue.length === 0 && data.allUnaligned.length === 0) { 
            data.startDetails.innerHTML = `<h1>Red wins!</h1>`; 
            data.gameOver = true; 
        }

        //Speed up conditions 
        const teamsArraysAreEmpty = (data.allBlue.length === 0 && data.allRed.length === 0 && data.allGreen.length === 0);
        if (teamsArraysAreEmpty && data.allRocks.length === 0 && !data.spedUp) {
            console.log("all rocks are gone");
            data.distance = data.distance * 2;
            data.spedUp = true;
        }
        if (teamsArraysAreEmpty && data.allScissors.length === 0 && !data.spedUp) {
            console.log("all scissors are gone");
            data.distance = data.distance * 2;
            data.spedUp = true;
            
        }
        if (teamsArraysAreEmpty && data.allPapers.length === 0 && !data.spedUp) {
            console.log("all papers are gone");
            data.distance = data.distance * 2;
            data.spedUp = true;
        }

        return true;
    }

    moveItem() {
        this.getNearestPredPreySame();
        //console.log(`for ${this.id} ${this.team} ${this.type}, the nearestPredator is ${this.nearestPredator} and the nearestPrey is ${this.nearestPrey} and the nearestSame is ${this.nearestSame}`);
    
        //determine if the item is moving to predator or prey
        let target;
        let angle = 0;
        if (this.nearestPredatorDistance < this.nearestPreyDistance) {
            target = this.nearestPredator; 
            angle += this.getDirection(target);;
        } 
        else { 
            target = this.nearestPrey; 
            angle += 180 + this.getDirection(target);
        }
    
        //move the the right distance at the right angle to move toward nearest target
        let moveX = this.speed * Math.cos(angle * Math.PI / 180);
        let moveY = this.speed * Math.sin(angle * Math.PI / 180);
        this.x += moveX;
        this.y += moveY;
    
        //check if item is out of bounds
        if (this.x < 0) { this.x = 0; }
        if (this.x > data.screenWidth) { this.x = data.screenWidth; }
        if (this.y < 0) { this.y = 0; }
        if (this.y > data.screenHeight) { this.y = data.screenHeight; }

        //check for collisions
        this.collisionDetection(this.nearestPredator);
        this.collisionDetection(this.nearestPrey);
        this.collisionDetection(this.nearestSame);
    }
}


//TESTING
/*
new itemClass("rock", "unaligned");
new itemClass("paper", "unaligned");
new itemClass("scissors", "unaligned");
new itemClass("rock", "unaligned");
new itemClass("paper", "unaligned");
new itemClass("scissors", "unaligned");
data.allItems[0].getNearestPredPreySame();
data.allItems[1].getNearestPredPreySame();
data.allItems[2].getNearestPredPreySame();
console.log("angle: " + data.allItems[0].getDirection(data.allItems[0].nearestPredator));

//checks for any collisions of every item with every other item
for (let i = 0; i < data.allItems.length; i++) {
    for (let j = 0; j < data.allItems.length; j++) {
        if (i === j) { continue; }
        if (data.allItems[i].collisionDetection(data.allItems[j].id)) {
            console.log("collision between " + data.allItems[i].id + " and " + data.allItems[j].id);
        }
    }
}

*/