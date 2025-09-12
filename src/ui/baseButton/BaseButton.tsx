import s from './BaseButton.module.scss';

export const BaseButton: React.FC<{
  variant?: 'primary' | 'muted' | 'edit' | 'delete';
  block?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}> = ({ variant = 'primary', block, children, onClick, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${s.btn} ${s[variant]} ${block ? s.block : ''} ${disabled ? s.disabled : ''}`}
    >
      {children}
    </button>
  );
};
