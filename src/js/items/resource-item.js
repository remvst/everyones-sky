class ResourceItem extends Item {

    renderGraphic() {
        scale(0.3, 0.3);

        R.fillStyle = '#fff';
        renderResourcesIcon();
    }

    pickUp(ship) {
        ship.civilization.resources = min(MAX_PLANET_RESOURCES, ship.civilization.resources + 1);
        G.eventHub.emit(EVENT_PICKUP_RESOURCE, this);
    }

}