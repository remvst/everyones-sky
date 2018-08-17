class Game {

    constructor() {
        if (DEBUG) {
            console.log('Game starting woohoo');
        }

        U = new Universe();
        V = new Camera();

        this.clock = 0;
    }

    cycle(e) {
        this.clock += e;

        U.cycle(e);
        INTERPOLATIONS.slice().forEach(i => i.cycle(e));

        U.render();
    }

}