import { useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff, type LucideIcon } from 'lucide-react';

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
}

export const AuthField = ({
  label,
  icon: Icon,
  id,
  type,
  ...props
}: AuthFieldProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="formGroup">
      <label htmlFor={id} className="formLabel">
        {label}
      </label>
      <div className="inputWrapper">
        <Icon className="inputIcon" strokeWidth={1.75} />
        <input
          id={id}
          type={isPassword ? (isVisible ? 'text' : 'password') : type}
          className={isPassword ? 'authInput hasToggle' : 'authInput'}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="passwordToggleBtn"
            onClick={() => setIsVisible((p) => !p)}
            tabIndex={-1}
            aria-label={isVisible ? 'Hide password' : 'Show password'}
          >
            {isVisible ? <EyeOff size={18} strokeWidth={1.75} /> : <Eye size={18} strokeWidth={1.75} />}
          </button>
        )}
      </div>
    </div>
  );
};
