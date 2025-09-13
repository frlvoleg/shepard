import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/redux';
import { AttributeSection } from '../AttributeContent';
import { ThreekitImageService } from '../../../services/threekitImageService';
import { useThreekitImageUrl } from '../../../hooks/useThreekitImageUrl';
import fallbackImg from '../../../assets/gray.jpg';
import s from './AddonsContent.module.scss';
import { setConfigurationLoading } from '../../../store/slices/ui/uiSlice';

interface CarpetValue {
  assetId: string;
  enabled: boolean;
  fileSize: number;
  label: string;
  metadata: Record<string, any>;
  name: string;
  tagids: string[];
  tags: string[];
  type: string;
  visible: boolean;
}

const AddonsContent = ({ section }: { section: AttributeSection }) => {
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [addonName, setAddonName] = useState<string>('');
  const [imageLoading, setImageLoading] = useState(false);
  const isConfigurationLoading = useAppSelector(
    (s) => s.ui.isConfigurationLoading
  );
  const dispatch = useAppDispatch();

  const selectedConfig = useAppSelector(
    (s) => s.configurator.selectedConfiguration
  );

  // Get Carpet values from attributes
  const carpetValues = useAppSelector(
    (s) => s.configurator.attributes.find((attr: any) => attr.name === 'Carpet')?.values || []
  ) as CarpetValue[];

  const currentAttribute = selectedConfig?.[section.attributeName];

  console.log('Carpet Values:', carpetValues);

  const currentAssetId =
    currentAttribute &&
    typeof currentAttribute === 'object' &&
    'assetId' in currentAttribute
      ? currentAttribute.assetId
      : null;

  console.log(currentAssetId);

  // Fetch image URL when asset ID is available
  // useEffect(() => {
  //   const fetchImageUrl = async () => {
  //     if (currentAssetId && typeof currentAssetId === 'string') {
  //       try {
  //         const imageUrl =
  //           await ThreekitImageService.getImageFromAsset(currentAssetId);

  //         console.log(imageUrl);

  //         if (imageUrl) {
  //           setCurrentImageUrl(imageUrl);
  //         }
  //       } catch (error) {
  //         // Could not get image URL - that's okay, just means no preview
  //         setCurrentImageUrl(null);
  //       }
  //     } else {
  //       setCurrentImageUrl(null);
  //     }
  //   };

  //   fetchImageUrl();
  // }, [currentAssetId]);

  useEffect(() => {
    const fetchImageUrl = async () => {
      if (currentAssetId) {
        setImageLoading(true);
        try {
          console.log('Fetching thumbnail for assetId:', currentAssetId);
          const imageUrl =
            await ThreekitImageService.getAssetThumbnail(currentAssetId);

          console.log('Thumbnail URL:', imageUrl);
          console.log('ImageUrl type:', typeof imageUrl);

          if (imageUrl && imageUrl.trim() !== '') {
            setCurrentImageUrl(imageUrl);
          } else {
            setCurrentImageUrl(null);
          }
        } catch (error) {
          setCurrentImageUrl(null);
        } finally {
          setImageLoading(false);
        }
      }
    };

    fetchImageUrl();
  }, [currentAssetId]);

  useEffect(() => {
    const fetchMaterialData = async () => {
      if (!currentAssetId) return;

      dispatch(setConfigurationLoading(true));

      try {
        const res = await ThreekitImageService.getAssetData(currentAssetId);
        console.log(res);
        setAddonName(res.name);
      } catch (error) {
        console.error('Failed to fetch material data:', error);
      } finally {
        dispatch(setConfigurationLoading(false));
      }
    };

    fetchMaterialData();

    console.log("currentAttribute");
    console.log(currentAttribute);

  }, [currentAssetId, dispatch]);

  return (
    <div>
      {carpetValues.map((carpetValue: CarpetValue) => {
        return (
          <div key={carpetValue.assetId} className={s.material_item}>
            <div className={s.material_item__img}>
              {imageLoading ? (
                <div className={s.imageSpinner} />
              ) : (
                <img src={currentImageUrl || fallbackImg} alt="material image" />
              )}
            </div>
            <div>{carpetValue.name}</div>
          </div>
        )
      })}
    </div>
  );
};

export default AddonsContent;
