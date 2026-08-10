import os
import sys
import time
import socket
import subprocess
import webbrowser


# ==========================================
# SilentVoice AI Launcher
# ==========================================

HOST = "127.0.0.1"

MAIN_PORT = 8001
EYE_PORT = 8002


BASE_DIR = os.path.dirname(os.path.abspath(__file__))


# ==========================================
# Main Backend
# ==========================================

BACKEND_DIR = os.path.join(
    BASE_DIR,
    "backend"
)

MAIN_PYTHON = os.path.join(
    BASE_DIR,
    ".mlvenv",
    "Scripts",
    "python.exe"
)

MAIN_FILE = os.path.join(
    BACKEND_DIR,
    "main.py"
)


# ==========================================
# Eye Blink Backend
# ==========================================

EYE_BACKEND_DIR = os.path.join(
    BACKEND_DIR,
    "eye_backend"
)

EYE_PYTHON = os.path.join(
    EYE_BACKEND_DIR,
    ".venv",
    "Scripts",
    "python.exe"
)

EYE_MAIN = os.path.join(
    EYE_BACKEND_DIR,
    "main.py"
)


# ==========================================
# Website
# ==========================================

HOME_URL = f"http://{HOST}:{MAIN_PORT}/login"


# ==========================================
# Helper Function
# ==========================================

def port_running(port):

    try:

        with socket.create_connection(
            (HOST, port),
            timeout=1
        ):

            return True

    except:

        return False


# ==========================================
# Project Checks
# ==========================================

print()
print("===================================")
print("       SilentVoice AI Launcher")
print("===================================")
print()

if not os.path.exists(MAIN_PYTHON):

    print("❌ Main Python environment not found.")
    input("\nPress Enter to close...")
    sys.exit()


print("✅ Main Python environment found.")


if not os.path.exists(EYE_PYTHON):

    print("❌ Eye Backend environment not found.")
    input("\nPress Enter to close...")
    sys.exit()


print("✅ Eye Backend environment found.")


if not os.path.exists(MAIN_FILE):

    print("❌ backend/main.py not found.")
    input("\nPress Enter to close...")
    sys.exit()


print("✅ Main Backend found.")


if not os.path.exists(EYE_MAIN):

    print("❌ eye_backend/main.py not found.")
    input("\nPress Enter to close...")
    sys.exit()


print("✅ Eye Backend found.")


# ==========================================
# Start Main Backend
# ==========================================

if not port_running(MAIN_PORT):

    print()
    print("Starting Main Backend...")

    subprocess.Popen(
        [
            MAIN_PYTHON,
            "main.py"
        ],
        cwd=BACKEND_DIR
    )

else:

    print()
    print("Main Backend already running.")


# ==========================================
# Start Eye Backend
# ==========================================

if not port_running(EYE_PORT):

    print("Starting Eye Backend...")

    subprocess.Popen(
        [
            EYE_PYTHON,
            "main.py"
        ],
        cwd=EYE_BACKEND_DIR
    )

else:

    print("Eye Backend already running.")


# ==========================================
# Wait For Servers
# ==========================================

print()
print("Waiting for servers", end="", flush=True)

for i in range(30):

    main_ready = port_running(MAIN_PORT)
    eye_ready = port_running(EYE_PORT)

    if main_ready and eye_ready:

        break

    print(".", end="", flush=True)

    time.sleep(1)

print()
print()


# ==========================================
# Server Status
# ==========================================

if port_running(MAIN_PORT):

    print("✅ Main Backend : http://127.0.0.1:8001")

else:

    print("❌ Main Backend failed to start.")


if port_running(EYE_PORT):

    print("✅ Eye Backend  : http://127.0.0.1:8002")

else:

    print("❌ Eye Backend failed to start.")


# ==========================================
# Open Google Chrome
# ==========================================

print()
print("Opening Google Chrome...")


CHROME_PATHS = [

    r"C:\Program Files\Google\Chrome\Application\chrome.exe",

    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",

    os.path.expandvars(
        r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
    )
]


chrome_opened = False


for chrome_path in CHROME_PATHS:

    if os.path.exists(chrome_path):

        subprocess.Popen(
            [
                chrome_path,
                HOME_URL
            ]
        )

        chrome_opened = True

        break


# ==========================================
# Fallback Browser
# ==========================================

if not chrome_opened:

    print("⚠️ Chrome executable not found.")

    print("Opening default browser instead...")

    webbrowser.open(HOME_URL)


# ==========================================
# Finished
# ==========================================

print()
print("===================================")
print("        SilentVoice AI Ready")
print("===================================")
print()
print("Main Backend : 8001")
print("Eye Backend  : 8002")
print()
print(f"Website      : {HOME_URL}")
print()
print("===================================")

input("\nPress Enter to close launcher...")