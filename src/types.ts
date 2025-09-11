import { ReactNode } from 'react';

export interface BaseComponentProps {
  title?: string;
  attribute?: any;
}

export interface TabPaneProps {
  children: ReactNode;
  onClick?: () => void;
}

export interface TabsProps {
  children: ReactNode;
}

export interface ModalProps {
  title?: string;
  children: ReactNode;
  handleClose: () => void;
  show?: boolean;
}

export interface AccordionItemProps {
  selected?: boolean;
  handleSelect: (idx: any) => void;
  label: string;
  children: ReactNode;
}

export interface AccordionProps {
  children?: ReactNode;
}

export interface PlayerProps {
  assetId?: string;
}

export interface ShareProps {
  message?: string;
}

export interface SnapshotsProps {
  cameras?: any;
  config?: any;
}

export interface UploadProps {
  attribute?: string;
}

export interface FormComponentProps {
  attribute?: any;
  address?: any;
  includeNestedConfigurator?: boolean;
}

export interface ThreekitAsset {
  id: string;
  name: string;
  type: 'item' | 'material' | 'model' | 'texture' | string; // extend as needed
  as: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  deletedAt: string | null;
  createdBy: string;
  orgId: string;
  description: string | null;
  metadata: Record<string, any>;
  tags: string[];
  keywords: string[];
  publicShare: string | null;
  parentFolderId: string;
  importedFileId: string | null;
  advancedAr: boolean;
  proxyId: string | null;
  publishedAt: string | null;
  defaultStageId: string | null;
  defaultCompositeId: string | null;
  deletedBy: string | null;
  nodetags: string[];
  updatedBy: string;
  proxyType: 'material' | 'item' | string | null;
  effects: any | null;
  warnings: boolean;
  fileSize: number;
  tagids: string[];
  categoryId: string | null;
  head: string;
  customId: string | null;
  analytics: boolean;
}
