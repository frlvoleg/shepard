import React from 'react';
import { AddInfoTitle } from '../AddInfoTitle/AddInfoTitle';
import { useAppDispatch, useAppSelector } from '../../store/redux';

export const AnnotationTooltip: React.FC = () => {
  const dispatch = useAppDispatch();
  const tooltip = useAppSelector((s) => s.ui.tooltip);
  if (!tooltip) return null;

  const { left, top, text, imageSrc } = tooltip;
  const annotationDown = text.includes('Exterior');

  const annotationStyles: React.CSSProperties = {
    position: 'absolute',
    left: `${left + 647}px`,
    top: `${top + 80}px`,
    transform: annotationDown
      ? 'translate(-37%, -108%)'
      : 'translate(-37%, 4%)',
    pointerEvents: 'auto',
    zIndex: 1000,
  };

  return (
    <div style={annotationStyles} onClick={() => {}}>
      <AddInfoTitle src={imageSrc} label={text} text={text} />
    </div>
  );
};
