var eIndex = 0;

/**
 * request window frame?
 */
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

//timer with step attributes
function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

/**
 * tick method of timer. returns gamedelta.
 */ 
Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

/**
 * Game engine, array of entributes that is iterated
 * for tick and render method
 */
function GameEngine() {
    this.entities = [];
    this.showOutlines = false;
    this.ctx = null;
    this.click = null;
    this.mouse = null;
    this.wheel = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
}

/**
 * Initilizes the context of the game engine, and timer.
 * @param {*} ctx 2d contex of a canvas
 */
GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.startInput();
    this.timer = new Timer();
    console.log('game initialized');
}

/**
 * starts the looping of the game engine.
 */
GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

/**
 * Starts input for the game engine. Mouse adds/removes entities
 */
GameEngine.prototype.startInput = function () {
    console.log('Starting input');
    var that = this;

    var getXandY = function (e) {
        var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

        return { x: x, y: y };
    }

    this.ctx.canvas.addEventListener("mousemove", function (e) {
        that.mouse = getXandY(e);
    }, false);

    this.ctx.canvas.addEventListener("click", function (e) {
        var cords = getXandY(e);
        if (!Calc.remove_click) {
            gameEngine.addEntity(new Lipid(cords.x/c.scale + c.getX(), cords.y/c.scale + c.getY(), Calc.randomInt(360) , gameEngine.getEntities().length));
        } else {
            for (var i = 0, n = gameEngine.getEntities().length; i < n; i++) {
                var e = gameEngine.getEntities()[i];
                if (e.name != "camera") {
                    if (Math.abs(cords.x/c.scale + c.getX() - e.getX(0)) < e.getLength() 
                    && Math.abs(cords.y/c.scale + c.getY() - e.getY(0)) < e.getLength()) {
                        gameEngine.getEntities().splice(i,1);
                        break;
                    }
                }
            }
        }
        
        that.click = getXandY(e);
    }, false);

    this.ctx.canvas.addEventListener("wheel", function (e) {
        that.wheel = e;
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("contextmenu", function (e) {
        that.rightclick = getXandY(e);
        e.preventDefault();
    }, false);
    console.log('Input started');
}

/**
 * Adds an entity to be interate ticked and rendered.
 * @param {*} entity Must have tick and render method, and removeFromWorld attribute
 * 
 */
GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
}

/**
 * Iterates the entities and renders them on the canvas.
 */
GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.save();
    for (var i = 0, n = this.entities.length; i < n; i++) {
        this.entities[i].render(this.ctx);
    }
    this.ctx.restore();
}

/**
 * Interates the entities and calls their tick method.
 * Removes any that need to be removed.
 */
GameEngine.prototype.update = function () {   
    var entitiesCount = this.entities.length;
    for (var i = 0; i < entitiesCount; i++) {
        var p = document.getElementById("entity_info");
        var entity = this.entities[i];

        if (i == eIndex) {
            entity.setFocus(true);
            p.innerHTML = Number(entity.getX(0)).toFixed(2) + ", " + Number(entity.getY(0)).toFixed(2) + ", " + Number(entity.getSpeed()).toFixed(2);
        } else {
            entity.setFocus(false);
        }

        if (!entity.isRemove) {
            entity.tick(this.entities);
        }
    }

    for (var i = this.entities.length - 1; i >= 0; --i) {
        if (this.entities[i].isRemove) {
            this.entities.splice(i, 1);
        }
    }
    c.follow = this.entities[eIndex];
}

/**
 * Game loop.
 */
GameEngine.prototype.loop = function () {
    var speed = 10;
    this.clockTick = this.timer.tick() * 2;
    this.update();
    this.draw();
    this.click = null;
    this.rightclick = null;
    this.wheel = null;
}

/**
 * Getter for entites
 */
GameEngine.prototype.getEntities = function() {
    return this.entities;
}

