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
        const angleToPlayer = normalize(angleBetween(this, U.playerShip) - this.globalAngle);
        const targetAngle = limit(-PI / 4, angleToPlayer, PI / 4);
        const maxRotation = e * PI / 4;
        this.shootAngle += limit(-maxRotation, targetAngle - this.shootAngle, maxRotation);

        if (abs(normalize(this.shootAngle - angleToPlayer)) < PI / 64 && this.planet.civilization.relationshipType() === RELATIONSHIP_ENEMY) {
            this.shoot();
        }
    }

    shoot() {
        if (G.clock - (this.lastShot || 0) < 1) {
            return;
        }

        this.lastShot = G.clock;

        const angle = this.globalAngle + this.shootAngle;
        U.projectiles.push(new SuperLaser(this, this.x + cos(angle) * this.radius, this.y + sin(angle) * this.radius, angle));
    }

}