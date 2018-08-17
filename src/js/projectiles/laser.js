class Laser {

    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = 200;
    }

    cycle(e) {
        this.x += cos(this.angle) * this.speed * e;
        this.y += sin(this.angle) * this.speed * e;
    }

    render() {
        wrap(() => {
            translate(this.x, this.y);
            rotate(this.angle);
    
            R.fillStyle = '#fff';
            fr(0, -1, 4, 2);
        });
    }

}