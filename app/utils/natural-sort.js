// Natural sort helper so notations like "A2", "A3", "A20", "A3.1" sort in
// the order a human expects, instead of alphabetically (which would put
// "A20" right after "A2" and before "A3").
export function naturalCompare(a = '', b = '') {
  const chunksA = String(a).match(/\d+|\D+/g) || [];
  const chunksB = String(b).match(/\d+|\D+/g) || [];
  const length = Math.max(chunksA.length, chunksB.length);

  for (let i = 0; i < length; i++) {
    const chunkA = chunksA[i] ?? '';
    const chunkB = chunksB[i] ?? '';

    if (chunkA === chunkB) continue;

    const numA = Number(chunkA);
    const numB = Number(chunkB);
    const bothNumeric = chunkA !== '' && chunkB !== '' && !isNaN(numA) && !isNaN(numB);

    if (bothNumeric) {
      if (numA !== numB) return numA - numB;
    } else {
      return chunkA < chunkB ? -1 : 1;
    }
  }

  return 0;
}

export function compareByNotation(a, b) {
  return naturalCompare(a?.notation, b?.notation);
}
