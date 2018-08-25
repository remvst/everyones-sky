class Civilization {

    constructor(planet) {
        this.resources = 0;
        this.planet = planet;
        this.relationShip = random();
    }

    relationshipColor() {
        return ['#f00', '#0f0'][this.relationshipType()];
    }

    relationshipType() {
        return this.relationShip < 0.5 ? RELATIONSHIP_ENEMY : RELATIONSHIP_ALLY;
    }

}