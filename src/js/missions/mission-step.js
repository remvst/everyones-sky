class MissionStep {

    constructor() {
        this.listeners = [];
    }

    attach() {
        // To be overridden
    }

    detach() {
        // Stop listening to all events
        this.listeners.forEach(listener => G.eventHub.ignore(listener.event, listener.listener));
        this.listeners = [];
    }

    listen(event, listener) {
        this.listeners.push({'event': event, 'listener': listener});
        G.eventHub.listen(event, listener);
    }

    start() {
        this.attach();
    }

    proceed(nextStep) {
        this.detach();

        if (this.proceedListener) {
            this.proceedListener(nextStep);
        }
    }

}