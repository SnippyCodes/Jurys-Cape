from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.core.config import settings

# 1. Setup Gemini embeddings
try:
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/text-embedding-004",
        google_api_key=settings.GEMINI_API_KEY
    )
except Exception as e:
    print(f"Warning: Failed to load embeddings: {e}")
    embeddings = None

# 2. Setup Vector Store (FAISS)
vector_db = None
if embeddings:
    try:
        vector_db = FAISS.load_local("data/faiss_index", embeddings, allow_dangerous_deserialization=True)
    except:
        # Initialize empty if not exists
        try:
            vector_db = FAISS.from_texts(["Initial setup"], embeddings)
            vector_db.save_local("data/faiss_index")
        except Exception as e:
            print(f"Warning: Failed to create vector db: {e}")


def add_documents_to_db(text: str):        
    """Splits text and adds it to the local vector database."""
    if not vector_db:
        return "Vector DB not initialized."
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = text_splitter.create_documents([text])
    vector_db.add_documents(chunks)
    vector_db.save_local("data/faiss_index") # Explicit save for FAISS
    return "Successfully indexed document."

def search_legal_precedents(query: str):
    """
    Searches the local legal vector database for relevant case laws, precedents, and BNS (Bharatiya Nyaya Sanhita) sections.
    Use this when the user asks about specific laws, legal definitions, or past case examples.
    """
    if not vector_db:
        return []
        
    results = vector_db.similarity_search(query, k=2)
    return [res.page_content for res in results]