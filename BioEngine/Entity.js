class Entity {
    constructor(x, y, angle, speed, id) {
        this.x = x;
        this.y = y;
        this.d_angle = new Angle(angle);
        this.o_angle = new Angle(angle);
        this.speed = speed;
        this.id = id;
        this.isRemove = false;
        this.focus = false;//same name as function?
        this.radius = 4;
        this.name = "Entity";
    }

    render(ctx) {
        if (this.focus) {
            ctx.fillStyle = "red";
        } else {
            ctx.fillStyle = "white";
        }

        var body = new Path2D();
        body.arc((this.x * c.scale - c.x), (this.y * c.scale - c.y), this.radius * c.scale, 0, 2 * Math.PI);
        ctx.fill(body);
    }

    tick(entities) {
        if (this.speed > Calc.max_speed) {
            this.speed = Calc.max_speed;
        }
        this.x += this.getXvel();
        this.y += this.getYvel();

        if (Calc.water_fric) {//decrease speed with friction/drag
            this.actForce((this.d_angle.getValue() + 180), .5 * Calc.water_fric_constant * (this.speed * this.speed) * 1);
        }//f=1/2 p v^2 c_d A, p=fluid densiy, c_d=drag coeffient, A= cross section

        if (this.x < 0) {
            this.isRemove = true;
        }
        if (this.x > 6000) {
            this.isRemove = true;
        }
        if (this.y < 0) {
            this.isRemove = true;
        }
        if (this.y > 6000) {
            this.isRemove = true;
        }

    }

    actForce(angle, magnitue) {
        if (!isFinite(angle) || !isFinite(magnitue)) {
            return;
        }
        var eXvel = this.getXvel();
        var eYvel = this.getYvel();

        var forceX = Math.cos(angle * Calc.DEGTORAD) * magnitue;
        var forceY = Math.sin(angle * Calc.DEGTORAD) * magnitue;

        eXvel += forceX;
        eYvel += forceY;

        if (eXvel != 0 && eYvel != 0 && isFinite(eXvel) && isFinite(eYvel)) {
            var newAngle = Math.atan2(eYvel, eXvel);
            var newSpeed = Math.sqrt(eXvel * eXvel + eYvel * eYvel);//remove or bound to max
            this.d_angle.setValue(newAngle * Calc.RADTODEG);
            this.speed = newSpeed;//remove or bound to max   
        }
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getAngle() {//direction angle, might need one for orientatonal angle
        return this.d_angle.getValue();
    }

    getSpeed() {
        return this.speed;
    }

    getXvel() {
        return Math.cos(this.d_angle.getValue() * Calc.DEGTORAD) * this.speed;
    }

    getYvel() {
        return Math.sin(this.d_angle.getValue() * Calc.DEGTORAD) * this.speed;
    }

    isFocus() {
        return this.focus
    }

    setAngle(angle) {//direction angle, might need one for orientatonal angle
        this.d_angle.setAngle(angle);
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    setX(x) {
        this.x = x;
    }

    setY() {
        this.y = y;
    }

    setFocus(focus) {
        this.focus = focus;
    }

}
