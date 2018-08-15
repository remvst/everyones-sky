const rndArr = [random(), random(), random(), random()];

class Star extends Body {

    constructor() {
        super();
        this.radius = 100;
    }

    render() {
        R.fillStyle = '#ff0';
        beginPath();

        for (let i = 0 ; i < 40 ; i++) {
            const a = (i / 40) * PI * 2;
            const d = sin(Date.now() / 1000 * 2 * PI * 2 + i * rndArr[i % rndArr.length]) * this.radius * 0.02 + this.radius * 0.98;

            R[i ? 'lineTo' : 'moveTo'](this.x * 0.9 + cos(a) * d, this.y * 0.9 + sin(a) * d);
        }
        fill();
    }

}