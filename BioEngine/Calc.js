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

class Calc {
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

    static get max_speed() {//not applied on single fatty, only used in actforce
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

    static lineIntercept(x1, y1, x2, y2, x3, y3, x4, y4) {

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
    gameEngine.addEntity(new Fatty(Calc.randomInt(canv.width), Calc.randomInt(canv.height), Calc.randomInt(360) , gameEngine.getEntities.length));  
}





/*
function isIntercept(x1,y1,x2,y2,x3,y3,x4,y4) {
    if (x2 - x1 != 0) {
        slope1 = (y2 - y1)-(x2 - x1);
        b1 = y1 - (slope1 * x1); 
    }

    if (x4 - x3 != 0) {
        slope2 = (y4 - y3) - (x4 - x3);
        b2 = y3 - (slope2 * x3);
    }

    if (slope1 == slope2) {
        //check if x's and y's are in bound
    }

    intx = (b2 - b1)/ (slope2 - slope1);

    inty = (slope1 * x1) + b1;

    //check if x in range and y in range;
}

*/

/*
function Rectcollide(rect1, rect2) {
    for (var i = 0; i < rect1.length; i+=2) {
        for (var j = 0; j < rect2.length; j+=2) {
            if (isIntercpet(rect1[i % rect1.length], rect1[(i+1) % rect1.length], rect1[(i+2) % rect1.length], rect1[(i+3) % rect1.length]
             ,rect2[j % rect2.length], rect2[(j+1) % rect2.length], rect2[(j+2) % rect2.length], rect2[(j+3) % rect2.length])) {

            }
            //slopes1.append( (rect1[(i+3) % rect.length] - rect[(i+1)%rect.length]) / (rect1[(i + 2) % rect.length] - rect1[(i) % rect.length]) );
        }
    }
}
*/
/*
function RectCollide(x1,y1,x2,y2,x3,y3,x4,y4) {
    //line1 slope1 (y2-)y1)/(x2-y1);
    //line1 b1 = y1-(slope*x1);

    //line2 slope2 (y3-y2)/(x3-y2);
    //line2 b2 = y2 - (slope2*x2);

    //line3 slope3 (y4-y3)/(x4-y3);
    //line3 b3 = y3 - (slope3*x3);

    //line4 slope4 (y1-y4)/(x1-y4);
    //line4 b4 = y4 - (slope4*x4);


    //line5 slope5 (y6-y6)/(x6-y6);
    //line5 b5 = y5-(slope*x5);

    //line6 slope6 (y7-y6)/(x7-y6);
    //line6 b6 = y6 - (slope6*x6);

    //line7 slope7 (y8-y7)/(x8-y7);
    //line7 b7 = y7 - (slope7*x7);

    //line8 slope8 (y5-y8)/(x5-y8);
    //line8 b8 = y8 - (slope8*x8);

    /*
    (rect1, rect2)
    slope1 = [];
    slopes2 = [];

    for (vari = 0; i < rect1.length; i+=2) {
        slopes1.append( (rect1[(i+3) % rect.length] - rect[(i+1)%rect.length]) / (rect1[(i + 2) % rect.length] - rect1[(i) % rect.length]) );
    }

    for (var i = 0; i < rect2.length; i+=2) {
        slopes2.append( (rect2[(i+3) % rect.length] - rect2[(i+1)%rect.length]) / (rect2[(i + 2) % rect.length] - rect2[(i) % rect.length]) );
    }

    b1 = [];
    b2 = [];

    for (var i = 0; i < rect1.length; i+=2) {
        b1.append(rect1[i+1] - (slope1[i/2] * rect1[i]));
    }

      for (var i = 0; i < rect2.length; i+=2) {
        b2.append(rect2[i+1] - (slope2[i/2] * rect2[i]));
    }

    for (var i = 0; i < rect1.length; i +=2) {
        for (var i = 0; i < rect2.length; i +=2) {

        }
    }   
}
*/