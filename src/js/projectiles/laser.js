class Laser {

    constructor(owner, x, y, angle) {
        this.owner = owner;
        this.x = x;
        this.y = y;
        this.angle = angle;
        // this.speed = 800;
        // this.radius = 10;
        this.guideRadius = 0;
        this.age = 0;

        shootSound();
    }

    cycle(e) {
        this.x += cos(this.angle) * this.speed * e;
        this.y += sin(this.angle) * this.speed * e;

        if (!V.isVisible(this.x, this.y) || (this.age += e) >= 5) {
            U.remove(U.projectiles, this);
        }

        // Collisions
        U.forEachTarget(target => {
            if (target === this.owner) {
                return;
            }

            if (dist(target, this) < target.radius + this.radius) {
                U.remove(U.projectiles, this);
                target.damage(this, this.damage);
            }

            if (dist(target, this) < this.guideRadius) {
                const angleToTarget = angleBetween(this, target);
                const angleDiff = normalize(angleToTarget - this.angle);
                if (abs(angleDiff) < PI / 4) {
                    const appliedDiff = limit(-e * PI / 2, angleDiff, e * PI / 2);
                    this.angle += appliedDiff;
                }
            }
        });
    }

    render() {

    }

}