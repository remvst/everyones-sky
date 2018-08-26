class Mountain extends PlanetaryStation {

    renderGraphic() {
        beginPath();
        moveTo(0, -10);
        lineTo(10, -6);
        lineTo(4, -2);
        lineTo(15, 2);
        lineTo(3, 8);
        lineTo(8, 10);
        lineTo(0, 14);
        fill();
    }

}