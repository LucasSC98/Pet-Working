import "../styles/Input.css";

type InputProps = {
  label?: string;
  type: string;
  name: string;
  value: string;
  placeholder?: string;
  textColor?: string;
  required?: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  options?: { value: string; label: string }[];
  error?: string;
};

const Input = ({
  label,
  type,
  name,
  value,
  placeholder,
  textColor,
  required = false,
  onChange,
  options,
}: InputProps) => {
  return (
    <div className="input-box">
      <label>{label}</label>
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          style={{ color: textColor }}
          required
        >
          <option value="">{placeholder || "Selecione uma opção"}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{ color: textColor }}
          required={required}
        />
      )}
    </div>
  );
};

export default Input;
