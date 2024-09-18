export const SuccessIcon = ({
  color = "#ECEDEE",
  className,
}: {
  color?: string;
  className?: string;
}) => {
  return (
    <svg
      style={{
        minHeight: 30,
        maxHeight: 30,
      }}
      className={className}
      viewBox="0 0 25 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23.7305 1.51562L8.04199 19.4355L1.31836 12.7156"
        stroke={color}
        strokeWidth="2.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
    </svg>
  );
};
