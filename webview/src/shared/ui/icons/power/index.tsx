export const PowerIcon = ({
  className,
  color = "#ECEDEE",
}: {
  className?: string;
  color?: string;
}) => {
  return (
    <svg
      style={{
        minHeight: 18,
        maxHeight: 25,
      }}
      className={className}
      viewBox="0 0 18 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.3104 10.7874H12.4882V1.88126C12.4882 -0.196833 11.3626 -0.6174 9.98957 0.941172L9 2.06681L0.625767 11.5914C-0.524608 12.8902 -0.0421923 13.954 1.68955 13.954H5.51177V22.8601C5.51177 24.9382 6.6374 25.3588 8.01043 23.8002L9 22.6746L17.3742 13.15C18.5246 11.8512 18.0422 10.7874 16.3104 10.7874Z"
        fill={color}
      />
    </svg>
  );
};
