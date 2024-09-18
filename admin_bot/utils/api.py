import aiohttp

from config import Config


class API:
    def __init__(self) -> None:
        config = Config()

        self.token = config.BOT_TOKEN
        self.base_url = config.BASE_API_URL

        self.headers = {"Authorization": f"Bearer {self.token}"}

    async def get_users(self, count: int = 5, offset: int = 0) -> dict:
        url = f"{self.base_url}/users?count={count}&offset={offset}"

        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=self.headers) as response:
                return await response.json()

    async def get_withdraws(self, count: int = 5, offset: int = 0) -> dict:
        url = f"{self.base_url}/withdraws?count={count}&offset={offset}"

        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=self.headers) as response:
                return await response.json()

    async def get_boosts(self, count: int = 5, offset: int = 0) -> dict:
        url = f"{self.base_url}/boosts?count={count}&offset={offset}"

        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=self.headers) as response:
                return await response.json()

    async def get_stats(self) -> dict:
        url = f"{self.base_url}/stats"

        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=self.headers) as response:
                print(await response.json())
                return await response.json()

    async def get_user(self, telegramId: int) -> dict:
        url = f"{self.base_url}/user/id/{telegramId}"

        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=self.headers) as response:
                data = await response.json()

        return data

    async def get_user_id(self, name: str) -> dict:
        url = f"{self.base_url}/user/name/{name}"

        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=self.headers) as response:
                return await response.json()

    async def get_boost(self, boost_id: int) -> dict:
        url = f"{self.base_url}/boost/{boost_id}"

        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=self.headers) as response:
                if await response.read() == b"":
                    return {}

                return await response.json()

    async def get_withdraw(self, withdraw_id: int) -> dict:
        url = f"{self.base_url}/withdraw/{withdraw_id}"

        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=self.headers) as response:
                if await response.read() == b"":
                    return {}

                return await response.json()

    async def cancel_withdraw(self, withdraw_id: int) -> int:
        url = f"{self.base_url}/withdraw/{withdraw_id}"

        async with aiohttp.ClientSession() as session:
            async with session.delete(url, headers=self.headers) as response:
                return await response.json()

    async def cancel_withdraw_and_return(self, withdraw_id: int) -> int:
        url = f"{self.base_url}/withdraw/{withdraw_id}/return"

        async with aiohttp.ClientSession() as session:
            async with session.patch(url, headers=self.headers) as response:
                return await response.json()

    async def confirm_withdraw(self, withdraw_id: int) -> int:
        url = f"{self.base_url}/withdraw/{withdraw_id}"

        async with aiohttp.ClientSession() as session:
            async with session.patch(url, headers=self.headers) as response:
                return await response.json()

    async def ban_user(self, telegramId: int) -> dict:
        url = f"{self.base_url}/user/{telegramId}"

        async with aiohttp.ClientSession() as session:
            async with session.delete(url, headers=self.headers) as response:
                return await response.json()

    async def unban_user(self, telegramId: int) -> dict:
        url = f"{self.base_url}/user/{telegramId}"

        async with aiohttp.ClientSession() as session:
            async with session.patch(url, headers=self.headers) as response:
                return await response.json()

    async def add_task(
        self, type: str, desc: str, reward: int, link: str, tgid: int, fastcomplete: int
    ) -> dict:
        url = f"{self.base_url}/task"

        data = {
            "type": type,
            "description": desc,
            "reward": reward,
            "link": link,
            "tgId": int(tgid),
            "fastComplete": fastcomplete,
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=self.headers, json=data) as response:
                return await response.json()

    async def get_task(self, task_id: int) -> dict:
        url = f"{self.base_url}/task/{task_id}"

        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=self.headers) as response:
                return await response.json()

    async def get_tasks(self, count: int = 5, offset: int = 0) -> dict:
        url = f"{self.base_url}/tasks?count={count}&offset={offset}"

        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=self.headers) as response:
                return await response.json()

    async def delete_task(self, task_id: int) -> int:
        url = f"{self.base_url}/task/{task_id}"

        async with aiohttp.ClientSession() as session:
            async with session.delete(url, headers=self.headers) as response:
                return await response.json()
