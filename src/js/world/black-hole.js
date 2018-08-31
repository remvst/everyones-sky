class BlackHole extends Body {

    constructor() {
        super();
        this.radius = 200;
    }

    render() {
        translate(this.x, this.y);
        rotate(G.clock * PI);

        const gradient = createRadialGradient(0, 0, 0, 0, 0, this.radius);
        gradient.addColorStop(0, '#000');
        gradient.addColorStop(0.5, '#000');
        gradient.addColorStop(1, 'rgba(128,128,128,0)');

        fs(gradient);
        beginPath();

        // R.shadowBlur = 25;
        // R.shadowColor = '#fff';

        for (let i = 0 ; i < 40 ; i++) {
            const a = (i / 40) * PI * 2;
            // const d = sin(Date.now() / 1000 * 2 * PI / 4 + i * rndArr[i % rndArr.length]) * this.radius * 0.1 + this.radius * 0.9;

            const seeSaw = (Date.now() / 1000 + i * rndArr[i % rndArr.length]) % 1;
            // const d = (1 - seeSaw) * this.radius * 0.5 + this.radius * 0.5;
            const d = sin(Date.now() / 1000 * PI * 2 + i * rndArr[i % rndArr.length]) * this.radius * 0.2 + this.radius * 0.9;

            R[i ? 'lineTo' : 'moveTo'](cos(a) * d, sin(a) * d);
        }
        fill();
        stroke();

        beginPath();

        // R.shadowBlur = 10;
        // R.shadowColor = '#fff';

        // for (let i = 0 ; i < 40 ; i++) {
        //     const a = (i / 40) * PI * 2 + PI;
        //     // const d = sin(Date.now() / 1000 * 2 * PI / 4 + i * rndArr[i % rndArr.length]) * this.radius * 0.1 + this.radius * 0.9;

        //     const seeSaw = (Date.now() / 1000 + i * rndArr[i % rndArr.length]) % 1;
        //     // const d = (1 - seeSaw) * this.radius * 0.5 + this.radius * 0.5;
        //     const d = sin(Date.now() / 1000 * PI * 2 + i * rndArr[i % rndArr.length]) * this.radius * 0.3 + this.radius * 0.8;

        //     R[i ? 'lineTo' : 'moveTo'](cos(a) * d, sin(a) * d);
        // }
        // fill();
        // stroke();
    }

}