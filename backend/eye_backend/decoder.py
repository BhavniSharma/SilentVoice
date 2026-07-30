from data.morse_map import MORSE_CODE_DICT


class MorseDecoder:

    def decode(self, morse_code: str):

        return MORSE_CODE_DICT.get(morse_code, "")