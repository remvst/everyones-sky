class Mountain extends PlanetaryStation {

    render() {
        R.fillStyle = '#fff';

        // scale(4, 4);

        beginPath();
        moveTo(0, -10);
        lineTo(10, -6);
        lineTo(4, -2);
        lineTo(15, 2);
        lineTo(3, 8);
        lineTo(8, 10);
        lineTo(0, 14);
        fill();

        // fr(0, -2, 20, 4);
    }

}