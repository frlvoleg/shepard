import {
  usePlayerLoadingStatus,
  useThreekitInitStatus,
} from '@threekit-tools/treble/dist';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { setInitAttributes } from '../../store/slices/configurator/configuratorSlice';
import { AttributeThreekit } from '../../store/slices/configurator/types';
import logo from '../../assets/logo.svg';
import s from './LoagingPage.module.scss';
import { ThreekitService } from '../../services/threekitService';

export const LoagingPage = () => {
  const hasLoaded = useThreekitInitStatus();
  const isLoading = usePlayerLoadingStatus();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (hasLoaded) {
      const waitForThreekit = (): Promise<any> => {
        return new Promise((resolve) => {
          const checkAvailability = () => {
            if (window.threekit) {
              resolve(window.threekit);
            } else {
              requestAnimationFrame(checkAvailability);
            }
          };
          checkAvailability();
        });
      };

      waitForThreekit().then(() => {
        const dataConfig = window.threekit.configurator.getDisplayAttributes();
        dispatch(
          setInitAttributes(dataConfig as unknown as AttributeThreekit[])
        );
      });
    }
  }, [hasLoaded, isLoading]);

  if (!hasLoaded)
    return (
      <div className={s.wrap}>
        <div className={s.icon}>
          <img src={logo} alt="logo" />
        </div>
        <div className={s.name}>We're preparing your content</div>
        <div className={s.subname}>This shouldn't take too long</div>
      </div>
    );

  return;
};
