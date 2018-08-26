class AttackPlanet extends TimedMissionStep {

    constructor(planet) {
        super();
        this.planet = planet;
        this.prompt = nomangle('Help us fight ') + planet.name.toUpperCase() + nomangle(', destroy some of their stations');
        this.maxTime = 120;
        this.targets = [planet];

        this.stationsToDestroy = min(this.planet.stations.length, ~~rnd(3, 5));
    }

    instructions() {
        return nomangle('Destroy ') + this.stationsToDestroy + nomangle(' stations on ') + this.planet.name.toUpperCase();
    }

    attach() {
        super.attach();

        this.listen(EVENT_STATION_DESTROYED, station => {
            if (station.planet === this.planet && !--this.stationsToDestroy) {
                G.missionDone(true);
            }
        });
    }

}
