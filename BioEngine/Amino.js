class Amino extends Entity {
    constructor(x, y, angle, id) {
        super(x, y, angle, 1, id);
        this.radius = 4;
        this.width = 8;
        this.name = "amino"
    }

    render(ctx) {

        var amine = new Path2D();
        var carbox = new Path2D();
        var sidechain = new Path2D();

        ctx.fillStyle = "purple";

        amine.arc(this.x * c.scale - this.width / 2 * c.scale - c.x, this.y * c.scale - c.y, this.radius * c.scale, 0, 2 * Math.PI);

        ctx.fill(amine);

        ctx.fillStyle = "white";

        carbox.arc(this.x * c.scale + this.width / 2 * c.scale - c.x, this.y * c.scale - c.y, this.radius * c.scale, 0, 2 * Math.PI);

        ctx.fill(carbox);

        ctx.fillStyle = "red";

        sidechain.arc(this.x * c.scale - c.x, this.y * c.scale + this.width / 2 * c.scale - c.y, this.radius * c.scale, 0, 2 * Math.PI);

        ctx.fill(sidechain);

        if (this.isfocus) {
            var label = new Path2D();
            label.arc(this.x * c.scale - c.x, this.y * c.scale - c.y, this.width / 2 * c.scale, 0, Math.PI * 2);
            ctx.stroke(label);
        }
    }

    tick(entities) {

        for (var i = 0; i < entities.length; i++) {
            var e = entities[i];
            if (e != this && e.name == "amino") {
                var xdist = e.x - this.x;
                var ydist = e.y - this.y;
                var dist = Calc.distance(e.x, e.y, this.x, this.y);
                if (dist != 0) {
                    var ang = Math.atan2(ydist, xdist) * 180 / Math.PI;
                    var mag = 40 * 1 * 1 / (dist * dist);
                    //this.actForce(ang, mag);
                }
    
                this.isCollide(e);
    
            }
        }    
    
        // for (var i = 0; i < entities.length; i++) {
        //     var e = entities[i];
        //     if (e != this && e.name == "amino" && Calc.distance(e.x, e.y, this.x, this.y) <=this.width + e.width) {
        //         e.x += Math.cos(this.angle.value * Math.PI / 180) * this.vel;
        //         e.y += Math.sin(this.angle.value * Math.PI / 180) * this.vel;
        //     }
        // }
    
        super.tick(entities);
    }

    isCollide(other) {
        if (Calc.distance(this.getAmineX(), this.getAmineY(), other.getCarboxX(), other.getCarboxY()) <= this.radius * 2) {
            this.angle.setValue(other.angle.value);
        }

        if (Calc.distance(this.getCarboxX(), this.getCarboxY(), other.getAmineX(), other.getAmineY()) <= this.radius * 2) {
            this.angle.setValue(other.angle.value);
        }
    }

    getAmineX() {
        //this.x *c.scale - this.width/2 * c.scale - c.x, 
        return this.x - this.width / 2;
    }

    getAmineY() {
        //this.y *c.scale - c.y
        return this.y;
    }

    getCarboxX() {
        //(this.x *c.scale + this.width/2 * c.scale - c.x
        return this.x + this.width / 2;
    }

    getCarboxY() {
        //, this.y *c.scale - c.y
        return this.y;
    }

    getSideX() {
        //this.x *c.scale - c.x,
        return this.x
    }

    getSideY() {
        // this.y *c.scale + this.width/2 * c.scale - c.y
        return this.y + this.width / 2;
    }


}

