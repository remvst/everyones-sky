function stickString(characters, charSpacing) {
    const absoluteSegments = [];

    let characterX = 0;
    let width;
    characters.forEach(charSegments => {
        let nextX = characterX;
        charSegments.forEach(segment => {
            absoluteSegments.push([
                characterX + segment[0], 
                segment[1], 
                characterX + segment[2], 
                segment[3]
            ]);
            nextX = max(nextX, characterX + segment[0] + charSpacing, characterX + segment[2] + charSpacing);
        });

        if (!charSegments.length) {
            nextX += 1;
        }

        characterX = nextX;
        width = characterX - charSpacing;
    });

    const appearanceOffsets = [];
    let offset = 0;
    for (let i = 0 ; i < absoluteSegments.length ; i++) {
        appearanceOffsets.splice(~~(random() * appearanceOffsets.length), 0, offset);
        offset += 1;
    }

    return {
        'segments': absoluteSegments,
        'appearanceOffsets': appearanceOffsets,
        'width': width,
        'height': 1
    };
}

const r = rnd();

function renderStickString(stickStringSettings, charWidth, charHeight, progress, segmentInterval, appearanceTime) {
    stickStringSettings.segments.forEach((segment, index) => {
        wrap(() => {
            const appearanceOffset = stickStringSettings.appearanceOffsets[index];
            const delay = appearanceOffset * segmentInterval;
            const factor = limit(0, (progress - delay) / appearanceTime, 1);
            
            const direction = sign(((index + appearanceOffset) % 2) - 0.5);
            if (((index % 2) - 0.5) > 0) {
                translate(direction * (1 - factor) * 50, 0);
            } else {
                translate(0, direction * (1 - factor) * 50);
            }
        
            R.globalAlpha *= factor;

            beginPath();
            moveTo(segment[0] * charWidth, segment[1] * charHeight);
            lineTo(segment[2] * charWidth, segment[3] * charHeight);
            stroke();
        });
    });
}

const everyones = stickString([
    // E
    [
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [0, 1 / 2, 1 * 2 / 3, 1 / 2],
        [0, 1, 1, 1]
    ],

    // V
    [
        [0, 0, 1 / 2, 1],
        [1, 0, 1 / 2, 1]
    ],

    // E
    [
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [0, 1 / 2, 1 * 2 / 3, 1 / 2],
        [0, 1, 1, 1]
    ],

    // R
    [
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [1, 0, 1, 1 / 2],
        [0, 1 / 2, 1, 1 / 2],
        [0, 1 / 2, 1, 1]
    ],

    // Y
    [
        [0, 0, 1 / 2, 1 / 2],
        [1 / 2, 1 / 2, 1, 0],
        [1 / 2, 1 / 2, 1 / 2, 1]
    ],

    // O
    [
        [0, 0, 1, 0],
        [0, 1, 1, 1],
        [0, 0, 0, 1],
        [1, 0, 1, 1],
    ],

    // N
    [
        [0, 0, 0, 1],
        [0, 0, 1, 1],
        [1, 0, 1, 1]
    ],

    // E
    [
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [0, 1 / 2, 1 * 2 / 3, 1 / 2],
        [0, 1, 1, 1]
    ],

    // '
    [
        [0, 1 / 4, 1 / 4, 0]
    ],

    // S
    [
        [0, 0, 1, 0],
        [0, 0, 0, 1 / 2],
        [0, 1 / 2, 1, 1 / 2],
        [1, 1 / 2, 1, 1],
        [0, 1, 1, 1],
    ]
], 2 / 5);

const sky = stickString([
    // S
    [
        [0, 0, 1, 0],
        [0, 0, 0, 1 / 2],
        [0, 1 / 2, 1, 1 / 2],
        [1, 1 / 2, 1, 1],
        [0, 1, 1, 1],
    ],

    // K
    [
        [0, 0, 0, 1],
        [1, 0, 0, 1 / 2],
        [1, 1, 0, 1 / 2],
    ],

    // Y
    [
        [0, 0, 1 / 2, 1 / 2],
        [1 / 2, 1 / 2, 1, 0],
        [1 / 2, 1 / 2, 1 / 2, 1]
    ]
], 2 / 5);

const pressEnterToStart = stickString([
    // P
    [
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [1, 0, 1, 1 / 2],
        [0, 1 / 2, 1, 1 / 2],
    ],

    // R
    [
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [1, 0, 1, 1 / 2],
        [0, 1 / 2, 1, 1 / 2],
        [0, 1 / 2, 1, 1]
    ],

    // E
    [
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [0, 1 / 2, 1 * 2 / 3, 1 / 2],
        [0, 1, 1, 1]
    ],

    // S
    [
        [0, 0, 1, 0],
        [0, 0, 0, 1 / 2],
        [0, 1 / 2, 1, 1 / 2],
        [1, 1 / 2, 1, 1],
        [0, 1, 1, 1],
    ],

    // S
    [
        [0, 0, 1, 0],
        [0, 0, 0, 1 / 2],
        [0, 1 / 2, 1, 1 / 2],
        [1, 1 / 2, 1, 1],
        [0, 1, 1, 1],
    ],

    [],

    // E
    [
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [0, 1 / 2, 1 * 2 / 3, 1 / 2],
        [0, 1, 1, 1]
    ],

    // N
    [
        [0, 0, 0, 1],
        [0, 0, 1, 1],
        [1, 0, 1, 1]
    ],

    // T
    [
        [0, 0, 1, 0],
        [1 / 2, 0, 1 / 2, 1]
    ],

    // E
    [
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [0, 1 / 2, 1 * 2 / 3, 1 / 2],
        [0, 1, 1, 1]
    ],

    // R
    [
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [1, 0, 1, 1 / 2],
        [0, 1 / 2, 1, 1 / 2],
        [0, 1 / 2, 1, 1]
    ],

    [],

    // T
    [
        [0, 0, 1, 0],
        [1 / 2, 0, 1 / 2, 1]
    ],

    // O
    [
        [0, 0, 1, 0],
        [0, 1, 1, 1],
        [0, 0, 0, 1],
        [1, 0, 1, 1],
    ],

    [],

    // S
    [
        [0, 0, 1, 0],
        [0, 0, 0, 1 / 2],
        [0, 1 / 2, 1, 1 / 2],
        [1, 1 / 2, 1, 1],
        [0, 1, 1, 1],
    ],

    // T
    [
        [0, 0, 1, 0],
        [1 / 2, 0, 1 / 2, 1]
    ],

    // A
    [
        [0, 1, 1 / 2, 0],
        [1, 1, 1 / 2, 0]
    ],

    // R
    [
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [1, 0, 1, 1 / 2],
        [0, 1 / 2, 1, 1 / 2],
        [0, 1 / 2, 1, 1]
    ],

    // T
    [
        [0, 0, 1, 0],
        [1 / 2, 0, 1 / 2, 1]
    ]
], 2 / 5);

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

            // Game title
            const charWidth = 50;
            const charHeight = 100;
            wrap(() => {
                translate(0, this.titleYOffset);

                R.fillStyle = '#000';
                fr(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

                R.strokeStyle = '#fff';
                R.lineCap = 'round';

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