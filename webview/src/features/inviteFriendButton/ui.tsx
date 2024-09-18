import { useUnit } from "effector-react";
import { $userStore } from "entities/user";
import { TelegramShareButton } from "react-share";

export const InviteFriendButton = () => {
  const { telegramId } = useUnit($userStore);
  return (
    <TelegramShareButton
      style={{
        backgroundColor: "#F9F9F9",
      }}
      className="w-full rounded-xl text-center active:opacity-50 transition-all"
      url={"https://t.me/stellartrx_bot?start=" + telegramId}
      title="🔗 I invite you to join the STELLAR project and start mining TRON cryptocurrency!

        The STELLAR project offers a unique opportunity to earn TRON (TRX) using a convenient mining bot. This is an excellent way to enter the world of cryptocurrencies and start earning right away.
        
        Use my referral link to register and receive a bonus to get started! 🚀
        
        Benefits of the STELLAR project:
        - Easy start: just register and start mining.
        - Convenient mining bot: everything is automated.
        - Bonuses for new users.
        - Reliability and security of your funds.
        
        Join the TRON mining community and start earning today! 💰"
    >
      <p className="font-bold text-on-primary text-2xl ">Share link</p>
    </TelegramShareButton>
  );
};
