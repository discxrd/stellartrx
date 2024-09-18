import sys
import asyncio
import logging

from aiogram import Bot, Dispatcher

from aiogram.client.bot import DefaultBotProperties

from config import Config
from handlers import boosts, withdraws, users, stats, tasks


config = Config()


async def main() -> None:
    print(f"Token: {config.BOT_TOKEN}")
    bot = Bot(
        token=config.BOT_TOKEN, default=DefaultBotProperties(parse_mode="MarkdownV2")
    )
    dp = Dispatcher()

    dp.include_routers(
        boosts.router, withdraws.router, users.router, stats.router, tasks.router
    )

    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())
