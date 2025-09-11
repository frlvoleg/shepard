export interface UIState {
  page: 'leandig' | 'configuration';
  selectedCollection: string;
  sort: string;
  selectedScholl: string;
  isConfigurationLoading: boolean;
  selectedRing: string | undefined;
  depthType: Record<string, 'Etch depth' | 'Marking depth'>;
  dimensions: boolean;
  addInfo: 'Top' | 'Bottle' | null;
  tooltip: Tooltip | null;
  tooltipText: string | null;
  setImageUploaded: string;
}

export interface Tooltip {
  type: string;
  left: number;
  top: number;
  text: string;
  imageSrc?: string;
}
