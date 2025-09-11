import { Player } from '@threekit-tools/treble/dist';
import React, { useEffect, useState } from 'react';
import { PlayerProps } from '@threekit-tools/treble/dist/components/Player';
import { useSelector } from 'react-redux';
import { getImageUploaded } from '../../store/selectors/uiSelectors';
interface ThreekitPlayerProps
  extends Omit<PlayerProps, 'height' | 'width' | 'minHeight'> {
  onAnnotationChange?: (annotations: any[], parentEl: HTMLElement) => void;
}

export const ThreekitPlayer = ({
  onAnnotationChange,
  ...restProps
}: ThreekitPlayerProps) => {
  const overlayImageUrl = useSelector(getImageUploaded);

  return (
    <div style={{ marginTop: '35px' }}>
      <Player height="100%" width="100%" />
    </div>
  );
};
