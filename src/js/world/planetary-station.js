class PlanetaryStation {

    constructor(planet, angleOnPlanet) {
        this.planet = planet;
        this.angleOnPlanet = angleOnPlanet;
        this.radius = 15;
    }

    cycle(e) {
        this.x = this.planet.x + (this.planet.radius - 2) * cos(this.angleOnPlanet + this.planet.angle);
        this.y = this.planet.y + (this.planet.radius - 2) * sin(this.angleOnPlanet + this.planet.angle);
    }

    // For reference only
    // render() {

    // }

    damage() {
        console.log('hit!');
    }

}