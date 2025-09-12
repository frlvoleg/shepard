import React, { useRef, useState } from 'react';
import { useAppDispatch } from '../../store/redux';
import Modal from '../Modal/Modal';
import { BaseButton } from '../../ui/baseButton/BaseButton';
import {
  ThreekitImageService,
  ImageValidationService,
  ThreekitConfigurationService,
  ImageValidationError,
  ImageType,
} from '../../services/threekitImageService';
import { updateSelectedValue } from '../../store/slices/configurator/configuratorSlice';
import { AttributeValue } from '../../store/slices/configurator/types';
import s from './ImageUploadModal.module.scss';

export interface ImageUploadConfig {
  attributeName: string;
  imageType: ImageType;
}

interface ImageUploadModalProps {
  show: boolean;
  title: string;
  config: ImageUploadConfig;
  onClose: () => void;
  onImageUploaded: (imageUrl: string) => void;
  onUnsavedChanges: (hasChanges: boolean) => void;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  show,
  title,
  config,
  onClose,
  onImageUploaded,
  onUnsavedChanges,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        ImageValidationService.validateFile(file);
        setSelectedFile(file);

        // Create preview URL
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
      } catch (error) {
        if (error instanceof ImageValidationError) {
          alert(error.message);
        }
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      if (
        typeof window !== 'undefined' &&
        (window as any).threekit?.player?.uploadImage
      ) {
        const assetId = await window.threekit.player.uploadImage(selectedFile);

        await ThreekitConfigurationService.applyImageToModel(
          assetId,
          config.imageType
        );

        let finalImageUrl = '';
        try {
          const imageUrl =
            await ThreekitImageService.getImageFromAsset(assetId);
          if (imageUrl) {
            finalImageUrl = imageUrl;
          } else {
            throw new Error('No image URL returned from Threekit API');
          }
        } catch (previewError) {
          finalImageUrl = URL.createObjectURL(selectedFile);
        }

        const attributeValue: AttributeValue = {
          assetId: assetId,
        };

        dispatch(
          updateSelectedValue({
            name: config.attributeName,
            value: attributeValue,
          })
        );

        onImageUploaded(finalImageUrl);
        onUnsavedChanges(true);
        handleClose();
      } else {
        // Development fallback
        const objectUrl = URL.createObjectURL(selectedFile);
        onImageUploaded(objectUrl);
        handleClose();
      }
    } catch (error) {
      if (error instanceof ImageValidationError) {
        alert(error.message);
      } else {
        alert('Failed to upload image. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    onClose();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  return (
    <Modal show={show} title={title} handleClose={handleClose}>
      <div className={s.modalContent}>
        <div className={s.uploadSection}>
          <div
            className={`${s.uploadBox} ${isDragActive ? s.dragActive : ''}`}
            onClick={triggerFileInput}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{ opacity: uploading ? 0.6 : 1 }}
          >
            <div className={s.uploadInner}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 4v16m8-8H4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className={s.uploadText}>
                Drag & Drop files or <span className={s.browse}>browse</span>
              </p>
              <p className={s.uploadSubtext}>
                Supported files: JPG, PNG, GIF, up to 10MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className={s.hiddenInput}
              disabled={uploading}
            />
          </div>
        </div>

        {previewUrl && (
          <div className={s.previewSection}>
            <div className={s.previewLabel}>Preview:</div>
            <img src={previewUrl} alt="Preview" className={s.previewImage} />
            <div className={s.fileName}>{selectedFile?.name}</div>
          </div>
        )}

        <div className={s.actionButtons}>
          <p>Upload image with aspect ratio to actual size (968 x 898 mm)</p>
          <div>
            <BaseButton
              variant="muted"
              onClick={handleClose}
              disabled={uploading}
            >
              Cancel
            </BaseButton>

            <BaseButton
              variant="primary"
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
            >
              {uploading ? 'Uploading...' : 'Save Image'}
            </BaseButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};
