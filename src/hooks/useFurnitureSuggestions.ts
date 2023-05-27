import { useAppFurniture } from './useAppFurniture';
import { useCurrentOrder } from './useCurrentOrder';

import { Furniture } from 'um-types';

export function useFurnitureSuggestions() {
  const appFurniture = useAppFurniture();
  const order = useCurrentOrder();

  const orderItems = order?.items || [];
  const blockedFurniture: Furniture[] = [];

  appFurniture.forEach((f) => {
    f.categoryRefs.forEach((catRef) => {
      const categoryOfItemInOrder = orderItems.find((oi) => oi.id == f.id)?.selectedCategory;

      if (catRef.name !== categoryOfItemInOrder) {
        blockedFurniture.push({ ...f, selectedCategory: catRef.name });
      }
    });
  });

  return blockedFurniture;
}
