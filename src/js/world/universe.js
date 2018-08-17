class Universe {

    constructor() {
        this.ships = [];
        this.bodies = [];
        this.particles = [];
        this.projectiles = [];
        this.items = [];

        this.playerPlanet = new Planet(null, 0);

        // Player ship
        this.playerShip = new PlayerShip(this.playerPlanet);
        this.playerShip.x = CANVAS_WIDTH / 2;
        this.playerShip.y = CANVAS_HEIGHT / 2;
        this.ships.push(this.playerShip);

        // const star = new Star();
        // star.x = CANVAS_WIDTH / 2 + 200;
        // star.y = CANVAS_HEIGHT / 2 + 200;
        // this.bodies.push(star);

        // this.bodies.push(new Planet(star, 400));
        // this.bodies.push(new Planet(star, 800));

        this.generateUniverse();

        // const p = new Planet(star, 1200);
        // this.bodies.push(p);

        // const ai = new AIShip(p);
        // // ai.enemy = this.playerShip;
        // this.ships.push(ai);
        // this.ai = ai;

        // const asteroid = new Asteroid();
        // asteroid.x = star.x + 100;
        // asteroid.y = star.y + 100;
        // this.bodies.push(asteroid);

        // const blackHole = new BlackHole();
        // blackHole.x = this.playerShip.x + 400;
        // blackHole.y = this.playerShip.y + 400;
        // this.bodies.push(blackHole);

        // for (let i = 0 ; i < 10 ; i++) {
        //     const item = new ResourceItem();
        //     item.x = this.playerShip.x + 200 + rnd(-50, 50);
        //     item.y = this.playerShip.y + rnd(-50, 50);
        //     this.items.push(item);
        // }

        // for (let i = 0 ; i < 10 ; i++) {
        //     const asteroid = new Asteroid();
        //     asteroid.x = this.playerShip.x + 500 + rnd(-200, 200);
        //     asteroid.y = this.playerShip.y + rnd(-200, 200);
        //     this.bodies.push(asteroid);
        // }
    }

    cycle(e) {
        this.bodies.forEach(b => b.cycle(e));
        this.ships.forEach(ship => ship.cycle(e));
        this.items.forEach(item => item.cycle(e));
        this.projectiles.forEach(projectile => projectile.cycle(e));
        V.cycle(e);
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
            // translate(this.playerShip.x, this.playerShip.y);
            // scale(V.scale, V.scale);
            // translate(-this.playerShip.x, -this.playerShip.y);

            R.scale(V.scale, V.scale);
            R.translate(-V.x, -V.y);

            if (DEBUG) {
                // R.strokeStyle = '#f00';
                // strokeRect(V.x + 10, V.y + 10, V.width - 20, V.height - 20);
            }
    
            this.bodies.forEach(b => wrap(() => b.render()));
            this.particles.forEach(particles => particles.render());
            this.projectiles.forEach(projectile => projectile.render());
            this.items.forEach(item => item.render());
            this.ships.forEach(ship => ship.render());

            if (DEBUG) {
                // this.forEachTarget(t => {
                //     R.fillStyle = '#f00';
                //     beginPath();
                //     arc(t.x, t.y, t.radius, 0, PI * 2);
                //     stroke();
                // });
            }
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

        for (let i = 0 ; i < 1 ; i++) {
            const radius = i * UNIVERSE_GENERATE_RADIUS_STEP;
            const circumference = 2 * PI * radius;
            const phase = rnd(0, PI * 2);

            const maxSystems = ~~(circumference / maxSystemRadius); // using the circumference leads to slightly incorrect margins, but whatever

            for (let angle = 0 ; angle < PI * 2 ; angle += PI * 2 / maxSystems) {
                // Generate a system there
                const star = new Star(rnd(UNIVERSE_GENERATE_STAR_MIN_RADIUS, UNIVERSE_GENERATE_STAR_MAX_RADIUS));
                star.x = cos(angle + phase) * radius;
                star.y = sin(angle + phase) * radius;
                this.bodies.push(star);

                const planets = rnd(UNIVERSE_GENERATE_SYSTEM_MIN_PLANETS, UNIVERSE_GENERATE_SYSTEM_MAX_PLANETS);
                let orbitRadius = rnd(UNIVERSE_GENERATE_ORBIT_MIN_MARGIN, UNIVERSE_GENERATE_ORBIT_MAX_MARGIN);
                for (let j = 0 ; j < planets ; j++) {
                    const planet = new Planet(star, orbitRadius, rnd(UNIVERSE_GENERATE_PLANET_MIN_RADIUS, UNIVERSE_GENERATE_PLANET_MAX_RADIUS));
                    this.bodies.push(planet);

                    orbitRadius += rnd(UNIVERSE_GENERATE_ORBIT_MIN_MARGIN, UNIVERSE_GENERATE_ORBIT_MAX_MARGIN);
                }
            }
        }
    }

}