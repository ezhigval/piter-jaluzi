interface InputProps {
  label: string
  type?: 'text' | 'email' | 'tel' | 'number'
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  required?: boolean
  className?: string
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = '',
}) => {
  const baseClasses = 'block w-full px-3 py-2 border border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm'
  
  const errorClasses = 'border-red-500 focus:ring-red-500'

  const classes = [
    baseClasses,
    error ? errorClasses : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={classes}
        required={required}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  )
}

export default Input
