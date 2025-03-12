# fika-collect-surveys

This directory contains some basic (currently, *very* basic) infrastructure for maintaining surveys.

The official list of current surveys is stored in the `fika-collect` S3 bucket under the key `surveys/mainfest.json`. A bucket policy makes objects under the prefix `surveys/` publicly visible, so this manifest is visible at https://fika-collect.s3.us-west-1.amazonaws.com/surveys/manifest.json. (Note that survey *responses* are *not* publicly visible, as they are stored under `responses/`.)

## CLI Commands

This script contains some basic commands which will eventually get rolled up into a nicer CLI utility.

### Print survey manifest

To print the current list of surveys:

```bash
$ node bin/print-manifest.js
{
  "surveys": [
    {
      "survey_id": "quick_report",
      "key": "surveys/quick_report.json",
      "updated_at": "2025-03-12T20:34:32.253Z"
    },
    {
      "survey_id": "detailed_report",
      "key": "surveys/detailed_report.json",
      "updated_at": "2025-03-12T20:38:01.301Z"
    }
  ]
}
```

Each survey, in turn, is publicly accessible at the corresponding key, e.g. [surveys/quick\_report.json](https://fika-collect.s3.us-west-1.amazonaws.com/surveys/quick_report.json).

### Create a new survey

To upload a survey, enter the filename of the schema. THe survey JSON is validated usin the zod schema definition in [request-schema.js](../fika-collect-lambda/src/request-schema.js).

```bash
node bin/upload-survey.js surveys/quick_report.json
```

This command will upload the survey to `surveys/{survey_id}.json` and update the manifest accordingly to include that survey. However, you can expect this to fail since `quick_report.json` already exists. If you are replacing a survey, add `--replace`:

```bash
node bin/upload-survey.js surveys/quick_report.json --replace
```

### Deactivate a survey

You may deactivate a survey by removing it from the manifest. This only removes it from the manifest and does not remove the survey JSON definition from the bucket or make it inaccessible.

```
node bin/deactivate-survey.js quick_report
```

The process is just a bit clunky and does not currently permit reordering the surveys.

