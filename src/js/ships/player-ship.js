class PlayerShip extends Ship {

    constructor(x, y) {
        super(new Civilization(), x, y);

        this.angle = -PI / 8;
        this.nextHealing = 0;
        this.shield = 1;
        this.age = 0;
    }

    cycle(e) {
        this.age += e;

        // // Hairy condition here: we only want to brake if the user is pressing the down arrow AND we're moving towards the same direction we're pointing to
        // // This is to avoid having a reverse mode
        // this.thrust = (w.down[40] && (this.vX || this.vY) && abs(normalize(atan2(this.vY, this.vX) - this.angle)) < PI / 2) ?
        //     -1 : (w.down[38] ? 1 : 0);
        this.thrust = w.down[38] ? 1 : (w.down[40] ? -0.25 : 0);

        this.rotationDirection = w.down[37] ? -1 : (w.down[39] ? 1 : 0);

        if (w.down[32]) this.shoot(SimpleLaser);
        if (w.down[13] && this.age > 1) this.shoot(SuperLaser, SHIP_SUPERSHOT_INTERVAL);

        const nearStar = this.nearStar();
        if (nearStar) {
            this.damage(nearStar, e * 0.15);
        }

        if ((G.clock - this.lastShieldDamage) > SHIELD_RECOVERY_DELAY) {
            this.shield += SHIELD_RECOVERY_SPEED * e;
        }
        this.shield = min(this.health, this.shield); // make sure shields don't surpass health

        if ((this.nextHealing -= e) < 0) {
            this.heal();
        }

        super.cycle(e);

        if (this.thrust) {
            if (!this.thrustSound) {
                this.thrustSound = thrustSound();
                this.thrustSound.loop = true;
            }
        } else if (this.thrustSound) {
            this.thrustSound.pause();
            this.thrustSound = null;
        }
    }

    heal() {
        const healingAmount = min(1 - this.health, SHIP_HEALING_AMOUNT);
        const requiredResources = ~~(SHIP_HEALING_REQUIRED_RESOURCES * healingAmount / SHIP_HEALING_AMOUNT);
        if (this.civilization.resources >= requiredResources && healingAmount > 0) {
            G.healAnimation(() => {
                this.health += healingAmount;
                this.civilization.resources -= requiredResources;
            });
        }

        this.nextHealing = SHIP_HEALING_INTERVAL;
    }

    damage(source, amount) {
        const isStar = source instanceof Star;

        if (this.shield > 0) {
            this.shield -= amount;

            if (!isStar || (G.clock - (this.lastShieldDamage || 0)) > 0.3) {
                this.lastShieldDamage = G.clock;

                this.shieldEffectAngle = angleBetween(this, source);
                interp(this, 'shieldEffectScale', 0.8, 1, 0.2);
            }
            return;
        }

        if (!isStar) {
            V.shake(0.1);
        }

        super.damage(source, amount * 0.5); // Less damage for the player

        this.nextHealing = SHIP_HEALING_DAMAGE_TIMEOUT;
    }

    modifyProjectile(projectile) {
        projectile.guideRadius = 100;
    }

    shipColor() {
        return '#fff';
    }

    explode(projectile) {
        super.explode(projectile);
        setTimeout(() => G.gameOver(), 2000);

        if (this.thrustSound) {
            this.thrustSound.pause();
        }
    }

    currentWarning() {
        if (this.health <= 0.3) {
            return nomangle('CRITICAL HULL DAMAGE') + (this.civilization.resources < SHIP_HEALING_REQUIRED_RESOURCES ? nomangle('. FIND RESOURCES TO REPAIR') : '');
        }

        if (this.nearStar()) {
            return nomangle('CRITICAL HEAT');
        }

        if (U.pirates.filter(ship => dist(ship, this) < CANVAS_WIDTH).length) {
            return nomangle('PIRATES NEARBY');
        }

        if (this.shield <= 0) {
            return nomangle('SHIELDS OFFLINE');
        }
    }

    nearStar() {
        return U.stars.filter(star => dist(this, star) < star.radius * 2)[0];
    }

    render() {
        wrap(() => super.render());

        translate(this.x, this.y);
        rotate(this.shieldEffectAngle);

        fs('#fff');

        beginPath();
        arc(0, 0, 25, -PI / 2, PI / 2);

        wrap(() => {
            scale(this.shieldEffectScale, 1);
            arc(0, 0, 25, PI / 2, -PI / 2, true);
        });

        fill();
    }

}
