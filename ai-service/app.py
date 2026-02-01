import json
import random
import nltk
import json
import random
import nltk
import traceback
import re
import requests
import os
from flask import Flask, request, jsonify
from nltk.stem import PorterStemmer

app = Flask(__name__)

# --- CONFIGURATION (UPDATED) ---
# New API URL structure
API_URL = "https://router.huggingface.co/hf-inference/models/j-hartmann/emotion-english-distilroberta-base"

# Get token
HF_TOKEN = os.environ.get("HF_TOKEN") 
# Fallback for local testing if env var isn't set (Replace with your actual token for local test)
if not HF_TOKEN:
    # prompt user or use a hardcoded string ONLY for local testing
    print("⚠️ WARNING: HF_TOKEN not found in environment variables.")

headers = {"Authorization": f"Bearer {HF_TOKEN}"}

# ... (Rest of the code remains exactly the same) ...

# --- NLTK SETUP ---
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('tokenizers/punkt_tab')
except LookupError:
    nltk.download('punkt')
    nltk.download('punkt_tab')

stemmer = PorterStemmer()

# Load Data
try:
    with open('bot_data.json', 'r') as f:
        BOT_DATA = json.load(f)
    print("✅ Bot Data Loaded!")
except Exception as e:
    print(f"❌ DATA CRASH: {e}")
    BOT_DATA = None

# ---------------------------------------------------------
# HELPER: Query Hugging Face API
# ---------------------------------------------------------
def query_emotion_api(payload):
    try:
        response = requests.post(API_URL, headers=headers, json=payload)
        return response.json()
    except Exception as e:
        print(f"API Error: {e}")
        return None

# ---------------------------------------------------------
# CORE LOGIC
# ---------------------------------------------------------
def check_chitchat(text):
    cleaned_text = text.lower().strip()
    if not BOT_DATA or 'chitchat' not in BOT_DATA: return None

    for category in BOT_DATA['chitchat']:
        for pattern in category['patterns']:
            if re.search(r'\b' + re.escape(pattern) + r'\b', cleaned_text):
                return random.choice(category['responses'])
            if pattern in cleaned_text and "name" in pattern:
                 return random.choice(category['responses'])
    return None

def get_smart_reply(text):
    if not BOT_DATA: return {"reply": "Error: bot_data.json is missing."}

    # 1. Check Chitchat
    chitchat_response = check_chitchat(text)
    if chitchat_response:
        return {"reply": chitchat_response, "debug_info": {"context": "chitchat"}}

    # 2. Call AI API for Emotion
    emotion = "neutral" # Default
    try:
        api_response = query_emotion_api({"inputs": text})
        # API returns: [[{'label': 'fear', 'score': 0.9}, ...]]
        if isinstance(api_response, list) and len(api_response) > 0:
             # Get the top label
             top_emotion = api_response[0][0]['label']
             emotion = top_emotion
        elif isinstance(api_response, dict) and "error" in api_response:
             print(f"HF API Error: {api_response['error']}")
             # If model is loading, it sends an error. We fallback to neutral.
    except Exception as e:
        print(f"Emotion Check Failed: {e}")

    # 3. Detect Context & Reply
    user_words = [stemmer.stem(w.lower()) for w in nltk.word_tokenize(text)]
    detected_intent = None
    
    for intent in BOT_DATA['intents']:
        intent_keywords = [stemmer.stem(k) for k in intent['keywords']]
        if any(word in user_words for word in intent_keywords):
            detected_intent = intent
            break
    
    reply = ""
    if detected_intent:
        if emotion in detected_intent['responses']:
            reply = random.choice(detected_intent['responses'][emotion])
        else:
            reply = f"I hear you talking about {detected_intent['id']}. Tell me more. "
    else:
        fallbacks = BOT_DATA['fallbacks'].get(emotion, BOT_DATA['fallbacks']['neutral'])
        reply = random.choice(fallbacks)
        
    return {
        "reply": reply,
        "debug_info": {
            "detected_emotion": emotion,
            "detected_context": detected_intent['id'] if detected_intent else "none"
        }
    }

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        response_data = get_smart_reply(data.get('message', ''))
        return jsonify(response_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)