"""FastAPI server for PDF to Markdown conversion."""

import tempfile
from pathlib import Path

from docling.document_converter import DocumentConverter
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI(
    title="PDF to Markdown API",
    description="Convert PDF files to Markdown using Docling",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check() -> dict:
    """Health check endpoint."""
    return {"status": "healthy"}


@app.post("/convert")
async def convert_pdf(file: UploadFile = File(...)) -> JSONResponse:
    """Convert an uploaded PDF file to Markdown.

    Args:
        file: The uploaded PDF file

    Returns:
        JSON response with the Markdown content and filename
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File must be a PDF")

    try:
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = Path(tmp.name)

        converter = DocumentConverter()
        result = converter.convert(str(tmp_path))
        markdown_content = result.document.export_to_markdown()

        tmp_path.unlink()

        original_name = Path(file.filename).stem

        return JSONResponse(
            content={
                "success": True,
                "filename": f"{original_name}.md",
                "markdown": markdown_content,
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
