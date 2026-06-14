import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

key = os.getenv("GEMINI_API_KEY")
print("KEY FOUND:", key[:10] + "...")

genai.configure(api_key=key)

model = genai.GenerativeModel("gemini-1.5-flash")

response = model.generate_content("Say hello")

print(response.text)