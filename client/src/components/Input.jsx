const Input = ({ type, name, placeholder, value, onChange }) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="rounded-sm border-1 border-gray-400 px-2 py-2 text-sm"
    />
  );
};

export default Input;
