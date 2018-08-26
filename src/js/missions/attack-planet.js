class AttackPlanet extends MissionStep {

    constructor(planet) {
        super();
        this.planet = planet;
        this.prompt = nomangle('Help us fight ') + planet.name.toUpperCase() + nomangle(', destroy some of their stations');
        this.targets = [planet];
    }

    attach() {
        let stationsRemaining = min(this.planet.stations.length, ~~rnd(3, 5));
        G.showPrompt(nomangle('Destroy ') + stationsRemaining + nomangle(' stations on ') + this.planet.name.toUpperCase());

        this.listen(EVENT_STATION_DESTROYED, station => {
            if (station.planet === this.planet && !--stationsRemaining) {
                G.missionDone(true);
            }
        })
    }

}
