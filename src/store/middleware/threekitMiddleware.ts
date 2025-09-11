import { Middleware } from '@reduxjs/toolkit';
import { setConfigurationLoading } from '../slices/ui/uiSlice';
import {
  loadConfiguration,
  updateInitAttributes,
} from '../slices/configurator/configuratorSlice';
import { ThreekitService } from '../../services/threekitService';

const evaluateAndStopLoading = (dispatch: any) =>
  (window.threekit?.player as any)
    .evaluate()
    .finally(() => dispatch(setConfigurationLoading(false)));

export const threekitMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    const { dispatch } = store;

    if (
      action.type === 'configurator/updateSelectedValue' &&
      window.threekit?.configurator
    ) {
      dispatch(setConfigurationLoading(true));
      const { name, value } = action.payload;
      const svc = new ThreekitService(window.threekit.player);
      svc
        .setConfiguration({ [name]: value })
        .then(async () => {
          const displayAttributes = await svc.getDisplayAttributes();
          dispatch(updateInitAttributes(displayAttributes));
        })
        .catch((err: any) =>
          console.error('Threekit setConfiguration error:', err)
        )
        .finally(() => evaluateAndStopLoading(dispatch));
    }

    if (
      action.type === loadConfiguration.fulfilled.type &&
      window.threekit?.configurator
    ) {
      dispatch(setConfigurationLoading(true));

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

      waitForThreekit()
        .then(() => new ThreekitService(window.threekit.player))
        .then((svc: ThreekitService) =>
          action.payload.config?.selectedConfiguration
            ? svc
                .setConfiguration(action.payload.config.selectedConfiguration)
                .then(() => svc)
            : svc
        )
        .then(async (svc: ThreekitService) => {
          const displayAttributes = await svc.getDisplayAttributes();
          dispatch(updateInitAttributes(displayAttributes));
        })
        .catch((err: unknown) =>
          console.error('Apply loaded configuration error:', err)
        )
        .finally(() => evaluateAndStopLoading(dispatch));
    }

    return next(action);
  };
