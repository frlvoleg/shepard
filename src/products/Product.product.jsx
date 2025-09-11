import React from 'react';
import { ProductLayout } from '@threekit-tools/treble';
import { MainLayout } from '../components/MainLayout';

const products = {
  purist: { preview: { assetId: 'f0b45d13-39b3-485b-89fa-05d0dc59e17a' } }, //50753783-e8b7-42b1-ac23-8cf174f49322
};

const Product = () => {
  return <ProductLayout products={products}>{<MainLayout />}</ProductLayout>;
};

export default Product;
