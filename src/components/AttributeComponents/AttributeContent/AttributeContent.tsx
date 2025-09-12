import { useState, useEffect } from 'react';
import { BaseButton } from '../../../ui/baseButton/BaseButton';
import s from './AttributeContent.module.scss';
import {
  ImageUploadModal,
  ImageUploadConfig,
} from '../../ImageUploadModal/ImageUploadModal';
import {
  ThreekitConfigurationService,
  ThreekitImageService,
} from '../../../services/threekitImageService';
import { useAppDispatch, useAppSelector } from '../../../store/redux';
import { setConfigurationLoading } from '../../../store/slices/ui/uiSlice';

export interface AttributeSection {
  id: string;
  title: string;
  attributeName: string;
  imageType: 'background' | 'logo';
  showColorButton?: boolean;
}

interface AttributeContentProps {
  section: AttributeSection;
}

export const AttributeContent: React.FC<AttributeContentProps> = ({
  section,
}) => {
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  // Get the uploaded image from Redux store
  const selectedConfig = useAppSelector(
    (s) => s.configurator.selectedConfiguration
  );

  // Get the current attribute value
  const currentAttribute = selectedConfig?.[section.attributeName];

  const currentAssetId =
    currentAttribute &&
    typeof currentAttribute === 'object' &&
    'assetId' in currentAttribute
      ? currentAttribute.assetId
      : null;

  // Fetch image URL when asset ID is available
  useEffect(() => {
    const fetchImageUrl = async () => {
      if (currentAssetId && typeof currentAssetId === 'string') {
        try {
          const imageUrl =
            await ThreekitImageService.getImageFromAsset(currentAssetId);
          if (imageUrl) {
            setCurrentImageUrl(imageUrl);
          }
        } catch (error) {
          // Could not get image URL - that's okay, just means no preview
          setCurrentImageUrl(null);
        }
      } else {
        setCurrentImageUrl(null);
      }
    };

    fetchImageUrl();
  }, [currentAssetId]);

  const imageConfig: ImageUploadConfig = {
    attributeName: section.attributeName,
    imageType: section.imageType,
  };

  const handleImageUploaded = (imageUrl: string) => {
    setCurrentImageUrl(imageUrl);
  };

  const handleSaveConfiguration = async () => {
    setSaving(true);
    dispatch(setConfigurationLoading(true));

    try {
      const result = await ThreekitConfigurationService.saveConfiguration();
      alert(result.message);

      if (result.success) {
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
      dispatch(setConfigurationLoading(false));
    }
  };

  return (
    <div className={s.attributeContent}>
      <div className={s.section}>
        <div className={s.sectionLabel}>{section.title}</div>

        {/* Show current image if available */}
        {currentImageUrl && (
          <div className={s.currentImage}>
            <img
              src={currentImageUrl}
              alt={`Current ${section.title}`}
              className={s.previewImage}
            />
          </div>
        )}

        <div className={s.buttonRow}>
          {section.showColorButton && (
            <BaseButton variant="muted">Set color</BaseButton>
          )}
          <BaseButton
            variant="primary"
            onClick={() => setShowImageModal(true)}
            block={!section.showColorButton}
          >
            {currentImageUrl ? 'Change Image' : 'Set Image'}
          </BaseButton>
        </div>
      </div>

      {/* Image Upload Modal */}
      <ImageUploadModal
        show={showImageModal}
        title={`Upload ${section.title} Image`}
        config={imageConfig}
        onClose={() => setShowImageModal(false)}
        onImageUploaded={handleImageUploaded}
        onUnsavedChanges={setHasUnsavedChanges}
      />
    </div>
  );
};
