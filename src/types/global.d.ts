// Global type declarations for Treble components
declare module '@threekit-tools/treble' {
  export interface ThreekitProviderProps {
    children?: React.ReactNode;
  }
  
  export interface PlayerProps {
    children?: React.ReactNode;
  }
  
  export const ThreekitProvider: React.FC<ThreekitProviderProps>;
  export const Player: React.FC<PlayerProps>;
  export const PortalToElement: React.FC<any>;
  export const FlatForm: React.FC<any>;
  export const useAttribute: (name: string) => [any, any?];
  export const useConfigurator: () => [any];
  export const useNestedConfigurator: (address: any) => [any];
  export const usePlayerPortal: () => [any, any];
  export const useShare: () => any;
  export const useThreekitInitStatus: () => boolean;
  export const usePlayerLoadingStatus: () => boolean;
  export const useAddToWishlist: () => any;
  export const useWishlist: () => any;
  export const useSnapshot: (...args: any[]) => any;
  export const useZoom: () => any;
  
  // Icons
  export const CaretDownIcon: React.FC;
  export const RemoveIcon: React.FC;
  export const HeartIcon: React.FC;
  export const ShareIcon: React.FC;
  export const DownloadIcon: React.FC;
  export const SpinnerIcon: React.FC;
  export const AddIcon: React.FC;
  export const DeleteIcon: React.FC;
  export const WishlistIcon: React.FC;
  export const ZoomInIcon: React.FC;
  export const ZoomOutIcon: React.FC;
  
  // Components
  export const Drawer: React.FC<any>;
  
  export const ATTRIBUTE_TYPES: any;
}

// CSS Module declarations
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.scss' {
  const content: string;
  export default content;
}

// Suppress implicit any errors for props
// SVG imports
declare module '*.svg' {
  import React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

// Image imports
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare global {
  interface Window {
    // Add any window properties if needed
  }
}