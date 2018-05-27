class Molecule {//save relative x,y for later calcultions
    
    constructor(radius, color) {
        this.radius = radius;
        this.color = color;
        this.isCollide = true;//left right bottom... 
       }

    render(ctx, x, y) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y, this.radius, 0, 2*Math.PI);
        ctx.fill();
    }




}