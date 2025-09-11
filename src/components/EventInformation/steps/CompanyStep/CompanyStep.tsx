import { useId, useState } from 'react';
import { BaseButton } from '../../../../ui/baseButton/BaseButton';
import { BoothCard, BoothOptionValue } from '../../boothCard/BoothCart';
import s from './CompanyStep.module.scss';

export interface BoothOption {
  id: BoothOptionValue;
  title: string;
  price: string; // відформатована ціна
  image: string;
  disabled?: boolean;
}

export interface BoothOptionsProps {
  label?: string;
  options?: BoothOption[];
  value?: BoothOptionValue; // керований режим
  defaultValue?: BoothOptionValue; // некерований
  onChange?: (value: BoothOptionValue) => void;
  name?: string;
  handleStepClick: (stepId: string) => void;
}

const CompanyStep = ({
  label = 'Pre-configured Booth Setup',
  options,
  value,
  defaultValue,
  onChange,
  name,
  handleStepClick,
}: BoothOptionsProps) => {
  const groupName = name ?? useId();
  const [internal, setInternal] = useState<BoothOptionValue | undefined>(
    defaultValue
  );
  const selected = value !== undefined ? value : internal;

  const handleChange = (v: BoothOptionValue) => {
    if (value === undefined) setInternal(v);
    onChange?.(v);
  };
  return (
    <>
      <h3>{label}</h3>
      <div className={s.wrapper}>
        <div className={s.grid} role="radiogroup" aria-label={label}>
          {options?.map((opt) => (
            <BoothCard
              key={opt.id}
              name={groupName}
              value={opt.id}
              title={opt.title}
              price={opt.price}
              image={opt.image}
              selected={selected === opt.id}
              disabled={opt.disabled}
              onChange={handleChange}
            />
          ))}
        </div>
      </div>
      <div className={s.bottom_buttons}>
        <BaseButton onClick={() => handleStepClick('event')}>Back</BaseButton>
        <BaseButton onClick={() => handleStepClick('company')}>
          Next step
        </BaseButton>
      </div>
    </>
  );
};

export default CompanyStep;
