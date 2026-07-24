import os
import sys
import time
import socket
import subprocess
import urllib.request
import webbrowser

# ==========================================
# SilentVoice AI Launcher v3
# ==========================================

HOST = "127.0.0.1"
PORT = 8001

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

BACKEND_DIR = os.path.join(BASE_DIR, "backend")

PYTHON_EXE = os.path.join(
    BASE_DIR,
    ".mlvenv",
    "Scripts",
    "python.exe"
)

MAIN_FILE = os.path.join(
    BACKEND_DIR,
    "main.py"
)

HEALTH_URL = f"http://{HOST}:{PORT}/health"

HOME_URL = f"http://{HOST}:{PORT}"


# ==========================================
# Banner
# ==========================================

print(r"""

╔══════════════════════════════════════════════╗
║                                              ║
║              SilentVoice AI                  ║
║       Giving Every Gesture a Voice 🤟        ║
║                                              ║
╚══════════════════════════════════════════════╝

""")


# ==========================================
# Check Server
# ==========================================

def server_running():

    try:

        with socket.create_connection(

            (HOST, PORT),

            timeout=1

        ):

            return True

    except:

        return False


# ==========================================
# Check Environment
# ==========================================

print("Checking Project...\n")

if not os.path.exists(PYTHON_EXE):

    print("❌ Python Environment not found")

    input("\nPress Enter to Exit...")

    sys.exit()


print("✅ Python Environment")


if not os.path.exists(MAIN_FILE):

    print("❌ backend/main.py not found")

    input("\nPress Enter to Exit...")

    sys.exit()


print("✅ Backend Found")


# ==========================================
# Start Backend
# ==========================================

if not server_running():

    print("\nStarting FastAPI Backend...\n")

    subprocess.Popen(

        [PYTHON_EXE, "main.py"],

        cwd=BACKEND_DIR

    )

else:

    print("\nBackend already running.\n")


# ==========================================
# Wait For Health
# ==========================================

print("Loading Backend", end="", flush=True)

while True:

    try:

        urllib.request.urlopen(HEALTH_URL)

        break

    except:

        print(".", end="", flush=True)

        time.sleep(1)

print("\n")


# ==========================================
# Launch Browser
# ==========================================

print("Opening Browser...\n")

webbrowser.open(HOME_URL)


# ==========================================
# Finish
# ==========================================

print("==========================================")
print(" SilentVoice AI is Ready!")
print("==========================================")
print()
print(f" Local URL : {HOME_URL}")
print()
print("You may now use SilentVoice AI.")
print()