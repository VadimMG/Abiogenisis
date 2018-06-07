//pass in all entities, create array of closest entities.
// increase all angles such that it doesnt cause a deep collison
// check if new angle overlaps or causes fatty or move over another cell then stop
// f = g m1*m2/r^2

class Fatty extends Entity {
    constructor(x, y, angle, id) {
        super(x, y, angle, 1, id);
        this.length = Calc.tailLength; //this.length = Calc.randomInt(10) + 8;
        this.radius = Calc.tailRad;
        this.name = "Fatty";
        this.headScale = Calc.headScale;
    }

    render(ctx) {
        ctx.fillStyle = "white";

        var c0 = Calc.rotatePoint(this.x - this.length / 2, this.y - this.radius, this.x, this.y, this.o_angle.value);
        var c1 = Calc.rotatePoint(this.x + this.length / 2, this.y - this.radius, this.x, this.y, this.o_angle.value);
        var c2 = Calc.rotatePoint(this.x + this.length / 2, this.y + this.radius, this.x, this.y, this.o_angle.value);
        var c3 = Calc.rotatePoint(this.x - this.length / 2, this.y + this.radius, this.x, this.y, this.o_angle.value);

        var head = new Path2D();
        var tail = new Path2D();
        var body = new Path2D();

        head.arc((c3[0] + c0[0]) / 2 * c.scale - c.x, (c3[1] + c0[1]) / 2 * c.scale - c.y, this.radius * this.headScale * c.scale, 0, 2 * Math.PI);
        tail.arc((c1[0] + c2[0]) / 2 * c.scale - c.x, (c1[1] + c2[1]) / 2 * c.scale - c.y, this.radius * c.scale, 0, 2 * Math.PI);

        body.moveTo(c0[0] * c.scale - c.x, c0[1] * c.scale - c.y);
        body.lineTo(c1[0] * c.scale - c.x, c1[1] * c.scale - c.y);
        body.lineTo(c2[0] * c.scale - c.x, c2[1] * c.scale - c.y);
        body.lineTo(c3[0] * c.scale - c.x, c3[1] * c.scale - c.y);
        body.lineTo(c0[0] * c.scale - c.x, c0[1] * c.scale - c.y);

        ctx.fillStyle = "goldenrod";
        ctx.fill(body);
        ctx.fill(tail);

        ctx.fillStyle = "white";
        ctx.fill(head);

        if (this.isFocus()) {
            var label = new Path2D();
            label.arc(this.x * c.scale - c.x, this.y * c.scale - c.y, this.length / 2 * c.scale, 0, Math.PI * 2);
            ctx.stroke(label);
        }
    }

    tick(entities) {//pass in game
        super.tick(entities);
        var isc1 = false;//right
        var isc2 = false;//left
        var isc3 = false;

        var thisAng = new Angle(this.o_angle.getValue() + 180);
        var thisAngL = new Angle(this.o_angle.getValue() + 120);
        var thisAngR = new Angle(this.o_angle.getValue() - 120);


        for (var i = 0; i < entities.length; i++) {
            var e = entities[i];
            if (e != this && e.name == "Fatty") {
                if (this.threeWayCollide(e)) {
                    var xdist = e.getTailX() - this.getTailX();
                    var ydist = e.getTailY() - this.getTailY();
                    var dist = Calc.distance(this.getTailX(), this.getTailY(), e.getTailX(), e.getTailY());
                    if (ydist != 0 && xdist != 0) {//
                        var ang = Math.atan2(-ydist, -xdist) * 180 / Math.PI;
                        var mag = Calc.HYDRO_CONST * 1 * 1 / (dist * dist);
                        e.actForce(ang, mag);
                        var otherAng = new Angle(ang);
                        if (otherAng.getValue() >= thisAng.getValue() && otherAng.getValue() <= thisAngR.getValue()) {
                            isc1 = true;
                        }
                        if (otherAng.getValue() <= thisAng.getValue() && otherAng.getValue() >= thisAngL.getValue()) {
                            isc2 = true;
                        }
                        if (otherAng.getValue() >= thisAngR.getValue() && otherAng.getValue() <= thisAngL.getValue()) {
                            isc3 = true;
                        }
                    }
                    var xdist2 = e.getHeadX() - this.getHeadX();
                    var ydist2 = e.getHeadY() - this.getHeadY();
                    var dist2 = Calc.distance(this.getHeadX(), this.getHeadY(), e.getHeadX(), e.getHeadY());
                    if (ydist2 != 0 && xdist2 != 0) {//and not head colliding
                        var ang = Math.atan2(-ydist2, -xdist2) * 180 / Math.PI;
                        var mag = Calc.ELECTRO_CONST * 1 * 1 / (dist2 * dist2);
                        e.forceHead(ang, mag);
                    }

                    //swap vels
                    // var tempSpeed = this.speed;
                    // var tempAng = this.d_angle.value;
                    // this.speed = e.speed;
                    // this.d_angle.setValue(e.d_angle.getValue());
                    // e.speed = tempSpeed;
                    // e.d_angle.setValue(tempAng);
                }
            }
        }


        for (var i = 0; i < entities.length; i++) {
            var e = entities[i];
            if (e != this && e.name == "Fatty") {
                if (!(isc1 && isc2 && isc3)) {//(this.x > e.x && isc1) || (this.x < e.x && isc2)

                    var xdist = e.getTailX() - this.getTailX();
                    var ydist = e.getTailY() - this.getTailY();
                    if (ydist != 0 && xdist != 0) {
                        var ang = Math.atan2(-ydist, -xdist) * 180 / Math.PI;

                        if (ang >= thisAng.getValue() && ang <= thisAngR.getValue() && !isc1) {
                            var dist = Calc.distance(this.getTailX(), this.getTailY(), e.getTailX(), e.getTailY());
                            var mag = Calc.HYDRO_CONST * 1 * 1 / (dist * dist);
                            e.actForce(ang, mag);
                        }

                        if (ang <= thisAng.getValue() && ang >= thisAngL.getValue() && !isc2) {
                            var dist = Calc.distance(this.getTailX(), this.getTailY(), e.getTailX(), e.getTailY());
                            var mag = Calc.HYDRO_CONST * 1 * 1 / (dist * dist);
                            e.actForce(ang, mag);
                        }

                        if (ang >= thisAngR.getValue() && ang <= thisAngL.getValue() && !isc3) {
                            var dist = Calc.distance(this.getTailX(), this.getTailY(), e.getTailX(), e.getTailY());
                            var mag = Calc.HYDRO_CONST * 1 * 1 / (dist * dist);
                            e.actForce(ang, mag);
                        }

                    }
                }

                var xdist2 = e.getHeadX() - this.getHeadX();
                var ydist2 = e.getHeadY() - this.getHeadY();
                var dist2 = Calc.distance(this.getHeadX(), this.getHeadY(), e.getHeadX(), e.getHeadY());
                if (ydist2 != 0 && xdist2 != 0) {//and not head colliding
                    var ang = Math.atan2(-ydist2, -xdist2) * 180 / Math.PI;
                    var mag = Calc.ELECTRO_CONST * 1 * 1 / (dist2 * dist2);
                    e.forceHead(ang, mag);
                    e.actForce(ang, mag);
                }

                var xdist3 = e.getTailX() - this.getHeadX();
                    var ydist3 = e.getTailY() - this.getHeadY();
                    var dist3 = Calc.distance(this.getHeadX(), this.getHeadY(), e.getHeadX(), e.getHeadY());
                    if (ydist3 != 0 && xdist3 != 0) {
                        var ang = Math.atan2(ydist3, xdist3) * 180 / Math.PI;
                        var mag = Calc.ELECTRO_CONST * 1 * 1 / (dist3 * dist3);
                        e.actForce(ang, mag);//keep head and tail apart
                    } else {
                        //console.log("need something");
                    }

            }
        }





        /*
        for (var i = 0; i < entities.length; i++) {
            var e = entities[i];
            if (e != this && e.name == "Fatty" && this.isCollide(e)) {
                var dist = Calc.distance(this.x, this.y, e.x, e.y);
                var delta = this.length / 2 + this.radius * this.headScale + e.length / 2 + e.radius * e.headScale - dist;
                var difX = (this.x - e.x) / dist;
                var difY = (this.y - e.y) / dist;
 
                this.x += difX * delta / 2;
                this.y += difY * delta / 2;
                e.x -= difX * delta / 2;
                e.y -= difY * delta / 2;
                //swap vels
                var tempSpeed = this.speed;
                var tempAng = this.d_angle.value;
                this.speed = e.speed;
                this.d_angle.setValue(e.d_angle.getValue());
                e.speed = tempSpeed;
                e.d_angle.setValue(tempAng);
 
                isc = true;
                //act forces only from colliding lipids
                var xdist = e.getX() - this.getX();
                var ydist = e.getY() - this.getY();
                var dist = Calc.distance(this.getTailX(), this.getTailY(), e.getTailX(), e.getTailY());
                if (ydist != 0 && xdist != 0) {// && dist > this.radius
                    var ang = Math.atan2(-ydist, -xdist) * 180 / Math.PI;
                    var mag = 20 * 1 * 1 / (dist * dist);
                    e.actForce(ang, mag);
                } else {
                    //console.log("need something");
                    // var ang = Math.atan2(ydist, xdist) * 180 / Math.PI + 180;
                    // var mag = 40 * 1 * 1 / (dist * dist);
                    // this.actForce(ang, mag);
                }
 
                var xdist2 = e.getHeadX() - this.getHeadX();
                var ydist2 = e.getHeadY() - this.getHeadY();
                var dist2 = Calc.distance(this.getHeadX(), this.getHeadY(), e.getHeadX(), e.getHeadY());
                if (ydist2 != 0 && xdist2 != 0) {//and not head colliding
                    var ang = Math.atan2(-ydist2, -xdist2) * 180 / Math.PI;
                    var mag = 2 * 1 * 1 / (dist2 * dist2);
                    e.forceHead(ang, mag);
                } else {
                    //console.log("need something");
                }
 
            }
        }
 
 
        if (true) {//!isc
            for (var i = 0; i < entities.length; i++) {
                var e = entities[i];
                if (e != this && e.name == "Fatty" && !isc) {
                    var xdist = e.getX() - this.getX();
                    var ydist = e.getY() - this.getY();
                    var dist = Calc.distance(this.getTailX(), this.getTailY(), e.getTailX(), e.getTailY());
                    if (ydist != 0 && xdist != 0) {// && dist > this.radius
                        var ang = Math.atan2(-ydist, -xdist) * 180 / Math.PI;
                        var mag = 20 * 1 * 1 / (dist * dist);
                        e.actForce(ang, mag);
                    } else {
                        //console.log("need something");
                        // var ang = Math.atan2(ydist, xdist) * 180 / Math.PI + 180;
                        // var mag = 40 * 1 * 1 / (dist * dist);
                        // this.actForce(ang, mag);
                    }
                    var xdist2 = e.getHeadX() - this.getHeadX();
                    var ydist2 = e.getHeadY() - this.getHeadY();
                    var dist2 = Calc.distance(this.getHeadX(), this.getHeadY(), e.getHeadX(), e.getHeadY());
                    if (ydist2 != 0 && xdist2 != 0) {//and not head colliding
                        var ang = Math.atan2(-ydist2, -xdist2) * 180 / Math.PI;
                        var mag = 2 * 1 * 1 / (dist2 * dist2);
                        e.forceHead(ang, mag);
                    } else {
                        //console.log("need something");
                    }
 
                    var xdist3 = e.getTailX() - this.getHeadX();
                    var ydist3 = e.getTailY() - this.getHeadY();
                    var dist3 = Calc.distance(this.getHeadX(), this.getHeadY(), e.getHeadX(), e.getHeadY());
                    if (ydist3 != 0 && xdist3 != 0) {
                        var ang = Math.atan2(ydist3, xdist3) * 180 / Math.PI;
                        var mag = 1 * 1 * 1 / (dist3 * dist3);
                        e.actForce(ang, mag);//keep head and tail apart
                    } else {
                        //console.log("need something");
                    }
 
                }
            }
 
        }
        */

    }

    /**
     * Electrostatic force, orients the heads of fatty acids towards each other.
     * @param {*} angle angle of applied force in degrees
     * @param {*} mag function of distance
     */
    forceHead(angle, mag) {
        if (!isFinite(angle || !isFinite(mag))) {
            return;
        }
        var xang = Math.cos(this.o_angle.getValue() * Calc.DEGTORAD) * 1;
        var yang = Math.sin(this.o_angle.getValue() * Calc.DEGTORAD) * 1;

        var fxang = Math.cos(angle * Calc.DEGTORAD) * mag;
        var fyang = Math.sin(angle * Calc.DEGTORAD) * mag;

        xang += fxang;
        yang += fyang;

        if (xang != 0 && yang != 0 && isFinite(xang) && isFinite(yang)) {
            var newAngle = Math.atan2(yang, xang);
            this.o_angle.setValue(newAngle * Calc.RADTODEG);
        }
    }


    threeWayCollide(other) {//maybe only check one and return
        var col = false;
        var dist = Calc.distance(this.getHeadX(), this.getHeadY(), other.getHeadX(), other.getHeadY());
        if (dist <= this.getHeadRadius() + other.getHeadRadius() + Calc.colPad + Calc.colPad) {//head head
            this.seperate(other, dist, this.getHeadX(), this.getHeadY(),
                other.getHeadX(), other.getHeadY(), this.getHeadRadius(), other.getHeadRadius());
            col = true;
            //return true;
        }

        dist = Calc.distance(this.getHeadX(), this.getHeadY(), other.getX(), other.getY());
        if (dist < this.getHeadRadius() + other.radius + Calc.colPad + Calc.colPad) {//head center
            this.seperate(other, dist, this.getHeadX(), this.getHeadY(),
                other.getX(), other.getY(), this.getHeadRadius(), other.radius);
            col = true;
            //return true;
        }

        dist = Calc.distance(this.getHeadX(), this.getHeadY(), other.getTailX(), other.getTailY());
        if (dist <= this.getHeadRadius() + other.radius + Calc.colPad + Calc.colPad) {//head tail
            this.seperate(other, dist, this.getHeadX(), this.getHeadY(),
                other.getTailX(), other.getTailY(), this.getHeadRadius(), other.radius);
            col = true;
            //return true;
        }

        dist = Calc.distance(this.getTailX(), this.getTailY(), other.getHeadX(), other.getHeadY());
        if (dist <= this.radius + other.getHeadRadius() + Calc.colPad) {//tail head
            this.seperate(other, dist, this.getTailX(), this.getTailY(),
                other.getHeadX(), other.getHeadY(), this.radius, other.getHeadRadius());
            col = true;
            //return true;
        }

        dist = Calc.distance(this.getTailX(), this.getTailY(), other.getX(), other.getY());
        if (dist < this.radius + other.radius + Calc.colPad + Calc.colPad) {//tail center
            this.seperate(other, dist, this.getTailX(), this.getTailY(),
                other.getX(), other.getY(), this.radius, other.radius);
            col = true;
            //return true;
        }

        dist = Calc.distance(this.getTailX(), this.getTailY(), other.getTailX(), other.getTailY());
        if (dist <= this.radius + other.radius + Calc.colPad + Calc.colPad) {//tail tail
            this.seperate(other, dist, this.getTailX(), this.getTailY(),
                other.getTailX(), other.getTailY(), this.radius, other.radius);
            col = true;
            //return true;
        }
        return col;
    }

    seperate(other, dist, thisX, thisY, otherX, otherY, thisRad, otherRad) {
        var delta = thisRad + otherRad + Calc.colPad + Calc.colPad - dist;
        var difX = (thisX - otherX) / dist;
        var difY = (thisY - otherY) / dist;

        this.x += difX * delta / 2;
        this.y += difY * delta / 2;
        other.x -= difX * delta / 2;
        other.y -= difY * delta / 2;
    }

    isCollide(other) {//apply padding
        if (Calc.distance(this.getHeadX(), this.getHeadY(), other.getHeadX(), other.getHeadY()) <= this.radius * this.headScale + other.radius * other.headScale ||
            Calc.distance(this.getHeadX(), this.getHeadY(), other.getTailX(), other.getTailY()) <= this.radius * this.headScale + other.radius ||
            Calc.distance(this.getHeadX(), this.getHeadY(), other.x, other.y) <= this.radius * this.headScale + other.radius) {
            return true;//head
        }
        if (Calc.distance(this.x, this.y, other.getHeadX(), other.getHeadY()) <= this.radius + other.radius * this.headScale ||
            Calc.distance(this.x, this.y, other.getTailX(), other.getTailY()) <= this.radius + other.radius ||
            Calc.distance(this.x, this.y, other.x, other.y) <= this.radius + other.radius) {
            return true;//center
        }
        if (Calc.distance(this.getTailX(), this.getTailY(), other.getHeadX(), other.getHeadY()) <= this.radius + other.radius * this.headScale ||
            Calc.distance(this.getTailX(), this.getTailY(), other.getTailX(), other.getTailY()) <= this.radius + other.radius ||
            Calc.distance(this.getTailX(), this.getTailY(), other.x, other.y) <= this.radius + other.radius) {
            return true;//tail
        }
    }


    getHeadX() {
        var temp = Calc.rotatePoint(this.x - this.length / 2, this.y, this.x, this.y, this.o_angle.value);
        return temp[0];
    }

    getHeadY() {
        var temp = Calc.rotatePoint(this.x - this.length / 2, this.y, this.x, this.y, this.o_angle.value)[1];
        return temp;
    }

    getTailX() {//should be tail...
        var temp = Calc.rotatePoint(this.x + this.length / 2, this.y, this.x, this.y, this.o_angle.value)[0];
        return temp;
    }

    getTailY() {
        var temp = Calc.rotatePoint(this.x + this.length / 2, this.y, this.x, this.y, this.o_angle.value)[1];
        return temp;
    }

    getRadius() {
        var temp = this.radius;
        return temp;
    }

    getLength() {
        return this.length;
    }

    getHeadRadius() {
        return this.radius * this.headScale;
    }

}




