const badCharRegex = /[ÃÂâ�]/g;

const badCharCount = (value: string) => (value.match(badCharRegex) || []).length;

const tryDecodeLatin1 = (value: string) => {
  try {
    // Converts UTF-8 bytes misread as Latin-1 back to proper Unicode.
    return decodeURIComponent(escape(value));
  } catch {
    return value;
  }
};

const replacementMap: Record<string, string> = {
  '\u00C3\u00A1': '\u00E1', // á
  '\u00C3\u00A0': '\u00E0', // à
  '\u00C3\u00A2': '\u00E2', // â
  '\u00C3\u00A3': '\u00E3', // ã
  '\u00C3\u00A4': '\u00E4', // ä
  '\u00C3\u00A9': '\u00E9', // é
  '\u00C3\u00AA': '\u00EA', // ê
  '\u00C3\u00AD': '\u00ED', // í
  '\u00C3\u00B3': '\u00F3', // ó
  '\u00C3\u00B4': '\u00F4', // ô
  '\u00C3\u00B5': '\u00F5', // õ
  '\u00C3\u00BA': '\u00FA', // ú
  '\u00C3\u00A7': '\u00E7', // ç
  '\u00C3\u0081': '\u00C1', // Á
  '\u00C3\u0080': '\u00C0', // À
  '\u00C3\u0082': '\u00C2', // Â
  '\u00C3\u0083': '\u00C3', // Ã
  '\u00C3\u0089': '\u00C9', // É
  '\u00C3\u008A': '\u00CA', // Ê
  '\u00C3\u008D': '\u00CD', // Í
  '\u00C3\u0093': '\u00D3', // Ó
  '\u00C3\u0094': '\u00D4', // Ô
  '\u00C3\u0095': '\u00D5', // Õ
  '\u00C3\u009A': '\u00DA', // Ú
  '\u00C3\u0087': '\u00C7', // Ç
  '\u00C2\u00BA': '\u00BA', // º
  '\u00C2\u00B0': '\u00B0', // °
  '\u00C2\u00AA': '\u00AA', // ª
  '\u00C2\u00A9': '\u00A9', // ©
  '\u00C2\u00B7': '\u00B7', // ·
  '\u00E2\u0080\u0093': '\u2013', // –
  '\u00E2\u0080\u0094': '\u2014', // —
  '\u00E2\u0080\u00A2': '\u2022', // •
  '\u00E2\u0080\u009C': '\u201C', // “
  '\u00E2\u0080\u009D': '\u201D', // ”
  '\u00E2\u0080\u0098': '\u2018', // ‘
  '\u00E2\u0080\u0099': '\u2019', // ’
  '\u00E2\u0080\u00A6': '\u2026', // …
};

export const normalizeText = (value?: string) => {
  if (typeof value !== 'string') return value;

  let normalized = value;
  if (badCharRegex.test(normalized)) {
    const decoded = tryDecodeLatin1(normalized);
    if (badCharCount(decoded) < badCharCount(normalized)) {
      normalized = decoded;
    }
  }

  Object.entries(replacementMap).forEach(([bad, good]) => {
    normalized = normalized.split(bad).join(good);
  });

  return normalized;
};
