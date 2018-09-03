class Asteroids extends TimedMissionStep {

    constructor() {
        super();
        this.prompt = nomangle('Destroy these asteroids for us');
    }

    instructions() {
        return nomangle('Destroy the asteroids');
    }

    attach() {
        super.attach();

        const asteroids = [];
        for (let i = 0 ; i < 5 ; i++) {
            const asteroid = new Asteroid();
            asteroid.x = this.civilization.center.x + pick([-1, 1]) * 1000;
            asteroid.y = this.civilization.center.y + rnd(-2500, 2500);
            asteroid.vX = sign(this.civilization.center.x - asteroid.x) * min(abs(asteroid.vX), 100);
            asteroid.vY = sign(this.civilization.center.y - asteroid.y) * min(abs(asteroid.vY), 100);
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
