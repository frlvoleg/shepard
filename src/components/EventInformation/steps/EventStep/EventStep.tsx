import ArrowRight from '../../../../assets/svg/ArrowRight';
import BackArrow from '../../../../assets/svg/BackArrow';
import { BaseButton } from '../../../../ui/baseButton/BaseButton';
import { BaseInput } from '../../../../ui/baseInput/BaseInput';
import s from './EventStep.module.scss';

const EventStep = ({
  handleStepClick,
  onClose,
}: {
  handleStepClick: (stepId: string) => void;
  onClose?: () => void;
}) => {
  return (
    <>
      <div className={s.grid}>
        <BaseInput label="Event name" placeholder="Connections 2025" />
        <BaseInput label="Event city" placeholder="Chikago" />
        <BaseInput label="Event venue" placeholder="Connections 2025" />
        <BaseInput label="Size of space" placeholder="Connections 2025" />
        <BaseInput
          label="Event start date"
          placeholder="Connections 2025"
          type="date"
        />
        <BaseInput
          label="Event end date"
          placeholder="Connections 2025"
          type="date"
        />
      </div>
      <div className={s.bottom_buttons}>
        <BaseButton variant="muted" onClick={onClose}>
          <BackArrow /> Exit customizer{' '}
        </BaseButton>
        <BaseButton variant="primary" onClick={() => handleStepClick('setup')}>
          Next step
          <ArrowRight />
        </BaseButton>
      </div>
    </>
  );
};

export default EventStep;
