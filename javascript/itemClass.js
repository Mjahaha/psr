import { data } from "./data.js";
import { mainMenu, updateSidebar } from "./menu.js";

export const itemClass = class {
    constructor(type, team, specifics) {
        this.id = data.itemCount;
        data.itemCount++;
        this.element = document.createElement("div");
        this._type = type;
        this._team = team || "unaligned";
        this.specifics = specifics;
        this._x = (specifics && specifics.x) || Math.random() * data.screenWidth; 
        this._y = (specifics && specifics.y) || Math.random() * data.screenHeight;
        this._alive = true;
        this.width = 60;
        this.height = 60;
        this.topLeftX = this.x + this.width / 2;
        this.topLeftY = this.y + this.height / 2;
        this.speed = data.distance;
        this.alive = true;
        this.setArrays();
        data.allItems.forEach((item) => { item.setArrays(); });
        this.itemDoesConsoleLogs = false;
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
        this.element.style.transition = `all ${data.timestep}ms linear`;
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
            console.log(this); 
            console.log(data);
            this.itemDoesConsoleLogs = true;
        });
        data.field.appendChild(this.element);
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
        if (isNaN(newX)) { 
            console.log(`cannot set this.x to NaN, id: ${this.id}`)
            newX = this._x;
         }
        this._x = newX;
        this.topLeftX = this.x - this.width / 2;
    }
    get y() { return this._y; }
    set y(newY) {
        if (typeof newY != 'number') { newY = this._y; }
        if (isNaN(newY)) { 
            console.log(`cannot set this.y to NaN, id: ${this.id}`)
            newY = this._y;
         }
        this._y = newY;
        this.topLeftY = this.y - this.height / 2;
    }

    get topLeftX() { return this._topLeftX; }
    set topLeftX(newTopLeftX) {
        if (typeof newTopLeftX != 'number') { newTopLeftX = this._topLeftX; }
        this._topLeftX = newTopLeftX;

        //checks if item is out of bounds
        if (this.topLeftX < 0) { this._topLeftX = 0; } 
        if (this.topLeftX > data.screenWidth - this.width) { this._topLeftX = data.screenWidth - this.width; } 

        this._x = this.topLeftX + this.width / 2;
        this.element.style.left = `${this.topLeftX}px`;

    }
    get topLeftY() { return this._topLeftY; }
    set topLeftY(newTopLeftY) {
        if (typeof newTopLeftY != 'number') { newTopLeftY = this._topLeftY; }

        //checking if the item is colliding with the nearest terrain
        const isPointWithTerrain = (checkingX, checkingY) => {
            if (this.nearestTerrain == null) { return false; }
            const terrain = data.allTerrain[this.nearestTerrain];
            const distancetoTerrain = Math.sqrt(Math.pow(checkingX - terrain.x, 2) + Math.pow(checkingY - terrain.y, 2));
            const distanceToCheck = terrain.radius;
            return distancetoTerrain < distanceToCheck;
        }

        //this function returns the new position of the item if it is colliding with a terrain
        const getNewPositionIfCollidingWithTerrain = () => {
            const terrain = data.allTerrain[this.nearestTerrain];
            const angle = 180 + this.getDirection(terrain, null, "trying to move into terrain and being prevented by TopLeftY rules");    //180 because we move away from terrain
            const pointX = terrain.x + terrain.radius * Math.cos(angle * Math.PI / 180);
            const pointY = terrain.y + terrain.radius * Math.sin(angle * Math.PI / 180);
            return {x: pointX, y: pointY};
        }

        //checking each corner of the item to see if it is colliding with the nearest terrain
        if (isPointWithTerrain(this.topLeftX, newTopLeftY)) {   //top left corner
            const newPosition = getNewPositionIfCollidingWithTerrain();
            this._topLeftX = newPosition.x;
            this._topLeftY = newPosition.y;
        } else if (isPointWithTerrain(this.topLeftX, newTopLeftY + this.height)) { //bottom left corner
            const newPosition = getNewPositionIfCollidingWithTerrain();
            this._topLeftX = newPosition.x;
            this._topLeftY = newPosition.y - this.height;
        } else if (isPointWithTerrain(this.topLeftX + this.width, newTopLeftY)) { //top right corner
            const newPosition = getNewPositionIfCollidingWithTerrain();
            this._topLeftX = newPosition.x - this.width;
            this._topLeftY = newPosition.y;
        } else if (isPointWithTerrain(this.topLeftX + this.width, newTopLeftY + this.height)) { //bottom right corner
            const newPosition = getNewPositionIfCollidingWithTerrain();
            this._topLeftX = newPosition.x - this.width;
            this._topLeftY = newPosition.y - this.height;
        } else {
            this._topLeftY = newTopLeftY; 
        }

        //checks if item is out of bounds
        if (this.topLeftY < 0) { this._topLeftY = 0; }
        if (this.topLeftY > data.screenHeight - this.height) { this._topLeftY = data.screenHeight - this.height; }

        this._y = this.topLeftY + this.height / 2;
        this.element.style.top = `${this.topLeftY}px`;

        

    }

    get alive() { return this._alive; }
    set alive(newAlive) {
        if (this._alive === newAlive) { return; }
        
        //remove item from relevant arrays
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
        this.getNearestItemsAndTerrain();     
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

    createDotForTesting(redDotX, redDotY, colour, weight) {
        const dot = document.createElement('div');
        dot.style.position = "absolute";
        dot.style.left = `${redDotX}px`;
        dot.style.top = `${redDotY}px`;
        let size = weight == null ? 3 : weight;
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        dot.style.backgroundColor = colour || "red";
        dot.style.zIndex = 9;
        document.body.appendChild(dot);
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
    getNearestItemsAndTerrain() {
        //initialise variable
        let chaseTargetList; 
        let sameTargetList; 
        this.nearestPredatorDistance = 100000;
        this.nearestPreyDistance = 100000;
        this.nearestSameDistance = 100000;
        this.nearestTerrainDistance = 100000;
        this.nearestPredator = null;
        this.nearestPrey = null;
        this.nearestSame = null;
        this.nearestTerrain = null;
        //define chaseTargetList and sameTargetList
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
            else { sameTargetList = this.typeArray }
            //console.log(`this is ${this.id} ${this.team} ${this.type} and its chaseTargetList is ${chaseTargetList.join(', ')} and its sameTargetList is ${sameTargetList.join(', ')}`);
        }
        //console.log(`this is ${this.id} ${this.team} ${this.type} and its chaseTargetList is ${chaseTargetList.join(', ')}\n and its sameTargetList is ${sameTargetList.join(', ')}`);

        //loop through terrain to find closest terrain
        for (let i = 0; i < data.allTerrain.length; i++) {
            let terrainX = data.allTerrain[i].x;
            let terrainY = data.allTerrain[i].y;
            let distance = Math.sqrt(Math.pow(terrainX - this.x, 2) + Math.pow(terrainY - this.y, 2));
            distance = distance - data.allTerrain[i].radius; //we want the distance to the edge of the terrain
            if (distance < this.nearestTerrainDistance) {
                this.nearestTerrainDistance = distance;
                this.nearestTerrain = data.allTerrain[i].id;
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
        //console.log('nearestPredatorDistance is ' + this.nearestPredatorDistance);
        //console.log('nearestPreyDistance is ' + this.nearestPreyDistance);
       // console.log(`id:${this.id}, nearestSame is ${this.nearestSame}, nearestSameDistance is ${this.nearestSameDistance}`);
    }

    getDirection(target, startCoordObjGD, locationOfFunctionCall) {    //returns the angle to travel. Taking an ID for items, or a JSON with an x and y property
        //finding the targets X and Ys
        let targetX, targetY;
        if (typeof target == "object" || typeof target == "function") {
            targetX = target.x;
            targetY = target.y;
        } else {
            if (target == null) { return false; }
            targetX = data.allItems[target].x;
            targetY = data.allItems[target].y;
        }

        //finding starting point X and Ys
        let startX, startY;
        if (!startCoordObjGD) {
            startX = this.x;
            startY = this.y;
        } else {
            startX = startCoordObjGD.x;
            startY = startCoordObjGD.y;
        }
        
        let angle = Math.atan2(targetY - startY, targetX - startX) * 180 / Math.PI;
        if (this.itemDoesConsoleLogs && locationOfFunctionCall) {
            console.log(this);
            console.log(locationOfFunctionCall);
            console.log(`the angle is ${angle}\n and the targetX is ${targetX} and the targetY is ${targetY} and the startX is ${startX} and the startY is ${startY}`);
        }
        return angle;
    }

    //checks if one item is colliding with another, returning a boolean and executing collisionActionItem if true
    collisionDetectionItem(targetId) {

        if (targetId == null || targetId == this.id) { return false; }
        
        let targetX = data.allItems[targetId].topLeftX;
        let targetY = data.allItems[targetId].topLeftY;
        let targetWidth = data.allItems[targetId].width;
        let targetHeight = data.allItems[targetId].height;
    
        //check if item is colliding with target
        if (this.topLeftX < targetX + targetWidth &&
            this.topLeftX + this.width > targetX &&
            this.topLeftY < targetY + targetHeight &&
            this.topLeftY + this.height > targetY) { 
                this.collisionActionItem(targetId);
                return true; 
            }
        else { return false; }
    }

    //checks if one item is colliding with a terrain, returning a boolean and executing collisionActionTerrain if true
    /*
    collisionDetectionTerrain(terrainId) {

        if (terrainId == null) { return false; }

        //checks each corner of the square to see if it is within the radius of the circle
        //returns true if any corner is within the radius of the circle else false
        if (data.allTerrain[terrainId].type == "circle") {
            const targetRadius = data.allTerrain[terrainId].radius; 
            const checkIfPointIsWithinCircle = (pointX, pointY) => {
                const distance = Math.sqrt(Math.pow(pointX - data.allTerrain[terrainId].x, 2) + Math.pow(pointY - data.allTerrain[terrainId].y, 2));
                //console logs distance variables
                
                return distance < targetRadius; //returns true of the point is within the radius of the circular terrain
            }

            let thisX, thisY;
            //checks top left corner
            thisX = this.topLeftX; 
            thisY = this.topLeftY;
            if (checkIfPointIsWithinCircle(thisX, thisY)) { 
                this.collisionActionTerrain(terrainId);
                return true;
            }
            //checks top right corner
            thisX = this.topLeftX;
            thisY = this.topLeftY + this.width;
            if (checkIfPointIsWithinCircle(thisX, thisY)) { 
                this.collisionActionTerrain(terrainId);
                return true; 
            }
            //checks bottom left corner
            thisX = this.topLeftX + this.height;
            thisY = this.topLeftY;
            if (checkIfPointIsWithinCircle(thisX, thisY)) { 
                this.collisionActionTerrain(terrainId);
                return true; 
            }
            //checks bottom right corner
            thisX = this.topLeftX + this.height;
            thisY = this.topLeftY + this.width;
            if (checkIfPointIsWithinCircle(thisX, thisY)) { 
                this.collisionActionTerrain(terrainId);
                return true; 
            }
            
            //console logs all variable
            //console.log(`targetRadius is ${targetRadius}, this.x is ${this.x}, this.y is ${this.y}, `);
            return false;
        }
    } */

    collisionActionItem(targetId) {
        if (targetId == null) { return false; }
        updateSidebar();   //keep sidebar stats up to date
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
            const angle = 180 + this.getDirection(this.nearestSame, null, "colliding with a same");    //180 because we move away from sames
            const moveX = this.speed * Math.cos(angle * Math.PI / 180);
            const moveY = this.speed * Math.sin(angle * Math.PI / 180);
            this.topLeftX += moveX;
            this.topLeftY += moveY;
        }

        //check if there is only one class left
        if (data.allRocks.length === 0 && data.allPapers.length === 0) { 
            data.startDetails.innerHTML = `
            <h1>Scissors wins!</h1>
            <input type="button" id="return" value="Return"">`;
            document.getElementById('return').addEventListener('click', mainMenu);
            data.gameOver = true;
            updateSidebar();
        }
        if (data.allPapers.length === 0 && data.allScissors.length === 0) { 
            data.startDetails.innerHTML = `<h1>Rock wins!</h1>
            <input type="button" id="return" value="Return"">`;
            document.getElementById('return').addEventListener('click', mainMenu); 
            data.gameOver = true; 
            updateSidebar();
        }
        if (data.allScissors.length === 0 && data.allRocks.length === 0) { 
            data.startDetails.innerHTML = `<h1>Paper wins!</h1>
            <input type="button" id="return" value="Return"">`;
            document.getElementById('return').addEventListener('click', mainMenu); 
            data.gameOver = true; 
            updateSidebar();

        }
        if (data.allBlue.length === 0 && data.allRed.length === 0 && data.allUnaligned.length === 0) { 
            data.startDetails.innerHTML = `<h1>Green wins!</h1>
            <input type="button" id="return" value="Return"">`;
            document.getElementById('return').addEventListener('click', mainMenu); 
            data.gameOver = true; 
            updateSidebar();
        }
        if (data.allRed.length === 0 && data.allGreen.length === 0 && data.allUnaligned.length === 0) { 
            data.startDetails.innerHTML = `<h1>Blue wins!</h1>
            <input type="button" id="return" value="Return"">`;
            document.getElementById('return').addEventListener('click', mainMenu); 
            data.gameOver = true; 
            updateSidebar();

        }
        if (data.allGreen.length === 0 && data.allBlue.length === 0 && data.allUnaligned.length === 0) { 
            data.startDetails.innerHTML = `<h1>Red wins!</h1>
            <input type="button" id="return" value="Return"">`;
            document.getElementById('return').addEventListener('click', mainMenu);
            data.gameOver = true; 
            updateSidebar();
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

    collisionActionTerrain(targetId) {
        
        //actions for if item is colliding with a terrain
        if (data.allTerrain[targetId].type === "circle") {
            const angle = 180 + this.getDirection(this.nearestTerrain, null, "colliding with a terrain");    //180 because we move away from terrain
            const moveX = this.speed * Math.cos(angle * Math.PI / 180);
            const moveY = this.speed * Math.sin(angle * Math.PI / 180);
            this.topLeftX += moveX;
            this.topLeftY += moveY;
        }
    }

    pathing() {
        this.getNearestItemsAndTerrain();
        let targetToPathTo = data.allItems[this.nearestPrey];
        let executePathingVisualCounter = 0;    //the executePathingVisualisation function uses recursion, this is the 
                                                //counter that stops it from going on forever

        //checks if a straight line path between two points intersects with a particular terrain
        const doesStraightLinePathIntersectTerrain = (pathTarget, terrain, startCoordsObjDSLPIT) => {
            
            //exits if there is not pathTarget
            if (!pathTarget) { return false; }

            //get relevant coords for intersection formula
            const thisX = (startCoordsObjDSLPIT && startCoordsObjDSLPIT.x) || this.x; 
            const thisY = (startCoordsObjDSLPIT && startCoordsObjDSLPIT.y) || this.y;
            const targetX = pathTarget.x, targetY = pathTarget.y; 
            const terrainX = terrain.x, terrainY = terrain.y;

            //calculate the intersection formula
            const A = targetY - thisY;
            const B = thisX - targetX;
            const C = targetX * thisY - thisX * targetY;
            const distance = Math.abs(A * terrainX + B * terrainY + C) / Math.sqrt(A * A + B * B);

            //check if the distance is less than the radius of the terrain
            const intersection = distance < terrain.radius;
            return intersection;    //Boolean
        }

        //find the shorts path around an intersecting terrain by finding the left and right paths, and finding the 
        //smallest angle between the target and them and the direct linear route to the target
        const shortestPathAroundTerrain = (terrain, startCoordsObjSPAT) => {  
            //stops isses when the angles are on opposite sides of 0
            const angleDiffFunction = (angle1, angle2) => {     
                const diff = Math.abs(angle1 - angle2) % 360;
                return Math.min(diff, 360 - diff);
            }
            //general variables
            const terrainX = terrain.x, terrainY = terrain.y;
            const howFarPastTerrainToGo = Math.max(this.height, this.width) * 0;  
            const angleToTerrain = this.getDirection({x: terrainX, y: terrainY}, startCoordsObjSPAT);
            const angleToTarget = this.getDirection(targetToPathTo, startCoordsObjSPAT);

            //variables storing info about the left hand path
            const perpendicularAngleLeft = angleToTerrain + 90;
            const leftX = terrainX + (terrain.radius + howFarPastTerrainToGo) * Math.cos(perpendicularAngleLeft * Math.PI / 180);
            const leftY = terrainY + (terrain.radius + howFarPastTerrainToGo) * Math.sin(perpendicularAngleLeft * Math.PI / 180);
            const leftAngle = this.getDirection({x: leftX, y: leftY}, startCoordsObjSPAT);
            const leftAngleDiff = angleDiffFunction(angleToTarget, leftAngle);
            
            //variables storing info about the right hand path
            const perpendicularAngleRight = angleToTerrain - 90;
            const rightX = terrainX + (terrain.radius + howFarPastTerrainToGo) * Math.cos(perpendicularAngleRight * Math.PI / 180);
            const rightY = terrainY + (terrain.radius + howFarPastTerrainToGo) * Math.sin(perpendicularAngleRight * Math.PI / 180);
            const rightAngle = this.getDirection({x: rightX, y: rightY}, startCoordsObjSPAT);
            const rightAngleDiff = angleDiffFunction(angleToTarget, rightAngle);

            //vars for drawing dots to show what way we are going
            //const shortest = leftAngleDiff < rightAngleDiff ? "left" : "right";
            //shortest == "left" ? this.createDotForTesting(leftX, leftY, "green", 10) : this.createDotForTesting(rightX, rightY, "orange", 10);

            //checks which angle is smaller which represents the shorter path around the terrain
            const returnVal = leftAngleDiff < rightAngleDiff ? {x: leftX, y: leftY} : {x: rightX, y: rightY};
            return returnVal; 
        }
        
        //finds the closest terrain in the way of the target and returns false if there is none
        const findClosestTerrainInTheWay = (targetToCheck, startCoords) => {
            //if there is no terrain in the way, move to the target 
            let startingCoordsOfThisRun = {};
            if (!startCoords) { startingCoordsOfThisRun = {x: this.x, y: this.y}; }
            else { startingCoordsOfThisRun = startCoords }

            let closestIntersectingTerrainId = null;
            let distanceToClosestIntersectingTerrain = 100000;
            
            data.allTerrain.forEach(terrain => {
                const thisDistance = Math.sqrt(Math.pow(terrain.x - startingCoordsOfThisRun.x, 2) + Math.pow(terrain.y - startingCoordsOfThisRun.y, 2));
                const angleToPrey = this.getDirection(targetToCheck, startingCoordsOfThisRun);
                const angleToTerrain = this.getDirection({x: terrain.x, y: terrain.y}, startingCoordsOfThisRun);
                let intersects = false;
                if ( Math.abs(angleToPrey - angleToTerrain) < 90) {
                    intersects = doesStraightLinePathIntersectTerrain(targetToCheck, terrain, startingCoordsOfThisRun); 
                }
                if (intersects && thisDistance < distanceToClosestIntersectingTerrain) {
                    closestIntersectingTerrainId = terrain.id;
                    distanceToClosestIntersectingTerrain = thisDistance;
                }
            });
            if (closestIntersectingTerrainId == null) { return false; }
            return {terrain : data.allTerrain[closestIntersectingTerrainId], distance : distanceToClosestIntersectingTerrain};
        }

        //visualisePathing creates dots between two points on the map
        const visualisePathingBetweenTwoPoints = (pathTarget, distanceAway, startCoordObjVP) => { 
            let angle = this.getDirection(pathTarget, startCoordObjVP);
            let distanceToTravelEachStep = 40;
            const distanceToTravelEachStepX = distanceToTravelEachStep * Math.cos(angle * Math.PI / 180);
            const distanceToTravelEachStepY = distanceToTravelEachStep * Math.sin(angle * Math.PI / 180);
            let distanceTravelled = 0;
            //console.log(`the distanceX is ${distanceToTravelEachStepX} and the distanceY is ${distanceToTravelEachStepY}`)
            
            //define starting point and initialise starting location
            let beginningX = (startCoordObjVP && startCoordObjVP.x) || this.x; 
            let beginningY = (startCoordObjVP && startCoordObjVP.y) || this.y;
            let currentX = beginningX;
            let currentY = beginningY;

            //a loop that creates dots all the way to the nearest predator
            while (distanceTravelled < distanceAway) {
                //console.log(`distance travelled is ${distanceTravelled} and distance away is ${distanceAway}`)
                //console.log(`currentX is ${currentX} and currentY is ${currentY}`)
                this.createDotForTesting(currentX, currentY);
                currentX += distanceToTravelEachStepX;
                currentY += distanceToTravelEachStepY;

                distanceTravelled = Math.sqrt(Math.pow(beginningX - currentX, 2) + Math.pow(beginningY - currentY, 2));
            }
        } 
        
        //executePathingVisual is a recursive function that finds the path two the nearest target, checks what terrain is 
        //in the way, finds the shortest path around that terrain, and then calls itself again to check if there is any
        //terrain in the way now we've gone around gthe first bit of terrain
        const executePathingVisualisation = (targetToPathToEPV, startCoords) => {
            //breaks out of the loop if it has been going for too long
            executePathingVisualCounter++;
            if (executePathingVisualCounter > 5) { return; }
            //console.log(`THIS IS RUN NUMBER: ${executePathingVisualCounter}`);
            
            let distanceToNextPoint = 0;
            let closestBlockingTerrain = findClosestTerrainInTheWay(targetToPathToEPV, startCoords); 
            
            //this breaks out of the recursion if there is no terrain in the way and draws final line
            if (closestBlockingTerrain === false) { 
                if (startCoords) {  //if starCoords aren't populated, use the items current coords
                    distanceToNextPoint = Math.sqrt(Math.pow(targetToPathToEPV.x - startCoords.x, 2) + Math.pow(targetToPathToEPV.y - startCoords.y, 2));
                } else {
                    distanceToNextPoint = Math.sqrt(Math.pow(targetToPathToEPV.x - this.x, 2) + Math.pow(targetToPathToEPV.y - this.y, 2));
                }
                //console.log(`target coords are ${targetToPathToEPV.x}, ${targetToPathToEPV.y}, distance is ${distanceToNextPoint} and startCoords are ${startCoords.x}, ${startCoords.y}`)
                visualisePathingBetweenTwoPoints(targetToPathTo, distanceToNextPoint, startCoords);
                return; 
            }

            //since the recursion isn't broken so there is terrain in the way, we find which way we need to go around it
            let nextPoint = shortestPathAroundTerrain(closestBlockingTerrain.terrain, startCoords);

            //get startingCoordsOfThisRun
            let startingCoordsOfThisRun = {};
            if (!startCoords) { startingCoordsOfThisRun = {x: this.x, y: this.y}; }
            else { startingCoordsOfThisRun = startCoords }
            //console.log(`startCoords of this run are ${startingCoordsOfThisRun.x}, ${startingCoordsOfThisRun.y}`)
            //console.log(`nextPoint is ${nextPoint.x}, ${nextPoint.y}`);

            //visual drawing code
            distanceToNextPoint = Math.sqrt(Math.pow(nextPoint.x - startingCoordsOfThisRun.x, 2) + Math.pow(nextPoint.y - startingCoordsOfThisRun.y, 2));
            visualisePathingBetweenTwoPoints(nextPoint, distanceToNextPoint, startCoords); 
            executePathingVisualisation(targetToPathToEPV, nextPoint);
        }
        //executePathingVisual(targetToPathTo);

        //creates a function that returns the angle to travel around any terrain
        const angleToTravel = () => {
            //find the closest terrain in the way of the target and returns false if there is none
            const closestTerrainInTheWay = findClosestTerrainInTheWay(targetToPathTo);
            //console.log(closestTerrainInTheWay)
            if (closestTerrainInTheWay === false) { 
                return this.getDirection(targetToPathTo.id, null, "using pathing and there was no terrain in the way"); 
            }
            //find the shortest path around the terrain
            const shortestPath = shortestPathAroundTerrain(closestTerrainInTheWay.terrain);
            //console.log(shortestPath)
            //find the angle to travel to get to the shortest path
            //calculates the distance between this item and shortest path point
            //const distanceToShortestPath = Math.sqrt(Math.pow(shortestPath.x - this.x, 2) + Math.pow(shortestPath.y - this.y, 2));
            //visualisePathingBetweenTwoPoints(shortestPath, distanceToShortestPath);
            const angle = this.getDirection(shortestPath, null, "using pathing and there was a terrain in the way");  
            return angle;
        }

        return angleToTravel();
    }

    moveItem() {
        this.getNearestItemsAndTerrain();   //looping through all items to find the ones relevant for moving
        //console.log(`for ${this.id} ${this.team} ${this.type}\n, the nearestPredator is ${this.nearestPredator} and the nearestPrey is ${this.nearestPrey}\n, the nearestPredatorDistance is ${this.nearestPredatorDistance} and the nearestPreyDistance is ${this.nearestPreyDistance}`);
        
        this.topLeftY = this.topLeftY; 

        //determine if the item is moving to predator or prey
        let target;
        let angle = 0;
        if (this.nearestPredatorDistance < this.nearestPreyDistance) {
            target = this.nearestPredator; 
            //console.log(`pathing is ${this.pathing()} while getDirectionGives ${this.getDirection(target)}`); 
            angle += this.getDirection(target, null, "running away from prey") + 180;   //180 because we move away from predators
        } 
        else { 
            target = this.nearestPrey; 
            //console.log(`pathing is ${this.pathing()} while getDirectionGives ${this.getDirection(target)}`);
            angle += this.pathing();                
        }
    
        //move the the right distance at the right angle to move toward nearest target
        let moveX = this.speed * Math.cos(angle * Math.PI / 180);
        let moveY = this.speed * Math.sin(angle * Math.PI / 180);

        const collisionDetectionTerrain = (terrainId) => {

            if (terrainId == null) { return false; }
            //returns true if the point is within the circle area
            const checkIfPointIsWithinCircle = (pointX, pointY, terrainIdCIPIWC) => {
                //circle constants 
                const r1 = data.allTerrain[terrainIdCIPIWC].radius + this.speed;
                const x1 = data.allTerrain[terrainIdCIPIWC].x;
                const y1 = data.allTerrain[terrainIdCIPIWC].y;
                const distance = Math.sqrt(Math.pow(pointX - x1 , 2) + Math.pow(pointY - y1, 2));
                //console.log(`distance is ${distance} and targetRadius is ${r1}`);
                return distance < r1; //returns true of the point is within the radius of the circular terrain
            }

            //we can think of the movement of the item as a circle, with the center of the item being its original position
            //and the diameter of the circle being the distance it moves, so to find where the item moves along the perimeter
            //of the circle, we can find our two options for each direction using formula of intersection of two circles
            const calculateNewPosOnPerimeter = (startingPointX, startingPointY, movedPointX, movedPointY, terrainIdCNPOP) => {
                //circle constants of terrain circle
                if (data.allTerrain[terrainIdCNPOP].hasOwnProperty("radius") == false) { 
                    //logs the id, the item itself 
                    console.log(`the id is ${this.id}`); 
                    console.log(this); 
                    console.log(`terrainId is ${terrainIdCNPOP}`); 
                }
                const r1 = data.allTerrain[terrainIdCNPOP].radius + this.speed;
                const x1 = data.allTerrain[terrainIdCNPOP].x;
                const y1 = data.allTerrain[terrainIdCNPOP].y;
                //circle constants of potential movement "circle"
                const r2 = this.speed;
                let x2 = startingPointX;
                let y2 = startingPointY;

                //d is the distance between centers
                const d = Math.max(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)), 0.1)
                //variables for point equations 
                const a = (Math.pow(r1, 2) - Math.pow(r2, 2) + Math.pow(d, 2)) / (2 * d);
                const h = Math.sqrt(Math.abs(Math.pow(r1, 2) - Math.pow(a, 2)));    //abs because we don't quare root of a negative
                //if d a or h are NaN then console log
                if (isNaN(d) || isNaN(a) || isNaN(h)) {
                    console.log(`r1 is ${r1}, r2 is ${r2}, y1 is ${y1}, y2 is ${y2}, x1 is ${x1}, x2 is ${x2}`);
                    console.log(`d is ${d}, a is ${a}, h is ${h}`);
                }
                //points along the perimeter of the circle
                const point1x = x1 + (a / d) * (x2 - x1) + (h / d) * (y2 - y1);
                const point1y = y1 + (a / d) * (y2 - y1) - (h / d) * (x2 - x1);
                //this.createDotForTesting(point1x, point1y, "purple", 6);
                const point2x = x1 + (a / d) * (x2 - x1) - (h / d) * (y2 - y1);
                const point2y = y1 + (a / d) * (y2 - y1) + (h / d) * (x2 - x1);
                //this.createDotForTesting(point2x, point2y, "purple", 6);
                if (isNaN(point1x) || isNaN(point1y) || isNaN(point2x) || isNaN(point2y)) { 
                    console.log(`point1x is ${point1x}, point1y is ${point1y}, point2x is ${point2x}, point2y is ${point2y}`);
                    return false;
                }
                //console.log(`point1x is ${point1x}, point1y is ${point1y}, point2x is ${point2x}, point2y is ${point2y}`);

                //in order to find which point is best, we find out the smallest distance between each point and the collision point
                //if collision points or original points an Nan then console log
                if (isNaN(movedPointX) || isNaN(movedPointY) || isNaN(startingPointX) || isNaN(startingPointY)) {
                    console.log(`movedPointX is ${movedPointX}, collisionPointY is ${movedPointY}, originalPointX is ${startingPointX}, originalPointY is ${startingPointY}`);
                }

                //the closest point to the collision point is the one we want 
                const p1DistancetoCollisionPoint = Math.sqrt(Math.pow(movedPointX - point1x, 2) + Math.pow(movedPointY - point1y, 2));
                const p2DistancetoCollisionPoint = Math.sqrt(Math.pow(movedPointX - point2x, 2) + Math.pow(movedPointY - point2y, 2));
                //if those variables are NaN then console log
                if (isNaN(p1DistancetoCollisionPoint) || isNaN(p2DistancetoCollisionPoint)) {
                    console.log(`p1DistancetoCollisionPoint is ${p1DistancetoCollisionPoint}, p2DistancetoCollisionPoint is ${p2DistancetoCollisionPoint}`);
                }
                if (p1DistancetoCollisionPoint < p2DistancetoCollisionPoint) {
                    return {x: point1x, y: point1y};
                } else {
                    return {x: point2x, y: point2y};
                }

            }

            //checks each corner of the square to see if it is within the radius of the circle
            //returns true if any corner is within the radius of the circle else false
            let startingX, startingY, movedX, movedY;
            //checks the center for testing
            startingX = this.x; 
            startingY = this.y;
            movedX = startingX + moveX;
            movedY = startingY + moveY;
            
            //console.log(`moveX is ${moveX} and moveY is ${moveY} and height is ${this.height} and width is ${this.width}`)
            if (checkIfPointIsWithinCircle(movedX, movedY, terrainId)) { 
                //set this.x and this.y position to the returned point
                const newPosition = calculateNewPosOnPerimeter(startingX, startingY, movedX, movedY, terrainId);
                //console.log(`thisX is ${thisX}, thisY is ${thisY},`)
                //console.log(`newPosition is ${newPosition.x}, ${newPosition.y}`)
                this.x = newPosition.x;
                this.y = newPosition.y;
                //console.log(`this.x is ${this.x}, this.y is ${this.y}`)

                return true;
            }
            
            
            //checks top left corner
            startingX = this.topLeftX; 
            startingY = this.topLeftY;
            movedX = startingX + moveX;
            movedY = startingY + moveY;
            if (checkIfPointIsWithinCircle(movedX, movedY, terrainId)) { 
                //set this.x and this.y position to the returned point
                const newPosition = calculateNewPosOnPerimeter(startingX, startingY, movedX, movedY, terrainId);
                this.topLeftX = newPosition.x;
                this.topLeftY = newPosition.y;

                return true;
            }
            
            //checks top right corner
            startingX = this.topLeftX + this.width;
            startingY = this.topLeftY;
            movedX = startingX + moveX;
            movedY = startingY + moveY;
            if (checkIfPointIsWithinCircle(movedX, movedY, terrainId)) { 
                const newPosition = calculateNewPosOnPerimeter(startingX, startingY, movedX, movedY, terrainId);
                this.topLeftX = newPosition.x - this.width;
                this.topLeftY = newPosition.y;

                return true; 
            }
            
            //checks bottom left corner
            startingX = this.topLeftX;
            startingY = this.topLeftY + this.height;
            movedX = startingX + moveX;
            movedY = startingY + moveY;
            if (checkIfPointIsWithinCircle(movedX, movedY, terrainId)) { 
                const newPosition = calculateNewPosOnPerimeter(startingX, startingY, movedX, movedY, terrainId);
                this.topLeftX = newPosition.x;
                this.topLeftY = newPosition.y - this.height;

                return true; 
            }
            
            
            //checks bottom right corner
            startingX = this.topLeftX + this.width;
            startingY = this.topLeftY + this.height;
            movedX = startingX + moveX;
            movedY = startingY + moveY;
            if (checkIfPointIsWithinCircle(movedX, movedY, terrainId)) { 
                const newPosition = calculateNewPosOnPerimeter(startingX, startingY, movedX, movedY, terrainId);
                this.topLeftX = newPosition.x - this.width; 
                this.topLeftY = newPosition.y - this.height; 
                
                return true; 
            }
            
            //console.log(`targetRadius is ${targetRadius}, this.x is ${this.x}, this.y is ${this.y}, `);
            return false;
        
        }
        //adjust point if the new point was
        const newPointWasInTerrain = collisionDetectionTerrain(this.nearestTerrain);
        if (newPointWasInTerrain) { 
            //check for collisions
            this.collisionDetectionItem(this.nearestPredator);
            this.collisionDetectionItem(this.nearestPrey);
            this.collisionDetectionItem(this.nearestSame);
            return; 
        }

        this.x += moveX;
        this.y += moveY;

        //check for collisions
        this.collisionDetectionItem(this.nearestPredator);
        this.collisionDetectionItem(this.nearestPrey);
        this.collisionDetectionItem(this.nearestSame);
    }
}
