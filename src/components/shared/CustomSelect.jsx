import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const CustomSelect = ({ options, placeholder, onChange, value, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const option = options.find((opt) => opt.value === value);
    setSelectedOption(option || null);
  }, [value, options]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onChange) {
      onChange(option.value);
    }
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-left bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        name={name}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown
          className="w-5 h-5 ml-2 -mr-1 text-gray-400"
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul
          className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          tabIndex="-1"
          role="listbox"
          aria-labelledby="listbox-label"
          aria-activedescendant="listbox-option-0"
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              className={`cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-primary hover:text-primary-foreground ${
                selectedOption && selectedOption.value === option.value
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-900"
              }`}
              id={`listbox-option-${index}`}
              role="option"
              aria-selected={
                selectedOption && selectedOption.value === option.value
              }
              onClick={() => handleOptionClick(option)}
            >
              <span className="block truncate">{option.label}</span>
              {selectedOption && selectedOption.value === option.value && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
