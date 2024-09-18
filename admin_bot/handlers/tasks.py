from aiogram import Router, F

from aiogram.filters import Command, CommandObject
from aiogram.types import Message, CallbackQuery, InlineKeyboardButton
from aiogram.utils.keyboard import InlineKeyboardBuilder

from utils.api import API

from callbacks.object import ObjectCallback
from callbacks.pagination import PaginationCallback


router = Router(name=__name__)
api = API()


async def get_tasks(message: Message, count: int = 5, offset: int = 0):
    tasks = await api.get_tasks(count, offset)
    stats = await api.get_stats()
    tasks_count = stats["tasks_count"]

    current_page = offset // count + 1
    available_pages = tasks_count // count + (tasks_count % count > 0)

    builder = InlineKeyboardBuilder()

    for task in tasks:
        builder.row(
            InlineKeyboardButton(
                text=f"{task['description']} - {task['reward']} SHIB",
                callback_data=ObjectCallback(method="get_task", id=task["id"]).pack(),
            )
        )

    builder.row(
        InlineKeyboardButton(
            text="<",
            callback_data=PaginationCallback(
                offset=offset - count,
                count=count,
                method="tasks_previous_page",
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
                method="tasks_next_page",
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
                method="tasks_next_page",
                current_page=current_page,
                max_page=available_pages,
                id=0,
            ).pack(),
        ),
    )

    await message.edit_text("Миссии", reply_markup=builder.as_markup())


async def get_task(id: int, message: Message):
    try:
        data = await api.get_task(id)
    except:
        await message.edit_text("Миссия не найдена")
        return

    if data == {}:
        await message.reply("Миссия не найдена")
        return

    builder = InlineKeyboardBuilder()

    builder.row(
        InlineKeyboardButton(
            text="Удалить",
            callback_data=ObjectCallback(method="delete_task", id=data["id"]).pack(),
        )
    )

    builder.row(InlineKeyboardButton(text="К списку", callback_data="to_tasks"))

    text = f"Тип: {data['title']}\nОписание: {data['description']}\nНаграда: {data['reward']} SHIB\nСсылка: {data['link']}\nБыстрая завершение: {data['fastComplete']}\nTelegramID: {data['tgId']}".replace(
        ".", ","
    ).replace(
        "-", ""
    )

    await message.edit_text(text, reply_markup=builder.as_markup())


"""Добавить таск
аргументы:
    type - отображаемая иконка возможные иконки:
        Twitter
        Telegram
        Youtube
        Instagram
    desc - отображаемое описание таска
    reward - награда за таск (ТОЛЬКО SHIB)
    tgid - айди телеграмм чата или канала (бот обязательно должен быть в нем!!)
    link - ссылка куда перейдет пользователь
    fastcomplete - таск завершается после нажатия кнопки (0 - проверить подписку, 1 завершить сразу)

/addtask type desc reward link tgid fastcomplete

пример:
если это телеграмм канал или чат
/addtask Telegram "Подписаться на канал" 10000 "https://t.me/test" -5438527451 0
если это что-то другое
/addtask Twitter "Подписаться на аккаунт" 10000 "https://x.com/test" 1"""


@router.message(Command("addtask"))
async def add_task(message: Message, command: CommandObject):
    try:
        args = command.args.split(" ")

        type = args[0]
        desc = " ".join(args[1:][:-4]).strip(" ")
        reward = int(args[-4])
        link = args[-3]
        tgid = args[-2]
        fastcomplete = int(args[-1])
    except Exception as err:
        print(err)
        await message.reply(
            "Неправильное использование команды\.\n"
            + "Возможные типы\:\n"
            + "   Twitter\n"
            + "   Telegram\n"
            + "   Youtube\n"
            + "   Instagram\n"
            + "Награда должна быть целым числом\n"
            + "Телеграм ID должен быть целым числом\n"
            + "Быстрое выполнение должно быть целым числом"
            + "Пример:\n"
            + "Если это телеграмм канал или чат:\n"
            + "`/addtask Telegram Подписаться на канал 10000 https://t\.me/test \-5438527451 0`\n"
            + "Если это что\-то другое:\n"
            + "`/addtask Twitter Подписаться на аккаунт 10000 https://x\.com/test 0 1`"
        )
        return

    if (fastcomplete != 1) and (fastcomplete != 0):
        await message.reply(
            "Неправильное значение fastcomplete \(должно быть 0 или 1\)"
        )
        return

    await api.add_task(type, desc, reward, link, tgid, fastcomplete)

    await message.reply("Таск добавлен")


@router.message(Command("tasks"))
async def all_users(message: Message) -> None:
    message = await message.reply(f"Получаю список\.\.\.")

    return await get_tasks(message)


@router.callback_query(ObjectCallback.filter(F.method == "get_task"))
async def get_task_callback(callback: CallbackQuery, callback_data: ObjectCallback):
    return await get_task(callback_data.id, callback.message)


@router.callback_query(F.data == "to_tasks")
async def to_tasks_callback(callback: CallbackQuery):
    return await get_tasks(callback.message)


@router.callback_query(PaginationCallback.filter(F.method == "tasks_previous_page"))
async def tasks_previous_page_callback(
    callback: CallbackQuery, callback_data: PaginationCallback
):
    if callback_data.current_page <= 1:
        await callback.answer("Уже на первой странице")
        return

    return await get_tasks(
        callback.message,
        count=callback_data.count,
        offset=callback_data.offset,
    )


@router.callback_query(PaginationCallback.filter(F.method == "tasks_next_page"))
async def tasks_next_page_callback(
    callback: CallbackQuery, callback_data: PaginationCallback
):
    if callback_data.current_page >= callback_data.max_page:
        await callback.answer("Уже на последней странице")
        return

    return await get_tasks(
        callback.message,
        count=callback_data.count,
        offset=callback_data.offset,
    )


@router.callback_query(ObjectCallback.filter(F.method == "delete_task"))
async def ban_user_callback(callback: CallbackQuery, callback_data: ObjectCallback):
    result = await api.delete_task(callback_data.id)

    await callback.answer(f"{result}")

    return await get_tasks(callback.message)
