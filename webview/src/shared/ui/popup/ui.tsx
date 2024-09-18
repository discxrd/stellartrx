import clsx from "clsx";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Popup = ({ isOpen, onClose, children }: PopupProps) => {
  return (
    <>
      <>
        <div
          onClick={onClose}
          className={clsx(
            "absolute bg-[#000] top-0 left-0 w-full h-full z-40 transition-all",
            isOpen ? "opacity-40" : "opacity-0  invisible"
          )}
        ></div>
        <div
          style={{
            left: "5%",
            right: "5%",
            top: "50%",
            transform: "translateY(-50%)",
            transition: "opacity 0.2s ease-out",
          }}
          className={clsx(
            "absolute flex flex-col gap-4 p-5 bg-container rounded-xl z-50 transition-all",
            isOpen ? "opacity-100" : "opacity-0 invisible"
          )}
        >
          {children}
        </div>
      </>
    </>
  );
};
