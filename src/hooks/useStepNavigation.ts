import { useState, useCallback } from 'react';

export interface StepState {
  id: string;
  isCompleted: boolean;
}

interface UseStepNavigationProps {
  initialSteps: string[];
  initialCurrentStep?: string;
}

export const useStepNavigation = ({ 
  initialSteps, 
  initialCurrentStep 
}: UseStepNavigationProps) => {
  const [currentStepId, setCurrentStepId] = useState(
    initialCurrentStep || initialSteps[0]
  );
  
  const [stepStates, setStepStates] = useState<Record<string, StepState>>(
    () => 
      initialSteps.reduce((acc, stepId) => ({
        ...acc,
        [stepId]: { id: stepId, isCompleted: false },
      }), {})
  );

  const goToStep = useCallback((stepId: string) => {
    if (initialSteps.includes(stepId)) {
      setCurrentStepId(stepId);
    }
  }, [initialSteps]);

  const nextStep = useCallback(() => {
    const currentIndex = initialSteps.indexOf(currentStepId);
    if (currentIndex < initialSteps.length - 1) {
      const nextStepId = initialSteps[currentIndex + 1];
      setCurrentStepId(nextStepId);
    }
  }, [currentStepId, initialSteps]);

  const previousStep = useCallback(() => {
    const currentIndex = initialSteps.indexOf(currentStepId);
    if (currentIndex > 0) {
      const prevStepId = initialSteps[currentIndex - 1];
      setCurrentStepId(prevStepId);
    }
  }, [currentStepId, initialSteps]);

  const completeStep = useCallback((stepId: string) => {
    setStepStates(prev => ({
      ...prev,
      [stepId]: { ...prev[stepId], isCompleted: true },
    }));
  }, []);

  const completeCurrentStep = useCallback(() => {
    completeStep(currentStepId);
  }, [currentStepId, completeStep]);

  const resetSteps = useCallback(() => {
    setStepStates(
      initialSteps.reduce((acc, stepId) => ({
        ...acc,
        [stepId]: { id: stepId, isCompleted: false },
      }), {})
    );
    setCurrentStepId(initialSteps[0]);
  }, [initialSteps]);

  const currentStepIndex = initialSteps.indexOf(currentStepId);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === initialSteps.length - 1;

  return {
    currentStepId,
    currentStepIndex,
    stepStates,
    isFirstStep,
    isLastStep,
    goToStep,
    nextStep,
    previousStep,
    completeStep,
    completeCurrentStep,
    resetSteps,
  };
};