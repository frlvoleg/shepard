import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../store/redux';
import { AttributeSection } from '../AttributeContent';
import { ThreekitImageService } from '../../../services/threekitImageService';
import { useThreekitImageUrl } from '../../../hooks/useThreekitImageUrl';
import fallbackImg from '../../../assets/gray.jpg';
import s from './AddonsContent.module.scss';

const AddonsContent = ({ section }: { section: AttributeSection }) => {
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const selectedConfig = useAppSelector(
    (s) => s.configurator.selectedConfiguration
  );

  const currentAttribute = selectedConfig?.[section.attributeName];

  console.log(currentAttribute);

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
        }
      }
    };

    fetchImageUrl();
  }, [currentAssetId]);

  useEffect(() => {
    const fetchMaterialData = async () => {
      const res = await ThreekitImageService.getAssetData(currentAssetId);

      console.log(res);
      return res;
    };

    fetchMaterialData();
  }, [currentAssetId]);

  return (
    <div>
      <div className={s.material_item}>
        <div className={s.material_item__img}>
          <img src={fallbackImg} alt="material image" />
        </div>
        <div>Gray</div>
      </div>
    </div>
  );
};

export default AddonsContent;
