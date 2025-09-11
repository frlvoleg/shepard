import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../store/redux';
import { AttributeSection } from '../AttributeContent';
import { ThreekitImageService } from '../../../services/threekitImageService';

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

  console.log(currentImageUrl);

  return (
    <div>
      {currentImageUrl ? (
        <img src={currentImageUrl} alt="Asset preview" />
      ) : (
        <div>No image available for asset: {currentAssetId}</div>
      )}
    </div>
  );
};

export default AddonsContent;
