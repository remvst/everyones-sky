class Asteroids extends TimedMissionStep {

    constructor(planet) {
        super();
        this.planet = planet;
        this.prompt = nomangle('There asteroids are threatening us. Destroy them');
    }

    instructions() {
        return nomangle('Destroy the asteroids');
    }

    attach() {
        super.attach();

        const asteroids = [];
        for (let i = 0 ; i < 5 ; i++) {
            const asteroid = new Asteroid();
            asteroid.x = this.planet.x + pick([-1, 1]) * 5000;
            asteroid.y = this.planet.y + rnd(-5000, 5000);
            asteroid.vX = sign(this.planet.x - asteroid.x) * min(abs(asteroid.vX), 100);
            asteroid.vY = sign(this.planet.y - asteroid.y) * min(abs(asteroid.vY), 100);
            asteroid.preventAutomaticRemoval = true;
            U.bodies.push(asteroid);

            asteroids.push(asteroid);
        }

        this.listen(EVENT_CYCLE, () => {
            this.targets = asteroids.filter(asteroid => asteroid.health > 0);

            if (!this.targets.length) {
                G.missionDone(true);
            }
        });
    }

}
