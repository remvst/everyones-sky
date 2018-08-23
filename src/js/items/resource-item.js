class ResourceItem extends Item {

    renderGraphic() {
        scale(0.3, 0.3);

        R.fillStyle = '#fff';
        renderResourcesIcon();
    }

    pickUp(ship) {
        ship.planet.resources = min(MAX_PLANET_RESOURCES, ship.planet.resources + 1);
    }

}