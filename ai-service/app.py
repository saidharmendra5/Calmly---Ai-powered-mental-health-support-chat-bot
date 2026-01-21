import json
import random
import nltk
import traceback
import re  # <--- Added Regex library
from flask import Flask, request, jsonify
from transformers import pipeline
from nltk.stem import PorterStemmer

app = Flask(__name__)

# --- NLTK SETUP ---
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('tokenizers/punkt_tab')
except LookupError:
    nltk.download('punkt')
    nltk.download('punkt_tab')

stemmer = PorterStemmer()

print("⏳ Loading AI Model...")
try:
    # Load the emotion model
    emotion_classifier = pipeline(
        "text-classification", 
        model="j-hartmann/emotion-english-distilroberta-base", 
        top_k=1
    )
    print("✅ AI Brain Ready!")
except Exception as e:
    print(f"❌ MODEL CRASH: {e}")

# Load Data
try:
    with open('bot_data.json', 'r') as f:
        BOT_DATA = json.load(f)
    print("✅ Bot Data Loaded!")
except Exception as e:
    print(f"❌ DATA CRASH: {e}")
    BOT_DATA = None

# ---------------------------------------------------------
# NEW FUNCTION: Check Chitchat (Layer 0)
# ---------------------------------------------------------
def check_chitchat(text):
    """
    Checks if the user message matches any common patterns (hi, how are you, etc).
    Returns a response string if matched, otherwise None.
    """
    cleaned_text = text.lower().strip()
    
    if not BOT_DATA or 'chitchat' not in BOT_DATA:
        return None

    for category in BOT_DATA['chitchat']:
        for pattern in category['patterns']:
            # We use Regex to look for the pattern inside the text
            # \b ensures "hi" matches "hi!" but NOT "hiding"
            # re.IGNORECASE handles upper/lowercase
            if re.search(r'\b' + re.escape(pattern) + r'\b', cleaned_text):
                return random.choice(category['responses'])
            
            # Special check for phrases like "my name is..." where the pattern is at the start
            if pattern in cleaned_text and "name" in pattern:
                 return random.choice(category['responses'])

    return None

# ---------------------------------------------------------
# CORE LOGIC
# ---------------------------------------------------------
def get_smart_reply(text):
    if not BOT_DATA:
        return {"reply": "Error: bot_data.json is missing."}

    # --- LAYER 0: Small Talk Check ---
    # We check this FIRST. If it matches, we skip the AI model entirely.
    chitchat_response = check_chitchat(text)
    if chitchat_response:
        return {
            "reply": chitchat_response,
            "debug_info": {
                "detected_emotion": "neutral",
                "detected_context": "chitchat"
            }
        }

    # --- LAYER 1: AI Emotion & Context ---
    try:
        # 1. Detect Emotion
        result = emotion_classifier(text)
        emotion = result[0][0]['label']
        
        # 2. Detect Context
        user_words = [stemmer.stem(w.lower()) for w in nltk.word_tokenize(text)]
        detected_intent = None
        
        for intent in BOT_DATA['intents']:
            intent_keywords = [stemmer.stem(k) for k in intent['keywords']]
            if any(word in user_words for word in intent_keywords):
                detected_intent = intent
                break
        
        # 3. Select Response
        reply = ""
        if detected_intent:
            if emotion in detected_intent['responses']:
                reply = random.choice(detected_intent['responses'][emotion])
            else:
                reply = f"I hear you talking about {detected_intent['id']}, but I'm not sure how to respond to that specific emotion yet. Tell me more."
        else:
            # Fallback if no context found
            fallbacks = BOT_DATA['fallbacks'].get(emotion, BOT_DATA['fallbacks']['neutral'])
            reply = random.choice(fallbacks)
            
        return {
            "reply": reply,
            "debug_info": {
                "detected_emotion": emotion,
                "detected_context": detected_intent['id'] if detected_intent else "none"
            }
        }
    except Exception as e:
        traceback.print_exc()
        return {"reply": "I'm having trouble thinking right now.", "error_details": str(e)}

# ---------------------------------------------------------
# API ROUTE
# ---------------------------------------------------------
@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        response_data = get_smart_reply(user_message)
        return jsonify(response_data)

    except Exception as e:
        return jsonify({"error": "Server Error", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)