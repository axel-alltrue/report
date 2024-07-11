# Report Generation API

This is a Node.js Express API for generating reports using the Carbone.io service and local templates. It provides endpoints to generate reports either locally or using remote templates from Carbone.io.

## Prerequisites

- Node.js (version 14.x or higher)
- npm (Node Package Manager)
- Carbone.io account and API key

## Usage

1. Install the dependencies:

   ```
   npm i

   ```

2. Start the server:

   ```
   npm run dev

   ```

## Endpoints

Generate Report from local templates

    URL: /generate-report/local
    Method: POST
    Description: Generates a report using a local template.
    Request Body: JSON object containing the data to be populated in the template.
    Response: Success message if the report is generated successfully.

Example:

```
curl -X POST http://localhost:3000/generate-report/local -H "Content-Type: application/json" -d
'{
    "pentestScanDate": "2024-07-09T18:52:46.796842",
    "customerName": "Test Axel",
    "llm_name": "Llama 3"
}'
```

Generate Report Using Template ID

    URL: /generate-report/template-id
    Method: POST
    Description: Generates a report using a remote template from Carbone.io.
    Request Body: JSON object containing the data to be populated in the template. The report field should specify which template to use (ML or Pentest).
    Response: JSON object containing the success message, render URL, and render ID if the report is generated successfully.

Example:

```
curl -X POST http://localhost:3000/generate-report/local -H "Content-Type: application/json" -d
'{  "data": {
        "pentestScanDate": "2024-07-09T18:52:46.796842",
        "customerName": "Test Axel",
        "llm_name": "Llama 3"
    },
    "convertTo": "pdf",
    "report": "PENTEST"
}'
```
