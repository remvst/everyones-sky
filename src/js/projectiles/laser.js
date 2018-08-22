class Laser {

    constructor(owner, x, y, angle) {
        this.owner = owner;
        this.x = x;
        this.y = y;
        this.angle = angle;
        // this.speed = 800;
        // this.radius = 10;
    }

    cycle(e) {
        this.x += cos(this.angle) * this.speed * e;
        this.y += sin(this.angle) * this.speed * e;

        if (!V.isVisible(this.x, this.y)) {
            U.remove(U.projectiles, this);
        }

        // Collisions
        U.forEachTarget(target => {
            if (target !== this.owner && dist(target, this) < target.radius + this.radius) {
                U.remove(U.projectiles, this);
                target.damage(this);
            }
        });
    }

    render() {

    }

}