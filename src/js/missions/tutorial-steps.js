class PromptTutorialStep extends MissionStep {

    attach() {
        V.targetScaleOverride = 1;

        G.showPrompt(nomangle('Follow a quick tutorial?'), [{
            'label': 'Yes',
            'action': () => this.proceed(new MovementStep())
        }, {
            'label': 'No',
            'action': () => this.proceed(new InstructionsStep())
        }]);
    }

}

class MovementStep extends MissionStep {

    attach() {
        G.showPrompt(nomangle('Use arrow keys to control your ship'));

        const start = {'x': U.playerShip.x, 'y': U.playerShip.y};
        this.listen('cycle', () => {
            if (dist(start, U.playerShip) > 500) {
                this.proceed(new ShootingStep());
            }
        });
    }

}

class ShootingStep extends MissionStep {

    attach() {
        G.showPrompt(nomangle('Press [SPACE] to use your blasters'));

        let shots = 10;
        this.listen('shot', projectile => {
            if (projectile.owner === U.playerShip && !--shots) {
                this.proceed(new OfflineStep());
            }
        });
    }

}

class OfflineStep extends MissionStep {

    attach() {
        G.showPrompt(nomangle('Communications are OFFLINE. Find resources to repair them'), [{
            'label': nomangle('Help'),
            'action': () => G.showPrompt(nomangle('Resources can be collected by shooting asteroids'))
        }]);

        this.listen('cycle', () => {
            if (U.playerShip.planet.resources >= 20) {
                this.proceed(new TutorialFinishedStep());
            }
        });

        this.listen('cycle', e => {
            if (U.bodies.length < 10) {
                const asteroid = new Asteroid();
                asteroid.x = U.playerShip.x + pick([-1, 1]) * V.width / 2;
                asteroid.y = U.playerShip.y + pick([-1, 1]) * V.height / 2;
                U.bodies.push(asteroid);
            }
        });
    }

}

class TutorialFinishedStep extends MissionStep {
    attach() {
        G.showPrompt(nomangle('Communications are ONLINE. Good job'));

        setTimeout(() => this.proceed(new InstructionsStep()), 5000);
    }
}

class InstructionsStep extends MissionStep {
    attach() {
        V.targetScaleOverride = null;

        U.generateUniverse();

        G.showPrompt(nomangle('Bring PEACE to the galaxy, or WAR... your call'), [{
            'label': nomangle('Dismiss'),
            'action': () => this.proceed()
        }]);
    }
}