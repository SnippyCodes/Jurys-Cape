from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.core.config import settings

# 1. Setup Gemini embeddings
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/text-embedding-004",
    google_api_key=settings.GEMINI_API_KEY
)

# 2. Setup Vector Store (This stores the numbers locally in a folder)
# It will create a folder called 'vector_db' in your project
vector_db = Chroma(persist_directory="./data/vector_db", embedding_function=embeddings)

def add_documents_to_db(text: str):        
    """Splits text and adds it to the local vector database."""
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = text_splitter.create_documents([text])
    vector_db.add_documents(chunks)
    return "Successfully indexed document."

def search_legal_precedents(query: str):
    """
    Searches the local legal vector database for relevant case laws, precedents, and BNS (Bharatiya Nyaya Sanhita) sections.
    Use this when the user asks about specific laws, legal definitions, or past case examples.
    """
    results = vector_db.similarity_search(query, k=2)
    return [res.page_content for res in results]