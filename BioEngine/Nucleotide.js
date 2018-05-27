
class Nucleotide extends Entity {
    constructor(x, y, angle, id) {
        super(x, y, angle, 1, id);
        this.name = "nucleotide";
        this.width = 8;
        this.radius = 4;
    }

    render(ctx) {
        var phos = new Path2D();
        var sugar = new Path2D();
        var base = new Path2D();

        ctx.fillStyle = "white";
        phos.arc(this.x * c.scale - this.width / 2 * c.scale - c.x, this.y * c.scale - this.width / 2 * c.scale - c.y, this.radius * c.scale, 0, Math.PI * 2);
        ctx.fill(phos);

        ctx.fillStyle = "purple";
        sugar.rect(this.x * c.scale - this.width / 2 * c.scale - c.x, this.y * c.scale - this.width / 2 * c.scale - c.y, this.width * c.scale, this.width * c.scale);
        ctx.fill(sugar);

        ctx.fillStyle = "yellow";
        base.rect(this.x * c.scale + this.width / 2 * c.scale - c.x, this.y * c.scale - c.y, this.radius * c.scale, this.radius * c.scale);
        ctx.fill(base);


        if (this.isfocus) {
            var label = new Path2D();
            label.arc(this.x * c.scale - c.x, this.y * c.scale - c.y, this.width / 2 * c.scale, 0, Math.PI * 2);
            ctx.stroke(label);
        }
    }

    tick(entities) {
        for (var i = 0; i < entities.length; i++) {
            var e = entities[i];
            if (e != this && e.name == "nucleotide") {
                var xdist = e.x - this.x;
                var ydist = e.y - this.y;
                var dist = Calc.distance(e.x, e.y, this.x, this.y);
                if (dist != 0) {
                    var ang = Math.atan2(ydist, xdist) * 180 / Math.PI;
                    var mag = 40 * 1 * 1 / (dist * dist);
                    this.actForce(ang, mag);
                }
            }
        }


        //this.x += Math.cos(this.angle.value * Math.PI / 180) * this.vel;
        //this.y += Math.sin(this.angle.value * Math.PI / 180) * this.vel;


        for (var i = 0; i < entities.length; i++) {
            var e = entities[i];
            if (e != this && e.name == "nucleotide" && Calc.distance(e.x, e.y, this.x, this.y) <= this.width + e.width) {
                e.x += Math.cos(this.angle.value * Math.PI / 180) * this.vel;
                e.y += Math.sin(this.angle.value * Math.PI / 180) * this.vel;
            }
        }

        super.tick(entities);
    }

}