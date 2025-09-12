import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/redux';
import Modal from '../Modal/Modal';
import { BaseButton } from '../../ui/baseButton/BaseButton';
import { updateSelectedValue } from '../../store/slices/configurator/configuratorSlice';
import s from './ColorPickerModal.module.scss';
import ColorPicker from '../../ColorPicker/ColorPicker';

// Helper function for RGB to HEX conversion
const rgbToHex = (color: { r: number; g: number; b: number }): string => {
  const toHex = (value: number) => {
    const hex = Math.round(value).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
};

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
  const [hexInput, setHexInput] = useState(() => {
    const rgb255 = {
      r: Math.round((currentColor?.r || 1) * 255),
      g: Math.round((currentColor?.g || 1) * 255),
      b: Math.round((currentColor?.b || 1) * 255),
    };
    return rgbToHex(rgb255);
  });
  const [lastColors, setLastColors] = useState<ColorValue[]>(() => {
    // Load from localStorage
    const saved = localStorage.getItem('lastColors');
    const savedColors = saved ? JSON.parse(saved) : [];
    
    // If there's a current color, make sure it's first in the list
    if (currentColor) {
      const filtered = savedColors.filter((c: ColorValue) => 
        !(c.r === currentColor.r && c.g === currentColor.g && c.b === currentColor.b)
      );
      return [currentColor, ...filtered].slice(0, 12);
    }
    
    return savedColors.slice(0, 12);
  });

  const selectedConfig = useAppSelector(
    (s) => s.configurator.selectedConfiguration
  );
  const dispatch = useAppDispatch();

  // Get the default Set_Color from configuration
  const defaultSetColor = selectedConfig?.Set_Color;

  // Save a color to lastColors list
  const saveColorToHistory = (color: ColorValue) => {
    setLastColors(prev => {
      const newColors = [color, ...prev.filter(c => 
        !(c.r === color.r && c.g === color.g && c.b === color.b)
      )].slice(0, 12); // Keep only 12 colors
      
      // Save to localStorage
      localStorage.setItem('lastColors', JSON.stringify(newColors));
      return newColors;
    });
  };

  // Handle clicking on a color from history
  const handleColorFromHistory = (color: ColorValue) => {
    setSelectedColor(color);
    const rgb255 = {
      r: Math.round(color.r * 255),
      g: Math.round(color.g * 255),
      b: Math.round(color.b * 255),
    };
    setRgbInputs({
      r: String(rgb255.r),
      g: String(rgb255.g),
      b: String(rgb255.b),
    });
    setHexInput(rgbToHex(rgb255));
  };

  console.log('selectedConfig');
  console.log(selectedConfig);

  // Update inputs when currentColor changes
  useEffect(() => {
    if (currentColor) {
      setSelectedColor(currentColor);
      const rgb255 = {
        r: Math.round(currentColor.r * 255),
        g: Math.round(currentColor.g * 255),
        b: Math.round(currentColor.b * 255),
      };
      setRgbInputs({
        r: String(rgb255.r),
        g: String(rgb255.g),
        b: String(rgb255.b),
      });
      setHexInput(rgbToHex({ r: rgb255.r, g: rgb255.g, b: rgb255.b }));
    }
  }, [currentColor]);

  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: string) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    const numValue = Math.max(0, Math.min(255, parseInt(value) || 0));
    const normalizedValue = numValue / 255;

    const newRgbInputs = { ...rgbInputs, [channel]: value };
    setRgbInputs(newRgbInputs);

    const newSelectedColor = { ...selectedColor, [channel]: normalizedValue };
    setSelectedColor(newSelectedColor);

    // Update hex input
    const rgb255 = {
      r: Math.round(newSelectedColor.r * 255),
      g: Math.round(newSelectedColor.g * 255),
      b: Math.round(newSelectedColor.b * 255),
    };
    setHexInput(rgbToHex(rgb255));
  };

  const handleHexChange = (value: string) => {
    // Remove # if present and ensure it's uppercase
    let hex = value.replace('#', '').toUpperCase();

    // Only allow valid hex characters
    if (!/^[0-9A-F]*$/.test(hex)) return;

    // Limit to 6 characters
    if (hex.length > 6) hex = hex.slice(0, 6);

    setHexInput('#' + hex);

    // If we have a complete 6-character hex, convert to RGB
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);

      // Update RGB inputs
      setRgbInputs({
        r: String(r),
        g: String(g),
        b: String(b),
      });

      // Update selected color (normalized)
      setSelectedColor({
        r: r / 255,
        g: g / 255,
        b: b / 255,
      });
    }
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
      console.log(act);

      // Update Redux state with the color value directly
      dispatch(
        updateSelectedValue({
          name: config.attributeName,
          value: selectedColor as any, // Color objects are stored directly
        })
      );

      // Save color to history
      saveColorToHistory(selectedColor);
      
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
    <Modal
      show={show}
      title={title}
      handleClose={handleClose}
      className={s.colorPicker_modal}
    >
      <div className={s.modalContent}>
        {/* RGB Inputs */}
        <div className={s.preview_colors}>
          <div className={s.rgbSection}>
            <label className={s.label}>HEX</label>
            <div className={s.inputGroup}>
              <input
                type="text"
                value={hexInput}
                onChange={(e) => handleHexChange(e.target.value)}
                className={s.rgbInput}
                maxLength={7}
                placeholder="#FF0000"
                style={{ textAlign: 'center', fontFamily: 'monospace' }}
              />
            </div>
            <div>
              <label className={s.label}>Last Colors</label>
              <div className={s.grid}>
                {Array.from({ length: 12 }).map((_, index) => {
                  // First slot shows current color or default Set_Color, rest show history
                  const color = index === 0 ? 
                    (currentColor || defaultSetColor) : 
                    lastColors[index - 1];
                  return (
                    <div 
                      key={index}
                      className={s.grid_item}
                      onClick={() => color && handleColorFromHistory(color)}
                      style={{
                        backgroundColor: color ? 
                          `rgb(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)})` : 
                          '#f5f5f5',
                        cursor: color ? 'pointer' : 'default'
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* <div className={s.rgbSection}>
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
          </div> */}
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
