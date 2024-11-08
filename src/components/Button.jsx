const Button = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full bg-[#5f5fe1] hover:bg-blue-600 text-white font-semibold py-2 rounded"
  >
    {label}
  </button>
);

export default Button;
