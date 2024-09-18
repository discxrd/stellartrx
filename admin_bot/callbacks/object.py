from aiogram.filters.callback_data import CallbackData


class ObjectCallback(CallbackData, prefix="object"):
    id: int
    method: str
