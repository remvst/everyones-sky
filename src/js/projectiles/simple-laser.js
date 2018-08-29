class SimpleLaser extends Laser {

    constructor(owner, x, y, angle) {
        super(owner, x, y, angle);
        this.speed = 400;
        this.radius = 4;
        this.damage = 0.1;
    }

    cycle(e) {
        super.cycle(e);

        const d = 0.3;
        particle(0, 'cyan', [
            ['alpha', 1, 0, d],
            ['size', 4, rnd(4, 6), d],
            ['x', this.x, this.x + rnd(-3, 3), d],
            ['y', this.y, this.y + rnd(-3, 3), d]
        ]);
    }

    render() {
        wrap(() => {
            translate(this.x, this.y);
            rotate(this.angle);
    
            R.fillStyle = 'cyan';
            fr(0, -2, 8, 4);
        });
    }

}