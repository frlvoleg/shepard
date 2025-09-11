import React from 'react';
import { useConfigurator } from '@threekit-tools/treble';
import FormComponent from './FormComponent';

export const FlatForm = (props: any) => {
  const [attributes] = useConfigurator();
  if (!attributes) return null;

  return Object.values(attributes).map((attr: any) => (
    <FormComponent
      attribute={(attr as any).name}
      includeNestedConfigurator={props.includeNestedConfigurator}
    />
  ));
};

export default FlatForm;
