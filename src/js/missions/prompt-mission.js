class PromptMission extends MissionStep {

    constructor(missionStep) {
        super();
        this.missionStep = missionStep;
    }

    attach() {
        super.attach();

        let timeleft = 15;
        this.listen(EVENT_CYCLE, e => {
            if ((timeleft -= e) < 0) {
                this.proceed();
            }
        });

        G.showPrompt(() => nomangle('Incoming communication from ') + this.missionStep.civilization.center.nameWithRelationship() + ' - ' + formatTime(timeleft), [{
            'label': nomangle('Respond'),
            'action': () => {
                timeleft = 15;
                G.showPrompt(() => this.missionStep.prompt + ' - ' + formatTime(timeleft), [{
                    'label': nomangle('Accept'),
                    'action': () => this.proceed(this.missionStep)
                }, {
                    'label': nomangle('Refuse'),
                    'action': () => this.proceed()
                }]);
            }
        }, {
            'label': nomangle('Ignore'),
            'action': () => this.proceed()
        }]);
    }

}
