class Universe {

    constructor() {
        this.ships = [];
        this.bodies = [];
        this.particles = [];

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
            R.scale(V.scale, V.scale);
            R.translate(-V.x, -V.y);
    
            this.bodies.forEach(b => wrap(() => b.render()));
            this.particles.forEach(particles => particles.render());
            this.ships.forEach(ship => ship.render());
        });
    }

    remove(array, item) {
        const index = array.indexOf(item);
        if (index >= 0) {
            array.splice(index, 1);
        }
    }

}