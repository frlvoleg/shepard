import React, { forwardRef, InputHTMLAttributes } from 'react';
import s from './BoothCart.module.scss';

export type BoothOptionValue = string | number;

interface BoothCardProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value: BoothOptionValue;
  name: string;
  title: string;
  price: string;
  image: string;
  selected?: boolean;
  disabled?: boolean;
  onChange?: (value: BoothOptionValue) => void;
}

export const BoothCard = forwardRef<HTMLInputElement, BoothCardProps>(
  (
    { value, name, title, price, image, selected, disabled, onChange, ...rest },
    ref
  ) => {
    return (
      <label
        className={`${s.card} ${selected ? s.selected : ''} ${disabled ? s.disabled : ''}`}
        aria-disabled={disabled}
      >
        <input
          ref={ref}
          className={s.radio}
          type="radio"
          name={name}
          value={String(value)}
          checked={!!selected}
          disabled={disabled}
          onChange={() => !disabled && onChange?.(value)}
          {...rest}
        />

        <div className={s.thumb}>
          <img src={image} alt={title} />
        </div>

        <div className={s.footer}>
          <div className={s.titleRow}>
            <span className={s.customRadio} aria-hidden />
            <span className={s.title}>{title}</span>
          </div>
          <div className={s.price}>{price}</div>
        </div>
      </label>
    );
  }
);

BoothCard.displayName = 'BoothCard';
