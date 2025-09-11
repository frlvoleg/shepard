export interface ThreekitConfig {
  orgId: string;
  bearerToken: string;
}

export interface AssetData {
  importedFileId?: string;
}

export interface FileData {
  hash?: string;
}

export type ImageType = 'background' | 'logo';

export interface AttributeMapping {
  attr: string;
  subAttr: string | null;
}

export class ThreekitConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ThreekitConfigurationError';
  }
}

export class ThreekitApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = 'ThreekitApiError';
  }
}

export class ImageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageValidationError';
  }
}

export class ThreekitImageService {
  private static getThreekitConfig(): ThreekitConfig {
    const orgId =
      process.env.REACT_APP_THREEKIT_PREVIEW_ORG_ID ||
      process.env.THREEKIT_PREVIEW_ORG_ID;
    const bearerToken =
      process.env.REACT_APP_THREEKIT_PREVIEW_PUBLIC_TOKEN ||
      process.env.THREEKIT_PREVIEW_PUBLIC_TOKEN;

    if (!orgId || !bearerToken) {
      throw new ThreekitConfigurationError('Threekit configuration not found');
    }

    return { orgId, bearerToken };
  }

  static async getAssetThumbnail(assetId: string): Promise<string> {
    try {
      const { orgId, bearerToken } = this.getThreekitConfig();
      const assetUrl = `https://preview.threekit.com/api/assets/${assetId}?orgId=${orgId}&bearer_token=${bearerToken}`;
      
      const response = await fetch(assetUrl, {
        method: 'GET',
        headers: { accept: 'application/json' },
      });

      if (response.ok) {
        const assetData = await response.json();
        console.log('Asset data:', assetData);
        
        // Check for thumbnail URL
        if (assetData.thumbnail) {
          return `${assetData.thumbnail}?orgId=${orgId}&bearer_token=${bearerToken}`;
        }
        
        // Check for preview images
        if (assetData.preview && assetData.preview.length > 0) {
          return `${assetData.preview[0]}?orgId=${orgId}&bearer_token=${bearerToken}`;
        }
        
        // For item assets, try to get the first variant's thumbnail
        if (assetData.type === 'item' && assetData.variants && assetData.variants.length > 0) {
          const firstVariant = assetData.variants[0];
          if (firstVariant.thumbnail) {
            return `${firstVariant.thumbnail}?orgId=${orgId}&bearer_token=${bearerToken}`;
          }
        }
        
        // For material assets, try to get the proxy material data
        if (assetData.proxyType === 'material' && assetData.proxyId) {
          console.log('Getting material proxy data for:', assetData.proxyId);
          const materialUrl = `https://preview.threekit.com/api/assets/${assetData.proxyId}?orgId=${orgId}&bearer_token=${bearerToken}`;
          const materialResponse = await fetch(materialUrl, {
            method: 'GET',
            headers: { accept: 'application/json' },
          });
          
          if (materialResponse.ok) {
            const materialData = await materialResponse.json();
            console.log('Material data:', materialData);
            
            // Check for thumbnail in material
            if (materialData.thumbnail) {
              return `${materialData.thumbnail}?orgId=${orgId}&bearer_token=${bearerToken}`;
            }
            
            // Check for preview in material
            if (materialData.preview && materialData.preview.length > 0) {
              return `${materialData.preview[0]}?orgId=${orgId}&bearer_token=${bearerToken}`;
            }
            
            // Get the full material configuration to access texture properties
            const configUrl = `https://preview.threekit.com/api/materials/${assetData.proxyId}?orgId=${orgId}&bearer_token=${bearerToken}`;
            const configResponse = await fetch(configUrl, {
              method: 'GET',
              headers: { accept: 'application/json' },
            });
            
            if (configResponse.ok) {
              const configData = await configResponse.json();
              console.log('Material config data:', configData);
              
              // Look for texture maps in common properties
              const textureProperties = ['baseColor', 'diffuse', 'albedo', 'color', 'map'];
              for (const prop of textureProperties) {
                if (configData[prop] && typeof configData[prop] === 'object') {
                  const textureData = configData[prop];
                  if (textureData.assetId) {
                    console.log(`Found texture in ${prop}:`, textureData.assetId);
                    // Try to get image from this texture asset
                    const textureImageUrl = await this.getImageFromAsset(textureData.assetId);
                    if (textureImageUrl) {
                      return textureImageUrl;
                    }
                  }
                }
              }
            }
          }
        }
      }
      
      return '';
    } catch (error) {
      console.error('Error getting asset thumbnail:', error);
      return '';
    }
  }

  static async getImageFromAsset(assetId: string): Promise<string> {
    try {
      // Give Threekit a moment to process the uploaded asset
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { orgId, bearerToken } = this.getThreekitConfig();
      const importedFileId = await this.getImportedFileId(
        assetId,
        orgId,
        bearerToken
      );

      if (!importedFileId) {
        throw new Error(
          `Asset ${assetId} does not include an importedFileId after max retries.`
        );
      }

      const fileData = await this.getFileData(
        importedFileId,
        orgId,
        bearerToken
      );

      if (!fileData.hash) {
        throw new Error('File hash not found in file data');
      }

      return `https://preview.threekit.com/api/files/hash/${fileData.hash}?orgId=${orgId}&bearer_token=${bearerToken}`;
    } catch (error) {
      return '';
    }
  }

  private static async getImportedFileId(
    assetId: string,
    orgId: string,
    bearerToken: string
  ): Promise<string | null> {
    const maxRetries = 30; // Increased retries
    const baseRetryDelay = 1000;

    for (let retries = 0; retries < maxRetries; retries++) {
      try {
        const assetUrl = `https://preview.threekit.com/api/assets/${assetId}?orgId=${orgId}&bearer_token=${bearerToken}`;
        const response = await fetch(assetUrl, {
          method: 'GET',
          headers: { accept: 'application/json' },
        });

        if (response.ok) {
          const assetData = await response.json();
          if (assetData.importedFileId) {
            return assetData.importedFileId;
          }
          // Asset exists but no importedFileId yet - continue retrying
        } else if (response.status === 404) {
          // Asset not found yet - this is expected, continue retrying
        } else {
          // Other error - continue retrying
        }
      } catch (error) {
        // Network error - continue retrying
      }

      if (retries < maxRetries - 1) {
        // Exponential backoff with jitter
        const delay =
          Math.min(baseRetryDelay * Math.pow(1.5, retries), 10000) +
          Math.random() * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    return null;
  }

  private static async getFileData(
    fileId: string,
    orgId: string,
    bearerToken: string
  ) {
    const fileUrl = `https://preview.threekit.com/api/files/${fileId}?orgId=${orgId}&bearer_token=${bearerToken}`;
    const response = await fetch(fileUrl, {
      method: 'GET',
      headers: { accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch file: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }
}

export class ImageValidationService {
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  static validateFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      throw new ImageValidationError('Please select an image file.');
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new ImageValidationError(
        'Image file is too large. Please select a file smaller than 10MB.'
      );
    }
  }
}

export class ThreekitConfigurationService {
  static async applyImageToModel(assetId: string, type: 'background' | 'logo') {
    try {
      const player = (window as any).threekit?.player;
      if (!player) return;

      const attributeMappings = this.getAttributeMappings(type);

      for (const mapping of attributeMappings) {
        try {
          const configObject = this.createConfigurationObject(mapping, assetId);
          const success = await this.trySetConfiguration(player, configObject);
          if (success) break;
        } catch (error) {
          continue;
        }
      }
    } catch (error) {
      // Don't throw to prevent breaking the upload flow
    }
  }

  private static getAttributeMappings(type: ImageType): AttributeMapping[] {
    const mappings: Record<ImageType, AttributeMapping[]> = {
      background: [
        { attr: 'Cabinet', subAttr: 'Background' },
        { attr: 'Background', subAttr: 'Texture' },
        { attr: 'Material', subAttr: 'BaseColor' },
        { attr: 'Background', subAttr: null },
        { attr: 'texture', subAttr: null },
      ],
      logo: [
        { attr: 'Cabinet', subAttr: 'Logo' },
        { attr: 'Logo', subAttr: 'Texture' },
        { attr: 'Decal', subAttr: 'Image' },
        { attr: 'Logo', subAttr: null },
        { attr: 'decal', subAttr: null },
      ],
    };
    return mappings[type] || [];
  }

  private static createConfigurationObject(
    mapping: AttributeMapping,
    assetId: string
  ): Record<string, any> {
    if (mapping.subAttr) {
      return {
        [mapping.attr]: {
          configuration: {
            [mapping.subAttr]: { assetId },
          },
        },
      };
    } else {
      return { [mapping.attr]: assetId };
    }
  }

  private static async trySetConfiguration(
    player: any,
    configObject: any
  ): Promise<boolean> {
    try {
      if (player.getConfigurator) {
        const configurator = await player.getConfigurator();
        if (configurator?.setConfiguration) {
          await configurator.setConfiguration(configObject);
          return true;
        }
      }

      if (player.setConfiguration) {
        await player.setConfiguration(configObject);
        return true;
      }
    } catch (error) {
      // Configuration setting failed
    }
    return false;
  }

  static async saveConfiguration(): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const player = (window as any).threekit?.player;
      if (!player) {
        return { success: false, message: 'Threekit player not available' };
      }

      let savedConfigId = null;

      if (player.saveConfiguration) {
        savedConfigId = await player.saveConfiguration();
      } else if (player.save) {
        savedConfigId = await player.save();
      } else if (player.saveState) {
        savedConfigId = await player.saveState();
      }

      if (savedConfigId) {
        return {
          success: true,
          message: 'Configuration saved successfully to Threekit and locally!',
        };
      } else {
        return {
          success: true,
          message: 'Configuration saved locally! (Threekit save not available)',
        };
      }
    } catch (error) {
      return { success: false, message: 'Failed to save configuration' };
    }
  }
}
