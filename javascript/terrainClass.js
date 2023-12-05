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
        this.element = document.createElement('div');
        this.element.classList.add(['terrain', type]);
        this.element.style.height = `${this.radius * 2}px`;
        this.element.style.width = `${this.radius * 2}px`;
        this.element.style.top = `${this.topLeftY}px`;
        this.element.style.left = `${this.topLeftX}px`;
        this.element.style.position = "absolute";
        this.element.style.borderRadius = "50%";
        this.element.style.border = "3px solid darkBlue";
        data.allTerrain.push(this);
        data.field.appendChild(this.element);
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
}

