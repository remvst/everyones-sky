class Planet extends Body {

    constructor(star) {
        super();
        this.radius = 100;

        this.orbitsAround = star;
        this.orbitPhase = rnd(0, PI * 2);
        this.orbitRadius = 400;

        this.angle = 0;

        this.asset = createCanvas(this.radius * 2, this.radius * 2, r => {
            // Make sure we only fill the circle
            r.fillStyle = '#fff';
            r.arc(this.radius, this.radius, this.radius, 0 , Math.PI * 2);
            r.fill();
            r.globalCompositeOperation = 'source-atop';

            let rgb = [rnd(32, 255), rnd(32, 255), rnd(32, 255)];

            for (let y = 0 ; y < this.radius * 2 ; y += rnd(PLANET_STRIPE_MIN_SIZE, PLANET_STRIPE_MAX_SIZE)) {
                r.fillStyle = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
                r.fillRect(0, y, this.radius * 2, this.radius * 2);

                // Update colors for the next stripe
                rgb = rgb.map(c => ~~limit(32, c + rnd(-PLANET_COLOR_CHANGE_FACTOR, PLANET_COLOR_CHANGE_FACTOR), 255));
            }
        });
    }

    cycle(e) {
        this.orbitPhase += e * PI / 12;

        this.x = this.orbitsAround.x + cos(this.orbitPhase) * this.orbitRadius;
        this.y = this.orbitsAround.y + sin(this.orbitPhase) * this.orbitRadius;

        this.angle = -this.orbitPhase;
    }

    render() {
        // Draw the orbit
        R.lineWidth = 5;
        R.strokeStyle = 'rgba(255,255,255,0.1)';
        beginPath();
        arc(this.orbitsAround.x, this.orbitsAround.y, this.orbitRadius, 0, PI * 2);
        stroke();

        R.shadowBlur = 100;
        R.shadowColor = 'rgba(255,255,255,0.5)';

        translate(this.x, this.y);
        rotate(this.angle);

        drawImage(this.asset, -this.asset.width / 2, -this.asset.height / 2);
    }

}