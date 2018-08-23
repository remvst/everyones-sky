const createStarsPattern = (stars, alpha) => createPattern(STAR_PATTERN_SIZE, STAR_PATTERN_SIZE, r => {
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