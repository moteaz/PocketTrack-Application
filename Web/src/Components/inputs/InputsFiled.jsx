
const InputField = ({ id, label, type, value, onChange }) => (
    <div className="relative">
      <input
        value={value}
        onChange={onChange}
        type={type}
        id={id}
        placeholder={label}
        className="peer w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-transparent"
      />
      <label
        htmlFor={id}
        className="absolute left-3 top-[-10px] text-xs text-violet-500 bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-violet-500"
      >
        {label}
      </label>
    </div>
  );
  export default InputField;