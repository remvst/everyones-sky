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
        
        R.fillStyle = damageFactor > 0 ? '#fff' : this.planet.civilization.relationshipType();
        this.renderGraphic();
    }
    
    // // For reference only
    // renderGraphic() {

    // }

    damage() {
        particle(10, '#ff0', [
            ['alpha', 1, 0, 1],
            ['size', rnd(2, 4), rnd(5, 10), 1],
            ['x', this.x, this.x + rnd(-20, 20), 1],
            ['y', this.y, this.y + rnd(-20, 20), 1]
        ]);

        this.lastDamage = G.clock;

        const item = new ResourceItem();
        U.items.push(item);
        interp(item, 'x', this.x, this.x + cos(this.globalAngle) * 50 + rnd(-20, 20), 0.3);
        interp(item, 'y', this.y, this.y + sin(this.globalAngle) * 50 + rnd(-20, 20), 0.3);

        this.planet.civilization.updateRelationship(RELATIONSHIP_UPDATE_DAMAGE_STATION);

        if ((this.health -= 0.1) <= 0) {
            this.explode();
        }
    }

    explode() {
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

        this.planet.civilization.updateRelationship(RELATIONSHIP_UPDATE_DESTROY_STATION);

        G.eventHub.emit(EVENT_STATION_DESTROYED, this);
    }

}