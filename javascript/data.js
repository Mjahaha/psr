export const myData = class {
    constructor() {
        this.itemCount = 0;
        this.terrainCount = 0;
        this.field = document.getElementById('theField');
        this.startDetails = document.getElementById('startDetails');
        this.sidebar = document.getElementById('sidebar');
        this.stopButton = document.getElementById('stopBattle');
        let widthOfSidebar;
        if (this.sidebar.style.display = 'none') {widthOfSidebar = 0} 
        else {widthOfSidebar = ((this.sidebar && this.sidebar.offsetWidth) || 0)}
        this.screenWidth = window.innerWidth - widthOfSidebar;
        this.screenHeight = window.innerHeight;
        this.timestep = 100;
        this.captureKill = "capture";
        this.gameMode = "FFA";
        this._gameStarted = false;
        this._gameOver = false;
        this.gameTimestepId = "";
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
        this.mouseX = this.screenWidth / 2;
        this.mouseY = this.screenHeight / 2;
        this.mouseInWindow = true;
        document.addEventListener('mousemove', (event) => {
            this.mouseInWindow = true;
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        });
        document.addEventListener('mouseout', () => {
            this.mouseInWindow = false;
            this.mouseX = data.screenWidth / 2;
            this.mouseY = data.screenHeight / 2;
        });
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

    get gameOver() {
        return this._gameOver;
    }
    set gameOver(value) {
        this._gameOver = value;
        if (value === true) {
            clearInterval(this.gameTimestepId);
        }
    }

    get gameStarted() {
        return this._gameStarted;
    }
    set gameStarted(value) {
        this._gameStarted = value;
        if (value === true) {
            this.sidebar.style.display = 'block';
        }
    }
}

export let data = new myData();

export const resetData = () => {
    data = new myData();
}