Absolutely. The previous README was **too detailed for GitHub**. You want something that looks professional, explains the project quickly, and doesn't overwhelm someone opening the repository.

Use this **precise copy-paste version**:

# SilentVoice AI

### AI-Powered Assistive Communication System

> **Turning gestures and eye movements into meaningful communication.**

SilentVoice AI is an AI-powered communication system developed during my internship. It uses **Machine Learning and Computer Vision** to convert **ASL hand gestures and eye-blink patterns into text and speech**.

---

## 🚀 Features

### 🤟 Sign Language Recognition

* ASL alphabet recognition using a **CNN model**
* Image upload and real-time camera detection
* **MediaPipe** hand detection
* Prediction confidence and word building
* Text-to-Speech output

### 👁️ Eye Blink Morse Communication

* Real-time eye-blink detection
* **Eye Aspect Ratio (EAR)** based blink detection
* Converts blinks into **DOT / DASH**
* Morse Code decoding into letters and sentences
* Text-to-Speech output

### 🔐 Application

* User registration and login
* Dashboard
* Profile
* Detection interface
* SQLite database
* Prediction history
* Clear and reset functionality
* Automated launcher
* Separate backend services

---

## 🏗️ Architecture

```text
                    SilentVoice AI
                          │
             ┌────────────┴────────────┐
             │                         │
      Sign Language              Eye Blink
             │                         │
       MediaPipe + CNN           Face / Eye Detection
             │                         │
        ASL Prediction              EAR
             │                         │
             │                  Morse Code
             │                         │
             └────────────┬────────────┘
                          │
                       FastAPI
                          │
                    Web Application
                          │
                    Text + Speech
```

---

## 🛠️ Tech Stack

**Languages:**
Python, JavaScript, HTML, CSS

**AI / ML:**
TensorFlow, Keras, CNN

**Computer Vision:**
OpenCV, MediaPipe, NumPy

**Backend:**
FastAPI, REST APIs, Uvicorn

**Database:**
SQLite

**Tools:**
Git, GitHub, GitHub Actions, PowerShell

---

## ⚙️ Backend

SilentVoice uses two separate FastAPI services:

| Service      |   Port | Purpose                          |
| ------------ | -----: | -------------------------------- |
| Main Backend | `8001` | Main application & Sign Language |
| Eye Backend  | `8002` | Eye Blink & Morse Code           |

The services use separate Python environments for dependency isolation.

---

## 📂 Project Structure

```text
SilentVoice/
│
├── backend/
│   ├── main.py
│   └── eye_backend/
│       ├── main.py
│       ├── routes.py
│       ├── eye_detector.py
│       ├── blink_detector.py
│       ├── morse_interpreter.py
│       └── decoder.py
│
├── .mlvenv/
│
└── launcher.py
```

---

## ▶️ Running Locally

### Main Backend

powershell
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload


### Eye Blink Backend
powershell
cd backend\eye_backend
.\.venv\Scripts\Activate.ps1
python main.py


Open:
http://127.0.0.1:8001/login

### One-Click Launch

`launcher.py` automatically:

* Checks both Python environments
* Starts both backend services
* Checks running ports
* Waits for the servers
* Opens SilentVoice in Chrome

---

## 🎯 Project Workflow

### Sign Language
Image / Camera
      ↓
MediaPipe
      ↓
CNN Model
      ↓
ASL Prediction
      ↓
Text
      ↓
Speech
```

### Eye Blink
Camera
   ↓
Eye Detection
   ↓
EAR
   ↓
Blink
   ↓
Morse Code
   ↓
Text
   ↓
Speech
```

---

## 🧪 Key Learning

This project provided hands-on experience in integrating **Machine Learning, Computer Vision, FastAPI, frontend development, databases, real-time camera processing, and application deployment** into a single working system.

---

## 📌 Status

**Working Prototype**

Core Sign Language and Eye Blink communication workflows are implemented and integrated.

---

## 🔮 Future Scope

* Dynamic sign-language recognition
* Expanded vocabulary
* Improved prediction accuracy
* Cloud deployment
* Scalable inference
* Mobile application
* Enhanced communication history and analytics

---

## 👨‍💻 Internship Project

**SilentVoice AI was developed during my internship** as a practical implementation of AI/ML and Computer Vision concepts into an end-to-end application.

> **From gestures and eye movements to meaningful communication. 🚀**
