class Laser {

    constructor(owner, x, y, angle) {
        this.owner = owner;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = 400;
    }

    cycle(e) {
        this.x += cos(this.angle) * this.speed * e;
        this.y += sin(this.angle) * this.speed * e;

        if (!V.isVisible(this.x, this.y)) {
            U.remove(U.projectiles, this);
        }

        // Collisions
        U.forEachTarget(target => {
            if (target !== this.owner && dist(target, this) < target.radius) {
                U.remove(U.projectiles, this);
                target.damage(this);
            }
        });

        const d = 0.3;
        particle(10, 'cyan', [
            ['alpha', 1, 0, d],
            ['size', 2, rnd(2, 5), d],
            ['x', this.x, this.x + rnd(-3, 3), d],
            ['y', this.y, this.y + rnd(-3, 3), d]
        ]);
    }

    render() {
        wrap(() => {
            translate(this.x, this.y);
            rotate(this.angle);
    
            R.fillStyle = 'cyan';
            fr(0, -1, 4, 2);
        });
    }

}