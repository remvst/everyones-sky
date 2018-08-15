class PlanetaryStation {

    constructor(planet, angleOnPlanet) {
        this.planet = planet;
        this.angleOnPlanet = angleOnPlanet;
    }

    cycle(e) {
        this.x = this.planet.x + this.planet.radius * cos(this.angleOnPlanet + this.planet.angle);
        this.y = this.planet.y + this.planet.radius * sin(this.angleOnPlanet + this.planet.angle);
    }

    // For reference only
    // render() {

    // }

}