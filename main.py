from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import os
import requests
from dotenv import load_dotenv
import aiofiles

load_dotenv()

app = FastAPI()
PORT = 3000
templateML = os.getenv("TEMPLATE_ML_ID")
templatePentest = os.getenv("TEMPLATE_PENTEST_ID")
token = os.getenv("TOKEN")

@app.post("/generate-report/template-id")
async def generate_report_template_id(body: dict):
    try:
        print(body)
        template_id = templateML if body["report"]  == "ML" else templatePentest
        print(template_id)
        response = requests.post(
            f"https://api.carbone.io/render/{template_id}",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token}",
            },
            json=body,
        )
        print(response.text)
        if not response.ok:
            raise HTTPException(status_code=response.status_code, detail=f"HTTP error! Status: {response.status_code}")

        result = response.json()
        render_id = result["data"].get("renderId")
        file_url = f"https://api.carbone.io/render/{render_id}"

        file_response = requests.get(file_url)
        if not file_response.ok:
            raise HTTPException(status_code=file_response.status_code, detail=f"HTTP error! Status: {file_response.status_code}")

        file_path = f"./files/{render_id}.pdf"
        async with aiofiles.open(file_path, "wb") as f:
            await f.write(file_response.content)

        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Document rendered and downloaded successfully",
                "renderUrl": file_url,
                "renderId": render_id,
            },
        )
    except Exception as e:
        print(f"Error generating report: {e}")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "Error rendering document",
                "error": str(e),
            },
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
