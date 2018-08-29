class CollectResources extends TimedMissionStep {

    constructor() {
        super();

        this.prompt = nomangle('We need resources, please collect some for us');

        this.requiredResources = 50;
        this.collectedResources = 0;
    }

    instructions() {
        return nomangle('Collect resources - ') + this.collectedResources + '/' + this.requiredResources;
    }

    attach() {
        super.attach();

        this.listen(EVENT_PICKUP_RESOURCE, () => {
            if (++this.collectedResources >= this.requiredResources) {
                U.playerShip.civilization -= this.requiredResources;
                G.missionDone(true);
            }
        });
    }

}
