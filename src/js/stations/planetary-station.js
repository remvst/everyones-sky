class PlanetaryStation {

    constructor(planet, angleOnPlanet) {
        this.planet = planet;
        this.angleOnPlanet = angleOnPlanet;
        this.radius = 15;

        this.scale = 1;
        this.lastDamage = 0;

        this.health = 1;
    }

    get globalAngle() {
        return this.angleOnPlanet + this.planet.angle;
    }

    cycle(e) {
        this.x = this.planet.x + (this.planet.radius - 2) * cos(this.globalAngle);
        this.y = this.planet.y + (this.planet.radius - 2) * sin(this.globalAngle);
    }

    render() {
        const damageFactor = 1 - limit(0, G.clock - this.lastDamage, 0.1) / 0.1;

        scale(1 + damageFactor * 0.2, 1 + damageFactor * 0.2);

        fs(damageFactor > 0 ? '#fff' : this.planet.civilization.relationshipType());
        this.renderGraphic();
    }

    // // For reference only
    // renderGraphic() {

    // }

    damage(source, amount) {
        particle(10, '#ff0', [
            ['alpha', 1, 0, 1],
            ['size', rnd(2, 4), rnd(5, 10), 1],
            ['x', this.x, this.x + rnd(-20, 20), 1],
            ['y', this.y, this.y + rnd(-20, 20), 1]
        ]);

        this.lastDamage = G.clock;

        if (source == U.playerShip) {
            this.planet.civilization.updateRelationship(RELATIONSHIP_UPDATE_DAMAGE_STATION);
        }

        if ((this.health -= amount) <= 0) {
            this.explode(source);
        }
    }

    explode(source) {
        for (let i = 0 ; i < 50 ; i++) {
            const angle = this.globalAngle + rnd(-PI / 2, PI / 2);
            const distance = rnd(30, 50);

            particle(10, pick(['#ff0', '#f80', '#f00']), [
                ['alpha', 1, 0, 1],
                ['size', rnd(2, 4), rnd(5, 10), 1],
                ['x', this.x, this.x + cos(angle) * distance, 1],
                ['y', this.y, this.y + sin(angle) * distance, 1]
            ]);
        }

        U.remove(this.planet.stations, this);

        if (source == U.playerShip) {
            this.planet.civilization.updateRelationship(RELATIONSHIP_UPDATE_DESTROY_STATION);
        }

        G.eventHub.emit(EVENT_STATION_DESTROYED, this);

        U.dropResources(this.x, this.y, 15);
    }

}
