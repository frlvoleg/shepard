import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/redux';
import { AttributeSection } from '../AttributeContent';
import { ThreekitImageService } from '../../../services/threekitImageService';
import { useThreekitImageUrl } from '../../../hooks/useThreekitImageUrl';
import fallbackImg from '../../../assets/gray.jpg';
import burgandyImg from '../../../assets/50255_Burgandy.jpg';
import peackImg from '../../../assets/peackokc.png';
import s from './AddonsContent.module.scss';
import { setConfigurationLoading } from '../../../store/slices/ui/uiSlice';
import { updateSelectedValue } from '../../../store/slices/configurator/configuratorSlice';

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

const fallbackImage = [
  {
    name: 'No Carpet',
    img: fallbackImg
  },
  {
    name: 'Peacock',
    img: peackImg
  },
  {
    name: 'Grey',
    img: fallbackImg
  },
  {
    name: 'Burgundi',
    img: burgandyImg
  },
]

const AddonsContent = ({ section }: { section: AttributeSection }) => {
  const [carpetImages, setCarpetImages] = useState<Record<string, string>>({});
  const [addonName, setAddonName] = useState<string>('');
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
  console.log('Current Attribute:', currentAttribute);
  
  // Filter carpets based on selected value
  const selectedCarpetId = currentAttribute && 
    typeof currentAttribute === 'object' && 
    'assetId' in currentAttribute 
      ? currentAttribute.assetId 
      : null;
  
  // Show all carpets, but highlight the selected one
  const filteredCarpetValues = carpetValues;

  const currentAssetId =
    currentAttribute &&
    typeof currentAttribute === 'object' &&
    'assetId' in currentAttribute
      ? currentAttribute.assetId
      : null;

  console.log(currentAssetId);

  // Handle carpet selection
  const handleCarpetSelect = async (carpetValue: CarpetValue) => {
    const newCarpetValue = {
      assetId: carpetValue.assetId,
      type: carpetValue.type
    };

    try {
      // Update Threekit configurator
      if (window.threekit?.configurator?.setConfiguration) {
        await window.threekit.configurator.setConfiguration({
          [section.attributeName]: newCarpetValue,
        });
      }

      // Update Redux state
      dispatch(updateSelectedValue({
        name: section.attributeName,
        value: newCarpetValue as any,
      }));

      console.log('Selected carpet:', carpetValue.name, newCarpetValue);
    } catch (error) {
      console.error('Failed to select carpet:', error);
    }
  };

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

  // Fetch images for all carpet values
  useEffect(() => {
    const fetchCarpetImages = async () => {
      if (carpetValues.length === 0) return;
      
      const imagePromises = carpetValues.map(async (carpetValue) => {
        try {
          console.log('Fetching thumbnail for assetId:', carpetValue.assetId);
          const imageUrl = await ThreekitImageService.getAssetThumbnail(carpetValue.assetId);
          
          if (imageUrl && imageUrl.trim() !== '') {
            return { assetId: carpetValue.assetId, imageUrl };
          }
          return { assetId: carpetValue.assetId, imageUrl: '' };
        } catch (error) {
          console.error('Failed to fetch image for:', carpetValue.assetId, error);
          return { assetId: carpetValue.assetId, imageUrl: '' };
        }
      });

      try {
        const results = await Promise.all(imagePromises);
        const imageMap = results.reduce((acc, result) => {
          acc[result.assetId] = result.imageUrl;
          return acc;
        }, {} as Record<string, string>);
        
        setCarpetImages(imageMap);
      } catch (error) {
        console.error('Failed to fetch carpet images:', error);
      }
    };

    fetchCarpetImages();
  }, [carpetValues]);

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
    <div className={s.parent}>
      {filteredCarpetValues.map((carpetValue: CarpetValue) => {
        const carpetImageUrl = carpetImages[carpetValue.assetId];
        const isSelected = selectedCarpetId === carpetValue.assetId;
        
        // Find matching fallback image by name
        const fallbackImageData = fallbackImage.find(
          fallback => fallback.name === carpetValue.name
        );
        const fallbackSrc = fallbackImageData?.img || fallbackImg;
        
        // Filter out 'No Carpet' items
        if (carpetValue.name === 'No Carpet') {
          return null;
        }
        
        return (
          <div
            key={carpetValue.assetId}
            className={`${s.material_item} ${isSelected ? s.selected : ''}`}
            onClick={() => handleCarpetSelect(carpetValue)}
            style={{ cursor: 'pointer' }}
          >
            <div className={s.material_item__img}>
              <img
                src={carpetImageUrl || fallbackSrc}
                alt={`${carpetValue.name} carpet`}
              />
            </div>
            <div>{carpetValue.name}</div>
          </div>
        );
      })}
    </div>
  );
};

export default AddonsContent;
