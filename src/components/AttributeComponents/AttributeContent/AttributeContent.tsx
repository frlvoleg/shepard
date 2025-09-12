import { useState, useEffect } from 'react';
import { BaseButton } from '../../../ui/baseButton/BaseButton';
import s from './AttributeContent.module.scss';
import {
  ImageUploadModal,
  ImageUploadConfig,
} from '../../ImageUploadModal/ImageUploadModal';
import {
  ColorPickerModal,
  ColorPickerConfig,
  ColorValue,
} from '../../ColorPickerModal/ColorPickerModal';
import {
  ThreekitConfigurationService,
  ThreekitImageService,
} from '../../../services/threekitImageService';
import { useAppDispatch, useAppSelector } from '../../../store/redux';
import { setConfigurationLoading } from '../../../store/slices/ui/uiSlice';
import EditIcon from '../../../assets/svg/EditIcon';
import DeleteIcon from '../../../assets/svg/DeleteIcon';

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
  const [showColorModal, setShowColorModal] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [currentColor, setCurrentColor] = useState<ColorValue | null>(null);
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

  // Check if current attribute is a color value
  const isColorAttribute =
    currentAttribute &&
    typeof currentAttribute === 'object' &&
    'r' in currentAttribute &&
    'g' in currentAttribute &&
    'b' in currentAttribute;

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

  // Update current color when attribute changes
  useEffect(() => {
    if (isColorAttribute) {
      setCurrentColor(currentAttribute as ColorValue);
    } else {
      setCurrentColor(null);
    }
  }, [currentAttribute, isColorAttribute]);

  const imageConfig: ImageUploadConfig = {
    attributeName: section.attributeName,
    imageType: section.imageType,
  };

  const colorConfig: ColorPickerConfig = {
    attributeName: 'Set_Color',
  };

  const handleImageUploaded = (imageUrl: string) => {
    setCurrentImageUrl(imageUrl);
  };

  const handleColorChanged = (color: ColorValue) => {
    setCurrentColor(color);
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

        {/* Show current color if available */}
        {currentColor && (
          <div className={s.currentColor}>
            <div className={s.colorPreview}>
              <div
                className={s.colorPreviewBox}
                style={{
                  backgroundColor: `rgb(${Math.round(currentColor.r * 255)}, ${Math.round(currentColor.g * 255)}, ${Math.round(currentColor.b * 255)})`,
                }}
              />
              <div className={s.colorHex}>
                {`#${Math.round(currentColor.r * 255)
                  .toString(16)
                  .padStart(2, '0')}${Math.round(currentColor.g * 255)
                  .toString(16)
                  .padStart(2, '0')}${Math.round(currentColor.b * 255)
                  .toString(16)
                  .padStart(2, '0')}`.toUpperCase()}
              </div>
            </div>
          </div>
        )}

        <div className={s.buttonRow}>
          {currentColor || currentImageUrl ? (
            <>
              <BaseButton
                variant="edit"
                onClick={() => {
                  if (currentColor) setShowColorModal(true);
                  if (currentImageUrl) setShowImageModal(true);
                }}
              >
                Edit
                <EditIcon />
              </BaseButton>
              <BaseButton
                variant="delete"
                onClick={() => {
                  // Handle delete functionality
                  if (currentColor) {
                    // Clear color logic here
                    setCurrentColor(null);
                  }
                  if (currentImageUrl) {
                    // Clear image logic here
                    setCurrentImageUrl(null);
                  }
                }}
              >
                Delete
                <DeleteIcon />
              </BaseButton>
            </>
          ) : (
            <>
              {section.showColorButton && (
                <BaseButton
                  variant="muted"
                  onClick={() => setShowColorModal(true)}
                >
                  Set Color
                </BaseButton>
              )}
              <BaseButton
                variant="primary"
                onClick={() => setShowImageModal(true)}
                block={!section.showColorButton}
              >
                Set Image
              </BaseButton>
            </>
          )}
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

      {/* Color Picker Modal */}
      <ColorPickerModal
        show={showColorModal}
        title={`Choose ${section.title} Color`}
        config={colorConfig}
        currentColor={currentColor || undefined}
        onClose={() => setShowColorModal(false)}
        onColorChanged={handleColorChanged}
        onUnsavedChanges={setHasUnsavedChanges}
      />
    </div>
  );
};
