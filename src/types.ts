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