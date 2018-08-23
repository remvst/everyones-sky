class EventHub {

    constructor() {
        this.listeners = {};
    }

    emit(event, eventData) {
        (this.listeners[event] || []).forEach(listener => listener(eventData));
    }

    listen(event, listener) {
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push(listener);
    }

    ignore(event, listener) {
        const index = (this.listeners[event] || []).indexOf(listener);
        if (index >= 0) {
            this.listeners[event].splice(index, 1);
        }
    }

}