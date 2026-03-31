const SUPPORTED_FIELDS = ['question', 'answer', 'proficiency', 'deck', 'language'];

const normalizeCell = (value) => String(value ?? '').trim();

const splitDelimitedLine = (line, delimiter) => {
  const values = [];
  let current = '';
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"') {
      if (insideQuotes && nextCharacter === '"') {
        current += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (character === delimiter && !insideQuotes) {
      values.push(current);
      current = '';
      continue;
    }

    current += character;
  }

  values.push(current);
  return values.map((value) => value.replace(/\r/g, '').trim());
};

const detectDelimiter = (text, format = 'auto') => {
  if (format === 'csv') return ',';
  if (format === 'tsv') return '\t';

  const lines = text.split(/\n/).filter((line) => line.trim() !== '').slice(0, 3);
  const tabCount = lines.reduce((count, line) => count + (line.match(/\t/g) || []).length, 0);
  const commaCount = lines.reduce((count, line) => count + (line.match(/,/g) || []).length, 0);

  return tabCount > commaCount ? '\t' : ',';
};

export const parseImportText = (text, options = {}) => {
  const trimmedText = String(text || '').trim();

  if (!trimmedText) {
    return {
      delimiter: ',',
      headers: [],
      rows: []
    };
  }

  const delimiter = detectDelimiter(trimmedText, options.format);
  const parsedLines = trimmedText
    .split(/\n/)
    .map((line) => line.replace(/\r/g, ''))
    .filter((line) => line.trim() !== '')
    .map((line) => splitDelimitedLine(line, delimiter));

  if (parsedLines.length === 0) {
    return {
      delimiter,
      headers: [],
      rows: []
    };
  }

  const hasHeaders = options.hasHeaders !== false;
  const firstRow = parsedLines[0];
  const headers = hasHeaders ? firstRow.map((value, index) => normalizeCell(value) || `Column ${index + 1}`) : firstRow.map((_, index) => `Column ${index + 1}`);
  const dataRows = hasHeaders ? parsedLines.slice(1) : parsedLines;

  return {
    delimiter,
    headers,
    rows: dataRows.map((cells, index) => ({
      rowNumber: hasHeaders ? index + 2 : index + 1,
      cells
    }))
  };
};

const HEADER_ALIASES = {
  question: ['question', 'word', 'wordorphrase', 'phrase', 'front'],
  answer: ['answer', 'translation', 'back'],
  proficiency: ['proficiency', 'level'],
  deck: ['deck', 'category', 'topic'],
  language: ['language', 'lang']
};

export const getDefaultMapping = (headers) => {
  const mapping = {
    question: '',
    answer: '',
    proficiency: '',
    deck: '',
    language: ''
  };

  headers.forEach((header, index) => {
    const normalizedHeader = normalizeCell(header).toLowerCase().replace(/\s+/g, '');

    SUPPORTED_FIELDS.forEach((field) => {
      if (!mapping[field] && HEADER_ALIASES[field].includes(normalizedHeader)) {
        mapping[field] = String(index);
      }
    });
  });

  if (!mapping.question && headers[0]) mapping.question = '0';
  if (!mapping.answer && headers[1]) mapping.answer = '1';

  return mapping;
};

export const validatePreviewRows = (rows, mapping) =>
  rows.map((row) => {
    const getValue = (field) => {
      const columnIndex = mapping[field];
      if (columnIndex === '') return '';
      return normalizeCell(row.cells[Number(columnIndex)]);
    };

    const cleanedRow = {
      rowNumber: row.rowNumber,
      question: getValue('question'),
      answer: getValue('answer'),
      proficiency: getValue('proficiency'),
      deck: getValue('deck'),
      language: getValue('language')
    };

    const errors = [];

    if (!cleanedRow.question) errors.push('Question is required.');
    if (!cleanedRow.answer) errors.push('Answer is required.');

    if (cleanedRow.proficiency) {
      const proficiencyValue = Number(cleanedRow.proficiency);

      if (!Number.isInteger(proficiencyValue) || proficiencyValue < 1 || proficiencyValue > 5) {
        errors.push('Proficiency must be a whole number from 1 to 5.');
      }
    }

    return {
      ...row,
      cleanedRow,
      errors,
      isValid: errors.length === 0
    };
  });

export const buildSampleCsv = () => `question,answer,proficiency,deck,language
Hola,Hello,1,Greetings,Spanish
Gracias,Thank you,2,Essentials,Spanish
`;
