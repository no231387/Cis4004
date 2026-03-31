import { useMemo, useState } from 'react';
import { bulkImportFlashcards } from '../services/flashcardService';
import { buildSampleCsv, getDefaultMapping, parseImportText, validatePreviewRows } from '../utils/importUtils';

const emptyParseResult = {
  delimiter: ',',
  headers: [],
  rows: []
};

function ImportFlashcardsPage() {
  const [rawText, setRawText] = useState('');
  const [fileName, setFileName] = useState('');
  const [format, setFormat] = useState('auto');
  const [hasHeaders, setHasHeaders] = useState(true);
  const [mapping, setMapping] = useState({
    question: '',
    answer: '',
    proficiency: '',
    deck: '',
    language: ''
  });
  const [parseResult, setParseResult] = useState(emptyParseResult);
  const [duplicateHandling, setDuplicateHandling] = useState('skip');
  const [isImporting, setIsImporting] = useState(false);
  const [importSummary, setImportSummary] = useState(null);

  const previewRows = useMemo(() => validatePreviewRows(parseResult.rows, mapping), [parseResult.rows, mapping]);
  const validRows = useMemo(() => previewRows.filter((row) => row.isValid).map((row) => row.cleanedRow), [previewRows]);
  const cleanedRows = useMemo(() => previewRows.map((row) => row.cleanedRow), [previewRows]);

  const handleParse = () => {
    const nextParseResult = parseImportText(rawText, { format, hasHeaders });
    setParseResult(nextParseResult);
    setMapping(getDefaultMapping(nextParseResult.headers));
    setImportSummary(null);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileText = await file.text();
    setRawText(fileText);
    setFileName(file.name);
    setImportSummary(null);
  };

  const handleMappingChange = (event) => {
    const { name, value } = event.target;
    setMapping((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleImport = async () => {
    if (validRows.length === 0 || isImporting) return;

    try {
      setIsImporting(true);
      const { data } = await bulkImportFlashcards({
        rows: cleanedRows,
        duplicateHandling
      });
      setImportSummary(data);
    } catch (error) {
      console.error('Failed to import flashcards:', error);
      alert('Import failed. Please review your data and try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const downloadSample = () => {
    const blob = new Blob([buildSampleCsv()], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'linguacards-import-template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const totalInvalidRows = previewRows.length - validRows.length;

  return (
    <section className="import-page">
      <div className="card">
        <h2>Import Flashcards</h2>
        <p>Paste CSV or tab-separated text, or upload a file, then preview the rows before importing.</p>
      </div>

      <div className="card form-card">
        <label>
          Upload CSV or TXT File
          <input type="file" accept=".csv,.txt,.tsv,text/csv,text/plain" onChange={handleFileUpload} />
        </label>

        {fileName && <p className="muted-text">Selected file: {fileName}</p>}

        <label>
          Paste CSV or Tab-Separated Text
          <textarea
            rows="10"
            value={rawText}
            onChange={(event) => setRawText(event.target.value)}
            placeholder="question,answer,proficiency,deck,language"
          />
        </label>

        <div className="filter-grid">
          <label>
            Format
            <select value={format} onChange={(event) => setFormat(event.target.value)}>
              <option value="auto">Auto Detect</option>
              <option value="csv">CSV</option>
              <option value="tsv">Tab Separated</option>
            </select>
          </label>

          <label className="checkbox-label">
            <span>First Row Contains Headers</span>
            <input type="checkbox" checked={hasHeaders} onChange={(event) => setHasHeaders(event.target.checked)} />
          </label>
        </div>

        <div className="action-row">
          <button type="button" onClick={handleParse}>
            Preview Import
          </button>
          <button type="button" onClick={downloadSample} className="secondary-button">
            Download Sample CSV
          </button>
        </div>
      </div>

      {parseResult.headers.length > 0 && (
        <div className="card">
          <h3>Column Mapping</h3>
          <div className="mapping-grid">
            {['question', 'answer', 'proficiency', 'deck', 'language'].map((field) => (
              <label key={field}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
                <select name={field} value={mapping[field]} onChange={handleMappingChange}>
                  <option value="">Do not import</option>
                  {parseResult.headers.map((header, index) => (
                    <option key={`${field}-${header}-${index}`} value={String(index)}>
                      {header}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>
      )}

      {previewRows.length > 0 && (
        <div className="card">
          <h3>Preview</h3>
          <p>
            {validRows.length} valid row(s) ready to import. {totalInvalidRows} invalid row(s) will be skipped.
          </p>

          <label>
            Duplicate Handling
            <select value={duplicateHandling} onChange={(event) => setDuplicateHandling(event.target.value)}>
              <option value="skip">Skip duplicates</option>
              <option value="import_anyway">Import anyway</option>
              <option value="update_existing">Update existing</option>
            </select>
          </label>

          <div className="preview-table-wrapper">
            <table className="preview-table">
              <thead>
                <tr>
                  <th>Row</th>
                  <th>Question</th>
                  <th>Answer</th>
                  <th>Proficiency</th>
                  <th>Deck</th>
                  <th>Language</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row) => (
                  <tr key={row.rowNumber} className={row.isValid ? '' : 'invalid-row'}>
                    <td>{row.rowNumber}</td>
                    <td>{row.cleanedRow.question || '-'}</td>
                    <td>{row.cleanedRow.answer || '-'}</td>
                    <td>{row.cleanedRow.proficiency || '-'}</td>
                    <td>{row.cleanedRow.deck || '-'}</td>
                    <td>{row.cleanedRow.language || '-'}</td>
                    <td>{row.isValid ? 'Valid' : row.errors.join(' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="action-row">
            <button type="button" onClick={handleImport} disabled={validRows.length === 0 || isImporting}>
              {isImporting ? 'Importing...' : `Import ${validRows.length} Valid Row(s)`}
            </button>
          </div>
        </div>
      )}

      {importSummary && (
        <div className="card">
          <h3>Import Summary</h3>
          <div className="stats-grid">
            <article className="card">
              <h4>Total Rows</h4>
              <p className="stat-number">{importSummary.totalRows}</p>
            </article>
            <article className="card">
              <h4>Inserted Rows</h4>
              <p className="stat-number">{importSummary.insertedRows}</p>
            </article>
            <article className="card">
              <h4>Invalid Rows</h4>
              <p className="stat-number">{importSummary.invalidRows}</p>
            </article>
            <article className="card">
              <h4>Duplicate Rows</h4>
              <p className="stat-number">{importSummary.duplicateRows}</p>
            </article>
          </div>

          {importSummary.updatedRows > 0 && <p>Updated existing rows: {importSummary.updatedRows}</p>}
        </div>
      )}
    </section>
  );
}

export default ImportFlashcardsPage;
