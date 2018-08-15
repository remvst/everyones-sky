class Planet extends Body {

    constructor() {
        super();
        this.radius = 100;

        this.asset = createCanvas(this.radius * 2, this.radius * 2, r => {
            // Make sure we only fill the circle
            r.fillStyle = '#fff';
            r.arc(this.radius, this.radius, this.radius, 0 , Math.PI * 2);
            r.fill();
            r.globalCompositeOperation = 'source-atop';

            let rgb = [rnd(32, 255), rnd(32, 255), rnd(32, 255)];

            for (let y = 0 ; y < this.radius * 2 ; y += rnd(PLANET_STRIPE_MIN_SIZE, PLANET_STRIPE_MAX_SIZE)) {
                r.fillStyle = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
                r.fillRect(0, y, this.radius * 2, this.radius * 2);

                // Update colors for the next stripe
                rgb = rgb.map(c => ~~limit(32, c + rnd(-PLANET_COLOR_CHANGE_FACTOR, PLANET_COLOR_CHANGE_FACTOR), 255));
            }
        });

        document.body.appendChild(this.asset);
    }

    render() {
        R.shadowBlur = 100;
        R.shadowColor = 'rgba(255,255,255,0.5)';

        drawImage(this.asset, this.x - this.asset.width / 2, this.y - this.asset.height / 2);
    }

}