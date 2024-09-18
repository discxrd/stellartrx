interface HomeIconProps {
  color: string;
}

export const HomeIcon = ({ color }: HomeIconProps) => {
  return (
    <svg
      style={{
        minHeight: 20,
        maxHeight: 20,
      }}
      viewBox="0 0 33 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M26.0349 16.6676C29.5993 19.4355 31.5816 21.8824 30.8974 23.0279C29.8167 24.8355 22.4947 22.7068 14.5437 18.273C6.59271 13.8392 1.0224 8.77968 2.10256 6.97264C2.77826 5.84296 5.89158 6.25077 10.0729 7.79823"
        stroke={color}
        strokeWidth="2.5"
        strokeMiterlimit="10"
      />
      <path
        d="M16.5 24.375C21.8503 24.375 26.1875 20.1777 26.1875 15C26.1875 9.82233 21.8503 5.625 16.5 5.625C11.1497 5.625 6.8125 9.82233 6.8125 15C6.8125 20.1777 11.1497 24.375 16.5 24.375Z"
        stroke={color}
        strokeWidth="2.5"
        strokeMiterlimit="10"
      />
    </svg>
  );
};
