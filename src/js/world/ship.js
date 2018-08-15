class Ship {

    constructor() {
        this.x = 0;
        this.y = 0;
    }

    cycle(e) {

    }

    render() {
        wrap(() => {
            R.fillStyle = '#080';
            translate(this.x, this.y);
            beginPath();
            moveTo(0, 0);
            lineTo(-5, 10);
            lineTo(25, 0);
            lineTo(-5, -10);
            fill();
        });
    }

}