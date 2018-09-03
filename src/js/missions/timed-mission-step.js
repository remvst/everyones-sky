class TimedMissionStep extends MissionStep {

    attach() {
        this.timeleft = 120;
        this.listen(EVENT_CYCLE, e => {
            if ((this.timeleft -= e) < 0) {
                G.missionDone(false);
            }
        });

        G.showPrompt(() => this.instructions() + ' - ' + formatTime(this.timeleft));
    }

    reach(target, prompt) {
        const step = new ReachTarget(target, prompt);
        step.civilization = this.civilization;
        this.proceed(step);

        step.timeleft = this.timeleft;
    }

}
