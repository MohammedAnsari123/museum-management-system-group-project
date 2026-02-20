from flask import Blueprint, request, jsonify
import os
from huggingface_hub import hf_hub_download
from llama_cpp import Llama

chatbot_bp = Blueprint('chatbot', __name__)

# Configuration
REPO_ID = "microsoft/Phi-3-mini-4k-instruct-gguf"
FILENAME = "Phi-3-mini-4k-instruct-q4.gguf" # Using q4 quantization for speed/size balance
MODEL_PATH = f"./models/{FILENAME}"

# Global Model Holder
llm = None

def load_model():
    global llm
    if llm is None:
        try:
            if not os.path.exists("./models"):
                os.makedirs("./models")
            
            # Check if file exists and has size (simple check)
            if not os.path.exists(MODEL_PATH):
                print(f"Model file {FILENAME} not found. Triggering download...")
                try:
                    hf_hub_download(repo_id=REPO_ID, filename=FILENAME, local_dir="./models", local_dir_use_symlinks=False)
                except Exception as dl_err:
                    print(f"Download failed inside route: {dl_err}")
                    return # Exit if download fails
            
            # Check size (approx 2.4GB -> 2.3e9 bytes)
            if os.path.getsize(MODEL_PATH) < 1000000000: # If less than 1GB, probably partial or wrong
                 print("Model file seems too small. It might be downloading or corrupted.")
                 return

            print("Loading Llama model...")
            llm = Llama(
                model_path=MODEL_PATH,
                n_ctx=2048, # Reduced from 4096 for speed
                n_threads=6, # Optimize for logical cores, adjust if needed
                n_batch=512,
                n_gpu_layers=-1, 
                verbose=True
            )
            print("Model loaded successfully.")
        except Exception as e:
            print(f"Failed to load model: {e}")

# Load model on startup? Or lazy load? 
# Better to lazy load on first request or explicitly call it from main.
# For now, we'll let main call it or check in the route.

FORBIDDEN_TOPICS = [
    "football", "soccer", "cricket", "basketball", "sport", "gym", "workout", "fitness", 
    "politics", "modi", "biden", "trump", "minister", "government", 
    "movie", "film", "cinema", "hollywood", "bollywood", "actor", "actress",
    "coding", "programming", "java", "python", "html", "css",
    "recipe", "cook", "food"
]

@chatbot_bp.route('/api/chat', methods=['POST'])
def chat_api():
    global llm
    if llm is None:
        load_model()
        if llm is None:
             # Check if file exists to give better hint
             if os.path.exists(MODEL_PATH) and os.path.getsize(MODEL_PATH) < 1000000000:
                 return jsonify({'response': "I am currently downloading my brain (Model). Please wait a few minutes and try again."})
             return jsonify({'response': "Chatbot is currently initializing. Please try again in a moment."})

    data = request.json
    user_message = data.get('message', '')
    
    # 1. Hard Filter
    user_msg_lower = user_message.lower()
    for word in FORBIDDEN_TOPICS:
        if word in user_msg_lower and "museum" not in user_msg_lower: # Allow "museum of cinema" etc.
             return jsonify({'response': f"I specialize in museum and history topics. I cannot discuss '{word}'."})

    # 2. Construct Prompt (Phi-3 format)
    # <|user|>\nQuestion<|end|>\n<|assistant|>
    
    system_prompt = (
        "You are a Museum Guide AI. Answer ONLY questions about museums, history, art, culture, and artifacts. "
        "If a question is off-topic (sports, coding, movies, daily life), politely REFUSE. "
        "Keep answers concise and helpful."
    )
    
    prompt = f"<|system|>\n{system_prompt}<|end|>\n<|user|>\n{user_message}<|end|>\n<|assistant|>"

    try:
        output = llm(
            prompt,
            max_tokens=256,
            stop=["<|end|>"],
            echo=False,
            temperature=0.7
        )
        response_text = output['choices'][0]['text'].strip()
        return jsonify({'response': response_text})
        
    except Exception as e:
        print(f"Generation Error: {e}")
        return jsonify({'response': "I'm having trouble thinking right now."})

@chatbot_bp.route('/api/chat/reset', methods=['POST'])
def chat_reset():
    # Stateless for now, but valid endpoint
    return jsonify({'status': 'success'})
