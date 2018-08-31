const consonants = 'bcdfghjklmnpqrstvwz'.split('');
const vowels = 'aeiouy'.split('');

randomSyllable = rng => rng.pick(consonants) + rng.pick(vowels) + rng.pick(consonants.concat(vowels));

randomName = rng => randomSyllable(rng) + randomSyllable(rng) + ' ' + rng.pick(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']);