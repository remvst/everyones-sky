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

const starsPattern1 = createStarsPattern(200, () => rnd(0.6, 0.8));
const starsPattern2 = createStarsPattern(50, () => rnd(0.8, 1));
