import { TrebleApp } from '@threekit-tools/treble/dist';
import { useMemo, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/redux';
import { getSelectedRing } from '../../store/selectors/uiSelectors';
import { useSearchParams } from '../../hooks/queryParams';
import { loadConfiguration } from '../../store/slices/configurator/configuratorSlice';
import { useThreekitAttributes } from '../../hooks/useThreekitAttributes';
import { AnnotationService } from '../../services/annotationService';

export const TreableComponentApp: React.FC = () => {
  const selectedSchool = useAppSelector(getSelectedRing);
  const threekitEnv = 'preview';
  const tkcsid = useSearchParams('tkcsid');
  const dispatch = useAppDispatch();
  const annotationService = useMemo(
    () => new AnnotationService(dispatch),
    [dispatch]
  );

  useEffect(() => {
    if (tkcsid) dispatch(loadConfiguration(tkcsid));
  }, [tkcsid, dispatch]);

  useThreekitAttributes();

  return (
    <TrebleApp
      key={selectedSchool}
      productId={selectedSchool}
      threekitEnv={threekitEnv}
      playerConfig={{
        // @ts-ignore: IPlayerConfig does not include onAnnotationChange
        onAnnotationChange: annotationService.onAnnotationChange,
      }}
    />
  );
};
