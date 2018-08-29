class PromptMission extends MissionStep {

    constructor(missionStep) {
        super();
        this.missionStep = missionStep;
    }

    attach() {
        G.showPrompt(nomangle('Incoming communication from ') + this.missionStep.civilization.center.nameWithRelationship(), [{
            'label': 'Respond',
            'action': () => {
                G.showPrompt(this.missionStep.prompt, [{
                    'label': 'Accept',
                    'action': () => this.proceed(this.missionStep)
                }, {
                    'label': 'Refuse',
                    'action': () => this.proceed()
                }]);
            }
        }, {
            'label': 'Ignore',
            'action': () => this.proceed()
        }]);
    }

}