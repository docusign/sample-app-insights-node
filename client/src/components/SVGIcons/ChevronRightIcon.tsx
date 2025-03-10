const ChevronRightIcon = ({ color = "#000000", size = 24, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 6 10"
      fill="none"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.66666 4.99999L1.30148 0.333323L0.333323 1.21523L3.87356 4.99999L0.333323 8.78474L1.30148 9.66666L5.66666 4.99999Z"
        fill={"currentColor"}
      />
    </svg>
  );
};

export default ChevronRightIcon;
