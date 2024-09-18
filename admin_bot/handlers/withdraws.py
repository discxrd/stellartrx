from aiogram import Router, F

from aiogram.filters import Command, CommandObject
from aiogram.types import Message, CallbackQuery, InlineKeyboardButton
from aiogram.utils.keyboard import InlineKeyboardBuilder

from utils.api import API

from callbacks.object import ObjectCallback
from callbacks.pagination import PaginationCallback


router = Router(name=__name__)
api = API()


async def get_withdraws(
    message: Message, count: int = 5, offset: int = 0, user_id: int = 0
) -> None:
    if user_id != 0:
        user = await api.get_user(user_id)

        withdraws = user["withdraws"][offset : offset + count]
        withdraws_count = len(user["withdraws"])
    else:
        withdraws = await api.get_withdraws(count, offset)
        stats = await api.get_stats()
        withdraws_count = stats["withdraws_count"]

    current_page = offset // count + 1
    available_pages = withdraws_count // count + (withdraws_count % count > 0)

    builder = InlineKeyboardBuilder()

    for withdraw in withdraws:
        builder.row(
            InlineKeyboardButton(
                text=f"Вывод #{withdraw['id']} - {withdraw['amount']} TRX - {withdraw['status']}",
                callback_data=ObjectCallback(
                    method="get_withdraw", id=withdraw["id"]
                ).pack(),
            )
        )

    builder.row(
        InlineKeyboardButton(
            text="<",
            callback_data=PaginationCallback(
                offset=offset - count,
                count=count,
                method="withdraws_previous_page",
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
                method="withdraws_next_page",
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
                method="withdraws_next_page",
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

    await message.edit_text("Выводы", reply_markup=builder.as_markup())


async def get_withdraw(id: int, message: Message) -> None:
    data = await api.get_withdraw(id)

    if data == {}:
        await message.edit_text("Вывод не найден")
        return

    builder = InlineKeyboardBuilder()

    if data["status"] == "pending":
        builder.row(
            InlineKeyboardButton(
                text="Подтвердить",
                callback_data=ObjectCallback(
                    method="confirm_withdraw", id=data["id"]
                ).pack(),
            ),
            InlineKeyboardButton(
                text="Отменить",
                callback_data=ObjectCallback(
                    method="cancel_withdraw", id=data["id"]
                ).pack(),
            ),
        )

    builder.row(
        InlineKeyboardButton(
            text="К пользователю",
            callback_data=ObjectCallback(
                method="get_user", id=data["user"]["telegramId"]
            ).pack(),
        )
    )

    builder.row(InlineKeyboardButton(text="К списку", callback_data="to_withdraws"))

    text = f"""*Вывод \#{id}*

Сумма: `{data["amount"]}` TRX
Статус: {data["status"]}
Адрес: `{data["address"]}`
"""

    await message.edit_text(text, reply_markup=builder.as_markup())


@router.message(Command("withdraws"))
async def all_withdraws(message: Message) -> None:
    message = await message.reply(f"Получаю список\.\.\.")

    return await get_withdraws(message)


@router.message(Command("withdraw"))
async def user(message: Message, command: CommandObject) -> None:
    id = command.args

    if not id:
        await message.reply("Не указан ID вывода")
        return

    message = await message.reply(f"Ищу вывод\.\.\.")

    return await get_withdraw(id, message)


@router.callback_query(ObjectCallback.filter(F.method == "get_withdraw"))
async def get_withdraw_callback(callback: CallbackQuery, callback_data: ObjectCallback):
    return await get_withdraw(callback_data.id, callback.message)


@router.callback_query(F.data == "to_withdraws")
async def to_withdraws_callback(callback: CallbackQuery):
    return await get_withdraws(callback.message)


@router.callback_query(ObjectCallback.filter(F.method == "to_withdraws"))
async def to_user_withdraws_callback(
    callback: CallbackQuery, callback_data: ObjectCallback
):
    return await get_withdraws(callback.message, user_id=callback_data.id)


@router.callback_query(PaginationCallback.filter(F.method == "withdraws_previous_page"))
async def withdraws_previous_page_callback(
    callback: CallbackQuery, callback_data: PaginationCallback
):
    if callback_data.current_page <= 1:
        await callback.answer("Уже на первой странице")
        return

    return await get_withdraws(
        callback.message,
        count=callback_data.count,
        offset=callback_data.offset,
        user_id=callback_data.id,
    )


@router.callback_query(PaginationCallback.filter(F.method == "withdraws_next_page"))
async def withdraws_next_page_callback(
    callback: CallbackQuery, callback_data: PaginationCallback
):
    if callback_data.current_page >= callback_data.max_page:
        await callback.answer("Уже на последней странице")
        return

    return await get_withdraws(
        callback.message,
        count=callback_data.count,
        offset=callback_data.offset,
        user_id=callback_data.id,
    )


@router.callback_query(ObjectCallback.filter(F.method == "confirm_withdraw"))
async def confirm_withdraw_callback(
    callback: CallbackQuery, callback_data: ObjectCallback
):
    result = await api.confirm_withdraw(callback_data.id)

    text = ""

    if result["result"] == "Cant find":
        text = f"Вывод \#`{callback_data.id}` не найден."
    elif result["result"] == "Success":
        text = f"Вывод \#`{callback_data.id}` подтвержден"
    else:
        text = f"Ошибка\!"

    await callback.answer(text)
    return await get_withdraw(id=callback_data.id, message=callback.message)


@router.callback_query(ObjectCallback.filter(F.method == "cancel_withdraw"))
async def cancel_withdraw_callback(
    callback: CallbackQuery, callback_data: ObjectCallback
):
    result = await api.cancel_withdraw(callback_data.id)

    text = ""

    if result["result"] == "Cant find":
        text = f"Вывод \#`{callback_data.id}` не найден."
    elif result["result"] == "Success":
        text = f"Вывод \#`{callback_data.id}` отменен"
    else:
        text = f"Ошибка\!"

    await callback.answer(text)
    return await get_withdraw(id=callback_data.id, message=callback.message)


@router.callback_query(ObjectCallback.filter(F.method == "cancel_withdraw_return"))
async def cancel_withdraw_callback(
    callback: CallbackQuery, callback_data: ObjectCallback
):
    result = await api.cancel_withdraw(callback_data.id)

    text = ""

    if result["result"] == "Cant find":
        text = f"Вывод \#`{callback_data.id}` не найден."
    elif result["result"] == "Success":
        text = f"Вывод \#`{callback_data.id}` отменен.\nДеньги возвращены"
    else:
        text = f"Ошибка\!"

    await callback.answer(text)
    return await get_withdraw(id=callback_data.id, message=callback.message)
