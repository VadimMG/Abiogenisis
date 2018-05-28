class Molecule {//save relative x,y for later calcultions
    
    constructor(radius, color) {
        this.radius = radius;
        this.color = color;
        this.isCollide = false;//left right bottom... 
        //this.lipid = lipid// for getting o_angle
       }

    render(ctx, x, y) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(Math.floor(x), Math.floor(y), Math.floor(this.radius), 0, 2*Math.PI);//Math.floor
        ctx.fill();
    }




}