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

        const star = new Star();
        star.x = CANVAS_WIDTH / 2 + 200;
        star.y = CANVAS_HEIGHT / 2 + 200;
        this.bodies.push(star);

        this.bodies.push(new Planet(star, 400));
        this.bodies.push(new Planet(star, 800));

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

        for (let i = 0 ; i < 10 ; i++) {
            const item = new ResourceItem();
            item.x = this.playerShip.x + 200 + rnd(-50, 50);
            item.y = this.playerShip.y + rnd(-50, 50);
            this.items.push(item);
        }

        for (let i = 0 ; i < 10 ; i++) {
            const asteroid = new Asteroid();
            asteroid.x = this.playerShip.x + 500 + rnd(-200, 200);
            asteroid.y = this.playerShip.y + rnd(-200, 200);
            this.bodies.push(asteroid);
        }
    }

    cycle(e) {
        this.bodies.forEach(b => b.cycle(e));
        this.ships.forEach(ship => ship.cycle(e));
        this.items.forEach(item => item.cycle(e));
        this.projectiles.forEach(projectile => projectile.cycle(e));
        V.cycle(e);
    }

    render() {
        R.fillStyle = '#000';
        fr(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        wrap(() => {
            translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
            scale(V.scale, V.scale);
            translate(-CANVAS_WIDTH / 2, -CANVAS_HEIGHT / 2);

            const x = V.x * 0.8;
            const y = V.y * 0.8;
            // scale(V.scale, V.scale);
            translate(-x, -y);
            R.fillStyle = starsPattern;
            fr(x, y, CANVAS_WIDTH, CANVAS_HEIGHT);
        });

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

}