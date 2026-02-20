from huggingface_hub import hf_hub_download
import os

REPO_ID = "microsoft/Phi-3-mini-4k-instruct-gguf"
FILENAME = "Phi-3-mini-4k-instruct-q4.gguf"
LOCAL_DIR = "./models"

def download():
    if not os.path.exists(LOCAL_DIR):
        os.makedirs(LOCAL_DIR)
    
    print(f"Starting download of {FILENAME}...")
    print("This may take a while (approx 2.4 GB)...")
    
    try:
        path = hf_hub_download(
            repo_id=REPO_ID, 
            filename=FILENAME, 
            local_dir=LOCAL_DIR, 
            local_dir_use_symlinks=False
        )
        print(f"Successfully downloaded to: {path}")
    except Exception as e:
        print(f"Error downloading: {e}")

if __name__ == "__main__":
    download()
