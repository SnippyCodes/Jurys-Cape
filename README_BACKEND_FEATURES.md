# Backend Guide & Features Explained

This guide explains how the "Juris-Cape" backend works in simple terms. It is designed to help frontend developers understand what buttons and features to build.

## 🏗️ What is this Project?
This is a **Smart Legal Assistant**. It uses Artificial Intelligence (Google Gemini) to help lawyers or regular people understand legal cases.
- It can read **Case Files** (text).
- It can look at **Evidence** (Videos, Photos, PDFs).
- It can **Chat** with you about Indian Laws (using a special legal database).

---

## 🛠️ The Technology Stack (How it's built)
- **FastAPI**: The main program that runs the server (the "brain").
- **Google Gemini**: The AI engine. Think of it like a smart legal intern that reads and answers questions.
- **ChromaDB**: A special database that stores "Law Books" (legal precedents). It helps the AI remember laws so it doesn't make things up.
- **No SQL Database**: This app doesn't save user accounts or past cases permanently. It "forgets" everything once you close the page (Stateless).

---

## 🚀 Key Features for the Frontend

### 1. 📝 Analyze a Legal Case (Text)
**What it does:**
You copy-paste the text of a police report or court case (like an FIR). The AI reads it and extracts the important details.

**What to build in UI:**
- A big text box to paste the case details.
- A "Analyze" button.
- A results area showing:
    - **Facts:** A timeline of what happened (e.g., "At 10 PM, X met Y").
    - **Laws:** Which sections of the BNS (Indian Law) apply.
    - **Summary:** A short version of the story.

### 2. 👁️ Analyze Evidence (Video/Image/PDF)
**What it does:**
You upload a photo of a crime scene, a CCTV video, or a PDF document. The AI looks at it and tells you what it sees from a legal perspective.

**What to build in UI:**
- **Upload Buttons** for:
    - 📷 Images (Support .jpg, .png)
    - 🎥 Videos (Support .mp4)
    - 📄 Documents (Support .pdf)
- A text inputs for a **"Prompt"** (e.g., "Is there a weapon in this video?").
- A display area to show the AI's answer.

### 3. 💬 Legal Chat (Ask a Lawyer)
**What it does:**
You ask a question like "What is the punishment for theft?". The AI looks up real Indian laws (from its internal "Law Book" database) and gives you an accurate answer.

**What to build in UI:**
- A **Chat Window** (like WhatsApp or ChatGPT).
- User types a message -> Code sends it to backend -> Backend replies.
- *Note:* It uses "RAG" (Retrieval-Augmented Generation), meaning it looks up facts before answering.

### 4. 🔄 Law Mapper (IPC vs BNS)
**What it does:**
India changed its penal code interactions recently (IPC -> BNS). This tool translates old laws to new ones.
*Example: Old "Section 302" (Murder) might be something else now.*

**What to build in UI:**
- A simple search box: "Enter IPC Section (e.g., 302)".
- A result card showing: "This is now Section 103 under BNS".

---

## 🔌 API Cheat Sheet (How to connect)

The backend runs on: `http://localhost:8000`

| Feature | URL Endpoint | Method | What to send | What you get back |
| :--- | :--- | :--- | :--- | :--- |
| **Analyze Text** | `/api/v1/analyze` | `POST` | JSON: `{ "case_text": "..." }` | JSON with Facts & Summary |
| **Analyze Video** | `/api/v1/gemini/analyze/video` | `POST` | File + Prompt | Text Analysis |
| **Analyze Image** | `/api/v1/gemini/analyze/image` | `POST` | File + Prompt | Text Analysis |
| **Analyze PDF** | `/api/v1/gemini/analyze/doc` | `POST` | File + Prompt | Text Analysis |
| **Chat** | `/api/v1/gemini/chat` | `POST` | Text Message | AI Reply |
| **Map Law** | `/api/v1/map-law/{section_number}` | `GET` | Nothing (Just URL) | The new Section Number |

---
## ⚠️ Important Notes for Developers
1. **No Login System:** You don't need to build a Login/Signup page right now. The backend is open.
2. **Local Processing:** The database runs on your computer (in a folder), so you don't need to connect to a cloud database.
3. **API Key:** You must have a Google Gemini API Key in your `.env` file for the AI to work.
