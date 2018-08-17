class HealthItem extends Item {

    renderGraphic() {
        scale(0.3, 0.3);

        R.fillStyle = '#fff';
        beginPath();
        moveTo(0, -15)
        lineTo(14, -10);
        lineTo(10, 10);
        lineTo(0, 18);
        lineTo(-10, 10);
        lineTo(-14, -10);
        fill();
    }

    pickUp(ship) {
        ship.health = min(1, ship.health + 0.05);
    }

}