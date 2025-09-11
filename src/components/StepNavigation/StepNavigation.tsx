import React from 'react';
import { Step } from './Step';
import s from './StepNavigation.module.scss';

export interface StepConfig {
  id: string;
  label?: string;
  isCompleted?: boolean;
}

interface StepNavigationProps {
  steps: StepConfig[];
  currentStepId: string;
  onStepClick?: (stepId: string) => void;
  showNumbers?: boolean;
  title?: string;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  steps,
  currentStepId,
  onStepClick,
  showNumbers = false,
  title = 'Booth Configuration',
}) => {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStepId);

  return (
    <div className={s.stepNavigation}>
      <div className={s.title}>{title}</div>
      <div className={s.steps}>
        <div className={s.line}>
          {steps.map((step, index) => {
            const isActive = step.id === currentStepId;
            const isCompleted = step.isCompleted || index < currentStepIndex;

            return (
              <div key={step.id} className={s.stepItem}>
                <Step
                  isActive={isActive}
                  isCompleted={isCompleted}
                  stepNumber={showNumbers ? index + 1 : undefined}
                  onClick={onStepClick ? () => onStepClick(step.id) : undefined}
                />
                {step.label && <div className={s.stepLabel}>{step.label}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
