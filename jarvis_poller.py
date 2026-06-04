import requests
import time
import webbrowser
import os

# Configuration
API_BASE_URL = "https://jar-git-main-blunets-projects.vercel.app/api"
AUTH_TOKEN = "newkey@123"
POLL_INTERVAL = 5  # seconds

headers = {
    "Authorization": f"Bearer {AUTH_TOKEN}",
    "Content-Type": "application/json"
}

def execute_command(command_data):
    command_text = command_data.get("command", "").lower()
    command_id = command_data.get("id")
    
    print(f"[JARVIS] Command received: {command_text}")
    print("[JARVIS] Executing...")
    
    try:
        if "open youtube" in command_text:
            webbrowser.open("https://www.youtube.com")
            print("[JARVIS] Opened YouTube in browser.")
        elif "open google" in command_text:
            webbrowser.open("https://www.google.com")
            print("[JARVIS] Opened Google in browser.")
        else:
            print(f"[JARVIS] Unknown command: {command_text}")
            
        # Update status to completed
        update_status(command_id, "completed")
        print("[JARVIS] Completed.")
        
    except Exception as e:
        print(f"[JARVIS] Error during execution: {e}")
        update_status(command_id, "failed")

def update_status(command_id, status):
    url = f"{API_BASE_URL}/command-status"
    payload = {
        "id": command_id,
        "status": status
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        if response.status_code == 200:
            print(f"[JARVIS] Status updated to {status} for {command_id}")
        else:
            print(f"[JARVIS] Failed to update status. Code: {response.status_code}")
            if response.status_code in [401, 403]:
                print("[JARVIS] Authentication failed.")
    except Exception as e:
        print(f"[JARVIS] Error updating status: {e}")

def poll_commands():
    url = f"{API_BASE_URL}/latest-command"
    
    print(f"[JARVIS] Polling API at {url}...")
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            command = response.json()
            if command and command.get("id"):
                execute_command(command)
            else:
                # No pending commands
                pass
        elif response.status_code in [401, 403]:
            print("[JARVIS] Authentication failed.")
        else:
            print(f"[JARVIS] API Error. Code: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"[JARVIS] Connection error: {e}")

def main():
    print("--- JARVIS Local Poller Started ---")
    print(f"Target API: {API_BASE_URL}")
    
    try:
        while True:
            poll_commands()
            time.sleep(POLL_INTERVAL)
    except KeyboardInterrupt:
        print("\n[JARVIS] Poller stopped by user.")

if __name__ == "__main__":
    main()
