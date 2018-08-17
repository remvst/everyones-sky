class Asteroid extends Body {

    constructor() {
        super();
        this.radius = 25;

        this.rotation = 0;
        this.angle = random() * PI * 2;
        this.speed = rnd(100, 200);
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

            r.globalCompositeOperation = 'source-atop';
            r.fillStyle = '#000';
            r.lineWidth = 2;
            for (let i = 0 ; i < 10 ; i++) {
                const a = rnd(0, PI * 2);
                const d = rnd(0, this.radius * 1.5);
                r.beginPath();
                r.arc(cos(a) * d, sin(a) * d, rnd(2, 5), 0, PI * 2, 0);
                r.fill();
            }
        });
    }

    cycle(e) {
        this.x += this.speed * cos(this.angle) * e;
        this.y += this.speed * sin(this.angle) * e;

        this.rotation += this.rotationSpeed * e;
    }

    render() {
        if (!V.isVisible(this.x, this.y, this.radius)) {
            return;
        }
        
        translate(this.x, this.y);
        rotate(this.rotation);

        drawImage(this.asset, -this.asset.width / 2, -this.asset.height / 2);
    }

}