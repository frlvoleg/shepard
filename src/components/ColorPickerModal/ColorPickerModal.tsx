import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/redux';
import Modal from '../Modal/Modal';
import { BaseButton } from '../../ui/baseButton/BaseButton';
import { updateSelectedValue } from '../../store/slices/configurator/configuratorSlice';
import s from './ColorPickerModal.module.scss';
import ColorPicker from '../../ColorPicker/ColorPicker';

export interface ColorValue {
  r: number;
  g: number;
  b: number;
}

export interface ColorPickerConfig {
  attributeName: string;
}

interface ColorPickerModalProps {
  show: boolean;
  title: string;
  config: ColorPickerConfig;
  currentColor?: ColorValue;
  onClose: () => void;
  onColorChanged: (color: ColorValue) => void;
  onUnsavedChanges: (hasChanges: boolean) => void;
}

export const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  show,
  title,
  config,
  currentColor,
  onClose,
  onColorChanged,
  onUnsavedChanges,
}) => {
  const [selectedColor, setSelectedColor] = useState<ColorValue>(
    currentColor || { r: 1, g: 1, b: 1 }
  );
  const [rgbInputs, setRgbInputs] = useState({
    r: String(Math.round((currentColor?.r || 1) * 255)),
    g: String(Math.round((currentColor?.g || 1) * 255)),
    b: String(Math.round((currentColor?.b || 1) * 255)),
  });

  const selectedConfig = useAppSelector(
    (s) => s.configurator.selectedConfiguration
  );
  const dispatch = useAppDispatch();

  console.log('selectedConfig');
  console.log(selectedConfig);

  // Update inputs when currentColor changes
  useEffect(() => {
    if (currentColor) {
      setSelectedColor(currentColor);
      setRgbInputs({
        r: String(Math.round(currentColor.r * 255)),
        g: String(Math.round(currentColor.g * 255)),
        b: String(Math.round(currentColor.b * 255)),
      });
    }
  }, [currentColor]);

  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: string) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    const numValue = Math.max(0, Math.min(255, parseInt(value) || 0));
    const normalizedValue = numValue / 255;

    setRgbInputs((prev) => ({ ...prev, [channel]: value }));
    setSelectedColor((prev) => ({ ...prev, [channel]: normalizedValue }));
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hex = event.target.value;
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const newColor = { r, g, b };
    setSelectedColor(newColor);
    setRgbInputs({
      r: String(Math.round(r * 255)),
      g: String(Math.round(g * 255)),
      b: String(Math.round(b * 255)),
    });
  };

  const rgbToHex = (color: ColorValue): string => {
    const toHex = (value: number) => {
      const hex = Math.round(value * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
  };

  const handleSaveColor = async () => {
    try {
      // Update the Threekit configurator with the new color
      if (window.threekit?.configurator?.setConfiguration) {
        await window.threekit.configurator.setConfiguration({
          [config.attributeName]: selectedColor,
        });
      }

      const act = dispatch(
        updateSelectedValue({
          name: config.attributeName,
          value: selectedColor as any, // Color objects are stored directly
        })
      );

      console.log('action');
      console.log('action');
      console.log('action');
      console.log(act);

      // Update Redux state with the color value directly
      dispatch(
        updateSelectedValue({
          name: config.attributeName,
          value: selectedColor as any, // Color objects are stored directly
        })
      );

      onColorChanged(selectedColor);
      onUnsavedChanges(true);
      handleClose();
    } catch (error) {
      console.error('Failed to apply color:', error);
      alert('Failed to apply color. Please try again.');
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal show={show} title={title} handleClose={handleClose}>
      <div className={s.modalContent}>
        {/* RGB Inputs */}
        <div className={s.preview_colors}>
          <div className={s.rgbSection}>
            <label className={s.label}>RGB Values (0-255):</label>
            <div className={s.rgbInputs}>
              <div className={s.inputGroup}>
                <label>R:</label>
                <input
                  type="text"
                  value={rgbInputs.r}
                  onChange={(e) => handleRgbChange('r', e.target.value)}
                  className={s.rgbInput}
                  maxLength={3}
                />
              </div>

              <div className={s.inputGroup}>
                <label>G:</label>
                <input
                  type="text"
                  value={rgbInputs.g}
                  onChange={(e) => handleRgbChange('g', e.target.value)}
                  className={s.rgbInput}
                  maxLength={3}
                />
              </div>
              <div className={s.inputGroup}>
                <label>B:</label>
                <input
                  type="text"
                  value={rgbInputs.b}
                  onChange={(e) => handleRgbChange('b', e.target.value)}
                  className={s.rgbInput}
                  maxLength={3}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={s.preview}>
          {/* Color Preview */}
          {/* <div className={s.previewSection}>
            <div className={s.previewLabel}>Preview:</div>
            <div
              className={s.colorPreview}
              style={{
                backgroundColor: rgbToHex(selectedColor),
              }}
            />
          </div> */}

          {/* Color Picker */}
          {/* <div className={s.colorPickerSection}>
            <input
              type="color"
              value={rgbToHex(selectedColor)}
              onChange={handleColorChange}
              className={s.colorInput}
            />
          </div> */}

          <ColorPicker
            value={{
              r: Math.round(selectedColor.r * 255),
              g: Math.round(selectedColor.g * 255),
              b: Math.round(selectedColor.b * 255),
            }}
            onChange={(color) => {
              const normalizedColor = {
                r: color.r / 255,
                g: color.g / 255,
                b: color.b / 255,
              };
              setSelectedColor(normalizedColor);
              setRgbInputs({
                r: String(color.r),
                g: String(color.g),
                b: String(color.b),
              });
            }}
            width={420} // піджени під свій макет
            height={220}
          />
        </div>
      </div>
      {/* Action Buttons */}
      <div className={s.actionButtons}>
        <div></div>
        <BaseButton variant="primary" onClick={handleSaveColor}>
          Save
        </BaseButton>
      </div>
    </Modal>
  );
};
