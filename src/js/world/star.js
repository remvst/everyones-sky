const rndArr = [0.1, 0.3, 0.2, 0.5];

class Star extends Body {

    constructor(rng) {
        super();
        this.radius = rng.between(UNIVERSE_GENERATE_STAR_MIN_RADIUS, UNIVERSE_GENERATE_STAR_MAX_RADIUS);
        this.name = randomName(rng);
        this.stickString = stickString(this.name);
        // this.reachRadius = 0; // for reference only
        // this.systemDiscovered = false; // for reference only
        this.halo = haloAround(createCanvas(this.radius * 2, this.radius * 2, () => 0), 100, 'rgba(255,0,0,0.3)', 'rgba(255,0,0,0)');
    }

    render() {
        if (!V.isVisible(this.x, this.y, this.radius + 100)) {
            return;
        }

        if (DEBUG) {
            G.renderedStars++;
        }

        drawImage(this.halo, this.x - this.halo.width / 2, this.y - this.halo.height / 2);

        fs('#ff0');
        beginPath();

        for (let i = 0 ; i < 40 ; i++) {
            const a = (i / 40) * PI * 2;
            const d = sin(Date.now() / 1000 * 2 * PI * 2 + i * rndArr[i % rndArr.length]) * this.radius * 0.02 + this.radius * 0.98;

            R[i ? 'lineTo' : 'moveTo'](this.x + cos(a) * d, this.y + sin(a) * d);
        }
        fill();
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
