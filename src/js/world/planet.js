class Planet extends Body {

    constructor(star, orbitRadius) {
        super();
        this.radius = 100;

        this.rotationSpeed = rnd(PI / 8, PI / 12)

        this.orbitsAround = star;
        this.orbitPhase = rnd(0, PI * 2);
        this.orbitRadius = orbitRadius;
        this.orbitPhase = PI;

        this.resources = 0;

        this.angle = 0;

        this.asset = createCanvas(this.radius * 2, this.radius * 2, r => {
            // Make sure we only fill the circle
            r.fillStyle = '#fff';
            r.arc(this.radius, this.radius, this.radius, 0 , Math.PI * 2);
            r.fill();
            r.globalCompositeOperation = 'source-atop';

            let rgb = [rnd(32, 255), rnd(32, 255), rnd(32, 255)];

            for (let y = 0 ; y < this.radius * 2 ; y += rnd(PLANET_STRIPE_MIN_SIZE, PLANET_STRIPE_MAX_SIZE)) {
                r.fillStyle = nomangle('rgb') + '(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
                r.fillRect(0, y, this.radius * 2, this.radius * 2);

                // Update colors for the next stripe
                rgb = rgb.map(c => ~~limit(32, c + rnd(-PLANET_COLOR_CHANGE_FACTOR, PLANET_COLOR_CHANGE_FACTOR), 255));
            }
        });

        this.stations = [];

        const city = new City(this, 0);
        this.stations.push(city);

        const mortar = new Mortar(this, PI / 2);
        this.stations.push(mortar);

        const mountain = new Mountain(this, PI);
        this.stations.push(mountain);

        const factory = new Factory(this, -PI / 2);
        this.stations.push(factory);
    }

    cycle(e) {
        super.cycle(e);

        const velocity = 25; // px/s
        const yearTime = 2 * PI * this.orbitRadius / velocity;
        const angularVelocity = 2 * PI / yearTime;

        this.orbitPhase += e * angularVelocity;

        this.x = this.orbitsAround.x + cos(this.orbitPhase) * this.orbitRadius;
        this.y = this.orbitsAround.y + sin(this.orbitPhase) * this.orbitRadius;

        this.angle += this.rotationSpeed * e;

        this.stations.forEach(station => station.cycle(e));
    }

    render() {
        if (!V.isVisible(this.orbitsAround.x, this.orbitsAround.y, this.orbitRadius + this.radius + 50)) {
            return;
        }

        this.stations.forEach(station => wrap(() => {
            translate(station.x, station.y);
            rotate(station.angleOnPlanet + this.angle);
            station.render();
        }));

        // Draw the orbit
        R.lineWidth = 10;
        R.strokeStyle = 'rgba(255,255,255,0.1)';
        beginPath();
        arc(this.orbitsAround.x, this.orbitsAround.y, this.orbitRadius, 0, PI * 2);
        stroke();

        if (DEBUG) {
            const pts = this.pointsAround([this.radius + 100, this.radius + 200]);

            R.lineWidth = 2;
            pts.forEach(pt => {
                R.fillStyle = '#0f0';
                fillRect(pt.x - 2, pt.y - 2, 4, 4);

                pt.neighbors.forEach(neighbor => {
                    beginPath();
                    R.strokeStyle = '#0f0';
                    moveTo(pt.x, pt.y);
                    lineTo(neighbor.x, neighbor.y);
                    stroke();
                });
            });
        }


        translate(this.x, this.y);
        rotate(this.angle);

        R.shadowBlur = 100;
        R.shadowColor = 'rgba(255,255,255,0.5)';

        drawImage(this.asset, -this.asset.width / 2, -this.asset.height / 2);
    }

    damage(projectile) {
        // TODO maybe super?

        particle(10, '#fff', [
            ['alpha', 1, 0, 1],
            ['size', rnd(2, 4), rnd(5, 10), 1],
            ['x', projectile.x, projectile.x + rnd(-20, 20), 1],
            ['y', projectile.y, projectile.y + rnd(-20, 20), 1]
        ]);
    }

}