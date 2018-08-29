class Pirates extends TimedMissionStep {

    constructor() {
        super();
        this.prompt = nomangle('Help us fight these pirates');
    }

    instructions() {
        return nomangle('Destroy the pirate ships');
    }

    attach() {
        super.attach();

        const pirates = U.createPirateGroup(
            this.civilization.center.orbitsAround.x + pick([-1, 1]) * (this.civilization.center.orbitsAround.reachRadius + 800 ),
            this.civilization.center.y + rnd(-5000, 5000)
        );

        this.listen(EVENT_CYCLE, () => {
            this.targets = pirates.filter(ship => ship.health > 0);

            if (!this.targets.length) {
                G.missionDone(true);
            }
        });
    }

}
