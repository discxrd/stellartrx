import { CopyIcon } from "shared/ui/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { $userStore } from "entities/user";
import { useUnit } from "effector-react";
import { useState } from "react";

export const CopyLinkButton = () => {
  const [copied, setCopied] = useState(false);

  const onClick = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { telegramId } = useUnit($userStore);
  return (
    <CopyToClipboard text={"https://t.me/stellartrx_bot?start=" + telegramId}>
      <button
        className="rounded-xl bg-primary p-[0.57rem] active:opacity-50 transition-all"
        onClick={onClick}
      >
        {copied ? <CopyIcon /> : <CopyIcon color="#292929" />}
      </button>
    </CopyToClipboard>
  );
};
//
