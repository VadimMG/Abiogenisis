class Camera {
    constructor(x, y, follow) {
        this.x = x;
        this.y = y;
        this.follow = follow;
        this.isRemove = false;
        this.focus = false;
        this.scale = .5;
        this.name = "camera";
        this.ent_id = Calc.CAMERA_ID;

        if (follow != null) {
            console.log("follow", follow.x, follow.y);
            this.x = follow.x;
            this.y = follow.y;
        }
    }

    tick(entities) {
        this.scale = Calc.zoomValue;
        if (this.follow != null && this.follow.name != "camera" && Calc.follow_cam) {
            this.x = (this.follow.x * this.scale - (600 / 2 * 1));//board.width
            this.y = (this.follow.y * this.scale - (600 / 2 * 1));
        } else {
            this.x = 0;//zoom into center if no following/function of zoom
            this.y = 0;
        }
        if (this.scale <= 0) {
            this.scale = .005;
        }
    }

    render(ctx) { }

    setFocus(focus) {
        this.focus = focus;
    }

    getX() {//used only for mouse click
        if (Calc.follow_cam) {
            return (this.follow.x* this.scale - (600 / 2 * 1));
        }
        return this.x;
    }

    getY() {//used only for mouse click
        if (Calc.follow_cam) {
            return (this.follow.y* this.scale - (600 / 2 * 1));
        }
        return this.y;
    }

    getSpeed() {
        return 0;
    }

}
