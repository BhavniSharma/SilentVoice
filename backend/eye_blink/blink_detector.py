import time
import numpy as np

EAR_THRESHOLD = 0.20
SHORT_BLINK = 0.15   # seconds
LONG_BLINK = 0.5    # seconds


class BlinkDetector:
    def __init__(self):
        self.eye_closed_time = None
        self.is_eye_closed = False

    def eye_aspect_ratio(self, eye_points):
        A = np.linalg.norm(eye_points[1] - eye_points[5])
        B = np.linalg.norm(eye_points[2] - eye_points[4])
        C = np.linalg.norm(eye_points[0] - eye_points[3])
        return (A + B) / (2.0 * C)

    def detect_blink(self, ear):
        blink_type = None
        current_time = time.time()

        if ear < EAR_THRESHOLD:
            if not self.is_eye_closed:
                self.is_eye_closed = True
                self.eye_closed_time = current_time
        else:
            if self.is_eye_closed:
                duration = current_time - self.eye_closed_time

                if duration < SHORT_BLINK:
                    blink_type = None
                elif duration < LONG_BLINK:
                    blink_type = "DOT"
                else:
                    blink_type = "DASH"

                self.is_eye_closed = False
                self.eye_closed_time = None

        return blink_type
