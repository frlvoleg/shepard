import React from 'react';
import styles from './SideTab.module.scss';
import ConfiguratorAccordion from '../Accordion/Accordion';
import { BaseButton } from '../../ui/baseButton/BaseButton';

interface SideTabProps {
  currentStepId?: string;
  onGoToAddons?: () => void;
  onStepClick?: (stepId: string) => void;
}

const SideTab: React.FC<SideTabProps> = ({
  currentStepId = 'branding',
  onGoToAddons,
  onStepClick,
}) => {
  const renderStepContent = () => {
    switch (currentStepId) {
      case 'branding':
        return <ConfiguratorAccordion stepType="branding" />;
      case 'addons':
        return <ConfiguratorAccordion stepType="addons" />;
      case 'cart':
        return <ConfiguratorAccordion stepType="cart" />;
      default:
        return <ConfiguratorAccordion />;
    }
  };

  const renderButton = () => {
    switch (currentStepId) {
      case 'branding':
        return <BaseButton onClick={onGoToAddons}>Go to Addons</BaseButton>;
      case 'addons':
        return (
          <BaseButton onClick={() => onStepClick?.('cart')}>
            Go to Cart
          </BaseButton>
        );
      case 'cart':
        return (
          <BaseButton onClick={() => onStepClick?.('branding')}>
            Back to Branding
          </BaseButton>
        );
      default:
        return <BaseButton onClick={onGoToAddons}>Go to Addons</BaseButton>;
    }
  };

  return (
    <div className={styles.sideTab}>
      {renderStepContent()}
      <div className={styles.stickyBtn}>{renderButton()}</div>
    </div>
  );
};

export default SideTab;
