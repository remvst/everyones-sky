class ResourceItem extends Item {

    renderGraphic() {
        scale(0.3, 0.3);

        R.fillStyle = '#fff';
        beginPath();
        moveTo(0, 20)
        lineTo(20, -10);
        lineTo(10, -20);
        lineTo(-10, -20);
        lineTo(-20, -10);
        fill();
    }

}