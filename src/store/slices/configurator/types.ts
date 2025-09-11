export interface Accessory {
  assetId: string;
  name: string;
  image: string;
  description: string;
  brand?: string;
}

export interface AttributeValue {
  assetId: string;
  name?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  fileSize?: number;
  tagids?: string[];
  type?: string;
  label?: string;
  visible?: boolean;
  enabled?: boolean;
  configuration?: Record<string, any>;
}

export interface AttributeThreekit {
  id: string;
  type: string;
  name: string;
  metadata: Record<string, any>;
  blacklist: string[];
  assetType?: string;
  values: AttributeValue[];
  defaultValue?: AttributeValue | boolean;
  global?: {
    id: string;
    type: string;
    name: string;
    metadata: any[];
    defaultValue?: any;
  };
  visible: boolean;
  enabled: boolean;
  hiddenValues: string[];
  disabledValues: string[];
  value: AttributeValue | boolean | AttributeValue[];
  maxLength?: number;
  of?: {
    type: string;
    metadata: any[];
    blacklist: string[];
    assetType?: string;
  };
}

export type SelectedValueThreekit = AttributeValue | boolean | AttributeValue[];

export interface ConfiguratorState {
  attributes: AttributeThreekit[];
  selectedConfiguration: Record<string, SelectedValueThreekit>;
  graduationYear: string;
  shortId: null | string;
  isSaving: boolean;
  isLoading: boolean;
  saveError: null | string;
  loadError: null | string;
}

export interface Price {
  id: undefined | string;
  currency: undefined | string;
  price: undefined | number;
}

export interface ProductCache {
  data: string;
  id: string;
  name: string;
}

export interface Product {
  activeCacheIdx: number;
  cache: ProductCache[];
  id: string;
  metadata: Record<string, any>;
  name: string;
}

export interface Translations {
  locale: undefined | string;
  translationsMap: Record<string, any>;
}

export interface Treble {
  awaitingFirstInteraction: boolean;
  isFirstRenderComplete: boolean;
  isPlayerLoading: boolean;
  isThreekitInitialized: boolean;
  loadingProgress: number;
  notifications: boolean;
  playerElId: string;
  threekitEnv: string;
}

export interface RootReduxState {
  treble: Treble;
  product: Product;
  attributes: Record<string, AttributeThreekit>;
  translations: Translations;
  wishlist: any[];
  price: Price;
}
