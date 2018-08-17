const rndArr = [random(), random(), random(), random()];

class Star extends Body {

    constructor() {
        super();
        this.radius = 100;
    }

    render() {
        if (!V.isVisible(this.x, this.y, this.radius)) {
            return;
        }

        R.fillStyle = '#ff0';
        beginPath();

        R.shadowBlur = 100;
        R.shadowColor = '#f00';

        for (let i = 0 ; i < 40 ; i++) {
            const a = (i / 40) * PI * 2;
            const d = sin(Date.now() / 1000 * 2 * PI * 2 + i * rndArr[i % rndArr.length]) * this.radius * 0.02 + this.radius * 0.98;

            R[i ? 'lineTo' : 'moveTo'](this.x + cos(a) * d, this.y + sin(a) * d);
        }
        fill();
    }

}