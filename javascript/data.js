const myData = class {
    constructor() {
        this.itemCount = 0;
        this.field = document.getElementById('theField');
        this.startDetails = document.getElementById('startDetails');
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
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
        this.allTerrain = [];
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

