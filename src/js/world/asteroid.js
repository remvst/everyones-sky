class Asteroid extends Body {

    constructor(radius = 25, speed) {
        super();
        this.radius = radius;

        this.reachRadius = radius * 10;

        this.health = 1;

        this.rotation = 0;

        speed = speed || rnd(100, 200);

        const angle = random() * PI * 2;
        this.vX = cos(angle) * speed;
        this.vY = sin(angle) * speed;

        this.rotationSpeed = rnd(PI / 2, PI / 4) * pick([-1, 1]);

        this.asset = createCanvas(this.radius * 2, this.radius * 2, r => {
            // Make sure we only fill the circle
            r.fillStyle = '#aaa';
            r.translate(this.radius, this.radius);
            r.beginPath();

            for (let i = 0 ; i < 40 ; i++) {
                const a = (i / 40) * PI * 2;
                const d = rnd(this.radius * 0.75, this.radius);

                r[i ? 'lineTo' : 'moveTo'](cos(a) * d, sin(a) * d);
            }
            
            r.fill();

            r.globalCompositeOperation = 'destination-out';
            r.fillStyle = '#000';
            r.lineWidth = 2;
            for (let i = 0 ; i < 10 ; i++) {
                const a = rnd(0, PI * 2);
                const d = rnd(0, this.radius * 1.5);
                r.beginPath();
                r.arc(cos(a) * d, sin(a) * d, rnd(this.radius * 2 / 25, this.radius * 5 / 25), 0, PI * 2, 0);
                r.fill();
            }
        });
    }

    get speed() {
        return distP(0, 0, this.vX, this.vY);
    }

    cycle(e) {
        super.cycle(e);

        this.x += this.vX * e;
        this.y += this.vY * e;

        this.rotation += this.rotationSpeed * e;

        U.bodies.forEach(body => {
            if (body === this) {
                return;
            }

            const minDist = this.radius + body.radius;
            const overlap = minDist - dist(body, this);
            if (overlap > 0) {
                // Push the other body away
                const angle = angleBetween(body, this);
                this.x = body.x + cos(angle) * (minDist);
                this.y = body.y + sin(angle) * (minDist);

                // Using a ship constant LOL REMI WTF
                this.vX += cos(angle) * (overlap + SHIP_DECELERATION * 2);
                this.vY += sin(angle) * (overlap + SHIP_DECELERATION * 2);

                this.damage(body, 0.2);
                body.damage(this, 0.2);
            }
        });

        if (!V.isVisible(this.x, this.y, V.width) && !this.preventAutomaticRemoval) {
            U.remove(U.bodies, this);
        }
    }

    render() {
        if (!V.isVisible(this.x, this.y, this.radius)) {
            return;
        }

        if (DEBUG) {
            G.renderedAsteroids++;
        }

        wrap(() => {
            translate(this.x, this.y);
            rotate(this.rotation);
    
            drawImage(this.asset, -this.asset.width / 2, -this.asset.height / 2);
        });
    }
    
    damage(projectile, amount) {
        particle(10, pick(['#aaa', '#fff', '#ccc']), [
            ['alpha', 1, 0, 1],
            ['size', rnd(2, 4), rnd(5, 10), 1],
            ['x', projectile.x, projectile.x + rnd(-20, 20), 1],
            ['y', projectile.y, projectile.y + rnd(-20, 20), 1]
        ]);

        this.lastDamage = G.clock;

        const item = new ResourceItem();
        U.items.push(item);
        interp(item, 'x', this.x, this.x + cos(projectile.angle + PI) * 50 + rnd(-20, 20), 0.3);
        interp(item, 'y', this.y, this.y + sin(projectile.angle + PI) * 50 + rnd(-20, 20), 0.3);

        if ((this.health -= amount) <= 0) {
            this.explode();
        }
    }

    explode() {
        for (let i = 0 ; i < 50 ; i++) {
            const angle = random() * PI * 2;
            const distance = random() * this.radius;

            particle(10, pick(['#aaa', '#fff', '#ccc']), [
                ['alpha', 1, 0, 1],
                ['size', rnd(2, 4), rnd(5, 10), 1],
                ['x', this.x + cos(angle) * distance, this.x + cos(angle) * distance + rnd(-20, 20), 1],
                ['y', this.y + sin(angle) * distance, this.y + sin(angle) * distance + rnd(-20, 20), 1]
            ]);
        }

        U.remove(U.bodies, this);

        if (this.radius > 15) {
            for (let i = 0 ; i < 2 ; i++) {
                const smallerAsteroid = new Asteroid(this.radius / 2, this.speed / 4);
                smallerAsteroid.x = this.x + rnd(-this.radius, this.radius);
                smallerAsteroid.y = this.y + rnd(-this.radius, this.radius);
                U.bodies.push(smallerAsteroid);
            }
        }

        explosionSound();
    }

}