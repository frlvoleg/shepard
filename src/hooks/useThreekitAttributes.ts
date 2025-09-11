import { useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/redux';
import { updateInitAttributes } from '../store/slices/configurator/configuratorSlice';
import { ThreekitService } from '../services/threekitService';
import { AttributeThreekit } from '../store/slices/configurator/types';

export enum AttributeName {
  CupSize = 'Bottle Size',
  Top = 'Top',
  Color = 'Color',
  ArtTemplate = 'Art template',
}

interface AttributeValue {
  visible: boolean;
  enabled: boolean;
  name?: string;
  label?: string;
  assetId: string;
  metadata?: {
    Icon?: string;
    Size?: string;
    [key: string]: any;
  };
}

const waitForThreekit = (): Promise<void> =>
  new Promise((resolve) => {
    const check = () =>
      window.threekit ? resolve() : requestAnimationFrame(check);
    check();
  });

export const useThreekitAttributes = () => {
  const dispatch = useAppDispatch();
  const attributes = useAppSelector((s) => s.configurator.attributes);
  const selectedConfiguration = useAppSelector(
    (s) => s.configurator.selectedConfiguration
  );

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (attributes.length) return;
      await waitForThreekit();

      const service = new ThreekitService(window.threekit.player);

      try {
        const attrs = await service.getDisplayAttributes();
        if (mounted && attrs.length) dispatch(updateInitAttributes(attrs));
      } catch (error) {
        console.error(error);
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, [attributes.length, dispatch]);

  const getAttributeByName = useCallback(
    (name: AttributeName | string) =>
      attributes.find((a: AttributeThreekit) => a.name === name),
    [attributes]
  );

  const getFormattedAttributeValues = useCallback(
    (attributeName: AttributeName | string) => {
      const attr = getAttributeByName(attributeName);
      if (!attr) return {};

      return attr.values
        .filter((v: AttributeValue) => v.visible && v.enabled)
        .reduce(
          (acc: Record<string, any>, v: AttributeValue, idx: number) => {
            const key = v.name ?? `option${idx + 1}`;
            acc[key] = {
              option: v.metadata?.Icon ?? '',
              label: v.label ?? v.name,
              size: v.metadata?.Size ?? '',
              assetId: v.assetId,
            };
            return acc;
          },
          {}
        );
    },
    [getAttributeByName]
  );

  const areAttributesLoaded = useCallback(
    (required: (AttributeName | string)[]) =>
      Boolean(attributes.length) &&
      required.every((n) =>
        attributes.some((a: AttributeThreekit) => a.name === n)
      ),
    [attributes]
  );

  return {
    attributes,
    selectedConfiguration,
    getAttributeByName,
    getFormattedAttributeValues,
    areAttributesLoaded,
  } as const;
};
