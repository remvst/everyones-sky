const everyones = stickString(nomangle('everyone\'s'), 2 / 5);
const sky = stickString(nomangle('sky'), 2 / 5);
const pressEnterToStart = stickString(nomangle('press enter to start'), 2 / 5);

class Game {

    constructor() {
        if (DEBUG) {
            console.log('Game starting woohoo');
        }

        U = new Universe();
        V = new Camera();

        this.eventHub = new EventHub();

        this.titleYOffset = 0;
        this.started = false;

        this.clock = 0;
        // this.promptText = null; // for reference
        // this.promptClock = 0; // for reference

        // this.message = null; // for reference
        // this.messageProgress = 0; // for reference
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

        if (w.down[13]) {
            this.start();
        }

        if (DEBUG) {
            G.renderedPlanets = 0;
            G.renderedOrbits = 0;
            G.renderedStars = 0;
            G.renderedAsteroids = 0;
            G.renderedShips = 0;
            G.renderedParticles = 0;
        }

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

            const closestStars = U.stars.sort((a, b) => {
                return dist(a, U.playerShip) - dist(b, U.playerShip);
            }).slice(0, 3);

            if (closestStars[0]) {
                if (dist(closestStars[0], U.playerShip) > closestStars[0].reachRadius) {
                    targets = closestStars;
                } else if (!closestStars[0].systemDiscovered) {
                    closestStars[0].systemDiscovered = true;
                    this.showMessage(nomangle('system discovered - ') + closestStars[0].name);
                }
            }
            
            targets.forEach(target => {
                const angle = angleBetween(U.playerShip, target);

                wrap(() => {
                    const distanceOnCircle = limit(0, (dist(target, U.playerShip) - target.reachRadius) / 4000, 1) * 200 + 50;

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

            R.strokeStyle = '#fff';
            R.lineCap = 'round';

            // Message
            if (this.message && this.messageProgress) {
                wrap(() => {
                    R.lineWidth = 4;

                    const messageWidth = this.message.width * 20;
                    translate((CANVAS_WIDTH - messageWidth) / 2, (CANVAS_HEIGHT - 100) / 2 - 200);
                    renderStickString(this.message, 20, 30, this.messageProgress, 0.1, 1);
                });
            }

            // Game title
            const charWidth = 50;
            const charHeight = 100;
            wrap(() => {
                translate(0, this.titleYOffset);

                R.fillStyle = '#000';
                fr(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

                R.lineWidth = 8;

                const everyonesY = (CANVAS_HEIGHT - charHeight * (everyones.height + 2 / 5 + sky.height)) / 2;
                wrap(() => {
                    translate((CANVAS_WIDTH - everyones.width * charWidth) / 2, everyonesY);
                    renderStickString(everyones, charWidth, charHeight, G.clock - 0.5, 0.1, 1);
                });

                wrap(() => {
                    translate((CANVAS_WIDTH - sky.width * charWidth) / 2, everyonesY + charHeight * sky.height * 7 / 5);
                    renderStickString(sky, charWidth, charHeight, G.clock - 0.5, 0.1, 1);
                });

                R.lineWidth = 4;

                const instructionCharWidth = 20;
                const instructionCharHeight = 30;
                wrap(() => {
                    if (G.clock % 1 > 0.5 && G.clock > 6 || this.titleYOffset) {
                        return;
                    }

                    translate((CANVAS_WIDTH - pressEnterToStart.width * instructionCharWidth) / 2, CANVAS_HEIGHT - instructionCharHeight - 100);
                    renderStickString(pressEnterToStart, instructionCharWidth, instructionCharHeight, G.clock - 5, 0.01, 0.2);
                });
            });
        });

        if (DEBUG) {
            wrap(() => {
                R.font = '10pt Courier';
                R.fillStyle = '#fff';

                const info = [
                    'planets: ' + G.renderedPlanets,
                    'stars: ' + G.renderedStars,
                    'orbits: ' + G.renderedOrbits,
                    'asteroids: ' + G.renderedAsteroids,
                    'ships: ' + G.renderedShips,
                    'particles: ' + G.renderedParticles
                ];
                let y = 20; 
                info.forEach(info => {
                    fillText(info, CANVAS_WIDTH - 200, y);
                    y += 20;
                });
            });
        }
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

    showMessage(message) {
        this.message = stickString(message, 2 / 5);
        interp(this, 'messageProgress', this.message.segments.length, 0, this.message.segments.length * 0.1, 3);
        interp(this, 'messageProgress', 0, this.message.segments.length, this.message.segments.length * 0.1);
    }

    start() {
        if (this.started) {
            return;
        }

        this.started = true;

        interp(this, 'titleYOffset', 0, -CANVAS_HEIGHT, 0.3);

        V.scale = V.targetScaleOverride = 1;
        setTimeout(() => this.proceedToMissionStep(new PromptTutorialStep()), 3000);
    }

}