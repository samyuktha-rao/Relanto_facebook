import os
import tempfile
import requests
import chromadb
from chromadb.utils import embedding_functions
from pypdf import PdfReader
import google.generativeai as genai
from flask import Flask, request

app = Flask(__name__)
from dotenv import load_dotenv
load_dotenv(dotenv_path="../.env")  # Adjust path if needed
# Set your Gemini API key here or via environment variable
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'YOUR_GEMINI_API_KEY')
genai.configure(api_key=GEMINI_API_KEY)

# ChromaDB setup (in-memory for demo)
chroma_client = chromadb.Client()
collection = chroma_client.create_collection('relanto_pdf')



# --- Hardcoded PDF path ---
PDF_PATH = "c:/Users/Samyuktha M Rao/Project/internal_facebook/Relanto Employee Handbook.pdf"  # <-- Updated to your new PDF

# Load and embed PDF on server start
def load_and_embed_pdf():
    reader = PdfReader(PDF_PATH)
    text = "\n".join(page.extract_text() or '' for page in reader.pages)
    chunk_size = 500
    chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
    embed_fn = embedding_functions.GoogleGenerativeAiEmbeddingFunction(
        api_key=GEMINI_API_KEY, model_name="models/embedding-001"
    )
    collection.add(documents=chunks, ids=[f'chunk-{i}' for i in range(len(chunks))], embeddings=embed_fn(chunks))

load_and_embed_pdf()


# Helper: Detect greetings
def is_greeting(text):
    greetings = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"]
    return any(greet in text.lower() for greet in greetings)

# RAG Chat endpoint (conversational)
@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    question = request.json.get('question')
    if not question:
        return {'error': 'No question provided'}, 400

    # Respond to greetings conversationally
    if is_greeting(question):
        return {'answer': "Hello! I'm your HR assistant. Ask me anything about company policies, leaves, or the employee handbook."}

    embed_fn = embedding_functions.GoogleGenerativeAiEmbeddingFunction(
        api_key=GEMINI_API_KEY, model_name="models/embedding-001"
    )
    q_emb = embed_fn([question])[0]
    results = collection.query(query_embeddings=[q_emb], n_results=3)
    context = "\n".join(results['documents'][0]) if results['documents'] else ''
    model = genai.GenerativeModel('gemini-pro')
    prompt = f"Context from Relanto Employee Handbook:\n{context}\n\nUser question: {question}\n\nAnswer conversationally and clearly:"
    response = model.generate_content(prompt)
    return {'answer': response.text}

