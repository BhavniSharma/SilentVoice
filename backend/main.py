from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from models import User, LoginUser

import sqlite3
import os
import io

import numpy as np
import tensorflow as tf

from PIL import Image


# -------------------------
# FastAPI App
# -------------------------

app = FastAPI()


# -------------------------
# CORS
# -------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------
# Load CNN Model
# -------------------------

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "..",
    "model",
    "silentvoice_cnn_improved.keras"
)
CLASS_NAMES_PATH = os.path.join(
    BASE_DIR,
    "..",
    "model",
    "class_names.txt"
)


print("\nLoading SilentVoice CNN model...")


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


print("CNN model loaded successfully.")

print("Classes:")

print(class_names)


# -------------------------
# Home
# -------------------------

@app.get("/")
def home():

    return {
        "message": "SilentVoice API is running"
    }


# -------------------------
# Register User
# -------------------------

@app.post("/users")
def create_user(user: User):

    conn = sqlite3.connect("users.db")

    cursor = conn.cursor()


    cursor.execute(
        "SELECT * FROM users WHERE email=?",
        (user.email,)
    )


    existing_user = cursor.fetchone()


    if existing_user:

        conn.close()

        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )


    cursor.execute(

        """
        INSERT INTO users(
            name,
            email,
            password,
            age
        )
        VALUES(?,?,?,?)
        """,

        (
            user.name,
            user.email,
            user.password,
            user.age
        )

    )


    conn.commit()

    conn.close()


    return {
        "message": "User created successfully"
    }


# -------------------------
# Get All Users
# -------------------------

@app.get("/users")
def get_users():

    conn = sqlite3.connect("users.db")

    cursor = conn.cursor()


    cursor.execute(
        "SELECT * FROM users"
    )


    users = cursor.fetchall()


    conn.close()


    result = []


    for user in users:

        result.append({

            "id": user[0],

            "name": user[1],

            "email": user[2],

            "age": user[4]

        })


    return result


# -------------------------
# Get User By ID
# -------------------------

@app.get("/users/{user_id}")
def get_user(user_id: int):

    conn = sqlite3.connect("users.db")

    cursor = conn.cursor()


    cursor.execute(

        "SELECT * FROM users WHERE id=?",

        (user_id,)

    )


    user = cursor.fetchone()


    conn.close()


    if user is None:

        raise HTTPException(

            status_code=404,

            detail="User not found"

        )


    return {

        "id": user[0],

        "name": user[1],

        "email": user[2],

        "age": user[4]

    }


# -------------------------
# Update User
# -------------------------

@app.put("/users/{user_id}")
def update_user(
    user_id: int,
    user: User
):

    conn = sqlite3.connect("users.db")

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

    conn.close()


    return {

        "message": "User updated successfully"

    }


# -------------------------
# Delete User
# -------------------------

@app.delete("/users/{user_id}")
def delete_user(user_id: int):

    conn = sqlite3.connect("users.db")

    cursor = conn.cursor()


    cursor.execute(

        "DELETE FROM users WHERE id=?",

        (user_id,)

    )


    conn.commit()

    conn.close()


    return {

        "message": "User deleted successfully"

    }


# -------------------------
# Login
# -------------------------

@app.post("/login")
def login(user: LoginUser):

    conn = sqlite3.connect("users.db")

    cursor = conn.cursor()


    cursor.execute(

        """
        SELECT *
        FROM users
        WHERE email=? AND password=?
        """,

        (
            user.email,
            user.password
        )

    )


    existing_user = cursor.fetchone()


    conn.close()


    if existing_user is None:

        raise HTTPException(

            status_code=401,

            detail="Invalid email or password"

        )


    return {

        "message": "Login successful",

        "user": {

            "id": existing_user[0],

            "name": existing_user[1],

            "email": existing_user[2],

            "age": existing_user[4]

        }

    }


# -------------------------
# Profile
# -------------------------

@app.get("/profile/{user_id}")
def profile(user_id: int):

    conn = sqlite3.connect("users.db")

    cursor = conn.cursor()


    cursor.execute(

        "SELECT * FROM users WHERE id=?",

        (user_id,)

    )


    user = cursor.fetchone()


    conn.close()


    if user is None:

        raise HTTPException(

            status_code=404,

            detail="User not found"

        )


    return {

        "id": user[0],

        "name": user[1],

        "email": user[2],

        "age": user[4]

    }

# -------------------------
# Predict Sign
# -------------------------

@app.post("/predict")
async def predict_sign(file: UploadFile = File(...)):

    try:

        image_bytes = await file.read()

        image = Image.open(
            io.BytesIO(image_bytes)
        ).convert("RGB")

        image = image.resize(
            (64, 64)
        )

        image_array = np.array(
            image,
            dtype=np.float32
        )

        image_array = image_array / 255.0

        image_array = np.expand_dims(
            image_array,
            axis=0
        )

        predictions = model.predict(
            image_array,
            verbose=0
        )

        predicted_index = int(
            np.argmax(predictions[0])
        )

        predicted_sign = class_names[
            predicted_index
        ]

        confidence = float(
            np.max(predictions[0])
        )

        return {
            "prediction": predicted_sign,
            "confidence": round(
                confidence * 100,
                2
            )
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )