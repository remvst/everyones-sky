class Laser {

    constructor(owner, x, y, angle) {
        this.owner = owner;
        this.x = x;
        this.y = y;
        this.angle = angle;
        // this.speed = 800;
        // this.radius = 10;
        this.magnetRadius = 100;
    }

    cycle(e) {
        this.x += cos(this.angle) * this.speed * e;
        this.y += sin(this.angle) * this.speed * e;

        if (!V.isVisible(this.x, this.y)) {
            U.remove(U.projectiles, this);
        }

        // Collisions
        U.forEachTarget(target => {
            if (target === this.owner) {
                return;
            }

            if (dist(target, this) < target.radius + this.radius) {
                U.remove(U.projectiles, this);
                target.damage(this);
            }

            if (dist(target, this) < this.magnetRadius) {
                const angleToTarget = atan2(target.y - this.y, target.x - this.x);
                const angleDiff = normalize(angleToTarget - this.angle);
                if (abs(angleDiff) < PI / 4) {
                    const appliedDiff = limit(-e * PI, angleDiff, e * PI);
                    this.angle += appliedDiff;
                }
            }
        });
    }

    render() {

    }

}