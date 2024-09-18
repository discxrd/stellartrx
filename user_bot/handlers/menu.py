import os
import random

from aiogram import Router, F
from aiogram.types import (
    Message,
    ContentType,
    InlineKeyboardMarkup,
    InlineKeyboardButton,
    CallbackQuery,
)
from aiogram.filters import Command

from aiogram_dialog import DialogManager, Window, StartMode, Dialog
from aiogram_dialog.widgets.kbd import Row, Url, WebApp
from aiogram_dialog.widgets.text import Const, Format
from aiogram_dialog.widgets.media import StaticMedia

from states.state import MainStateGroup

APP_BASE_URL = os.getenv("WEBAPP_URL")
router = Router()


async def get_start_parameters(event_update, **kwargs):
    try:
        uri = f"?refId={event_update.callback_query.message.reply_to_message.text.split(" ")[1]}"
    except AttributeError:
        try:
            uri = f"?refId={event_update.message.text.split(" ")[1]}"
        except AttributeError:
            uri = ''

    print(uri)

    return {"params": uri}


dialog = Dialog(
    Window(
        StaticMedia(path="assets/card.jpg", type=ContentType.PHOTO),
        Const(
            '🚀 What We Offer:\n\n- Cryptocurrency Mining: Our system allows you to mine cryptocurrency with high efficiency directly in the Telegram web application.\n- TRON Deposit Top-Up: Increase your mining speed by topping up your deposit with TRON cryptocurrency.\n- SHIBA Earnings: Invire friends and complete tasks to earn SHIBA coins, wich can be withdrawn.\n- Loyalty Programs: Participate in our bonus programs and receive additional privileges.\n- 24/7 Support: Our support team is always ready to help you at any time.\n\nOur symbol is a black hole, pulling TRON directly into your wallets. Dive into this fascinating process and watch your deposit grow day by day!\nThank you for choosing STELLAR! Start mining right now and discover a world of opportunities with cryptocurrency! 💫🚀\n\nYour success starts here and now! Together we can reach the stars and beyond! 🌌\n\nClick the "MINE" button below ⬇️'
        ),
        WebApp(Const("🔥 MINE 🔥"), Format("https://stellartrx.com/{params}")),
        Url(Const("📖 Read me 📖"),
            Const("https://telegra.ph/STELLAR-Docs-06-02-5")),
        Row(
            Url(Const("📰 News 📰"), Const("https://t.me/stellartrx")),
            Url(Const("💬 Chat 💬"), Const("https://t.me/+Srn5PMC_qJw3NTNi")),
        ),
        state=MainStateGroup.main,
        getter=get_start_parameters,
    ))

emojis = ["🟦", "🟨", "🟪", "🟩", "🟥", "🟧", "🟫", "⬜️", "⬛️"]


def generate_captcha(emojis: list[str]) -> InlineKeyboardMarkup:
    random.shuffle(emojis)

    keyboard = InlineKeyboardMarkup(
        row_width=3,
        inline_keyboard=[
            [
                InlineKeyboardButton(text=item, callback_data=item)
                for item in emojis[:3]
            ],
            [
                InlineKeyboardButton(text=item, callback_data=item)
                for item in emojis[3:6]
            ],
            [
                InlineKeyboardButton(text=item, callback_data=item)
                for item in emojis[6:9]
            ],
        ],
    )

    return keyboard


@router.message(Command("start"))
async def start(message: Message):
    keyboard = generate_captcha(emojis)

    await message.reply(f'Click on "{random.choice(emojis)}"',
                        reply_markup=keyboard)


@router.callback_query(F.data.in_(emojis))
async def callback_handler(callback_query: CallbackQuery,
                           dialog_manager: DialogManager):
    captcha = callback_query.message.text.split('"')[1]

    if captcha == callback_query.data:
        await dialog_manager.start(MainStateGroup.main,
                                   mode=StartMode.RESET_STACK)
    else:
        keyboard = generate_captcha(emojis)
        await callback_query.message.edit_text(
            f'Click on "{random.choice(emojis)}"', reply_markup=keyboard)
