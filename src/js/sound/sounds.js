soundPool = settings => {
    let index = 0;
    const sounds = [...Array(10)].map(() => jsfxr(settings));
    return () => sounds[index++ % sounds.length].play();
};

const explosionSound = soundPool([3,,0.3346,0.2953,0.4941,0.1205,,-0.2565,,,,,,,,,-0.1093,-0.2344,1,,,,,0.5]),
    shootSound = soundPool([0,,0.1584,0.1384,0.2216,0.63,,-0.2653,,,,,,0.1485,,,,,1,,,0.1888,,0.5]);