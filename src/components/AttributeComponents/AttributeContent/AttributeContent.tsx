import React, { useState, useEffect } from 'react';
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
import { updateSelectedValue } from '../../../store/slices/configurator/configuratorSlice';
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

  const getColorAttributeName = (attributeName: string) => {
    // Map image attribute names to their corresponding color attribute names
    const colorMap: Record<string, string> = {
      CustomArea_A1: 'Set_Color_A1',
      CustomArea_B1: 'Set_Color_B1',
      CustomArea_B2: 'Set_Color_B2',
      CustomArea_C1: 'Set_Color_C1',
      CustomArea_C2: 'Set_Color_C2',
      CustomArea_D1: 'Set_Color_D1',
      CustomArea_D2: 'Set_Color_D2',
    };
    return colorMap[attributeName] || 'Set_Color'; // fallback to global color
  };

  // Get the uploaded image from Redux store
  const selectedConfig = useAppSelector(
    (s) => s.configurator.selectedConfiguration
  );

  // Get the current attribute value (for images)
  const currentAttribute = selectedConfig?.[section.attributeName];

  // Get the corresponding color attribute
  const colorAttributeName = getColorAttributeName(section.attributeName);
  const currentColorAttribute = selectedConfig?.[colorAttributeName];

  // Check if global color has been set
  const globalColor = selectedConfig?.['Set_Color'];
  const hasGlobalColorSet =
    globalColor &&
    typeof globalColor === 'object' &&
    'r' in globalColor &&
    'g' in globalColor &&
    'b' in globalColor &&
    !(globalColor.r === 1 && globalColor.g === 1 && globalColor.b === 1); // Not default white

  // Debug logging
  console.log(
    'Section:',
    section.title,
    'Global Color:',
    globalColor,
    'Has Global Color Set:',
    hasGlobalColorSet
  );

  const currentAssetId =
    currentAttribute &&
    typeof currentAttribute === 'object' &&
    'assetId' in currentAttribute
      ? currentAttribute.assetId
      : null;

  // Check if current color attribute has a color value
  // Each section should only show its own color, not inherit from global color
  const isColorAttribute =
    currentColorAttribute &&
    typeof currentColorAttribute === 'object' &&
    'r' in currentColorAttribute &&
    'g' in currentColorAttribute &&
    'b' in currentColorAttribute &&
    // Only show color if it's the global color section OR this section has its own non-default color
    (section.id === 'global-color' ||
      !(
        currentColorAttribute.r === 1 &&
        currentColorAttribute.g === 1 &&
        currentColorAttribute.b === 1
      ));

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

  // Update current color when color attribute changes
  useEffect(() => {
    if (isColorAttribute) {
      setCurrentColor(currentColorAttribute as ColorValue);
    } else {
      setCurrentColor(null);
    }
  }, [currentColorAttribute, isColorAttribute]);

  const imageConfig: ImageUploadConfig = {
    attributeName: section.attributeName,
    imageType: section.imageType,
  };

  const colorConfig: ColorPickerConfig = {
    attributeName: getColorAttributeName(section.attributeName),
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
                onClick={async () => {
                  // Handle delete functionality
                  if (currentColor) {
                    const defaultColor = { r: 1, g: 1, b: 1 };
                    const colorAttrName = getColorAttributeName(
                      section.attributeName
                    );

                    // Update Threekit configurator.
                    if (window.threekit?.configurator?.setConfiguration) {
                      await window.threekit.configurator.setConfiguration({
                        [colorAttrName]: defaultColor,
                      });
                    }

                    dispatch(
                      updateSelectedValue({
                        name: colorAttrName,
                        value: defaultColor as any,
                      })
                    );

                    setCurrentColor(defaultColor);
                    setHasUnsavedChanges(true);
                  }
                  if (currentImageUrl) {
                    const defaultImg = '';

                    if (window.threekit?.configurator?.setConfiguration) {
                      await window.threekit.configurator.setConfiguration({
                        [section.attributeName]: defaultImg,
                      });
                    }

                    dispatch(
                      updateSelectedValue({
                        name: section.attributeName,
                        value: defaultImg as any,
                      })
                    );

                    // Clear image logic here
                    setCurrentImageUrl(null);
                    setHasUnsavedChanges(true);
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
                  onClick={() => {
                    setShowColorModal(true);
                  }}
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
