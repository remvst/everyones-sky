class Factory extends PlanetaryStation {

    render() {
        R.fillStyle = '#f00';

        // scale(4, 4);

        beginPath();
        moveTo(0, -10);
        lineTo(10, -10);
        lineTo(7, -2);
        lineTo(10, -2);
        lineTo(7, 6);
        lineTo(18, 6);
        lineTo(18, 9);
        lineTo(0, 9);
        fill();

        // fr(0, -2, 20, 4);
    }

}