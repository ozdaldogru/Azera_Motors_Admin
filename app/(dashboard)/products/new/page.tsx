import dynamic from 'next/dynamic';

const ProductForm = dynamic(() => import('@/components/products/ProductForm'), { ssr: false });

const CreateProduct = () => {
  return (
    <ProductForm />
  );
};

export default CreateProduct;