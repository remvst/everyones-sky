class Mortar extends PlanetaryStation {

    constructor(planet, angleOnPlanet) {
        super(planet, angleOnPlanet);
        this.shootAngle = 0;
    }

    renderGraphic() {
        beginPath();
        arc(0, 0, 10, 0, PI * 2);
        fill();

        rotate(this.shootAngle);
        fr(0, -2, 20, 4);
    }

    cycle(e) {
        super.cycle(e);

        // Smooth angle transition
        const angleToPlayer = normalize(atan2(U.playerShip.y - this.y, U.playerShip.x - this.x) - this.globalAngle);
        const targetAngle = limit(-PI / 4, angleToPlayer, PI / 4);
        const maxRotation = e * PI / 4;
        this.shootAngle += limit(-maxRotation, targetAngle - this.shootAngle, maxRotation);

        if (abs(normalize(this.shootAngle - angleToPlayer)) < PI / 64) {
            this.shoot();
        }
    }

    shoot() {
        if (G.clock - (this.lastShot || 0) < 0.2) {
            return;
        }

        this.lastShot = G.clock;

        U.projectiles.push(new Laser(this, this.x, this.y, this.globalAngle + this.shootAngle));
    }

}