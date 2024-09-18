export const CopyIcon = ({
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
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.873 6.25H9.0332C7.49608 6.25 6.25 7.49608 6.25 9.0332V19.873C6.25 21.4102 7.49608 22.6562 9.0332 22.6562H19.873C21.4102 22.6562 22.6562 21.4102 22.6562 19.873V9.0332C22.6562 7.49608 21.4102 6.25 19.873 6.25Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M18.7256 6.25L18.75 5.07812C18.7479 4.35356 18.4592 3.65926 17.9468 3.14691C17.4345 2.63456 16.7402 2.34581 16.0156 2.34375H5.46875C4.6407 2.3462 3.84727 2.67622 3.26174 3.26174C2.67622 3.84727 2.3462 4.6407 2.34375 5.46875V16.0156C2.34581 16.7402 2.63456 17.4345 3.14691 17.9468C3.65926 18.4592 4.35356 18.7479 5.07812 18.75H6.25"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
