from aiogram import Router

from aiogram.filters import Command
from aiogram.types import Message

from utils.api import API


router = Router(name=__name__)
api = API()


@router.message(Command("stats"))
async def statisctics(message: Message) -> None:
    stats = await api.get_stats()
    print(stats)

    await message.reply(
        f"Статистика:\n"
        + f"    Пользователей: {stats['users']:,}\n".replace(",", " ")
        + f"    Сумма выводов:\n"
        + f"        {stats['withdraws']['trx']:,} TRX\n".replace(",", " ")
        + f"        {stats['withdraws']['shib']:,} SHIB\n".replace(",", " ")
        + f"    Сумма бустов: {stats['boosts']:,} TRX".replace(",", " ")
    )
