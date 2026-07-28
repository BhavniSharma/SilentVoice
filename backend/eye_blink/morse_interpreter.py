import time
from data.morse_map import MORSE_CODE_DICT

LETTER_GAP = 2
WORD_GAP = 4


class MorseInterpreter:
    def __init__(self):
        self.current_symbol = ""
        self.last_blink_time = time.time()
        self.message = ""
        self.word_completed = False

    def add_signal(self, signal):
        self.current_symbol += "." if signal == "DOT" else "-"
        self.last_blink_time = time.time()
        self.word_completed = False

    def update(self):
        now = time.time()
        gap = now - self.last_blink_time

        if self.current_symbol and gap >= LETTER_GAP:
            self.decode_letter()

        if gap >= WORD_GAP and not self.message.endswith(" "):
            self.message += " "
            self.word_completed = True

    def decode_letter(self):
        letter = MORSE_CODE_DICT.get(self.current_symbol, "?")
        self.message += letter
        self.current_symbol = ""

    def get_message(self):
        return self.message

    def is_word_completed(self):
        return self.word_completed

    def clear_message(self):
        self.message = ""
        self.current_symbol = ""
        self.word_completed = False

    def reset_symbol(self):
        self.current_symbol = ""

