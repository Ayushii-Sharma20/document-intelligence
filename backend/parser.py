import os
import json
import pdfplumber
from pdf2image import convert_from_path
import pytesseract

from classifier import classify_document
from vector_store import store_document

UPLOAD_FOLDER = "uploads"
IMAGE_FOLDER = "page_images"
PARSED_FOLDER = "parsed"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(IMAGE_FOLDER, exist_ok=True)
os.makedirs(PARSED_FOLDER, exist_ok=True)


def process_pdf(file):

    pdf_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(pdf_path, "wb") as f:
        f.write(file.file.read())

    pages = convert_from_path(
        pdf_path,
        poppler_path=r"C:\poppler-26.02.0\Library\bin"
    )

    extracted_pages = []

    with pdfplumber.open(pdf_path) as pdf:

        for i, page in enumerate(pdf.pages):

            image_name = (
                f"{file.filename}_page_{i+1}.png"
            )

            image_path = os.path.join(
                IMAGE_FOLDER,
                image_name
            )

            pages[i].save(
                image_path,
                "PNG"
            )

            text = page.extract_text()

            if not text:
                text = pytesseract.image_to_string(
                    pages[i]
                )

            extracted_pages.append({
                "page": i + 1,
                "text": text,
                "image": image_path
            })

    json_path = os.path.join(
        PARSED_FOLDER,
        file.filename + ".json"
    )

    with open(
        json_path,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            extracted_pages,
            f,
            indent=4,
            ensure_ascii=False
        )

    full_text = ""

    for page in extracted_pages:

        if page["text"]:
            full_text += page["text"] + "\n"

    classification = classify_document(
        full_text[:1000]
    )

    store_document(
        file.filename,
        extracted_pages
    )

    return {
        "document": file.filename,
        "total_pages": len(extracted_pages),
        "classification": classification,
        "json_file": json_path
    }