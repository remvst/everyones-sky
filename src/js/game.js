class Game {

    constructor() {
        if (DEBUG) {
            console.log('Game starting woohoo');
        }

        U = new Universe();
        V = new Camera();

        this.eventHub = new EventHub();

        this.clock = 0;
        // this.promptText = null; // for reference
        // this.promptClock = 0; // for reference

        setTimeout(() => this.proceedToMissionStep(new MovementStep()), 5000);
    }

    proceedToMissionStep(missionStep) {
        if (!missionStep) {
            this.showPrompt();
            return;
        }

        missionStep.proceedListener = nextStep => this.proceedToMissionStep(nextStep);
        missionStep.attach();
    }

    renderGauge(x, y, ratio, color, renderIcon) {
        wrap(() => {
            translate(x, y);

            R.fillStyle = 'rgba(128,128,128,0.5)';
            fr(0, -5, 200, 10);

            R.fillStyle = color;
            fr(0, -5, -2, 10);
            fr(200, -5, 2, 10);

            fr(0, -5, 200 * limit(0, ratio, 1), 10);

            translate(-25, 0);
            renderIcon();
        });
    }

    cycle(e) {
        this.clock += e;

        U.cycle(e);
        INTERPOLATIONS.slice().forEach(i => i.cycle(e));

        this.eventHub.emit('cycle', e);

        U.render();

        // Render HUD
        wrap(() => {
            translate(V.shakeX, V.shakeY);

            R.fillStyle = 'rgba(0,0,0,0.5)';
            R.strokeStyle = '#fff';
            fr(50, 30, 270, 100);
            strokeRect(50.5, 30.5, 270, 100);

            this.renderGauge(100, 50, U.playerShip.health, (U.playerShip.health < 0.25 || G.clock - U.playerShip.lastDamage < 0.2) ? '#f00' : '#fff', () => {
                scale(0.5, 0.5);
                beginPath();
                moveTo(0, -15)
                lineTo(14, -10);
                lineTo(10, 10);
                lineTo(0, 18);
                lineTo(-10, 10);
                lineTo(-14, -10);
                fill();
            });

            this.renderGauge(100, 80, U.playerShip.planet.resources / MAX_PLANET_RESOURCES, '#fff', () => {
                scale(0.3, 0.3);
                renderResourcesIcon();
            });

            this.renderGauge(100, 110, U.playerShip.heat, U.playerShip.coolingDown ? '#f00' : '#fff', () => {
                fr(-5, -5, 3, 10);
                fr(-1, -5, 3, 10);
                fr(3, -5, 3, 10);
            });

            // Rendering targets
            let targets = [];

            targets = U.stars.sort((a, b) => {
                return dist(a, U.playerShip) - dist(b, U.playerShip);
            }).slice(0, 3);

            // If we are in a system, no need to show nearby systems
            if (targets[0] && dist(targets[0], U.playerShip) < targets[0].reachRadius) {
                targets = [];
            }
            
            targets.forEach(target => {
                const angle = atan2(target.y - U.playerShip.y, target.x - U.playerShip.x);

                wrap(() => {
                    const distanceOnCircle = limit(0, (dist(target, U.playerShip) - target.reachRadius) / 2000, 1) * 200 + 50;

                    translate(CANVAS_WIDTH / 2 + cos(angle) * distanceOnCircle, CANVAS_HEIGHT / 2 + sin(angle) * distanceOnCircle);
                    rotate(angle);

                    R.fillStyle = '#fff';
                    beginPath();
                    moveTo(0, 0);
                    lineTo(-14, 10);
                    lineTo(-8, 0);
                    lineTo(-14, -10);
                    fill();
                });
            });

            // Prompt
            if (this.promptText) {
                R.fillStyle = 'rgba(0,0,0,0.5)';
                R.font = '20pt Courier';
                fr(0, CANVAS_HEIGHT - 200, CANVAS_WIDTH, 200);

                const textWidth = measureText(this.promptText + '_').width;

                const length = ~~min((this.clock - this.promptClock) * 20, this.promptText.length);
                const actualText = this.promptText.slice(0, length) + (length < this.promptText.length || (G.clock % 1) > 0.5 ? '_' : '');

                R.fillStyle = '#fff';
                R.textAlign = 'left';
                fillText(actualText, (CANVAS_WIDTH - textWidth) / 2, CANVAS_HEIGHT - 200 + 50);

                if (length >= this.promptText.length) {
                    R.textAlign = 'center';

                    this.promptOptions.forEach((option, i) => {
                        const step = CANVAS_WIDTH / (this.promptOptions.length + 1);
                        const x = (i + 1) * step;
                        fillText('[' + option.label.slice(0, 1) + ']' + option.label.slice(1), x, CANVAS_HEIGHT - 200 + 100);
                    });
                }
            }
        });
    }

    showPrompt(promptText, options) {
        this.promptText = promptText;
        this.promptClock = this.clock;
        this.promptOptions = options || [];
    }

    selectPromptOption(character) {
        (this.promptOptions || []).forEach(option => {
            if (option.label.slice(0, 1).toLowerCase() === character.toLowerCase()) {
                option.action();
            }
        });
    }

}