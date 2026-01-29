
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key found: {api_key[:5]}...{api_key[-5:] if api_key else 'None'}")

if not api_key:
    print("No API Key found!")
    exit(1)

genai.configure(api_key=api_key)

print("\n--- Testing Text Generation (gemini-1.5-flash) ---")
try:
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Hello, can you hear me?")
    print(f"Response: {response.text}")
    print("SUCCESS: Text Generation works.")
except Exception as e:
    print(f"FAILED: Text Generation failed with: {e}")

print("\n--- Testing Embeddings (models/text-embedding-004) ---")
try:
    result = genai.embed_content(
        model="models/text-embedding-004",
        content="Hello world",
        task_type="retrieval_document",
        title="Embedding verification"
    )
    print("SUCCESS: Embeddings generated.")
except Exception as e:
    print(f"FAILED: Embeddings failed with: {e}")

print("\n--- Testing Chat with Tools ---")
try:
    def test_tool(query: str):
        return "This is a dummy legal search result."

    chat_model = genai.GenerativeModel('gemini-1.5-flash', tools=[test_tool])
    chat = chat_model.start_chat(enable_automatic_function_calling=True)
    res = chat.send_message("What is the legal search result?")
    print(f"Response: {res.text}")
    print("SUCCESS: Chat with tools works.")
except Exception as e:
    print(f"FAILED: Chat with tools failed with: {e}")
