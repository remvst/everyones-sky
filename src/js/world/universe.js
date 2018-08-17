class Universe {

    constructor() {
        this.ships = [];
        this.bodies = [];
        this.particles = [];
        this.projectiles = [];

        // Player ship
        this.playerShip = new PlayerShip();
        this.playerShip.x = CANVAS_WIDTH / 2;
        this.playerShip.y = CANVAS_HEIGHT / 2;
        this.ships.push(this.playerShip);

        const star = new Star();
        star.x = CANVAS_WIDTH / 2 + 200;
        star.y = CANVAS_HEIGHT / 2 + 200;
        this.bodies.push(star);

        this.bodies.push(new Planet(star, 400));
        this.bodies.push(new Planet(star, 800));
        this.bodies.push(new Planet(star, 1200));

        const asteroid = new Asteroid();
        asteroid.x = star.x + 100;
        asteroid.y = star.y + 100;
        this.bodies.push(asteroid);

        const blackHole = new BlackHole();
        blackHole.x = this.playerShip.x + 400;
        blackHole.y = this.playerShip.y + 400;
        this.bodies.push(blackHole);
    }

    cycle(e) {
        this.bodies.forEach(b => b.cycle(e));
        this.ships.forEach(ship => ship.cycle(e));
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

            R.strokeStyle = '#f00';
            strokeRect(V.x + 10, V.y + 10, V.width - 20, V.height - 20);
    
            this.bodies.forEach(b => wrap(() => b.render()));
            this.particles.forEach(particles => particles.render());
            this.projectiles.forEach(projectile => projectile.render());
            this.ships.forEach(ship => ship.render());

            if (DEBUG) {
                this.forEachTarget(t => {
                    R.fillStyle = '#f00';
                    beginPath();
                    arc(t.x, t.y, t.radius, 0, PI * 2);
                    stroke();
                });
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