const InputField = ({ label, type = "text", value, onChange }) => (
    <div className="mb-4">
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 bg-[#ebebeb] rounded p-2"
      />
    </div>
  );
  
  export default InputField;
  