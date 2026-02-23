import dynamic from 'next/dynamic';

export const ShopMap = dynamic(
    () => import('./ShopMap').then((mod) => mod.ShopMap),
    { ssr: false }
);
