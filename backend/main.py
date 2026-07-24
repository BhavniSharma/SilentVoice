from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from models import User, LoginUser

import sqlite3
import os
import io

import numpy as np
import tensorflow as tf
from PIL import Image


# =====================================================
# Project Paths
# =====================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

PROJECT_DIR = os.path.dirname(BASE_DIR)

FRONTEND_DIR = os.path.join(
    PROJECT_DIR,
    "frontend"
)

MODEL_DIR = os.path.join(
    PROJECT_DIR,
    "model"
)

DATABASE_PATH = os.path.join(
    BASE_DIR,
    "users.db"
)

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "silentvoice_cnn_improved.keras"
)

CLASS_NAMES_PATH = os.path.join(
    MODEL_DIR,
    "class_names.txt"
)


# =====================================================
# FastAPI
# =====================================================

app = FastAPI(
    title="SilentVoice AI",
    version="1.0",
    description="AI Powered Sign Language Recognition API"
)


# =====================================================
# CORS
# =====================================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=False,

    allow_methods=["*"],

    allow_headers=["*"]

)


# =====================================================
# Serve Frontend
# =====================================================

app.mount(

    "/css",

    StaticFiles(
        directory=os.path.join(
            FRONTEND_DIR,
            "css"
        )
    ),

    name="css"

)

app.mount(

    "/js",

    StaticFiles(
        directory=os.path.join(
            FRONTEND_DIR,
            "js"
        )
    ),

    name="js"

)

app.mount(

    "/images",

    StaticFiles(
        directory=os.path.join(
            FRONTEND_DIR,
            "images"
        )
    ),

    name="images"

)


# =====================================================
# Load CNN Model
# =====================================================

print("\nLoading SilentVoice CNN Model...")


if not os.path.exists(MODEL_PATH):

    raise FileNotFoundError(

        f"\nModel not found:\n{MODEL_PATH}"

    )


if not os.path.exists(CLASS_NAMES_PATH):

    raise FileNotFoundError(

        f"\nClass Names file not found:\n{CLASS_NAMES_PATH}"

    )


model = tf.keras.models.load_model(
    MODEL_PATH
)


with open(

    CLASS_NAMES_PATH,

    "r"

) as file:

    class_names = [

        line.strip()

        for line in file.readlines()

        if line.strip()

    ]


print("CNN Model Loaded Successfully.")

print("Detected Classes:")

print(class_names)


# =====================================================
# Frontend Routes
# =====================================================

@app.get("/")
def home():

    return FileResponse(

        os.path.join(

            FRONTEND_DIR,

            "index.html"

        )

    )


@app.get("/login")
def login_page():

    return FileResponse(

        os.path.join(

            FRONTEND_DIR,

            "login.html"

        )

    )


@app.get("/register")
def register_page():

    return FileResponse(

        os.path.join(

            FRONTEND_DIR,

            "register.html"

        )

    )


@app.get("/dashboard")
def dashboard_page():

    return FileResponse(

        os.path.join(

            FRONTEND_DIR,

            "index.html"

        )

    )


@app.get("/profile-page")
def profile_page():

    return FileResponse(

        os.path.join(

            FRONTEND_DIR,

            "profile.html"

        )

    )


@app.get("/detect")
def detect_page():

    return FileResponse(

        os.path.join(

            FRONTEND_DIR,

            "detect.html"

        )

    )


@app.get("/history")
def history_page():

    return FileResponse(

        os.path.join(

            FRONTEND_DIR,

            "history.html"

        )

    )


@app.get("/users-page")
def users_page():

    return FileResponse(

        os.path.join(

            FRONTEND_DIR,

            "users.html"

        )

    )
# =====================================================
# Register User
# =====================================================

@app.post("/users")
def create_user(user: User):

    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id FROM users WHERE email=?",
        (user.email,)
    )

    if cursor.fetchone():

        conn.close()

        raise HTTPException(
            status_code=400,
            detail="Email already exists."
        )

    cursor.execute(
        """
        INSERT INTO users
        (
            name,
            email,
            password,
            age
        )
        VALUES
        (
            ?,?,?,?
        )
        """,
        (
            user.name,
            user.email,
            user.password,
            user.age
        )
    )

    conn.commit()

    user_id = cursor.lastrowid

    conn.close()

    return {

        "message": "Registration Successful",

        "user": {

            "id": user_id,

            "name": user.name,

            "email": user.email,

            "age": user.age

        }

    }


# =====================================================
# Get All Users
# =====================================================

@app.get("/users")
def get_users():

    conn = sqlite3.connect(DATABASE_PATH)

    conn.row_factory = sqlite3.Row

    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users")

    users = cursor.fetchall()

    conn.close()

    return [

        {

            "id": user["id"],

            "name": user["name"],

            "email": user["email"],

            "age": user["age"]

        }

        for user in users

    ]


# =====================================================
# Get User By ID
# =====================================================

@app.get("/users/{user_id}")
def get_user(user_id: int):

    conn = sqlite3.connect(DATABASE_PATH)

    conn.row_factory = sqlite3.Row

    cursor = conn.cursor()

    cursor.execute(

        "SELECT * FROM users WHERE id=?",

        (user_id,)

    )

    user = cursor.fetchone()

    conn.close()

    if not user:

        raise HTTPException(

            status_code=404,

            detail="User not found."

        )

    return {

        "id": user["id"],

        "name": user["name"],

        "email": user["email"],

        "age": user["age"]

    }


# =====================================================
# Update User
# =====================================================

@app.put("/users/{user_id}")
def update_user(
    user_id: int,
    user: User
):

    conn = sqlite3.connect(DATABASE_PATH)

    cursor = conn.cursor()

    cursor.execute(

        """
        UPDATE users

        SET

            name=?,

            email=?,

            password=?,

            age=?

        WHERE id=?

        """,

        (

            user.name,

            user.email,

            user.password,

            user.age,

            user_id

        )

    )

    conn.commit()

    if cursor.rowcount == 0:

        conn.close()

        raise HTTPException(

            status_code=404,

            detail="User not found."

        )

    conn.close()

    return {

        "message": "User Updated Successfully"

    }


# =====================================================
# Delete User
# =====================================================

@app.delete("/users/{user_id}")
def delete_user(user_id: int):

    conn = sqlite3.connect(DATABASE_PATH)

    cursor = conn.cursor()

    cursor.execute(

        "DELETE FROM users WHERE id=?",

        (user_id,)

    )

    conn.commit()

    if cursor.rowcount == 0:

        conn.close()

        raise HTTPException(

            status_code=404,

            detail="User not found."

        )

    conn.close()

    return {

        "message": "User Deleted Successfully"

    }


# =====================================================
# Login
# =====================================================

@app.post("/login")
def login(user: LoginUser):

    conn = sqlite3.connect(DATABASE_PATH)

    conn.row_factory = sqlite3.Row

    cursor = conn.cursor()

    cursor.execute(

        """
        SELECT *

        FROM users

        WHERE

        email=?

        AND

        password=?

        """,

        (

            user.email,

            user.password

        )

    )

    existing_user = cursor.fetchone()

    conn.close()

    if not existing_user:

        raise HTTPException(

            status_code=401,

            detail="Invalid Email or Password."

        )

    return {

        "message": "Login Successful",

        "user": {

            "id": existing_user["id"],

            "name": existing_user["name"],

            "email": existing_user["email"],

            "age": existing_user["age"]

        }

    }


# =====================================================
# Profile
# =====================================================

@app.get("/profile/{user_id}")
def profile(user_id: int):

    conn = sqlite3.connect(DATABASE_PATH)

    conn.row_factory = sqlite3.Row

    cursor = conn.cursor()

    cursor.execute(

        "SELECT * FROM users WHERE id=?",

        (user_id,)

    )

    user = cursor.fetchone()

    conn.close()

    if not user:

        raise HTTPException(

            status_code=404,

            detail="User not found."

        )

    return {

        "id": user["id"],

        "name": user["name"],

        "email": user["email"],

        "age": user["age"]

    }

# =====================================================
# Predict Sign
# =====================================================

@app.post("/predict")
async def predict_sign(file: UploadFile = File(...)):

    try:

        # -------------------------
        # Validate File Type
        # -------------------------

        if not file.content_type.startswith("image/"):

            raise HTTPException(

                status_code=400,

                detail="Only image files are allowed."

            )

        # -------------------------
        # Read Uploaded Image
        # -------------------------

        image_bytes = await file.read()

        image = Image.open(

            io.BytesIO(image_bytes)

        ).convert("RGB")

        # -------------------------
        # Preprocess Image
        # -------------------------

        image = image.resize((64, 64))

        image_array = np.array(

            image,

            dtype=np.float32

        )

        image_array /= 255.0

        image_array = np.expand_dims(

            image_array,

            axis=0

        )

        # -------------------------
        # Predict
        # -------------------------

        predictions = model.predict(

            image_array,

            verbose=0

        )

        top5 = np.argsort(predictions[0])[-5:][::-1]

        print("\n========== TOP 5 PREDICTIONS ==========")
        for i in top5:
            print(f"{class_names[i]} : {predictions[0][i]*100:.2f}%")
        print("=======================================\n")

        predicted_index = int(

            np.argmax(predictions[0])

        )

        predicted_sign = class_names[predicted_index]

        confidence = float(

            np.max(predictions[0]) * 100

        )

        # -------------------------
        # Response
        # -------------------------

        return {

            "prediction": predicted_sign,

            "confidence": round(confidence, 2)

        }

    except HTTPException:

        raise

    except Exception as error:

        raise HTTPException(

            status_code=500,

            detail=f"Prediction Failed: {str(error)}"

        )


# =====================================================
# Health Check
# =====================================================

@app.get("/health")
def health():

    return {

        "status": "Running",

        "model_loaded": True,

        "total_classes": len(class_names)

    }


# =====================================================
# Run Server
# =====================================================

if __name__ == "__main__":

    import uvicorn

    print("\n========================================")

    print("🤟 SilentVoice AI Backend")

    print("========================================")

    print("Server : http://127.0.0.1:8001")

    print("Health : http://127.0.0.1:8001/health")

    print("========================================\n")

    uvicorn.run(

        "main:app",

        host="127.0.0.1",

        port=8001,

        reload=True

    )