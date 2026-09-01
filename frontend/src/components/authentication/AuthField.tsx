import type { InputHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
}

export const AuthField = ({
  label,
  icon: Icon,
  id,
  ...props
}: AuthFieldProps) => {
  return (
    <div className="formGroup">
      <label htmlFor={id} className="formLabel">
        {label}
      </label>
      <div className="inputWrapper">
        <Icon className="inputIcon" strokeWidth={1.75} />
        <input id={id} className="authInput" {...props} />
      </div>
    </div>
  );
};
