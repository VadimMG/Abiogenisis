//compute forces, move with forces, render (all different methods)

class Lipid extends Entity {//keep molecules consisten sized for easier calculations//save x y before calcuations.//integrate camera
    constructor(x, y, angle, id) {
        super(x, y, angle, 1, id);
        this.length = 2;
        this.radius = 2;
        this.headScale = 1;
        this.struc = this.fillLength(this.length);
        this.name = "Lipid";
        this.ent_id = Calc.LIPID_ID;
        // this.twotailed = true;
        // this.struc2 = this.fillLength(this.length);
    }

    fillLength(length) {//only for tail
        var structure = [];
        structure.push(new Molecule(this.radius * this.headScale, "white"));
        for (var i = 0; i < length; i++) {
            structure.push(new Molecule(this.radius, "goldenrod"));
        }
        return structure;
    }

    render(ctx) {
        for (var i = 0; i < this.struc.length; i++) {
            var m = this.struc[i];
            m.render(ctx, this.getX(i)*c.scale - c.x, this.getY(i)*c.scale - c.y);
        }

        // for (var i = 0; i < this.struc.length; i++) {
        //     var m = this.struc[i];
        //     m.render(ctx, this.getX(i), this.getY(i));
        // }

    }

    tick(entities) {//save x's and y's to reduce overhead/calcuations, pass on caclations//force apart head-tail
        super.tick(entities);
        var len = this.struc.length;
        var thisHX = this.getX(0);
        var thisHY = this.getY(0);
        var thisTX = this.getX(len);
        var thisTY = this.getY(len);

        for (var i = 0; i < entities.length; i++) {
            var e = entities[i];
            if (e != this && e.ent_id == Calc.LIPID_ID) {
                this.collide(e);
                var len2 = e.struc.length;
                var eHX = e.getX(0);
                var eHY = e.getY(0);
                var eTX = e.getX(len2);
                var eTY = e.getY(len2);

                var xdist2 = eHX - thisHX;
                var ydist2 = eHY - thisHY;
                var dist2 = Calc.distance(thisHX, thisHY, eHX, eHY);
                if (ydist2 != 0 && xdist2 != 0 && dist2 >= this.radius) {// && !this.struc[0].isCollide && !e.struc[0].isCollide
                    var ang = Math.atan2(-ydist2, -xdist2) * 180 / Math.PI;
                    var mag = Calc.ELECTRO_CONST * 1 * 1 / (dist2 * dist2);
                    e.forceHead(ang, mag);//head-head attraction
                    //e.actForce(ang, mag);
                }

                for (var j = 1; j < len2; j++) {
                    var otherX = e.getX(j);
                    var otherY = e.getY(j);

                    var xdist = otherX - thisHX;
                    var ydist = otherY - thisHY;
                    var dist = Calc.distance(otherX, otherY, theX, theY);

                    if (ydist != 0 && xdist != 0 && dist >= this.radius) {// && !e.struc[j].isCollide
                        var ang = Math.atan2(-ydist, -xdist) * 180 / Math.PI;
                        var mag = Calc.HYDRO_CONST * 1 * 1 / (dist * dist);
                        //e.forceHead(ang, -mag);//head-tail repulsion
                        e.actForce(ang, -mag);
                    }

                }



                for (var j = 1; j < len; j++) {//1 to ingnore head
                    for (var k = 1; k < len2; k++) {
                        var theX = this.getX(j);
                        var theY = this.getY(j);

                        var otherX = e.getX(k);
                        var otherY = e.getY(k);

                        var xdist = otherX - theX;
                        var ydist = otherY - theY;
                        var dist = Calc.distance(otherX, otherY, theX, theY);

                        if (ydist != 0 && xdist != 0 && dist >= this.radius && !this.struc[j].isCollide && !e.struc[k].isCollide) {
                            var ang = Math.atan2(-ydist, -xdist) * 180 / Math.PI;
                            var mag = Calc.HYDRO_CONST * 1 * 1 / (dist * dist);
                            e.actForce(ang, mag);//tail-tail attraction
                        }
                    }

                }

            }

        }

    }


    //lipid act force, force on individual molecule, torque?

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

    collide(other) {//save lengths to reduce calcs, check for head
        for (var i = 0; i < this.struc.length; i++) {
            var flag = false;
            var thisX = this.getX(i);
            var thisY = this.getY(i);
            var thisRad = this.struc[i].radius;
            for (var j = 0; j < other.struc.length; j++) {
                var otherX = other.getX(j);
                var otherY = other.getY(j);
                var otherRad = other.struc[i].radius;
                var dist = Calc.distance(thisX, thisY, otherX, otherY);
                if (dist < thisRad + otherRad + Calc.colPad + Calc.colPad) {
                    this.seperate(other, dist, thisX, thisY, otherX, otherY, thisRad, otherRad);
                    this.struc[i].isCollide = true;
                    //other.struc[j].isCollide = true;
                    flag = true;
                } else if (!flag){
                    //this.struc[i].isCollide = false;//do not reset on interval, flag
                    //other.struc[j].isCollide = false;
                }
            }

            if (!flag) {
                this.struc[i].isCollide = false;
            }
        }

    }

    seperate(other, dist, thisX, thisY, otherX, otherY, thisRad, otherRad) {
        var delta = thisRad + otherRad + Calc.colPad + Calc.colPad - dist;
        var difX = (thisX - otherX) / dist;
        var difY = (thisY - otherY) / dist;

        this.x += difX * delta / 2;
        this.y += difY * delta / 2;
        other.x -= difX * delta / 2;
        other.y -= difY * delta / 2;

        //swap vels
        var tempSpeed = this.speed;
        var tempAng = this.d_angle.value;
        this.speed = other.speed;
        this.d_angle.setValue(other.d_angle.getValue());
        other.speed = tempSpeed;
        other.d_angle.setValue(tempAng);
    }


    setFocus(focus) {
        this.focus = focus;
    }

    isFocus() {
        return this.focus
    }

    getSpeed() {
        return this.speed;
    }

    getX(index) {
        if (index == 0) {
            return this.x;
        }
        return Calc.rotatePoint(this.x + this.struc[0].radius + this.struc[1].radius * (2 * index - 1), this.y, this.x, this.y, this.o_angle.getValue())[0];
    }

    getY(index) {//+ this.radius*(index%2)*((this.id+1 )%2)
        if (index == 0) {
            return this.y;
        }
        return Calc.rotatePoint(this.x + this.struc[0].radius + this.struc[1].radius * (2 * index - 1), this.y, this.x, this.y, this.o_angle.getValue())[1];
    }

    getLength() {
        return this.length * this.radius * 2;
    }


}


 // var theY;
        // var oldx = this.x;
        // var oldRad = 0;
        // for (var i = 0; i< this.struc.length; index++) {
        //     var m = this.struc[i];
        //     theX = Calc.rotatePoint(oldx + oldRad + m.radius)[1];
        //     oldx = oldx + oldRad + m.radius;
        //     oldRad= m.radius;
        // }
        // return theY;