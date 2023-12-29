import { data } from "./data.js";

export const terrainClass = class {
    constructor(type, radius, specifics) {
        this.id = data.terrainCount;
        data.terrainCount++;
        this.type = type;
        this.radius = radius;
        this._x = (specifics && specifics.x) || Math.random() * (data.screenWidth - this.radius * 2); 
        this._y = (specifics && specifics.y) || Math.random() * (data.screenHeight - this.radius * 2);
        this.topLeftX = this.x - this.radius;
        this.topLeftY = this.y - this.radius;
        //div element details
        this.element = document.createElement('div');
        this.element.id = `T${this.id}`;
        this.element.classList.add('terrain', type);
        this.element.style.height = `${this.radius * 2}px`;
        this.element.style.width = `${this.radius * 2}px`;
        this.element.style.top = `${this.topLeftY}px`;
        this.element.style.left = `${this.topLeftX}px`;
        this.element.style.position = "absolute";
        this.element.style.borderRadius = "50%";
        this.element.style.border = "3px solid darkBlue";
        data.allTerrain.push(this); //stores the object in a terrain array
        data.field.appendChild(this.element);
        this.center = document.createElement('div');
        this.center.style.height = `4px`;
        this.center.style.width = `4px`;
        this.center.style.top = `${this._y}px`;
        this.center.style.left = `${this._x}px`;
        this.center.style.position = "absolute";
        this.element.style.borderRadius = "50%";
        this.center.style.border = "2px solid darkBlue";
        this.center.style.zIndex = "4";
        data.field.appendChild(this.center);
        //adds a listener to element on click that does a console log
        this.element.addEventListener('click', (event) => {
            console.log(this); console.log(data);
        });
    }
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
        this.topLeftX = this.x - this.radius;
        this.element.style.left = `${this.topLeftX}px`;
    }
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
        this.topLeftY = this.y - this.radius;
        this.element.style.top = `${this.topLeftY}px`;
    }
    //checks if an item collides with this terrain, if it does, it returns the a position of the item
    collisionWithItem(itemid) {     
        //item variable
        const item = data.allItems[itemid];
        const itemTopLeftX = item.topLeftX;
        const itemTopLeftY = item.topLeftY;

        //checking if the item is colliding with the nearest terrain
        const isPointWithTerrain = (checkingX, checkingY) => {
            const pointsDistanceToCenter = Math.sqrt(Math.pow(checkingX - this.x, 2) + Math.pow(checkingY - this.y, 2));
            const distanceToCheck = this.radius;
            return pointsDistanceToCenter < distanceToCheck;
        }
 
        //this function returns the new position of the item if it is colliding with a terrain
        const getNewPositionIfCollidingWithTerrain = () => {
            const angle = 180 + item.getDirection(this, null, "trying to move into terrain and being prevented by TopLeftY rules");    //180 because we move away from terrain
            const pointX = this.x + this.radius * Math.cos(angle * Math.PI / 180);
            const pointY = this.y + this.radius * Math.sin(angle * Math.PI / 180);
            return {x: pointX, y: pointY};
        }

        //checking each corner of the item to see if it is colliding with the nearest terrain
        if (isPointWithTerrain(itemTopLeftX, itemTopLeftY)) {   //top left corner
            const newPosition = getNewPositionIfCollidingWithTerrain(); 
            return newPosition;
        } else if (isPointWithTerrain(itemTopLeftX, itemTopLeftY + item.height)) { //bottom left corner
            const newPosition = getNewPositionIfCollidingWithTerrain(); 
            return newPosition;
        } else if (isPointWithTerrain(itemTopLeftX + item.width, itemTopLeftY)) { //top right corner
            const newPosition = getNewPositionIfCollidingWithTerrain(); 
            return newPosition;
        } else if (isPointWithTerrain(itemTopLeftX + item.width, itemTopLeftY + item.height)) { //bottom right corner
            const newPosition = getNewPositionIfCollidingWithTerrain(); 
            return newPosition;
        } else {
            return false;
        }
    }
}

