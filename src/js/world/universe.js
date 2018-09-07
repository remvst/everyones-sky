class Universe {

    constructor() {
        this.ships = [];
        this.bodies = [];
        this.stars = [];
        this.particles = [];
        this.projectiles = [];
        this.items = [];
        this.pirates = [];

        this.center = {'x': 0, 'y': 0};

        this.backgroundStarGradient = createRadialGradient(0, 0, 0, 0, 0, 1);
        this.backgroundStarGradient.addColorStop(0, 'rgba(255,255,200,1)');
        this.backgroundStarGradient.addColorStop(0.3, 'rgba(255,255,200,0.1)');
        this.backgroundStarGradient.addColorStop(1, 'rgba(255,255,200,0)');

        this.createPlayerShip();

        // setTimeout(() => this.generateUniverse(), 0);
        this.nextAsteroid = 0;
    }

    createPlayerShip() {
        this.remove(this.ships, this.playerShip);
        this.ships.push(this.playerShip = new PlayerShip(this.center.x, this.center.y));
    }

    cycle(e) {
        if ((this.nextAsteroid -= e) <= 0) {
            this.nextAsteroid = 3;
            this.randomAsteroid();
        }

        this.forEach([this.bodies, this.ships, this.items, this.projectiles, [V]], element => element.cycle(e));
    }

    randomAsteroid() {
        const asteroid = new Asteroid();
        asteroid.x = U.playerShip.x + pick([-1.1, 1.1]) * V.visibleWidth / 2;
        asteroid.y = U.playerShip.y + pick([-1.1, 1.1]) * V.visibleHeight / 2;
        U.bodies.push(asteroid);
    }

    forEach(arrays, func) {
        arrays.forEach(x => x.forEach(y => func(y)));
    }

    render() {
        fs('#000');
        fr(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const rng = createNumberGenerator(1);

        wrap(() => {
            translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
            scale(V.zoomScale, V.zoomScale);

            fs(this.backgroundStarGradient);

            for (let i = 0 ; i < 400 ; i++) {
                wrap(() => {
                    const distanceFactor = rng.between(0.1, 0.3);
                    translate(
                        moduloWithNegative(rng.between(-1, 1) * CANVAS_WIDTH - U.playerShip.x * distanceFactor, CANVAS_WIDTH),
                        moduloWithNegative(rng.between(-1, 1) * CANVAS_HEIGHT - U.playerShip.y * distanceFactor, CANVAS_HEIGHT)
                    );

                    scale(distanceFactor * 20, distanceFactor * 20);

                    beginPath();
                    arc(
                        0,
                        0,
                        1,
                        0,
                        TWO_PI
                    );
                    fill();
                });
            }
        });

        wrap(() => {
            scale(V.zoomScale, V.zoomScale);
            translate(-V.x, -V.y);

            this.forEach([this.projectiles, this.particles, this.ships, this.bodies, this.items], element => wrap(() => {
                element.render();
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
        this.forEach([this.ships, this.bodies], fn);
        this.bodies.forEach(p => (p.stations || []).forEach(fn));
    }

    generateUniverse() {
        this.center = {
            'x': U.playerShip.x,
            'y': U.playerShip.y
        };

        const maxSystemRadius = UNIVERSE_GENERATE_SYSTEM_MAX_PLANETS * UNIVERSE_GENERATE_ORBIT_MAX_MARGIN + UNIVERSE_GENERATE_SYSTEM_MIN_MARGIN;

        const rng = createNumberGenerator(1);

        for (let i = 0 ; i < 3 ; i++) {
            const radius = i * maxSystemRadius;
            const phase = rng.between(0, TWO_PI);

            const maxSystems = ~~(TWO_PI * radius / maxSystemRadius); // using the circumference leads to slightly incorrect margins, but whatever

            for (let i = 0 ; i < maxSystems ; i++) {
                const angle = (i / maxSystems) * TWO_PI;

                // Generate a system there
                const star = new Star(rng);
                star.x = cos(angle + phase) * radius + U.playerShip.x;
                star.y = sin(angle + phase) * radius + U.playerShip.y;
                this.bodies.push(star);
                this.stars.push(star);

                const planets = rng.between(UNIVERSE_GENERATE_SYSTEM_MIN_PLANETS, UNIVERSE_GENERATE_SYSTEM_MAX_PLANETS);
                let orbitRadius = rng.between(UNIVERSE_GENERATE_ORBIT_MIN_MARGIN, UNIVERSE_GENERATE_ORBIT_MAX_MARGIN);
                for (let j = 0 ; j < planets ; j++) {
                    const planet = new Planet(star, orbitRadius, rng.floating() * 999);
                    this.bodies.push(planet);

                    star.reachRadius = orbitRadius + planet.radius;

                    orbitRadius += rng.between(UNIVERSE_GENERATE_ORBIT_MIN_MARGIN, UNIVERSE_GENERATE_ORBIT_MAX_MARGIN);
                }

                // Create some pirates
                const pirateAngle = rng.between(0, TWO_PI);
                this.createPirateGroup(
                    cos(pirateAngle) * (radius + maxSystemRadius / 2),
                    sin(pirateAngle) * (radius + maxSystemRadius / 2)
                );
            }
        }
    }

    // debugView() {
    //     const can = document.createElement('canvas');
    //     can.width = 500;
    //     can.height = 500;
    //
    //     const ctx = can.getContext('2d');
    //
    //     const furthestStar = this.stars.reduce((furthestStar, star) => {
    //         return max(furthestStar, dist(star, this.center));
    //     }, 0);
    //
    //     ctx.fs('#000');
    //     ctx.fr(0, 0, can.width, can.height);
    //
    //     this.bodies.concat(this.ships).forEach(body => {
    //         if (body instanceof Star) {
    //             ctx.fs('#ff0');
    //         }
    //
    //         if (body instanceof Planet) {
    //             ctx.fs('#00f');
    //         }
    //
    //         if (body instanceof Ship) {
    //             ctx.fs('#f00');
    //         }
    //
    //         const distance = dist(body, this.center);
    //         const angle = angleBetween(this.center, body);
    //         const relativeDistance = distance / furthestStar;
    //
    //         ctx.fr(
    //             can.width / 2 + cos(angle) * relativeDistance * can.width / 2,
    //             can.height / 2 + sin(angle) * relativeDistance * can.height / 2,
    //             5,
    //             5
    //         );
    //     });
    //
    //     document.body.appendChild(can);
    // }

    createPirateGroup(x, y) {
        const ships = [...Array(~~rnd(4, 6))].map(() => new AIShip(
            new Civilization({'x': x, 'y': y, 'radius': 300}, 0),
            x + rnd(-300, 300),
            y + rnd(-300, 300)
        ));

        this.ships = this.ships.concat(ships);
        this.pirates = this.pirates.concat(ships);

        return ships;
    }

    dropResources(x, y, n) {
        // Drop resources
        [...Array(~~n)].forEach(() => U.items.push(new ResourceItem(x, y)));
    }

    // randomAsteroidField(x, y) {
    //     for (let i = 0 ; i < 10 ; i++) {
    //         // const angle = random() * TWO_PI;
    //         // const dist = random() *
    //         const asteroid = new Asteroid(0, rnd(-10, 10));
    //         asteroid.preventAutomaticRemoval = true;
    //         asteroid.x = x + rnd(-200, 200);
    //         asteroid.y = y + rnd(-200, 200);
    //         U.bodies.push(asteroid);
    //     }
    // }

}
