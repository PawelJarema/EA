const 
	polishChars = 'ęóąśłżźćńĘÓĄŚŁŻŹĆŃ',
	unicodeEquivalents = 'eoaslzzcnEOASLZZCN';

function replaceChars(text, index, fromArray, toArray) {
	const
		charInQuestion = text[index],
		dictionaryIndex = fromArray.indexOf(charInQuestion);

	if (dictionaryIndex !== -1)
		text = text.slice(0, index) + unicodeEquivalents[dictionaryIndex] + text.slice(index + 1);

	return text;
}

function findChar(charsToFind, text) {
	for (let c = 0; c < charsToFind.length; c++)
		for (let l = 0; l < text.length; l++)
			if (text[l] === charsToFind[c]) return l;

	return -1;
}

function stripPolish(text) {
	let charIndex = findChar(polishChars, text);
	while (charIndex !== -1) {
		text = replaceChars(text, charIndex, polishChars, unicodeEquivalents);
		charIndex = findChar(polishChars, text);
	}

	return text;
}

export { stripPolish };