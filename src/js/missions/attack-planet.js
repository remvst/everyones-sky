class AttackPlanet extends TimedMissionStep {

    constructor(planet) {
        super();
        this.planet = planet;
        this.prompt = nomangle('Destroy facilities on ') + planet.nameWithRelationship();
        this.targets = [planet];

        this.destroyedStations = 0;
        this.stationsToDestroy = min(this.planet.stations.length, ~~rnd(3, 5));
    }

    instructions() {
        return nomangle('Facilities destroyed: ') + this.destroyedStations + '/' + this.stationsToDestroy;
    }

    attach() {
        super.attach();

        this.listen(EVENT_STATION_DESTROYED, station => {
            if (station.planet === this.planet) {
                this.destroyedStations++;
                if (this.destroyedStations >= this.stationsToDestroy) {
                    G.missionDone(true);
                }
            }
        });
    }

}
