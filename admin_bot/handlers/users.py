from aiogram import Router, F

from aiogram.filters import Command, CommandObject
from aiogram.types import Message, CallbackQuery, InlineKeyboardButton
from aiogram.utils.keyboard import InlineKeyboardBuilder

from utils.api import API

from callbacks.object import ObjectCallback
from callbacks.pagination import PaginationCallback

router = Router(name=__name__)
api = API()


async def get_users(message: Message, count: int = 5, offset: int = 0) -> None:
    users = await api.get_users(count, offset)
    stats = await api.get_stats()
    user_count = stats["users"]

    current_page = offset // count + 1
    available_pages = user_count // count + (user_count % count > 0)

    builder = InlineKeyboardBuilder()

    for user in users:
        builder.row(
            InlineKeyboardButton(
                text=f"{user['name']} - {user['trx']} TRX",
                callback_data=ObjectCallback(
                    method="get_user", id=user["telegramId"]
                ).pack(),
            )
        )

    builder.row(
        InlineKeyboardButton(
            text="<",
            callback_data=PaginationCallback(
                offset=offset - count,
                count=count,
                method="users_previous_page",
                current_page=current_page,
                max_page=available_pages,
                id=0,
            ).pack(),
        ),
        InlineKeyboardButton(
            text=f"{current_page}/{available_pages}", callback_data="current_page"
        ),
        InlineKeyboardButton(
            text=">",
            callback_data=PaginationCallback(
                offset=offset + count,
                count=count,
                method="users_next_page",
                current_page=current_page,
                max_page=available_pages,
                id=0,
            ).pack(),
        ),
    )

    builder.row(
        InlineKeyboardButton(
            text="На последнюю",
            callback_data=PaginationCallback(
                offset=available_pages * count - count,
                count=count,
                method="users_next_page",
                current_page=current_page,
                max_page=available_pages,
                id=0,
            ).pack(),
        ),
    )

    await message.edit_text("Пользователи", reply_markup=builder.as_markup())


async def get_user(id: int, message: Message) -> None:
    try:
        data = await api.get_user(id)
    except:
        await message.edit_text("Пользователь не найден")
        return

    if data == {}:
        await message.reply("Пользователь не найден")
        return

    builder = InlineKeyboardBuilder()

    builder.row(
        InlineKeyboardButton(
            text="Выводы",
            callback_data=ObjectCallback(
                method="to_withdraws", id=data["telegramId"]
            ).pack(),
        ),
        InlineKeyboardButton(
            text="Бусты",
            callback_data=ObjectCallback(
                method="to_boosts", id=data["telegramId"]
            ).pack(),
        ),
    )
    builder.row(
        InlineKeyboardButton(
            text="Удалить",
            callback_data=ObjectCallback(
                method="ban_user", id=data["telegramId"]
            ).pack(),
        )
    )

    builder.row(InlineKeyboardButton(text="К списку", callback_data="to_users"))
    pending_boosts = [boost for boost in data["boosts"] if boost["status"] == "pending"]
    success_boosts = [boost for boost in data["boosts"] if boost["status"] == "success"]
    canceled_withdraws = [
        withdraw for withdraw in data["withdraws"] if withdraw["status"] == "canceled"
    ]
    pending_withdraws = [
        withdraw for withdraw in data["withdraws"] if withdraw["status"] == "pending"
    ]
    success_withdraws = [
        withdraw for withdraw in data["withdraws"] if withdraw["status"] == "completed"
    ]
    text = f"""Пользователь \#{data["id"]}

Имя: {data["name"]}
Партнер: {data["isPartner"]}
Монет: {str(data["coins"]).replace(".", ",")}
Telegram: `{data["telegramId"]}`
Энергия: {str(data["power"]).replace(".", ",")} ⚡
Кошелек:
    TRX: {str(data["trx"]).replace(".", ",")}
    SHIB: {str(data["shib"]).replace(".", ",")}
Бустов: 
    Куплено: {len(success_boosts)}
    Ожидает: {len(pending_boosts)}
Выводов: 
    Куплено: {len(success_withdraws)}
    Ожидает: {len(pending_withdraws)}
    Отменено: {len(canceled_withdraws)}
Рефералов: {len(data["referrals"])}""".replace(
        "-", ""
    )

    await message.edit_text(text, reply_markup=builder.as_markup())


@router.message(Command("users"))
async def all_users(message: Message) -> None:
    message = await message.reply(f"Получаю список\.\.\.")

    return await get_users(message)


@router.message(Command("username"))
async def username(message: Message, command: CommandObject) -> None:
    name = command.args

    if not name:
        await message.reply("Не указано имя пользователя")
        return

    message = await message.reply(f"Ищу пользователя\.\.\.")

    try:
        user = await api.get_user_id(name)
    except:
        await message.edit_text("Пользователь не найден")
        return

    return await get_user(user["telegramId"], message)


@router.message(Command("user"))
async def user(message: Message, command: CommandObject) -> None:
    id = command.args

    if not id:
        await message.reply("Не указан Telegram ID пользователя")
        return

    message = await message.reply(f"Ищу пользователя\.\.\.")

    return await get_user(id, message)


@router.callback_query(ObjectCallback.filter(F.method == "get_user"))
async def get_user_callback(callback: CallbackQuery, callback_data: ObjectCallback):
    return await get_user(callback_data.id, callback.message)


@router.callback_query(F.data == "to_users")
async def to_users_callback(callback: CallbackQuery):
    return await get_users(callback.message)


@router.callback_query(PaginationCallback.filter(F.method == "users_previous_page"))
async def users_previous_page_callback(
    callback: CallbackQuery, callback_data: PaginationCallback
):
    if callback_data.current_page <= 1:
        await callback.answer("Уже на первой странице")
        return

    return await get_users(
        callback.message,
        count=callback_data.count,
        offset=callback_data.offset,
    )


@router.callback_query(PaginationCallback.filter(F.method == "users_next_page"))
async def users_next_page_callback(
    callback: CallbackQuery, callback_data: PaginationCallback
):
    if callback_data.current_page >= callback_data.max_page:
        await callback.answer("Уже на последней странице")
        return

    return await get_users(
        callback.message,
        count=callback_data.count,
        offset=callback_data.offset,
    )


@router.callback_query(F.data == "current_page")
async def current_page_callback(callback: CallbackQuery):
    await callback.answer(":0")


@router.callback_query(ObjectCallback.filter(F.method == "ban_user"))
async def ban_user_callback(callback: CallbackQuery, callback_data: ObjectCallback):
    result = await api.ban_user(callback_data.id)

    await callback.answer(f"{result}")

    return await get_users(callback.message)
