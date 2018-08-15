const starsPattern = createPattern(STAR_PATTERN_SIZE, STAR_PATTERN_SIZE, context => {
    context.fillStyle = '#fff';
    for (let i = STAR_PATTERN_SIZE ; --i ; ) {
        context.globalAlpha = rnd(0.5, 1);
        context.fillRect(
            rnd(0, STAR_PATTERN_SIZE),
            rnd(0, STAR_PATTERN_SIZE),
            1,
            1
        );
    }
});