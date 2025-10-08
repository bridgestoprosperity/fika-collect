import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'csv-parse';

const INPUT_FILENAME = 'input/level-2-admin-regions.csv';
const OUTPUT_FILENAME = 'output/admin-2-locations.json';

// Path to the CSV file
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const csvFilePath = path.join(__dirname, INPUT_FILENAME);

const result = {};

fs.createReadStream(csvFilePath)
  .pipe(parse({columns: true, trim: true}))
  .on('data', row => {
    const adminLevel0 = row['adminLevel0'] || row[Object.keys(row)[0]];
    const adminLevel1 = row['adminLevel1'] || row[Object.keys(row)[1]];
    const adminLevel2 = row['adminLevel2'] || row[Object.keys(row)[2]];

    if (!adminLevel0 || !adminLevel1 || !adminLevel2) {
      return;
    }

    if (!result[adminLevel0]) {
      result[adminLevel0] = {};
    }
    if (!result[adminLevel0][adminLevel1]) {
      result[adminLevel0][adminLevel1] = [];
    }
    result[adminLevel0][adminLevel1].push(adminLevel2);
  })
  .on('end', () => {
    fs.writeFileSync(
      path.join(__dirname, OUTPUT_FILENAME),
      JSON.stringify(result),
    );
    console.log(`Wrote ${OUTPUT_FILENAME}`);
  });
