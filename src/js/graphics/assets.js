const createStarsPattern = (stars, alpha) => createCanvasPattern(STAR_PATTERN_SIZE, STAR_PATTERN_SIZE, r => {
    r.fillStyle = '#fff';
    for (let i = stars ; --i ; ) {
        r.globalAlpha = alpha();
        r.fr(
            rnd(0, STAR_PATTERN_SIZE),
            rnd(0, STAR_PATTERN_SIZE),
            1,
            1
        );
    }
});

const starsPattern1 = createStarsPattern(200, () => rnd(0.2, 0.6));
const starsPattern2 = createStarsPattern(40, () => rnd(0.6, 1));

function renderResourcesIcon() {
    beginPath(); arc(0, -12, 15, 0, PI * 2); fill();
    beginPath(); arc(12, 12, 15, 0, PI * 2); fill();
    beginPath(); arc(-12, 12, 15, 0, PI * 2); fill();
}

function haloAround(asset, haloRadius, colorStart, colorEnd) {
    return createCanvas(asset.width + haloRadius * 2, asset.height + haloRadius * 2, (r, can) => {
        const gradient = r.createRadialGradient(can.width / 2, can.height / 2, asset.width / 2, can.width / 2, can.height / 2, asset.width / 2 + haloRadius);
        gradient.addColorStop(0, colorStart);
        gradient.addColorStop(1, colorEnd);

        r.fillStyle = gradient;
        r.fr(0, 0, can.width, can.height);

        try { r.drawImage(asset, haloRadius, haloRadius); } catch(e) {}
    });
}