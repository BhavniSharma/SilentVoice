import cv2
import mediapipe as mp
import numpy as np

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

LEFT_EYE = [33, 160, 158, 133, 153, 144]
RIGHT_EYE = [362, 385, 387, 263, 373, 380]


def get_eye_points(landmarks, eye_indices, w, h):
    return np.array([
        [int(landmarks[i].x * w), int(landmarks[i].y * h)]
        for i in eye_indices
    ])


def detect_eyes(frame):
    h, w, _ = frame.shape
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = face_mesh.process(rgb)

    left_eye = right_eye = None

    if result.multi_face_landmarks:
        landmarks = result.multi_face_landmarks[0].landmark

        left_eye = get_eye_points(landmarks, LEFT_EYE, w, h)
        right_eye = get_eye_points(landmarks, RIGHT_EYE, w, h)

        for (x, y) in np.vstack((left_eye, right_eye)):
            cv2.circle(frame, (x, y), 2, (0, 255, 0), -1)

    return frame, left_eye, right_eye
