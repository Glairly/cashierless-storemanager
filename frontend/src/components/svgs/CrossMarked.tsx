import "./CrossMarked.scss";

const CrossMarked = () => {
  return (
    <svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="crossmark"
    >
      <circle
        className="crossmark__circle"
        d="M25 50C38.8071 50 50 38.8071 50 25C50 11.1929 38.8071 0 25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50Z"
        fill="#AE3B2A"
      />
      <path d="M15 35L35 15" stroke="white" className="crossmark__check" />
      <path d="M15 15L35 35" stroke="white" className="crossmark__check" />
    </svg>
  );
};

export default CrossMarked;
