class Planet extends Body {

    constructor(orbitsAround, orbitRadius, seed) {
        super();

        this.rng = createNumberGenerator(seed);

        this.radius = ~~this.rng.between(UNIVERSE_GENERATE_PLANET_MIN_RADIUS, UNIVERSE_GENERATE_PLANET_MAX_RADIUS);
        this.reachRadius = this.radius * 4;

        this.civilization = new Civilization(this, this.rng.floating());

        this.name = randomName(this.rng);
        this.stickString = stickString(this.name, 2 / 5);

        this.rotationSpeed = this.rng.between(PI / 8, PI / 12)

        this.orbitsAround = orbitsAround;
        this.orbitPhase = this.rng.between(0, PI * 2);
        this.orbitRadius = orbitRadius;

        this.ring = this.rng.floating() < 0.3;

        this.stations = [];
        this.angle = 0;

        this.updatePosition();

        const initialResources = this.civilization.resources = rnd(PLANET_MIN_INITIAL_RESOURCES, PLANET_MAX_INITIAL_RESOURCES);
        for (let i = 0 ; i < initialResources / PLANET_EVOLUTION_REQUIRED_RESOURCES ; i++) {
            this.evolve();
        }

        this.asset = haloAround(createCanvas(this.radius * 2, this.radius * 2, r => {
            // Make sure we only fill the circle
            r.fs('#fff');
            r.arc(this.radius, this.radius, this.radius, 0 , PI * 2);
            r.fill();
            r.globalCompositeOperation = nomangle('source-atop');

            const rng = createNumberGenerator(this.name.charCodeAt(0) + this.radius);

            let rgb = [...Array(3)].map(() => rng.between(32, 255));

            for (let y = 0 ; y < this.radius * 2 ; y += rng.between(PLANET_STRIPE_MIN_SIZE, PLANET_STRIPE_MAX_SIZE)) {
                r.fs(nomangle('rgb') + '(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')');
                r.fillRect(0, y, this.radius * 2, this.radius * 2);

                // Update colors for the next stripe
                rgb = rgb.map(c => ~~limit(32, c + rnd(-PLANET_COLOR_CHANGE_FACTOR, PLANET_COLOR_CHANGE_FACTOR), 255));
            }
        }), 50, 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0)');

        this.shadowAsset = createCanvas(this.radius * 4, this.radius * 2, (r, c) => {
            const gradient = r.createLinearGradient(0, 0, c.width, 0);
            gradient.addColorStop(0, '#000');
            gradient.addColorStop(1, 'rgba(0,0,0,0)');

            r.fs(gradient);
            r.globalAlpha = 0.4;

            r.beginPath();

            r.wrap(() => {
                r.translate(0, this.radius);
                r.scale(0.7, 1);
                r.arc(0, 0, this.radius, -PI / 2, PI / 2);
            });

            r.lineTo(c.width, c.height);
            r.lineTo(c.width, 0);

            r.fill();
        });
    }

    updatePosition() {
        this.x = this.orbitsAround.x + cos(this.orbitPhase) * this.orbitRadius;
        this.y = this.orbitsAround.y + sin(this.orbitPhase) * this.orbitRadius;
    }

    cycle(e) {
        super.cycle(e);

        const velocity = 25; // px/s
        const yearTime = 2 * PI * this.orbitRadius / velocity;
        const angularVelocity = 2 * PI / yearTime;

        this.orbitPhase += e * angularVelocity;

        this.updatePosition();
        this.angle += this.rotationSpeed * e;

        this.stations.forEach(station => station.cycle(e));

        this.civilization.resources = min(PLANET_MAX_RESOURCES, this.civilization.resources + e * PLANET_RESOURCES_PER_SECOND);

        if ((this.nextEvolution -= e) < 0) {
            this.evolve();
        }
    }

    evolve() {
        if (this.civilization.resources < PLANET_EVOLUTION_REQUIRED_RESOURCES) {
            return;
        }

        this.civilization.resources -= PLANET_EVOLUTION_REQUIRED_RESOURCES;

        pick([
            () => this.spawnStation(City),
            () => this.spawnStation(Mortar),
            // () => this.spawnStation(Mountain),
            () => this.spawnStation(Factory),
            () => this.spawnShip()
        ])();

        this.nextEvolution = PLANET_EVOLUTION_INTERVAL;
    }

    spawnStation(type) {
        let attempts = 0;
        let angle;

        const minAngleDifference = PI * 2 / (2 * PI * this.radius / 50);
        do {
            angle = random() * PI * 2;
        } while(++attempts < 5 && this.stations.filter(otherStation => abs(normalize(angle, otherStation.angle)) < minAngleDifference).length);

        this.stations.push(new type(this, angle));
    }

    spawnShip() {
        const ai = new AIShip(this.civilization);

        // Giving the ship a shitty position within the planet
        // AI ships fix their position automatically since they can't crash into their own planet
        ai.x = this.x + rnd(-1, 1);
        ai.y = this.y + rnd(-1, 1);
        
        U.ships.push(ai);
    }

    render() {
        if (!V.isVisible(this.orbitsAround.x, this.orbitsAround.y, this.orbitRadius + this.radius * 2)) { // * 2 for the halo
            return;
        }

        // Draw the orbit
        R.lineWidth = 10;
        R.strokeStyle = 'rgba(255,255,255,0.1)';
        beginPath();
        arc(this.orbitsAround.x, this.orbitsAround.y, this.orbitRadius, 0, PI * 2);
        stroke();

        if (DEBUG) {
            G.renderedOrbits++;

            // const pts = this.pointsAround([this.radius + 100, this.radius + 200]);

            // R.lineWidth = 2;
            // pts.forEach(pt => {
            //     R.fs('#0f0');
            //     fillRect(pt.x - 2, pt.y - 2, 4, 4);

            //     pt.neighbors.forEach(neighbor => {
            //         beginPath();
            //         R.strokeStyle = '#0f0';
            //         moveTo(pt.x, pt.y);
            //         lineTo(neighbor.x, neighbor.y);
            //         stroke();
            //     });
            // });
        }

        if (!V.isVisible(this.x, this.y, this.radius + 50)) {
            return;
        }

        if (DEBUG) {
            G.renderedPlanets++;
        }

        R.strokeStyle = '#fff';
        R.lineWidth = 60;

        if (this.ring) {
            wrap(() => {
                R.globalAlpha = 0.5;
                translate(this.x, this.y);
                rotate(PI / 4);
                scale(1, 0.2);
                beginPath();
                arc(0, 0, this.radius * 1.5, 0, PI);
                stroke();
            });
        }

        this.stations.forEach(station => wrap(() => {
            translate(station.x, station.y);
            rotate(station.angleOnPlanet + this.angle);
            station.render();
        }));

        translate(this.x, this.y);

        wrap(() => {
            rotate(this.angle);
            drawImage(this.asset, -this.asset.width / 2, -this.asset.height / 2);
        });

        wrap(() => {
            rotate(this.orbitPhase);
            drawImage(this.shadowAsset, 0, -this.shadowAsset.height / 2);
        });

        if (this.ring) {
            wrap(() => {
                R.globalAlpha = 0.5;
                rotate(PI / 4);
                scale(1, 0.2);
                beginPath();
                arc(0, 0, this.radius * 1.5, -PI, 0);
                stroke();
            });
        }
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

    nameWithRelationship() {
        return this.name.toUpperCase() + ' (' + (this.civilization.relationshipType() === RELATIONSHIP_ENEMY ? nomangle('enemy') : nomangle('ally')) + ')';
    }

}