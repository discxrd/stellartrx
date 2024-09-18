import os
import sys
import logging
import asyncio

from aiogram import Bot, Dispatcher
from aiogram_dialog import setup_dialogs

from handlers.menu import router as menu_router, dialog as menu_dialog


TOKEN = '6153701365:AAHxMlqGLoo6of5SiYzlmbOESoJEzAR62rY'#os.getenv("TOKEN")


async def main():
    bot = Bot(token=TOKEN)
    dp = Dispatcher()

    dp.include_routers(menu_dialog)
    dp.include_routers(menu_router)

    setup_dialogs(dp)

    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())
