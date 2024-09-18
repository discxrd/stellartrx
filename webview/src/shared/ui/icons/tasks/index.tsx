interface TaskIconProps {
  color: string;
}

export const TasksIcon = ({ color }: TaskIconProps) => {
  return (
    <svg
      style={{
        minHeight: 20,
        maxHeight: 20,
      }}
      viewBox="-1 -2 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_90_187)">
        <path
          d="M5.75 3.59375V2.875C5.75166 2.30364 5.97937 1.75615 6.38338 1.35213C6.7874 0.948118 7.33489 0.720409 7.90625 0.71875H17.9688C18.5401 0.720409 19.0876 0.948118 19.4916 1.35213C19.8956 1.75615 20.1233 2.30364 20.125 2.875V19.4062L16.5312 16.5312"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M14.375 4.3125H5.03125C4.45989 4.31416 3.9124 4.54187 3.50838 4.94588C3.10437 5.3499 2.87666 5.89739 2.875 6.46875V22.2812L9.70312 16.5312L16.5312 22.2812V6.46875C16.5296 5.89739 16.3019 5.3499 15.8979 4.94588C15.4939 4.54187 14.9464 4.31416 14.375 4.3125Z"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};
