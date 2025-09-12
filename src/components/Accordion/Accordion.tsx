import React, { useState, useEffect } from 'react';
import s from './Accordion.module.scss';
import {
  AttributeContent,
  AttributeSection,
} from '../AttributeComponents/AttributeContent';
import AddonsContent from '../AttributeComponents/AddonsContent/AddonsContent';

const brandingSections: AttributeSection[] = [
  {
    id: 'cabinet',
    title: 'Background',
    attributeName: 'CustomArea_A1',
    imageType: 'background',
    showColorButton: true,
  },
  {
    id: 'left-header',
    title: 'Left Header',
    attributeName: 'CustomArea_B1',
    imageType: 'background',
    showColorButton: true,
  },
  {
    id: 'right-header',
    title: 'Right Header',
    attributeName: 'CustomArea_B2',
    imageType: 'background',
    showColorButton: true,
  },
  {
    id: 'left-wall',
    title: 'Left Wall',
    attributeName: 'CustomArea_C1',
    imageType: 'background',
    showColorButton: true,
  },
  {
    id: 'right-wall',
    title: 'Right Wall',
    attributeName: 'CustomArea_C2',
    imageType: 'background',
    showColorButton: true,
  },
  {
    id: 'center-left-header',
    title: 'Center Left Header',
    attributeName: 'CustomArea_D1',
    imageType: 'background',
    showColorButton: true,
  },
  {
    id: 'center-right-header',
    title: 'Center Right Header',
    attributeName: 'CustomArea_D2',
    imageType: 'background',
    showColorButton: true,
  },
  {
    id: 'global-color',
    title: 'Set Color',
    attributeName: 'Set_Color',
    imageType: 'background',
    showColorButton: true,
  },
];

const addonsSections: AttributeSection[] = [
  {
    id: 'carpet',
    title: 'Carpet',
    attributeName: 'Carpet',
    imageType: 'background',
    showColorButton: false,
  },
];

const cartSections: AttributeSection[] = [
  {
    id: 'summary',
    title: 'Order Summary',
    attributeName: 'Order_Summary',
    imageType: 'background',
    showColorButton: false,
  },
];

const Badge: React.FC<{ label: string }> = ({ label }) => (
  <span className={s.badge}>{label}</span>
);

const Chevron: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    className={`${s.chevron} ${open ? s.open : ''}`}
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 10.127l3.71-2.896a.75.75 0 111.06 1.06l-4.24 3.31a.75.75 0 01-.94 0l-4.24-3.31a.75.75 0 01-.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

interface AccordionItemProps {
  id: string;
  title: string;
  badge?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  id,
  title,
  badge,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <div className={`${s.accordionItem} ${isOpen && s.active_acc} `}>
      <button
        onClick={onToggle}
        className={`${s.accordionHeader} ${isOpen && s.active}`}
        aria-controls={`${id}-panel`}
        aria-expanded={isOpen}
      >
        {badge && <Badge label={badge} />}
        <span className={s.accordionTitle}>{title}</span>
        <Chevron open={isOpen} />
      </button>

      {isOpen && (
        <div id={`${id}-panel`} className={s.accordionPanel}>
          {children}
        </div>
      )}
    </div>
  );
};

interface ConfiguratorAccordionProps {
  stepType?: 'branding' | 'addons' | 'cart';
}

export default function ConfiguratorAccordion({
  stepType,
}: ConfiguratorAccordionProps) {
  const getSections = () => {
    switch (stepType) {
      case 'branding':
        return brandingSections;
      case 'addons':
        return addonsSections;
      case 'cart':
        return cartSections;
      default:
        return brandingSections;
    }
  };

  const getBadges = () => {
    switch (stepType) {
      case 'addons':
        return ['1'];
      case 'cart':
        return ['S1'];
      default:
        return ['A1', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2', 'SC'];
    }
  };

  const getDefaultOpenId = () => {
    switch (stepType) {
      case 'addons':
        return 'carpet';
      case 'cart':
        return 'summary';
      default:
        return 'cabinet';
    }
  };

  const sections = getSections();
  const badges = getBadges();
  const defaultOpenId = getDefaultOpenId();

  // State to track which accordion item is open
  const [openItemId, setOpenItemId] = useState<string | null>(defaultOpenId);

  // Reset to first item when stepType changes
  useEffect(() => {
    const firstSectionId = sections[0]?.id || null;
    setOpenItemId(firstSectionId);
  }, [stepType]);

  // Handle toggling accordion items
  const handleToggle = (itemId: string) => {
    setOpenItemId(prevId => prevId === itemId ? null : itemId);
  };

  return (
    <div className={s.accordion}>
      {sections.map((section, index) => {
        const badge = badges[index];

        return (
          <AccordionItem
            key={section.id}
            id={section.id}
            title={section.title === 'Background' ? 'Cabinet' : section.title}
            badge={badge}
            isOpen={openItemId === section.id}
            onToggle={() => handleToggle(section.id)}
          >
            {stepType === 'addons' && section.id === 'carpet' ? (
              <AddonsContent section={section} />
            ) : (
              <AttributeContent section={section} />
            )}
          </AccordionItem>
        );
      })}
    </div>
  );
}
