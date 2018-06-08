class Amino extends Entity {
    constructor(x, y, angle, id) {
        super(x, y, angle, 1, id);
        this.radius = 2;
        this.width = 6;
        this.name = "amino"
        this.ent_id = Calc.AMINO_ID;
        this.struc = this.fillLength();
    }

    fillLength() {
        var structure = [];
        structure.push(new Molecule(this.radius, "purple"));
        structure.push(new Molecule(this.radius, "white"));
        structure.push(new Molecule(this.radius, "red"));
        return structure;
    }

    render(ctx) {
        
        for (var i = 0, n = this.struc.length; i < n; i++) {
            var m = this.struc[i];
            m.render(ctx, this.getX(i), this.getY(i));
        }
    }

    tick(entities) {    
        super.tick(entities);
        for (var i = 0 , n = entities.length; i < n; i++) {
            if (entities[i] != this) {
                this.collide(entities[i]);
            }
        }
    }

    collide(other) {
        for (var i =0, n = this.struc.length; i < n; i++) {
            var thisX = this.getX(i);
            var thisY = this.getY(i);
            var thisRad = this.struc[i].radius;
            if (other.ent_id == Calc.AMINO_ID || other.ent_id == Calc.LIPID_ID) {
                for (var j = 0, nj = other.struc.length; j < nj; j++) {
                    var otherX = other.getX(j);
                    var otherY = other.getY(j);
                    var otherRad = other.struc[i].radius;
                    var dist = Calc.distance(thisX, thisY, otherX, otherY);
                    if (dist < thisRad + otherRad + Calc.colPad + Calc.colPad) {
                        this.seperate(other, dist, thisX, thisY, otherX, otherY, thisRad, otherRad);
                    }
                }
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

    getX(index) { //0 = amine, 1 = Carbox, 2=side
        var ret = this.x;
        if (index==0) {
            ret = this.x * c.scale - this.width / 2 * c.scale - c.x; 
        }
        if (index==1) {
            ret = this.x * c.scale + this.width / 2 * c.scale - c.x; 
        }
        if (index==2) {
            ret = this.x * c.scale - c.x; 
        }
        return ret;
    }

    getY(index) {//0 = amine, 1 = Carbox, 2=side
        var ret = this.y;
        if (index==0) {
            ret = this.y * c.scale - c.y; 
        }
        if (index==1) {
            ret = this.y * c.scale - c.y; 
        }
        if (index==2) {
            ret = this.y * c.scale + this.width / 2 * c.scale - c.y; 
        }
        return ret;
    }

}

