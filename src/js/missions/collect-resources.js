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
            U.playerShip.civilization.resources--; // make sure the player doesn't get these resources

            if (++this.collectedResources >= this.requiredResources) {
                const step = new ReachTarget(this.civilization.center, nomangle('Return to ') + this.civilization.center.name);
                step.civilization = this.civilization;
                this.proceed(step);

                step.timeleft = this.timeleft;
            }
        });
    }

}
