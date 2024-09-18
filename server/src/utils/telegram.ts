import { User } from "src/user/entities/user.entity";

export async function sendTelegramMessage() {}

// TODO: full rework

export async function isUserSubscribed(
  telegram_id: string,
  channel_id: string
): Promise<boolean> {
  const bot_token =
    process.env.TELEGRAM_USER_BOT_TOKEN || "";

  const url = `https://api.telegram.org/bot${bot_token}/getChatMember?chat_id=${channel_id}&user_id=${telegram_id}`;

  console.log(
    `Checking: token=${bot_token} chat=${channel_id} telegram=${telegram_id}`
  );

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  try {
    const status = result["result"]["status"];

    if (status === "left" || status === "kicked") {
      console.log("User is not subscribed");
      return false;
    }
  } catch {
    console.log(result);
  }

  return response.ok;
}

export async function sendBoostNotification(
  power: number,
  txid: string,
  user: User
): Promise<boolean> {
  const bot_token =
    process.env.TELEGRAM_USER_BOT_TOKEN || "";
  const chat_id = process.env.TELEGRAM_BOOSTS_CHAT_ID || "";
  const message_thread_id = process.env.TELEGRAM_BOOSTS_THREAD_ID || "2";

  const url = `https://api.telegram.org/bot${bot_token}/sendMessage`;

  const name =
    user.name.length > 3
      ? user.name.substring(0, 3) + "\\*".repeat(user.name.length - 3)
      : user.name;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message_thread_id,
      chat_id,
      text:
        "*🚀 NEW BOOST*\n" +
        `👤 Username: \`${name}\`\n` +
        `💰 Amount: ${power * 10} TRX\n` +
        `⚡️ Power: \`${power}\`\n` +
        `🧾 TXID: [${txid}](https://tronscan\.org/\#/transaction/${txid})`,
      parse_mode: "MarkdownV2",
    }),
  });

  console.log(await response.json());

  return response.ok;
}

export async function sendWithdrawNotfication(
  id: number,
  address: string,
  coin: string,
  amount: number,
  user: User
): Promise<boolean> {
  const bot_token =
    process.env.TELEGRAM_ADMIN_BOT_TOKEN ||
    "";
  const chat_id = process.env.TELEGRAM_CHAT_ID || "";

  const url = `https://api.telegram.org/bot${bot_token}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id,
      text:
        "*Новый вывод:*\n" +
        `Пользователь: \`${user.name}\` \n` +
        `Telegram: \`${user.telegramId}\` \n` +
        `Сумма: \`${amount}\` ${coin} \n` +
        `Адрес: \`${address}\``,
      parse_mode: "MarkdownV2",
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            {
              text: "Подвердить",
              callback_data: `object:${id}:confirm_withdraw`,
            },
          ],
          [
            {
              text: "Отменить и вернуть деньги",
              callback_data: `object:${id}:cancel_withdraw_return`,
            },
          ],
          [
            {
              text: "Отменить",
              callback_data: `object:${id}:cancel_withdraw`,
            },
          ],
        ],
      }),
    }),
  });

  return response.ok;
}
