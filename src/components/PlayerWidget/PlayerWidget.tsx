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
      <div
        className={`${s.playerContainer} ${currentStepId === 'cart' && 'cart'} `}
      >
        {currentStepId !== 'cart' ? (
          <BoothConfiguration
            steps={stepsWithCompletionState}
            currentStepId={currentStepId}
            onStepClick={handleStepClick}
          />
        ) : (
          <div>
            <h2>Your Configuration</h2>
            <div className={s.parent}>
              <div className={s.info_item}>
                <h5>Booth Configuration</h5>
                <p>Event name: Connections 2025</p>
                <p>Event start date - end date: 6/11/25-6/12/25</p>
                <p>Event city: Chicago</p>
                <p>Event venue: McCormick Place</p>
                <p>Size of space: 20 x 20</p>
              </div>
              <div className={s.info_item}>
                <h5>Company Information</h5>
                <p>Company name: Threekit</p>
                <p>Company Address: Threekit</p>
                <p>Company Contacts: Threekit</p>
              </div>
              <div className={s.info_item}>
                <h5>Services</h5>
                <p>Premium Booth Branding</p>
                <p>Burgandy Carpet</p>
              </div>
            </div>
          </div>
        )}

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
