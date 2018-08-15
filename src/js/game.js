class Game {

    constructor() {
        if (DEBUG) {
            console.log('Game starting woohoo');
        }

        U = new Universe();
    }

    cycle(e) {
        U.cycle(e);
        INTERPOLATIONS.slice().forEach(i => i.cycle(e));

        U.render();
    }

}