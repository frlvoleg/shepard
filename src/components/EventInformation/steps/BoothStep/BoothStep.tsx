import { BaseButton } from '../../../../ui/baseButton/BaseButton';
import { BaseInput } from '../../../../ui/baseInput/BaseInput';
interface BoothStepProps {
  label?: string;
  handleStepClick: (stepId: string) => void;
  onClose?: () => void;
}
import s from './BoothStep.module.scss';

const BoothStep = ({
  label = '',
  handleStepClick,
  onClose,
}: BoothStepProps) => {
  return (
    <>
      {label && <h3>{label}</h3>}
      <div className={s.wrapper}>
        <BaseInput label="Company Name" placeholder="Threekit" />
        <BaseInput label="Company Address" placeholder="Threekit" />
        <BaseInput label="Contacts" placeholder="Threekit" />
      </div>
      <div className={s.bottom_buttons}>
        <BaseButton onClick={() => handleStepClick('event')}>Back</BaseButton>
        <BaseButton
          onClick={() => {
            handleStepClick('company');
            onClose?.();
          }}
        >
          Save and continue
        </BaseButton>
      </div>
    </>
  );
};

export default BoothStep;
