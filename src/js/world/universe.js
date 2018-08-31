class Universe {

    constructor() {
        this.ships = [];
        this.bodies = [];
        this.stars = [];
        this.particles = [];
        this.projectiles = [];
        this.items = [];

        // Player ship
        this.ships.push(this.playerShip = new PlayerShip());

        // setTimeout(() => this.generateUniverse(), 0);
        this.nextAsteroid = 0;
    }

    cycle(e) {
        if ((this.nextAsteroid -= e) <= 0) {
            this.nextAsteroid = this.stars.filter(star => dist(star, U.playerShip) < star.reachRadius).length ? 10 : 5; // Less asteroids when in a system
            this.randomAsteroid();
        }

        this.bodies.forEach(b => b.cycle(e));
        this.ships.forEach(ship => ship.cycle(e));
        this.items.forEach(item => item.cycle(e));
        this.projectiles.forEach(projectile => projectile.cycle(e));
        V.cycle(e);
    }
    
    randomAsteroid() {
        const asteroid = new Asteroid();
        asteroid.x = U.playerShip.x + pick([-1, 1]) * V.width / 2;
        asteroid.y = U.playerShip.y + pick([-1, 1]) * V.height / 2;
        U.bodies.push(asteroid);
    }

    renderBackground(pattern, factor) {
        wrap(() => {
            const x = (V.width / 2 + V.x) * factor;
            const y = (V.height / 2 + V.y) * factor;
            translate(-x, -y);
            R.fillStyle = pattern;
            fr(x, y, CANVAS_WIDTH, CANVAS_HEIGHT);
        });
    }

    render() {
        R.fillStyle = '#000';
        fr(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        this.renderBackground(starsPattern2, 0.2);
        this.renderBackground(starsPattern1, 0.1);

        wrap(() => {
            scale(V.scale, V.scale);
            translate(-V.x, -V.y);
    
            this.projectiles.forEach(projectile => projectile.render());
            this.particles.forEach(particles => particles.render());
            this.ships.forEach(ship => ship.render());
            this.bodies.forEach(b => wrap(() => b.render()));
            this.items.forEach(item => item.render());

            R.shadowColor = '#000';
            R.shadowOffsetY = 4;

            const closeBodies = this.bodies.filter(body => body.name && dist(body, U.playerShip) < V.width / 2);
            closeBodies.forEach(body => wrap(() => {
                const x1 = cos(-PI / 4) * (body.radius + 20);
                const y1 = sin(-PI / 4) * (body.radius + 20);

                const x2 = cos(-PI / 4) * (body.radius + 50);
                const y2 = sin(-PI / 4) * (body.radius + 50);

                const x3 = x2 + 30;
                const y3 = y2;

                R.strokeStyle = R.fillStyle = '#fff';
                R.lineWith = 2;
                beginPath();
                moveTo(body.x + x1, body.y + y1);
                lineTo(body.x + x2, body.y + y2);
                lineTo(body.x + x3, body.y + y3);
                stroke();

                R.lineWith = 8;
                translate(body.x + x3 + 10, body.y + y3 - 7);
                renderStickString(body.stickString, 10, 15, 1, 0, 0);
            }));
        });
    }

    remove(array, item) {
        const index = array.indexOf(item);
        if (index >= 0) {
            array.splice(index, 1);
        }
    }

    forEachTarget(fn) {
        this.ships.forEach(fn);
        this.bodies.forEach(fn);
        this.bodies.forEach(p => (p.stations || []).forEach(fn));
    }

    generateUniverse() {
        const maxOrbitsGap = UNIVERSE_GENERATE_ORBIT_MAX_MARGIN;
        const maxSystemRadius = UNIVERSE_GENERATE_SYSTEM_MAX_PLANETS * maxOrbitsGap + UNIVERSE_GENERATE_SYSTEM_MIN_MARGIN;

        for (let i = 0 ; i < 4 ; i++) {
            const radius = i * maxSystemRadius;
            const circumference = 2 * PI * radius;
            const phase = rnd(0, PI * 2);

            const maxSystems = ~~(circumference / maxSystemRadius); // using the circumference leads to slightly incorrect margins, but whatever

            for (let i = 0 ; i < maxSystems ; i++) {
                const angle = (i / maxSystems) * PI * 2;

                // Generate a system there
                const star = new Star(rnd(UNIVERSE_GENERATE_STAR_MIN_RADIUS, UNIVERSE_GENERATE_STAR_MAX_RADIUS));
                star.x = cos(angle + phase) * radius + U.playerShip.x;
                star.y = sin(angle + phase) * radius + U.playerShip.y;
                this.bodies.push(star);
                this.stars.push(star);

                const planets = rnd(UNIVERSE_GENERATE_SYSTEM_MIN_PLANETS, UNIVERSE_GENERATE_SYSTEM_MAX_PLANETS);
                let orbitRadius = rnd(UNIVERSE_GENERATE_ORBIT_MIN_MARGIN, UNIVERSE_GENERATE_ORBIT_MAX_MARGIN);
                for (let j = 0 ; j < planets ; j++) {
                    const planet = new Planet(star, orbitRadius, rnd(UNIVERSE_GENERATE_PLANET_MIN_RADIUS, UNIVERSE_GENERATE_PLANET_MAX_RADIUS));
                    this.bodies.push(planet);

                    star.reachRadius = orbitRadius + planet.radius;

                    orbitRadius += rnd(UNIVERSE_GENERATE_ORBIT_MIN_MARGIN, UNIVERSE_GENERATE_ORBIT_MAX_MARGIN);
                }

                // Create some pirates
                const pirateAngle = random() * PI * 2;
                this.createPirateGroup(
                    cos(pirateAngle) * (radius - maxSystemRadius / 2),
                    sin(pirateAngle) * (radius - maxSystemRadius / 2)
                );

                // return;
            }
        }
    }

    createPirateGroup(x, y) {
        const pirateCivilization = new Civilization({
            'x': x, 
            'y': y,
            'radius': 300
        });
        pirateCivilization.relationship = 0; // make sure we're enemies

        const ships = [];
        for (let i = 0 ; i < 5 ; i++) {
            ships.push(new AIShip(pirateCivilization));
        }

        ships.forEach(ship => { 
            ship.x = x + rnd(-300, 300);
            ship.y = y + rnd(-300, 300);
        })

        this.ships = this.ships.concat(ships);

        return ships;
    }

}