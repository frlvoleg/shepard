import React from 'react';
import styles from './SideTab.module.scss';
import ConfiguratorAccordion from '../Accordion/Accordion';
import { BaseButton } from '../../ui/baseButton/BaseButton';
import Cart from '../Cart/Cart';
import ArrowRight from '../../assets/svg/ArrowRight';
import CartIcon from '../../assets/svg/CartIcon';
import PhoneIcon from '../../assets/svg/PhoneIcon';
import ShareIcon from '../../assets/svg/ShareIcon';

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
        return <Cart stepType="cart" />;
      default:
        return <ConfiguratorAccordion />;
    }
  };

  const renderButton = () => {
    switch (currentStepId) {
      case 'branding':
        return (
          <BaseButton onClick={onGoToAddons}>
            Go to Addons
            <ArrowRight />
          </BaseButton>
        );
      case 'addons':
        return (
          <BaseButton onClick={() => onStepClick?.('cart')}>
            Add To Cart
            <CartIcon />
          </BaseButton>
        );
      case 'cart':
        return (
          <div className="side-bottom-btn">
            <BaseButton onClick={() => onStepClick?.('branding')}>
              Buy Now
              <CartIcon />
            </BaseButton>
            <BaseButton
              variant="muted"
              onClick={() => onStepClick?.('branding')}
            >
              Contact Sales
              <PhoneIcon />
            </BaseButton>
            <BaseButton
              variant="muted"
              onClick={() => onStepClick?.('branding')}
            >
              Share Configuration
              <ShareIcon />
            </BaseButton>
          </div>
        );
      default:
        return <BaseButton onClick={onGoToAddons}>Go to Addons</BaseButton>;
    }
  };

  return (
    <div
      className={`${styles.sideTab} ${currentStepId === 'cart' && styles.sideCart}`}
    >
      {renderStepContent()}
      <div className={styles.stickyBtn}>
        {currentStepId === 'addons' && (
          <div className={styles.price}>
            <div>Total:</div>
            <div>$9,000.00</div>
          </div>
        )}
        {currentStepId === 'cart' && (
          <div className={styles.price}>
            <div>Total:</div>
            <div>$15,000.00</div>
          </div>
        )}
        {renderButton()}
      </div>
    </div>
  );
};

export default SideTab;
