import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function Dropdown({
  trigger,
  children,
  placement = 'bottom-start',
  className,
  menuClassName,
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const placementClasses = {
    'bottom-start': 'top-full left-0 mt-1',
    'bottom-end': 'top-full right-0 mt-1',
    'top-start': 'bottom-full left-0 mb-1',
    'top-end': 'bottom-full right-0 mb-1',
    'left-start': 'right-full top-0 mr-1',
    'right-start': 'left-full top-0 ml-1'
  };

  return (
    <div className={clsx('relative inline-block', className)} ref={dropdownRef}>
      <div ref={triggerRef} onClick={toggleDropdown}>
        {trigger}
      </div>

      {isOpen && (
        <div
          className={clsx(
            'absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg',
            placementClasses[placement],
            menuClassName
          )}
        >
          <div onClick={closeDropdown}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

// Dropdown Item Component
export function DropdownItem({
  children,
  onClick,
  disabled = false,
  danger = false,
  className,
  ...props
}) {
  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={clsx(
        'w-full text-left px-4 py-2 text-sm transition-colors duration-200',
        'hover:bg-gray-100 focus:bg-gray-100 focus:outline-none',
        'first:rounded-t-lg last:rounded-b-lg',
        disabled && 'opacity-50 cursor-not-allowed',
        danger ? 'text-red-600 hover:bg-red-50 focus:bg-red-50' : 'text-gray-700',
        className
      )}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

// Dropdown Divider Component
export function DropdownDivider({ className }) {
  return <div className={clsx('border-t border-gray-200 my-1', className)} />;
}

// Dropdown Header Component
export function DropdownHeader({ children, className }) {
  return (
    <div className={clsx('px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider', className)}>
      {children}
    </div>
  );
}

// Select Dropdown Component
export function Select({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  error = false,
  className,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (option) => {
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <Dropdown
      trigger={
        <button
          className={clsx(
            'w-full px-3 py-2 text-left bg-white border rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'flex items-center justify-between',
            error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
            disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
            className
          )}
          disabled={disabled}
          {...props}
        >
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDownIcon className={clsx('w-4 h-4 text-gray-400 transition-transform', isOpen && 'rotate-180')} />
        </button>
      }
      className="w-full"
      menuClassName="w-full min-w-0"
      disabled={disabled}
    >
      <div className="max-h-60 overflow-auto">
        {options.map((option) => (
          <DropdownItem
            key={option.value}
            onClick={() => handleSelect(option)}
            className={value === option.value ? 'bg-indigo-50 text-indigo-600' : ''}
          >
            {option.label}
          </DropdownItem>
        ))}
      </div>
    </Dropdown>
  );
}
