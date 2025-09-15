import React from 'react';
import { StepNavigation, StepConfig } from '../StepNavigation';
import { useStepNavigation } from '../../hooks/useStepNavigation';
import s from './EventInformation.module.scss';
import EventStep from './steps/EventStep/EventStep';
import CompanyStep from './steps/CompanyStep/CompanyStep';
import card_image from '../../assets/base_image.png';
import card_image2 from '../../assets/img/createPopup/des_2.jpg';
import card_image3 from '../../assets/img/createPopup/des_3.jpg';
import card_image4 from '../../assets/img/createPopup/des_3.jpg';
import BoothStep from './steps/BoothStep/BoothStep';

interface EventInformationProps {
  title?: string;
  initialStep?: string;
  onClose?: () => void;
}

// Configuration constants
const BOOTH_STEPS = ['event', 'setup', 'company'] as const;

const STEP_CONFIGS: StepConfig[] = [
  { id: 'event', label: 'Even Information' },
  { id: 'setup', label: 'Booth set up' },
  { id: 'company', label: 'Company information' },
];

const data = [
  {
    id: 'curve-1',
    title: 'Curve Wall 1',
    price: '$7,856.70',
    image: card_image,
  },
  {
    id: 'curve-2',
    title: 'Curve Wall 2',
    price: '$12,416.75',
    image: card_image2,
  },
  {
    id: 'premium',
    title: 'Premium',
    price: '$19,394.20',
    image: card_image3,
  },
  {
    id: 'display-2',
    title: 'Display 2',
    price: '$10,179.75',
    image: card_image4,
  },
];

const EventInformation: React.FC<EventInformationProps> = ({
  title = '',
  initialStep = 'event',
  onClose,
}) => {
  const { currentStepId, stepStates, goToStep } = useStepNavigation({
    initialSteps: [...BOOTH_STEPS],
    initialCurrentStep: initialStep,
  });

  // Map step states to step configs
  const stepsWithCompletionState = STEP_CONFIGS.map((step) => ({
    ...step,
    isCompleted: stepStates[step.id]?.isCompleted || false,
  }));

  const handleStepClick = (stepId: string) => {
    goToStep(stepId);
  };

  return (
    <div className={s.event_info}>
      <StepNavigation
        title={title}
        steps={stepsWithCompletionState}
        currentStepId={currentStepId}
        onStepClick={handleStepClick}
        showNumbers={false}
      />

      {/* Step Content */}
      <div>
        <div className={s.stepContent}>
          {currentStepId === 'event' && (
            <EventStep handleStepClick={handleStepClick} onClose={onClose} />
          )}

          {currentStepId === 'setup' && (
            <div className={s.addonsStep}>
              <CompanyStep
                options={data}
                defaultValue="premium"
                handleStepClick={handleStepClick}
              />
            </div>
          )}

          {currentStepId === 'company' && (
            <BoothStep handleStepClick={handleStepClick} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventInformation;
