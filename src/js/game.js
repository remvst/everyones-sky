class Game {

    constructor() {
        if (DEBUG) {
            console.log('Game starting woohoo');
        }

        U = new Universe();
        V = new Camera();

        this.clock = 0;
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

                R.fillStyle = '#fff';
                beginPath();
                moveTo(0, 20)
                lineTo(20, -10);
                lineTo(10, -20);
                lineTo(-10, -20);
                lineTo(-20, -10);
                fill();
            });

            this.renderGauge(100, 110, U.playerShip.heat, U.playerShip.coolingDown ? '#f00' : '#fff', () => {
                fr(-5, -5, 3, 10);
                fr(-1, -5, 3, 10);
                fr(3, -5, 3, 10);
            });

            let targets = [];

            targets = U.stars.sort((a, b) => {
                return dist(a, U.playerShip) - dist(b, U.playerShip);
            }).slice(0, 3);

            // If we are in a system, no need to show nearby systems
            if (dist(targets[0], U.playerShip) < targets[0].reachRadius) {
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
                    lineTo(-7, 5);
                    lineTo(-2, 0);
                    lineTo(-7, -5);
                    fill();
                });
            });
        });
    }

}