import React from 'react';
import { StepNavigation, StepConfig } from '../StepNavigation';

interface BoothConfigurationProps {
  title?: string;
  steps?: StepConfig[];
  currentStepId?: string;
  onStepClick?: (stepId: string) => void;
  showNumbers?: boolean;
}

const BoothConfiguration: React.FC<BoothConfigurationProps> = ({
  title = 'Booth Configuration',
  steps = [
    { id: 'step1', label: 'Branding' },
    { id: 'step2', label: 'Addons' },
    { id: 'step3', label: 'Cart' },
  ],
  currentStepId = 'step1',
  onStepClick,
  showNumbers = false,
}) => {
  return (
    <StepNavigation
      title={title}
      steps={steps}
      currentStepId={currentStepId}
      onStepClick={onStepClick}
      showNumbers={showNumbers}
    />
  );
};

export default BoothConfiguration;
