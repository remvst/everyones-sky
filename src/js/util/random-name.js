const consonants = 'BCDFGHJKLMNPQRSTVWXZ'.split('');
const vowels = 'AEIOUY'.split('');

randomSyllable = rng => rng.pick(consonants) + rng.pick(vowels) + rng.pick(consonants.concat(vowels));

randomName = rng => randomSyllable(rng) + randomSyllable(rng) + ' ' + rng.pick(['III', 'IV', 'V', 'VI', 'VII', 'IX', 'X']);
