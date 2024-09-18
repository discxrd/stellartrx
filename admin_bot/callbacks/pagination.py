from aiogram.filters.callback_data import CallbackData


class PaginationCallback(CallbackData, prefix="pagination"):
    offset: int
    count: int
    method: str
    max_page: int
    current_page: int
    id: int
