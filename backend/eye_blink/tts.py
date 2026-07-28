''' import pyttsx3

class Speaker:
    def __init__(self):
        self.engine = pyttsx3.init()
        self.engine.setProperty("rate", 160)
        self.engine.setProperty("volume", 1.0)
        self.last_spoken = ""

    def speak(self, text):
        if text and text != self.last_spoken:
            self.engine.say(text)
            self.engine.runAndWait()
            self.last_spoken = text  


import pyttsx3
import threading

class Speaker:
    def __init__(self):
        self.last_spoken = ""

    def speak(self, text):
        if not text or text == self.last_spoken:
            return

        self.last_spoken = text

        def run():
            engine = pyttsx3.init('sapi5')
            engine.setProperty("rate", 160)
            engine.setProperty("volume", 1.0)
            engine.say(text)
            engine.runAndWait()
            engine.stop()

        threading.Thread(target=run).start()
'''


import pyttsx3
import threading
import platform

class Speaker:
    def __init__(self):
        self.last_spoken = ""

    def speak(self, text):
        if not text or text == self.last_spoken:
            return

        self.last_spoken = text

        def run():
            # Detect OS
            if platform.system() == "Windows":
                engine = pyttsx3.init('sapi5')
            else:
                engine = pyttsx3.init()

            engine.setProperty("rate", 160)
            engine.setProperty("volume", 1.0)

            engine.say(text)
            engine.runAndWait()
            engine.stop()

        threading.Thread(target=run).start()