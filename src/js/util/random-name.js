const consonants = 'bcdfghjklmnpqrstvwz'.split('');
const vowels = 'aeiouy'.split('');

function randomSyllable() {
    return pick(consonants) + pick(vowels) + pick(consonants.concat(vowels));
};

function randomName() {
    return randomSyllable() + randomSyllable() + ' ' + pick(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']);
};