// Explicitly specify the path to the .env file
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

// Check if the Hugging Face API key is loaded
if (!process.env.HUGGINGFACE_API_KEY) {
    console.error('Error: HUGGINGFACE_API_KEY is not defined. Please check your .env file.');
}

const axios = require('axios');
const pdfParse = require('pdf-parse');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { ChromaClient } = require('chromadb');
const { HfInference } = require('@huggingface/inference');
const path = require('path');

let vectorStore = null;
let embedder = null;
const chromaDbPath = path.resolve(__dirname, '../../chroma_db');
console.log('Initializing ChromaClient with absolute path:', chromaDbPath);
// Update ChromaClient to use a local file-based database
const chromaClient = new ChromaClient({ path: chromaDbPath });
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

console.log('Hugging Face API Key:', process.env.HUGGINGFACE_API_KEY);
console.log('Environment Variables:', process.env); // Debug log to verify .env loading

async function checkChromaDBConnection() {
    try {
        console.log('Attempting to connect to ChromaDB at path:', chromaDbPath);
        await chromaClient.listCollections();
        console.log('Successfully connected to ChromaDB.');
    } catch (error) {
        console.error('Failed to connect to ChromaDB:', error.message);
        if (error.message.includes('CORS')) {
            console.error('Ensure the CHROMA_SERVER_CORS_ALLOW_ORIGINS environment variable is correctly configured.');
        } else if (error.message.includes('Failed to connect')) {
            console.error('Ensure the ChromaDB server is running and accessible at the specified path:', chromaDbPath);
        }
        throw new Error('ChromaDB connection failed. Please ensure the server is running and accessible.');
    }
}

async function initializeVectorStore() {
    if (vectorStore) return;

    try {
        await checkChromaDBConnection();
        vectorStore = await chromaClient.getOrCreateCollection('company_docs');
        console.log('Vector store initialized:', vectorStore);
    } catch (error) {
        console.error('Error initializing vector store:', error);
        if (error.message.includes('Could not connect to tenant')) {
            console.error('Please ensure the ChromaDB instance is running and the path is correct:', chromaDbPath);
        }
        throw new Error('Failed to initialize vector store. Please check ChromaDB setup.');
    }

    if (!embedder) {
        embedder = async (text) => {
            const result = await hf.featureExtraction({
                model: 'sentence-transformers/all-MiniLM-L6-v2',
                inputs: text,
            });
            return result;
        };
    }

    const documentsPath = path.join(__dirname, '../file');
    const documents = [
        'Relanto - Insurance Policy_24-25.pdf',
        'Relanto Employee Handbook Jan 24 _ V 1.2 (1).pdf',
        'Relanto- Work From Home (WFH) Policy_Apr 24.pdf'
    ];

    let docs = [];
    for (const doc of documents) {
        const filePath = path.join(documentsPath, doc);
        try {
            const fileBuffer = require('fs').readFileSync(filePath);
            const parsedData = await pdfParse(fileBuffer);
            console.log(`Extracted text from ${doc}:`, parsedData.text.slice(0, 500)); // Log first 500 characters
            docs.push({ pageContent: parsedData.text, metadata: { source: doc } });
        } catch (error) {
            console.error(`Error processing document ${doc}:`, error);
        }
    }

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const splitDocs = await textSplitter.splitDocuments(docs.map(doc => ({
        pageContent: doc.pageContent || '',
        metadata: doc.metadata || {},
    })));
    console.log('Split documents:', splitDocs.length);

    const embeddings = [];
    for (const doc of splitDocs) {
        const embedding = await embedder(doc.pageContent);
        embeddings.push(embedding);
    }

    // Store embeddings in ChromaDB
    for (let i = 0; i < splitDocs.length; i++) {
        await vectorStore.add({
            id: `doc_${i}`,
            embedding: embeddings[i],
            metadata: splitDocs[i].metadata,
        });
    }

    console.log('Vector store initialized with ChromaDB.');
}

async function getAnswer(question) {
    await initializeVectorStore();

    if (!embedder) {
        embedder = async (text) => {
            const result = await hf.featureExtraction({
                model: 'sentence-transformers/all-MiniLM-L6-v2',
                inputs: text,
            });
            return result;
        };
    }

    const queryEmbedding = await embedder(question);

    // Retrieve relevant chunks from ChromaDB
    const results = await vectorStore.query({
        queryEmbedding: queryEmbedding[0],
        nResults: 5,
    });

    const relevantDocs = results.map(result => result.metadata);
    console.log('Relevant documents retrieved:', relevantDocs.length);

    // Combine the relevant chunks into a single context
    let context = relevantDocs.map(doc => doc.pageContent).join('\n\n');
    if (!context) {
        console.warn('No relevant documents found. Using fallback context.');
        context = 'I could not find any relevant information in the company documents.';
    }
    console.log('Context for Gemini API:', context.slice(0, 500)); // Log first 500 characters

    try {
        // Call the Gemini API
        const response = await axios.post('https://api.gemini.com/v1/answer', {
            question,
            context
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Gemini API response:', response.data);
        return response.data.answer;
    } catch (error) {
        console.error('Error getting answer from Gemini API:', error.response?.data || error.message);
        return 'I encountered an error while trying to retrieve the answer. Please try again later.';
    }
}

module.exports = { getAnswer };
