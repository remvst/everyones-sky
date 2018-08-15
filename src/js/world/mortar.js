class Mortar extends PlanetaryStation {

    render() {
        R.fillStyle = '#f00';

        beginPath();
        arc(0, 0, 10, 0, PI * 2);
        fill();

        fr(0, -2, 20, 4);
    }

}