class PlanetaryStation {

    constructor(planet, angleOnPlanet) {
        this.planet = planet;
        this.angleOnPlanet = angleOnPlanet;
        this.radius = 15;

        this.scale = 1;
        this.lastDamage = 0;
    }

    cycle(e) {
        this.x = this.planet.x + (this.planet.radius - 2) * cos(this.angleOnPlanet + this.planet.angle);
        this.y = this.planet.y + (this.planet.radius - 2) * sin(this.angleOnPlanet + this.planet.angle);
    }

    render() {
        const damageFactor = 1 - limit(0, G.clock - this.lastDamage, 0.1) / 0.1;

        scale(1 + damageFactor * 0.2, 1 + damageFactor * 0.2);
        
        R.fillStyle = damageFactor > 0 ? '#fff' : '#f00';
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

        // interp(this, 'scale', 1.2, 1, 0.2);

        this.lastDamage = G.clock;
    }

}