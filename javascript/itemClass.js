import { data } from "./data.js";

const itemClass = class {
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
        this.setPredatorPrey();
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
        data.field.appendChild(this.element);
        //the class is added to data.allItems
        data.allItems.push(this);
        if (this.type === "rock") { data.allRocks.push(this.id); }
        if (this.type === "paper") { data.allPapers.push(this.id); }
        if (this.type === "scissors") { data.allScissors.push(this.id); }
        console.log("all rocks array: " + data.allRocks.join(", "));
        console.log("all papers array: " + data.allPapers.join(", "));
        console.log("all scissors array: " + data.allScissors.join(", "));
    }

    get width() { return this._width; }
    set width(pixelsWide) {
        this._width = 60;
        this.element.style.width = `${this.width}px`;
    }
    get height() { return this._height; }
    set height(pixelsHigh) {
        this._height = 60;
        this.element.style.height = `${this.height}px`;
    }

    get x() { return this._x; }
    set x(newX) {
        this._x = newX;
        this.element.style.left = `${this.x}px`;
    }
    get y() { return this._y; }
    set y(newY) {
        this._y = newY;
        this.element.style.top = `${this.y}px`;
    }

    get alive() { return this._alive; }
    set alive(newAlive) {
        if (this._alive === newAlive) { return; }
        this._alive = newAlive;
        if (this._alive === false) { this.element.remove(); }
        if (this._alive === true) { data.field.appendChild(this.element); }
    }

    get type() { return this._type; }
    //this setter changes this._type, manages arrays, and changes the classList of relevant element
    set type(newType) { 
        if (this._type === newType) { return; }  
        let newTypeArray;
        if (newType === "rock") { newTypeArray = data.allRocks; }
        if (newType === "paper") { newTypeArray = data.allPapers; }
        if (newType === "scissors") { newTypeArray = data.allScissors; }
        if (this._type === "rock") {                    //SHOULD THIS BE CHECKING THE NEW TYPE????
            data.allRocks.splice(data.allRocks.indexOf(this.id), 1);
            newTypeArray.push(this.id); }
        if (this._type === "paper") { 
            data.allPapers.splice(data.allPapers.indexOf(this.id), 1);
            newTypeArray.push(this.id); }
        if (this._type === "scissors") { 
            data.allScissors.splice(data.allScissors.indexOf(this.id), 1); 
            newTypeArray.push(this.id); }
        this.element.classList.remove(this._type);
        this.element.classList.add(newType);
        this._type = newType;
        this.setPredatorPrey();        
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

    setPredatorPrey() {
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
    }

    //determines who should be chased and who should be run from
    getNearestPredPreySame() {
        let chaseTargetList;
        let sameTargetList;
        if(this.team == "unaligned") {
            console.log('this is an unaligned ' + this.type + ' and its preyTypeArray is ' + this.preyTypeArray.join(', ') + ' and its predatorTypeArray is ' + this.predatorTypeArray.join(', ') + ' and its typeArray is ' + this.typeArray.join(', '));
            chaseTargetList = [...this.preyTypeArray, ...this.predatorTypeArray];
            sameTargetList = [...this.typeArray];
        } else {
            chaseTargetList = [...this.preyTypeArray, ...this.predatorTypeArray].filter((ArrayItem) => 
                this.team != ArrayItem.team);
            sameTargetList = [...new Set([...this.type, ...this.team])];
        }
        
        //loop through predators and prey in chaseTargetList to find closest target
        for (let i = 0; i < chaseTargetList.length; i++) {
            let targetX = data.allItems[chaseTargetList[i]].x;
            let targetY = data.allItems[chaseTargetList[i]].y; 
            let distance = Math.sqrt(Math.pow(targetX - this.x, 2) + Math.pow(targetY - this.y, 2));
            let targetClass = data.allItems[chaseTargetList[i]].type;
            
            if (targetClass === this.preyType) {
                if (distance < this.nearestPredatorDistance) {
                    this.nearestPredatorDistance = distance;
                    this.nearestPredator = chaseTargetList[i];
                }
            } else if (distance < this.nearestPreyDistance) {
                    this.nearestPreyDistance = distance;
                    this.nearestPrey = chaseTargetList[i];
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
        console.log('nearestPredatorDistance is ' + this.nearestPredatorDistance);
        console.log('nearestPreyDistance is ' + this.nearestPreyDistance);
        console.log('nearestSameDistance is ' + this.nearestSameDistance);
    }

    getDirection(targetId) {
        let targetX = data.allItems[targetId].x;
        let targetY = data.allItems[targetId].y;
        let angle = Math.atan2(this.y - targetY, this.x - targetX) * 180 / Math.PI;
        return angle;
    }

    collisionDetection(targetId) {

        if (targetId == null) { return false; }
    
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
        console.log(`collision between ${this.id} and ${targetId}`);
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
        /*
        if (data.allItems[targetId].type == this.type) {
            const angle = this.getDirection(closestSame);
            const moveX = distance * Math.cos(angle * Math.PI / 180);
            const moveY = distance * Math.sin(angle * Math.PI / 180);
            this.x -= moveX;
            this.y -= moveY;
        }
        */

        //check if there is only one class left
        let classesLeft = 3;
        if (data.allRocks.length === 0) { classesLeft--; }
        if (data.allPapers.length === 0) { classesLeft--; }
        if (data.allScissors.length === 0) { classesLeft--; }
        if (classesLeft <= 1) { 
            data.startDetails.innerHTML = `<h1>${data.allItems[0].type} wins!</h1>`;
        }
        return true;
    }

    moveItem() {
        console.log(`it's ${this.team} ${this.type} ${this.id}'s turn`)
        this.getNearestPredPreySame();
    
        //determine if the item is moving to predator or prey
        let target;
        let angle = this.getDirection(target);
        if (this.nearestPredatorDistance < this.nearestPreyDistance  * 0.8) {
            target = closestPredator; 
            angle += 180;
        } 
        else { 
            target = closestPrey; 
        }
    
        //move the the right distance at the right angle to move toward nearest target
        let moveX = distance * Math.cos(angle * Math.PI / 180);
        let moveY = distance * Math.sin(angle * Math.PI / 180);
        this.x += moveX;
        this.y += moveY;
    
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

        //check for collisions
        this.collisionDetection(this.nearestPredator)
        this.collisionDetection(this.nearestPrey)
        this.collisionDetection(this.nearestSame)
    }
}

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

