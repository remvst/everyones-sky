class CollectResources extends TimedMissionStep {

    constructor() {
        super();

        this.prompt = nomangle('Collect some resources for us');

        this.requiredResources = 100;
        this.collectedResources = 0;
    }

    instructions() {
        return nomangle('Collect resources - ') + this.collectedResources + '/' + this.requiredResources;
    }

    attach() {
        super.attach();

        this.listen(EVENT_PICKUP_RESOURCE, () => {
            U.playerShip.civilization.resources--; // make sure the player doesn't get these resources

            if (++this.collectedResources >= this.requiredResources) {
                this.reach(this.civilization.center, nomangle('Return to ') + this.civilization.center.name);
            }
        });
    }

}
