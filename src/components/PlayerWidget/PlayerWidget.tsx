import React from 'react';
import s from './PlayerWidget.module.scss';
import { SideTab } from '../SideTab';
import { ThreekitPlayer } from '../ThreekitPlayer';
import BoothConfiguration from '../BoothConfiguration/BoothConfiguration';
import { StepConfig } from '../StepNavigation';
import { useStepNavigation } from '../../hooks/useStepNavigation';

const PLAYER_STEPS = ['branding', 'addons', 'cart'] as const;

const STEP_CONFIGS: StepConfig[] = [
  { id: 'branding', label: 'Branding' },
  { id: 'addons', label: 'Addons' },
  { id: 'cart', label: 'Cart' },
];

export const PlayerWidget = () => {
  const { currentStepId, stepStates, goToStep } = useStepNavigation({
    initialSteps: [...PLAYER_STEPS],
    initialCurrentStep: 'branding',
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
    <div className={s.playerWidget} id="productContainer">
      <div className={s.playerContainer}>
        <BoothConfiguration
          steps={stepsWithCompletionState}
          currentStepId={currentStepId}
          onStepClick={handleStepClick}
        />
        <ThreekitPlayer />
      </div>
      <div className={s.sideTab}>
        <SideTab
          currentStepId={currentStepId}
          onGoToAddons={() => handleStepClick('addons')}
          onStepClick={handleStepClick}
        />
      </div>
    </div>
  );
};
