/**
 * This file hold all the calculations, constants and button actions.
 */

var hydoInput = document.getElementById("hydroRange");
var electroInput = document.getElementById("electroRange");
var followCheck = document.getElementById("ckbx_follow");
var removeCheck = document.getElementById("ckbx_remove");
var zoomRange = document.getElementById("zoomRange");
var speedRange = document.getElementById("speedRange");
var waterFricCheck = document.getElementById("ckbx_waterFric");
var waterFricRange = document.getElementById("waterFricRange");
var colPadRange = document.getElementById("colPadRange");
var tailRange = document.getElementById("tailRange");
var tailRadRange = document.getElementById("tailRadRange");
var headRange = document.getElementById("headRange");

document.getElementById("btn_nextEntity").addEventListener("click", nextEntity_click);
document.getElementById("btn_addEntity").addEventListener("click", addEntity_click);

const MAXDEGREE = 360;
const DEGTORAD = Math.PI/180;
const RADTODEG = 180/Math.PI;

const LIPID_ID = 1;
const CAMERA_ID = 2;
const AMINO_ID = 3;

class Calc {
    static get LIPID_ID() {
        return LIPID_ID;
    }

    static get CAMERA_ID() {
        return CAMERA_ID;
    }

    static get AMINO_ID() {
        return AMINO_ID;
    }
    
    static get MAXDEGREE() {
        return MAXDEGREE;
    }

    static get DEGTORAD() {
        return DEGTORAD;
    }

    static get RADTODEG() {
        return RADTODEG;
    }

    static get HYDRO_CONST() {
        return Number(hydoInput.value);
    }

    static get ELECTRO_CONST() {
        return Number(electroInput.value);
    }

    static get follow_cam() {
        return followCheck.checked;
    }

    static get remove_click() {
        return removeCheck.checked;
    }

    static get zoomValue() {
        return Number(zoomRange.value);
    }

    static get max_speed() {
        return Number(speedRange.value);
    }

    static get water_fric() {
        return ckbx_waterFric.checked;
    }

    static get water_fric_constant() {
        return Number(waterFricRange.value) / 1000;
    }

    static get colPad() {
        return Number(colPadRange.value);
    }

    static get tailLength() {
        return Number(tailRange.value);
    }

    static get tailRad() {
        return Number(tailRadRange.value);
    }

    static get headScale() {
        return Number(headRange.value);
    }

    static distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }

    static rotatePoint(x, y, centerX, centerY, angle) {
        var newcoords = [];
        var xdist = x - centerX;
        var ydist = y - centerY;

        var dist = Math.sqrt(xdist*xdist + ydist*ydist);
        var oldAngle = Math.atan2(ydist, xdist);


        newcoords.push( Math.cos(angle * DEGTORAD + oldAngle) * dist + centerX);
        newcoords.push(Math.sin(angle * DEGTORAD + oldAngle) * dist + centerY);
        return newcoords;
    }

    static randomInt(n) {
        return Math.floor(Math.random() * n);
    }
}

class Angle {

    constructor(value) {
        this.value = value % 360;
    }

    addValue(value) {
        this.value = (this.value + value) % 360;
    }

    setValue(value) {
        this.value = value % 360;
    }

    getValue() {
        return this.value % 360;
    }
}

function nextEntity_click() {
    var list = gameEngine.getEntities();
    eIndex = (eIndex + 1) % list.length;  
}

function addEntity_click() {
    gameEngine.addEntity(new Lipid(Calc.randomInt(canv.width), Calc.randomInt(canv.height), Calc.randomInt(360) , gameEngine.getEntities.length));  
}