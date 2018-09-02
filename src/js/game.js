class Game {

    constructor() {
        G = this;

        U = new Universe();

        V = new Camera();
        G.setupNewGame();

        G.clock = 0;
        // G.promptClock = 0; // for reference

        // G.message = null; // for reference
        // G.messageProgress = 0; // for reference

        // G.missionStep = null; // for reference

        G.titleStickString = stickString(nomangle('everyone\'s'));
        G.subtitleStickString = stickString(nomangle('sky'));
        G.instructionsStickString = stickString(nomangle('press enter to send a ship'));

        G.titleCharWidth = G.subtitleCharWidth = 50;
        G.titleCharHeight = G.subtitleCharHeight = 100;

        G.startedOnce = false;
        G.startable = true;

        G.resourceIconOffsetY = 0;
        G.resourceIconScale = 1;
        G.resourceIconAlpha = 1;
        G.healthIconScale = 1;

        G.healthGaugeColor = '#fff';
    }

    proceedToMissionStep(missionStep) {
        if (G.missionStep) {
            G.missionStep.detach();
        }

        G.missionStep = missionStep;
        G.nextMission = 20;

        G.showPrompt();

        if (!missionStep) {
            return;
        }

        missionStep.proceedListener = missionStep => G.proceedToMissionStep(missionStep);
        missionStep.attach();
    }

    renderGauge(x, y, ratio, color, renderIcon) {
        wrap(() => {
            translate(x, y);

            fs('rgba(128,128,128,0.5)');
            fr(0, -5, 200, 10);

            fs(color);
            fr(0, -5, -2, 10);
            fr(200, -5, 2, 10);

            fr(0, -5, 200 * limit(0, ratio, 1), 10);

            translate(-25, 0);
            renderIcon();
        });
    }

    healAnimation(callback) {
        interp(G, 'resourceIconOffsetY', 0, -30, 0.3, 0, 0, () => {
            G.resourceIconOffsetY = 0;
        });

        interp(G, 'healthIconScale', 1, 2, 0.3, 0.2, 0, () => {
            interp(G, 'healthIconScale', 2, 1, 0.3, 0, 0, () => {
                G.healthGaugeColor = '#fff';
            });
        });

        setTimeout(() => G.healthGaugeColor = '#0f0', 200);

        interp(G, 'resourceIconScale', 1, 0, 0.3, 0, 0, () => {
            G.resourceIconScale = 1;
            callback();
        });

        interp(G, 'resourceIconAlpha', 1, 0, 0.3, 0, 0, () => {
            interp(G, 'resourceIconAlpha', 0, 1, 0.3, 0.3);
        });
    }

    resourceAnimation() {
        interp(G, 'resourceIconScale', 1, 2, 0.3, 0, 0, () => {
            interp(G, 'resourceIconScale', 2, 1, 0.3);
        });

        // interp(G, 'resourceIconAlpha', 1, 0, 0.3, 0, 0, () => {
        //     interp(G, 'resourceIconAlpha', 0, 1, 0.1);
        // });
    }

    cycle(e) {
        G.clock += e;

        if (G.started) {
            if ((G.nextMission -= e) <= 0) {
                G.promptRandomMission();
            }

            U.cycle(e);
            G.eventHub.emit(EVENT_CYCLE, e);
        }

        INTERPOLATIONS.slice().forEach(i => i.cycle(e));

        if (w.down[13]) {
            G.start();
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

            fs('rgba(0,0,0,0.5)');
            R.strokeStyle = '#fff';
            fr(50, 30, 270, 100);
            strokeRect(50.5, 30.5, 270, 100);

            G.renderGauge(100, 50, U.playerShip.health, (U.playerShip.health < 0.25 || G.clock - U.playerShip.lastDamage < 0.2) ? '#f00' : G.healthGaugeColor, () => {
                scale(0.5 * G.healthIconScale, 0.5 * G.healthIconScale);
                beginPath();
                moveTo(0, -15);
                lineTo(14, -10);
                lineTo(10, 10);
                lineTo(0, 18);
                lineTo(-10, 10);
                lineTo(-14, -10);
                fill();
            });

            G.renderGauge(100, 80, U.playerShip.civilization.resources / PLANET_MAX_RESOURCES, '#fff', () => {
                R.globalAlpha = G.resourceIconAlpha;

                translate(0, G.resourceIconOffsetY);
                scale(0.3 * G.resourceIconScale, 0.3 * G.resourceIconScale);
                renderResourcesIcon();
            });

            G.renderGauge(100, 110, U.playerShip.heat, U.playerShip.coolingDown ? '#f00' : '#fff', () => {
                fr(-5, -5, 3, 10);
                fr(-1, -5, 3, 10);
                fr(3, -5, 3, 10);
            });

            // Rendering targets
            let targets = [];

            if (G.missionStep) {
                targets = G.missionStep.targets || [];
                // (G.missionStep.targets || []).forEach(target => wrap(() => {
                //     U.transformToCamera();

                //     R.lineWidth = 4;
                //     R.strokeStyle = '#fff';
                //     R.globalAlpha = 0.1;

                //     setLineDash([20, 20]);
                //     beginPath();
                //     moveTo(U.playerShip.x, U.playerShip.y);
                //     lineTo(target.x, target.y);
                //     stroke();
                // }));
            } else {
                const closestStars = U.stars.sort((a, b) => {
                    return dist(a, U.playerShip) - dist(b, U.playerShip);
                }).slice(0, 3);

                if (closestStars[0]) {
                    if (dist(closestStars[0], U.playerShip) > closestStars[0].reachRadius) {
                        targets = closestStars;
                    } else if (!closestStars[0].systemDiscovered) {
                        closestStars[0].systemDiscovered = true;
                        G.showMessage(nomangle('system discovered - ') + closestStars[0].name);
                    }
                }
            }

            targets.forEach(target => {
                if (dist(target, U.playerShip) < (target.reachRadius || 0)) {
                    return;
                }

                const angle = angleBetween(U.playerShip, target);

                wrap(() => {
                    const distanceOnCircle = limit(0, (dist(target, U.playerShip) - target.reachRadius) / 4000, 1) * 200 + 50;

                    translate(CANVAS_WIDTH / 2 + cos(angle) * distanceOnCircle, CANVAS_HEIGHT / 2 + sin(angle) * distanceOnCircle);
                    rotate(angle);

                    R.globalAlpha = 0.5;
                    fs('#fff');
                    beginPath();
                    moveTo(0, 0);
                    lineTo(-14, 10);
                    lineTo(-8, 0);
                    lineTo(-14, -10);
                    fill();
                });
            });

            // Prompt
            const promptText = G.promptText();
            if (promptText) {
                wrap(() => {
                    fs('rgba(0,0,0,0.5)');
                    R.font = '20pt ' + monoFont;

                    translate(0, CANVAS_HEIGHT - (isTouch ? 400 : 200));
                    fr(0, 0, CANVAS_WIDTH, 200);

                    const textWidth = measureText(promptText + '_').width;
                    const actualText = this.currentPromptText();

                    fs('#fff');
                    R.textAlign = nomangle('left');
                    if (!G.selectedPromptOption) {
                        fillText(actualText, (CANVAS_WIDTH - textWidth) / 2, 50);
                    }

                    if (actualText.length >= promptText.length) {
                        R.textAlign = nomangle('center');
                        R.textBaseline = nomangle('middle');
                        R.font = '16pt ' + monoFont;

                        G.promptOptions.forEach((option, i) => {
                            fs('#fff');

                            if (G.selectedPromptOption) {
                                if (G.selectedPromptOption != option) {
                                    return;
                                }

                                R.globalAlpha = (sin(G.clock * PI * 2 * 4) + 1) / 2;
                            }

                            const promptText = '[' + option.label[0] + ']' + option.label.slice(1);
                            const x = (i + 1) * (CANVAS_WIDTH / (G.promptOptions.length + 1));

                            fr(x - PROMPT_OPTION_BOX_WIDTH / 2, 100 - PROMPT_OPTION_BOX_HEIGHT / 2, PROMPT_OPTION_BOX_WIDTH, PROMPT_OPTION_BOX_HEIGHT);

                            R.globalAlpha = 1;
                            fs('#000');
                            fillText(promptText, x, 100);
                        });
                    }
                });
            }

            const currentWarning = U.playerShip.currentWarning();
            if (currentWarning && currentWarning != G.currentWarning) {
                G.currentWarningEnd = G.clock + 3;
                G.currentWarning = currentWarning;

                warningSound();
            }

            if (!currentWarning) {
                G.currentWarning = 0;
            }

            if (G.currentWarning && G.clock < G.currentWarningEnd) {
                fs('rgba(255,0,0,0.5)');
                fr(0, 200, CANVAS_WIDTH, 125);

                R.font = '36pt ' + monoFont;
                R.textBaseline = 'middle';
                R.textAlign = nomangle('center');
                fs('#fff');
                fillText(nomangle('/!\\ WARNING /!\\'), CANVAS_WIDTH / 2, 250);

                R.font = '18pt ' + monoFont;
                fillText(G.currentWarning, CANVAS_WIDTH / 2, 300);

                G.message = 0; // don't want to have a warning and a message at the same time
            }

            R.strokeStyle = '#fff';
            R.lineCap = 'round';

            // Message
            if (G.message && G.messageProgress) {
                wrap(() => {
                    R.lineWidth = 4;

                    const messageWidth = G.message.width * 20;
                    translate((CANVAS_WIDTH - messageWidth) / 2, (CANVAS_HEIGHT - 100) / 2 - 200);
                    renderStickString(G.message, 20, 30, G.messageProgress, 0.1, 1);
                });
            }

            // Game title
            wrap(() => {
                translate(0, G.titleYOffset);

                fs('#000');
                fr(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

                R.lineWidth = 8;

                const everyonesY = (CANVAS_HEIGHT - G.titleCharHeight * (G.titleStickString.height + 2 / 5 + G.subtitleStickString.height)) / 2;
                wrap(() => {
                    translate((CANVAS_WIDTH - G.titleStickString.width * G.titleCharWidth) / 2, everyonesY);
                    renderStickString(G.titleStickString, G.titleCharWidth, G.titleCharHeight, G.clock - 0.5, 0.1, 1);
                });

                wrap(() => {
                    R.lineWidth = G.subtitleCharThickness;
                    translate((CANVAS_WIDTH - G.subtitleStickString.width * G.subtitleCharWidth) / 2, everyonesY + G.titleCharHeight * G.subtitleStickString.height * 7 / 5);
                    renderStickString(G.subtitleStickString, G.subtitleCharWidth, G.subtitleCharHeight, G.clock - 0.5, 0.1 * (G.titleStickString.segments.length / G.subtitleStickString.segments.length), 1);
                });

                R.lineWidth = 4;

                const instructionCharWidth = 20;
                const instructionCharHeight = 30;
                wrap(() => {
                    if (G.clock % 1 > 0.5 && G.clock > 6 || G.titleYOffset) {
                        return;
                    }

                    translate((CANVAS_WIDTH - G.instructionsStickString.width * instructionCharWidth) / 2, CANVAS_HEIGHT - instructionCharHeight - 100);
                    renderStickString(G.instructionsStickString, instructionCharWidth, instructionCharHeight, G.clock - 5, 0.01, 0.2);
                });

                R.font = '20pt Mono';
                fs('#fff');
                R.textAlign = nomangle('center');

                G.gameRecap.forEach((line, i) => {
                    fillText(line, CANVAS_WIDTH / 2, CANVAS_HEIGHT * 3 / 4 - 50 + i * 30);
                });
            });
        });

        // Touch controls
        wrap(() => {
            if (!isTouch) {
                return;
            }

            translate(0, CANVAS_HEIGHT - 200);

            R.globalAlpha = 0.8;
            fs('#000');
            fr(0, 0, CANVAS_WIDTH, 200);

            fs('#fff');

            translate(0, 100);

            wrap(() => {
                R.globalAlpha = w.down[37] ? 1 : 0.5;

                translate(CANVAS_WIDTH * 1 / 8, 0);
                rotate(PI);

                G.mobileArrow();
            });

            wrap(() => {
                R.globalAlpha = w.down[39] ? 1 : 0.5;

                translate(CANVAS_WIDTH * 3 / 8, 0);

                G.mobileArrow();
            });

            wrap(() => {
                R.globalAlpha = w.down[32] ? 1 : 0.5;

                translate(CANVAS_WIDTH * 5 / 8, 0);

                beginPath();
                moveTo(0, 0);
                arc(0, 0, MOBILE_BUTTON_SIZE / 2, 0, PI * 2);
                fill();
            });

            wrap(() => {
                R.globalAlpha = w.down[38] ? 1 : 0.5;

                translate(CANVAS_WIDTH * 7 / 8, 0);
                rotate(-PI / 2);

                G.mobileArrow();
            });
        });

        if (DEBUG) {
            wrap(() => {
                R.font = '10pt ' + monoFont;
                fs('#fff');

                const info = [
                    'fps: ' + G.fps,
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

    mobileArrow() {
        beginPath();
        moveTo(MOBILE_BUTTON_SIZE / 2, 0);
        lineTo(-MOBILE_BUTTON_SIZE / 2, -MOBILE_BUTTON_SIZE / 2);
        lineTo(-MOBILE_BUTTON_SIZE / 2, MOBILE_BUTTON_SIZE / 2);
        fill();
    }

    showPrompt(promptText, options) {
        G.promptText = promptText && promptText.call ? promptText : () => promptText;
        G.promptClock = G.clock;
        G.promptOptions = options || [];
        G.selectedPromptOption = null;

        if (G.promptText()) {
            promptSound();
        }
    }

    selectPromptOption(characterOrIndex) {
        const actualText = G.currentPromptText();
        if (actualText.length < (G.promptText() || '').length && isTouch || G.selectedPromptOption) {
            return;
        }

        (G.promptOptions || []).forEach((option, i) => {
            if (i == characterOrIndex || option.label[0].toLowerCase() === characterOrIndex) {
                G.selectedPromptOption = option;
                setTimeout(option.action, 500); // add a short delay so we can show that the option was selected
                selectSound();
            }
        });
    }

    showMessage(message) {
        G.message = stickString(message);
        interp(G, 'messageProgress', G.message.segments.length, 0, G.message.segments.length * 0.1, 3);
        interp(G, 'messageProgress', 0, G.message.segments.length, G.message.segments.length * 0.1);

        findSytemSound();
    }

    promptRandomMission() {
        // Missions only come from the closest planet
        const planet = U.bodies
            .filter(body => body.orbitsAround)
            .reduce((closest, body) => !closest || dist(U.playerShip, body) < dist(U.playerShip, closest) ? body : closest, null);

        if (planet && !G.missionStep) {
            // Pick another planet that's not too far yet not too close
            const otherPlanet = pick(U.bodies.filter(body => body.orbitsAround && between(1000, dist(body, planet), 10000)));

            const missionStep = pick([
                new AttackPlanet(otherPlanet),
                new StudyBody(otherPlanet),
                new CollectResources(),
                new Asteroids(),
                new Pirates()
            ]);
            missionStep.civilization = planet.civilization;

            G.proceedToMissionStep(new PromptMission(missionStep));

            for (let i = 0, d = max(planet.radius, dist(U.playerShip, planet) - V.width) ; d < dist(U.playerShip, planet) ; i++, d += 50) {
                const angle = angleBetween(planet, U.playerShip);
                // const particle = {
                //     'alpha': 0,
                //     'render': () => wrap()
                // };
                // U.particles.push(particle);

                particle(0, 0, [
                    ['alpha', 1, 0, 0.1, i * 0.02 + 0.2],
                    ['alpha', 0, 1, 0.1, i * 0.02]
                ], particle => {
                    R.strokeStyle = '#fff';
                    R.lineWidth = 2;
                    R.globalAlpha = particle.alpha;
                    beginPath();
                    arc(planet.x, planet.y, d, angle - PI / 16, angle + PI / 16);
                    stroke();
                });
            }
        }

    }

    missionDone(success) {
        const missionStep = G.missionStep;
        G.proceedToMissionStep();

        missionStep.civilization.updateRelationship(success ? RELATIONSHIP_UPDATE_MISSION_SUCCESS : RELATIONSHIP_UPDATE_MISSION_FAILED);

        G.showPrompt(nomangle('Mission ') + (success ? nomangle('SUCCESS') : nomangle('FAILED')) + '. ' + missionStep.civilization.center.name + nomangle(' will remember that.'), [{
            'label': nomangle('Dismiss'),
            'action': () => G.showPrompt()
        }]);
    }

    start() {
        if (G.started || !G.startable) {
            return;
        }

        U.createPlayerShip();

        interp(G, 'titleYOffset', 0, -CANVAS_HEIGHT, 0.3);

        if (!G.startedOnce) {
            V.zoomScale = V.targetScaleOverride = 1;
            setTimeout(() => G.proceedToMissionStep(new PromptTutorialStep()), 3000);
        }

        G.nextMission = G.startedOnce ? 20 : 9;
        G.started = G.startedOnce = true;

        introSound();
    }

    gameOver() {
        const civilizations = U.bodies
            .filter(body => body.civilization && body.civilization.relationshipType() != body.civilization.initialRelationship)
            .map(body => body.civilization);

        const enemiesMade = civilizations.filter(civilization => civilization.relationshipType() == RELATIONSHIP_ENEMY).length;
        const alliesMade = civilizations.filter(civilization => civilization.relationshipType() == RELATIONSHIP_ALLY).length;

        let subtitle;
        if (enemiesMade + alliesMade < GAME_RECAP_MIN_RELATIONSHIP_CHANGES) {
            subtitle = nomangle('you were barely noticed');
        } else if (abs(enemiesMade - alliesMade) < GAME_RECAP_RELATIONSHIP_CHANGES_NEUTRAL_THRESHOLD) {
            subtitle = nomangle('little has changed');
        } else if (enemiesMade > alliesMade) {
            subtitle = nomangle('you brought war');
        } else {
            subtitle = nomangle('you brought peace');
        }

        G.titleStickString = stickString(nomangle('game over'));
        G.subtitleStickString = stickString(subtitle);
        G.instructionsStickString = stickString(nomangle('press enter to send another ship'));

        G.subtitleCharWidth = 25;
        G.subtitleCharHeight = 50;
        G.subtitleCharThickness = 6;

        G.startable = G.started = false;

        G.clock = 0;

        interp(G, 'titleYOffset', -CANVAS_HEIGHT, 0, 0.3, 0, 0, () => G.setupNewGame());

        setTimeout(() => {
            G.gameRecap = [
                enemiesMade + nomangle(' planets have declared war against us.'),
                alliesMade + nomangle(' species are now our allies.')
            ];
            G.startable = true;
        }, 4000);
    }

    setupNewGame() {
        G.eventHub = new EventHub();

        G.promptText = () => 0;

        G.started = false;

        G.titleYOffset = 0;

        G.missionStep = 0;
        G.currentWarning = 0;

        G.gameRecap = [];
    }

    currentPromptText() {
        const promptText = G.promptText() || '';
        const length = ~~min((G.clock - G.promptClock) * 20, promptText.length);
        return promptText.slice(0, length) + (length < promptText.length || (G.clock % 1) > 0.5 ? '_' : '');
    }

}
