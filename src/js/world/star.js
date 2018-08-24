const rndArr = [random(), random(), random(), random()];

class Star extends Body {

    constructor(radius, name) {
        super();
        this.radius = radius || 100;
        this.name = name;
        // this.reachRadius = 0; // for reference only
    }

    render() {
        if (!V.isVisible(this.x, this.y, this.radius + 100)) {
            return;
        }

        R.fillStyle = '#ff0';
        beginPath();

        R.shadowBlur = 100;
        R.shadowColor = '#f00';

        for (let i = 0 ; i < 40 ; i++) {
            const a = (i / 40) * PI * 2;
            const d = sin(Date.now() / 1000 * 2 * PI * 2 + i * rndArr[i % rndArr.length]) * this.radius * 0.02 + this.radius * 0.98;

            R[i ? 'lineTo' : 'moveTo'](this.x + cos(a) * d, this.y + sin(a) * d);
        }
        fill();

        let x1 = cos(-PI / 4) * (this.radius + 20);
        let y1 = sin(-PI / 4) * (this.radius + 20);

        let x2 = cos(-PI / 4) * (this.radius + 50);
        let y2 = sin(-PI / 4) * (this.radius + 50);

        let x3 = x2 + 30;
        let y3 = y2;

        R.strokeStyle = R.fillStyle = '#fff';
        R.lineWith = 2;
        beginPath();
        moveTo(this.x + x1, this.y + y1);
        lineTo(this.x + x2, this.y + y2);
        lineTo(this.x + x3, this.y + y3);
        stroke();

        R.font = '20pt Courier';
        R.textBaseline = 'middle';
        fillText(this.name.toUpperCase(), this.x + x3 + 10, this.y + y3);
    }

    damage(projectile) {
        // TODO maybe super?

        particle(10, '#ff0', [
            ['alpha', 1, 0, 1],
            ['size', rnd(2, 4), rnd(5, 10), 1],
            ['x', projectile.x, projectile.x + rnd(-40, 40), 1],
            ['y', projectile.y, projectile.y + rnd(-40, 40), 1]
        ]);
    }

}