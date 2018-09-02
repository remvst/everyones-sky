class ReachTarget extends TimedMissionStep {

    constructor(target, prompt) {
        super();
        this.targets = [target];
        this.prompt = prompt;
    }

    instructions() {
        return this.prompt;
    }

    attach() {
        super.attach();

        this.listen(EVENT_CYCLE, () => {
            if (dist(this.targets[0], U.playerShip) < this.targets[0].radius * 3) {
                G.missionDone(true);
            }
        });
    }

}
