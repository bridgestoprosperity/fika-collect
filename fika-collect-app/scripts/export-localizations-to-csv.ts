import { localizations, LOCALE_LABELS } from '../src/localizations.ts';

// Helper to escape CSV values
function escapeCSV(value: string): string {
  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

// Assuming localizations is an object like { en: { key: value, ... }, es: { key: value, ... }, ... }
const languages = Object.keys(localizations);
const allKeys = Array.from(
  new Set(
    languages.flatMap(lang => Object.keys(localizations[lang]))
  )
);

const header = ['key', ...languages];
const rows = [header];

for (const key of allKeys) {
  const row = [LOCALE_LABELS[key], ...languages.map(lang => localizations[lang][key] ?? '')];
  rows.push(row);
}

const csv = rows
  .map(row => row.map(escapeCSV).join(','))
  .join('\n');

console.log(csv);
