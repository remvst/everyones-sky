class Civilization {

    constructor(planet) {
        this.resources = 0;
        this.planet = planet;
        this.relationship = random();
        this.initialRelationship = this.relationshipType();
    }

    relationshipType() {
        return this.relationship < 0.5 ? RELATIONSHIP_ENEMY : RELATIONSHIP_ALLY;
    }

    relationshipLabel() {
        return this.relationshipType() === RELATIONSHIP_ENEMY ? nomangle('enemy') : nomangle('ally');
    }

    updateRelationship(difference) {
        const relationshipTypeBefore = this.relationshipType();
        this.relationship = limit(0, this.relationship + difference, 1);
        
        if (this.relationshipType() !== relationshipTypeBefore) {
            G.showMessage(this.planet.name + nomangle(' is now your ') + this.relationshipLabel());
        }
    }

}