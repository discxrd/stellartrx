from os import getenv


class Config:
    BASE_API_URL = getenv("BASE_API_URL")
    BOT_TOKEN = getenv("BOT_TOKEN")
    DEBUG = False

    def __init__(self, debug: bool = False) -> None:
        if debug:
            self.DEBUG = True
            self.BASE_API_URL = "http://localhost:3000/api/admin"
            self.BOT_TOKEN = ""
