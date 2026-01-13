# Juris-Cape: AI Legal Assistant

Juris-Cape is a multimodal AI legal assistant that uses **Google Gemini** to analyze crime scene photos, surveillance videos, and legal documents. It answers legal questions by cross-referencing valid laws (like the Bharatiya Nyaya Sanhita - BNS).

---

## 🚀 How to Run (Step-by-Step)

Follow these instructions to set up the project on your Windows machine.

### Step 1: Prerequisites
- Install **Python 3.10 or higher** ([Download Here](https://www.python.org/downloads/)).
- Get a **Google Gemini API Key** ([Get it for free here](https://aistudio.google.com/app/apikey)).

### Step 2: Configure Environment
1.  **Create a `.env` file**:
    - Look for a file named `.env` in the project folder.
    - If it doesn't exist, create a new text file named `.env`.
    - Open it and add your key like this:
      ```env
      GEMINI_API_KEY=your_actual_api_key_here
      ```
    - Save the file.

### Step 3: Install Dependencies
Open your terminal (PowerShell or Command Prompt) in the `juris- cape` folder and run:
```powershell
pip install -r requirements.txt
```
*(If you are using a virtual environment, make sure it is activated or use the full path to python as shown in recent attempts).*

### Step 4: Verify Everything Works
Before running the server, run the verification script to test Image, Document, and Video analysis.
```powershell
python verify_multimodal.py
```
- It will verify your API key is working.
- It will test image analysis on a generated red square.
- You can optionally paste a path to a video file to test video analysis.

### Step 5: Start the App
Run the backend server:
```powershell
python -m uvicorn app.main:app --reload
```
You should see output saying `Application startup complete`.

### Step 6: Use the App
Open your browser and verify the API at:
👉 **http://127.0.0.1:8000/docs**

You can use the **Try it out** button on endpoints like `/gemini/chat` to ask legal questions.

---

## 📂 Project Overview

- **`app/services/gemini_service.py`**: The brain of the operation. Handles all interactions with Google Gemini.
- **`app/api/endpoints/gemini_routes.py`**: The API links used by the web interface.
- **`data/vector_db`**: Detailed storage for legal precedents (RAG).

## 🆘 Troubleshooting
- **"Module not found" error?**
  Try running with `python -m pip install -r requirements.txt` again.
- **"Quota exceeded" error?**
  We are using the free tier of Gemini. If you hit limits, wait a minute and try again.
- **"Unicode/Emoji" errors?**
  Your terminal might not support emojis. The script is designed to handle this, but if it crashes, try using a modern terminal like Windows Terminal.
