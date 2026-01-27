import React, { useState, useEffect } from 'react';
import { HowToStartModal } from '../../molecules/modals/HowToStartModal';
import { HOW_TO_START_STEPS } from '../../../data/steps';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const HowToStartFlow = ({ visible, onClose }: Props) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!visible) {
      setStepIndex(0);
    }
  }, [visible]);

  if (!visible) return null;

  const step = HOW_TO_START_STEPS[stepIndex];

  const handleNext = () => {
    if (stepIndex < HOW_TO_START_STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      onClose();
    }
  };

  return (
    <HowToStartModal
      visible
      title={step.title}
      description={step.description}
      onNext={handleNext}
      onClose={onClose}
      isLastStep={stepIndex === HOW_TO_START_STEPS.length - 1}
    />
  );
};
