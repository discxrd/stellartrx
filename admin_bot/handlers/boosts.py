from aiogram import Router, F

from aiogram.filters import Command, CommandObject
from aiogram.types import Message, CallbackQuery, InlineKeyboardButton
from aiogram.utils.keyboard import InlineKeyboardBuilder

from utils.api import API

from callbacks.object import ObjectCallback
from callbacks.pagination import PaginationCallback

router = Router(name=__name__)
api = API()


async def get_boosts(
    message: Message, count: int = 5, offset: int = 0, user_id: int = 0
) -> None:
    if user_id != 0:
        user = await api.get_user(user_id)

        boosts = user["boosts"][offset : offset + count]
        boosts_count = len(user["boosts"])
    else:
        boosts = await api.get_boosts(count, offset)
        stats = await api.get_stats()
        boosts_count = stats["boosts_count"]

    current_page = offset // count + 1
    available_pages = boosts_count // count + (boosts_count % count > 0)

    builder = InlineKeyboardBuilder()

    for boost in boosts:
        builder.row(
            InlineKeyboardButton(
                text=f"Boost #{boost['id']} - {boost['power']} ⚡︎",
                callback_data=ObjectCallback(method="get_boost", id=boost["id"]).pack(),
            )
        )

    builder.row(
        InlineKeyboardButton(
            text="<",
            callback_data=PaginationCallback(
                offset=offset - count,
                count=count,
                method="boosts_previous_page",
                current_page=current_page,
                max_page=available_pages,
                id=user_id,
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
                method="boosts_next_page",
                current_page=current_page,
                max_page=available_pages,
                id=user_id,
            ).pack(),
        ),
    )

    builder.row(
        InlineKeyboardButton(
            text="На последнюю",
            callback_data=PaginationCallback(
                offset=available_pages * count - count,
                count=count,
                method="boosts_next_page",
                current_page=current_page,
                max_page=available_pages,
                id=0,
            ).pack(),
        ),
    )

    if user_id != 0:
        builder.row(
            InlineKeyboardButton(
                text="Назад",
                callback_data=ObjectCallback(method="get_user", id=user_id).pack(),
            )
        )

    await message.edit_text("Бусты", reply_markup=builder.as_markup())


async def get_boost(id: int, message: Message) -> None:
    data = await api.get_boost(id)

    if data == {}:
        await message.edit_text("Буст не найден")
        return

    builder = InlineKeyboardBuilder()

    builder.row(
        InlineKeyboardButton(
            text="К пользователю",
            callback_data=ObjectCallback(
                method="get_user", id=data["user"]["telegramId"]
            ).pack(),
        )
    )
    builder.row(InlineKeyboardButton(text="К списку", callback_data="to_boosts"))

    text = f"""*Буст \#{id}*

Энергия: `{data["power"]}` ⚡︎
Статус: {data["status"]}
"""

    await message.edit_text(text, reply_markup=builder.as_markup())


@router.message(Command("boosts"))
async def all_boosts(message: Message) -> None:
    message = await message.reply(f"Получаю список\.\.\.")

    return await get_boosts(message)


@router.message(Command("boost"))
async def boost(message: Message, command: CommandObject) -> None:
    id = command.args

    if not id:
        await message.reply("Не указан ID буста")
        return

    message = await message.reply(f"Ищу буст\.\.\.")

    return await get_boost(id, message)


@router.callback_query(ObjectCallback.filter(F.method == "get_boost"))
async def get_user_callback(callback: CallbackQuery, callback_data: ObjectCallback):
    return await get_boost(callback_data.id, callback.message)


@router.callback_query(F.data == "to_boosts")
async def get_all_boosts_callback(callback: CallbackQuery):
    return await get_boosts(callback.message)


@router.callback_query(ObjectCallback.filter(F.method == "to_boosts"))
async def get_user_boosts_callback(
    callback: CallbackQuery, callback_data: ObjectCallback
):
    return await get_boosts(callback.message, user_id=callback_data.id)


@router.callback_query(PaginationCallback.filter(F.method == "boosts_previous_page"))
async def boosts_previous_page_callback(
    callback: CallbackQuery, callback_data: PaginationCallback
):
    if callback_data.current_page <= 1:
        await callback.answer("Уже на первой странице")
        return

    return await get_boosts(
        callback.message,
        count=callback_data.count,
        offset=callback_data.offset,
        user_id=callback_data.id,
    )


@router.callback_query(PaginationCallback.filter(F.method == "boosts_next_page"))
async def boosts_next_page_callback(
    callback: CallbackQuery, callback_data: PaginationCallback
):
    if callback_data.current_page >= callback_data.max_page:
        await callback.answer("Уже на последней странице")
        return

    return await get_boosts(
        callback.message,
        count=callback_data.count,
        offset=callback_data.offset,
        user_id=callback_data.id,
    )
