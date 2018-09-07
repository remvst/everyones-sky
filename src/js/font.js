stickString = string => {
    const absoluteSegments = [];

    let characterX = 0;
    let width;
    string.toLowerCase().split('').forEach(character => {
        const charSegments = characterSettings[character] || [];

        let nextX = characterX;
        charSegments.forEach(segment => {
            absoluteSegments.push([
                characterX + segment[0],
                segment[1],
                characterX + segment[2],
                segment[3]
            ]);
            nextX = max(nextX, characterX + segment[0] + 2 / 5, characterX + segment[2] + 2 / 5);
        });

        if (!charSegments.length) {
            nextX += 1;
        }

        characterX = nextX;
        width = characterX - 2 / 5;
    });

    const appearanceOffsets = [];
    absoluteSegments.forEach((x, offset) => {
        appearanceOffsets.splice(~~(random() * appearanceOffsets.length), 0, offset);
    });

    return {
        'segments': absoluteSegments,
        'appearanceOffsets': appearanceOffsets,
        'width': width
    };
};

renderStickString = (stickStringSettings, charWidth, charHeight, progress, segmentInterval, appearanceTime) => {
    stickStringSettings.segments.forEach((segment, index) => {
        wrap(() => {
            const appearanceOffset = stickStringSettings.appearanceOffsets[index];
            const delay = appearanceOffset * segmentInterval;
            const factor = limit(0, (progress - delay) / appearanceTime, 1);

            const direction = sign(((index + appearanceOffset) % 2) - 0.5);
            if (((index % 2) - 0.5) > 0) {
                translate(direction * (1 - factor) * 50, 0);
            } else {
                translate(0, direction * (1 - factor) * 50);
            }

            R.globalAlpha *= factor;

            beginPath();
            moveTo(segment[0] * charWidth, segment[1] * charHeight);
            lineTo(segment[2] * charWidth, segment[3] * charHeight);
            stroke();
        });
    });
}

const leftSegment = [0, 0, 0, 1];
const rightSegment = [1, 0, 1, 1];
const topSegment = [0, 0, 1, 0];
const bottomSegment = [0, 1, 1, 1];
const middleHorizontalSegment = [0, 1 / 2, 1, 1 / 2];
const rightBottomSegment = [1, 1 / 2, 1, 1];

const characterSettings = {
    'a': [
        [0, 1, 1 / 2, 0],
        [1, 1, 1 / 2, 0]
    ],
    'b': [
        leftSegment,
        bottomSegment,
        middleHorizontalSegment,
        rightBottomSegment,
        [0, 0, 3 / 4, 0],
        [3 / 4, 0, 3 / 4, 1 / 2]
    ],
    'c': [
        leftSegment,
        topSegment,
        bottomSegment
    ],
    'd': [
        leftSegment,
        [0, 0, 1, 1 / 2],
        [1, 1 / 2, 0, 1]
    ],
    'e': [
        leftSegment,
        topSegment,
        [0, 1 / 2, 1 * 2 / 3, 1 / 2],
        bottomSegment
    ],
    'f': [
        leftSegment,
        topSegment,
        [0, 1 / 2, 1 * 2 / 3, 1 / 2]
    ],
    'g': [
        topSegment,
        leftSegment,
        bottomSegment,
        rightBottomSegment
    ],
    'h': [
        leftSegment,
        rightSegment,
        middleHorizontalSegment
    ],
    'i': [
        leftSegment
    ],
    'j': [
        rightSegment,
        bottomSegment,
        [0, 1 / 2, 0, 1]
    ],
    'k': [
        leftSegment,
        [1, 0, 0, 1 / 2],
        [1, 1, 0, 1 / 2],
    ],
    'l': [
        leftSegment,
        bottomSegment
    ],
    'm': [
        leftSegment,
        [0, 0, 1 / 2, 1 / 2],
        [1, 0, 1 / 2, 1 / 2],
        rightSegment
    ],
    'n': [
        leftSegment,
        [0, 0, 1, 1],
        rightSegment
    ],
    'o': [
        topSegment,
        bottomSegment,
        leftSegment,
        rightSegment
    ],
    'p': [
        leftSegment,
        topSegment,
        [1, 0, 1, 1 / 2],
        middleHorizontalSegment,
    ],
    'q': [
        topSegment,
        bottomSegment,
        leftSegment,
        rightSegment,
        [1, 1, 1, 1.3]
    ],
    'r': [
        leftSegment,
        topSegment,
        [1, 0, 1, 1 / 2],
        middleHorizontalSegment,
        [0, 1 / 2, 1, 1]
    ],
    's': [
        topSegment,
        [0, 0, 0, 1 / 2],
        middleHorizontalSegment,
        rightBottomSegment,
        bottomSegment,
    ],
    't': [
        topSegment,
        [1 / 2, 0, 1 / 2, 1]
    ],
    'u': [
        leftSegment,
        bottomSegment,
        rightSegment
    ],
    'v': [
        [0, 0, 1 / 2, 1],
        [1, 0, 1 / 2, 1]
    ],
    'w': [
        [0, 0, 1 / 4, 1],
        [1 / 4, 1, 1 / 2, 1 / 2],
        [3 / 4, 1, 1 / 2, 1 / 2],
        [1, 0, 3 / 4, 1],
    ],
    'x': [
        [0, 0, 1, 1],
        [1, 0, 0, 1]
    ],
    'y': [
        [0, 0, 1 / 2, 1 / 2],
        [1 / 2, 1 / 2, 1, 0],
        [1 / 2, 1 / 2, 1 / 2, 1]
    ],
    'z': [
        topSegment,
        bottomSegment,
        [1, 0, 0, 1]
    ],
    '\'': [
        [0, 1 / 4, 1 / 4, 0]
    ],
    '-': [
        [0, 1 / 2, 1, 1 / 2]
    ]
};
