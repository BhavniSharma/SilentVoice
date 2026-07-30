from fastapi import APIRouter, UploadFile, File
import cv2
import numpy as np

from eye_detector import detect_eyes
from blink_detector import BlinkDetector
from morse_interpreter import MorseInterpreter
router = APIRouter()

blink_detector = BlinkDetector()
morse = MorseInterpreter()


@router.post("/predict")
async def predict(file: UploadFile = File(...)):

    image_bytes = await file.read()

    image_array = np.frombuffer(image_bytes, np.uint8)

    frame = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    frame, left_eye, right_eye = detect_eyes(frame)

    eye_status = "🟢 Eyes Open"
    current_blink = "-"
    decoded_letter = ""

    if left_eye is not None and right_eye is not None:

        ear_left = blink_detector.eye_aspect_ratio(left_eye)
        ear_right = blink_detector.eye_aspect_ratio(right_eye)

        ear = (ear_left + ear_right) / 2
        print(f"EAR: {ear:.3f}")

        if ear < 0.20:
            eye_status = "🔴 Eyes Closed"

        blink = blink_detector.detect_blink(ear)

        if blink:

            current_blink = blink

            morse.add_signal(blink)

    before = morse.get_message()

    morse.update()

    after = morse.get_message()

    if len(after) > len(before):
        decoded_letter = after[-1]

    return {
        "eye_status": eye_status,
        "current_blink": current_blink,
        "current_morse": morse.current_symbol,
        "decoded_letter": decoded_letter,
        "current_sentence": after
    }