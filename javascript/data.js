const myData = class {
    constructor() {
        this.itemCount = 0;
        this.field = document.getElementById('theField');
        this.startDetails = document.getElementById('startDetails');
        this.screenWidth = window.innerWidth - 60;
        this.screenHeight = window.innerHeight - 60;
        this.timestep = 100;
        this.captureKill = "capture";
        this.gameMode = "FFA";
        this.gameOver = false;
        this.allItems = [];
        this.allPapers = [];
        this.allRocks = [];
        this.allScissors = [];
        this.allUnaligned = [];
        this.allBlue = [];
        this.allRed = [];
        this.allGreen = [];
        this.distance = 8;
        this.spedUp = false;
    }

    get distance() {
        return this._distance;
    }
    set distance(value) {
        this._distance = value;
        if (this.allItems.length > 0) {
            this.allItems.forEach(item => {
                item.speed = value;
            });
        }
    }
}

export const data = new myData();

/*
export const data = {
    itemCount: 0,
    field: document.getElementById('theField'),
    startDetails: document.getElementById('startDetails'),
    screenWidth: window.innerWidth - 60,
    screenHeight: window.innerHeight - 60,
    distance: 15,
    timestep: 100,
    captureKill: "capture",
    gameMode: "FFA",
    gameOver: false,
    allItems: [],
    allPapers: [],
    allRocks: [],
    allScissors: [],
    allUnaligned: [],
    allBlue: [],
    allRed: [],
    allGreen: [],
}
*/
