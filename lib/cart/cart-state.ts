export type CartProduct = {
  id: string;
  name: string;
  href: string;
  image: { src: string; alt: string } | null;
};

export type CartItem = CartProduct & { quantity: number };
export type CartState = { items: readonly CartItem[] };

export type CartAction =
  | { type: "add"; product: CartProduct | null }
  | { type: "increase"; productId: string }
  | { type: "decrease"; productId: string }
  | { type: "remove"; productId: string }
  | { type: "clear" };

export type CartEligiblePreview = {
  routeKey: string;
  name: string;
  detailPageStatus: string;
  images: readonly { src: string; alt: string; approvalStatus: string }[];
};

export const initialCartState: CartState = { items: [] };

export function isPositiveInteger(value: number): boolean {
  return Number.isSafeInteger(value) && value > 0;
}

function isValidCartProduct(product: CartProduct | null): product is CartProduct {
  return Boolean(product && product.id && product.name && product.href === `/products/${product.id}`);
}

export function resolvePreviewCartProduct(productId: string, previews: readonly CartEligiblePreview[]): CartProduct | null {
  const preview = previews.find((item) => item.routeKey === productId && item.detailPageStatus === "development-preview-eligible");
  if (!preview) return null;
  const approvedImage = preview.images.find((image) => image.approvalStatus === "approved");
  return {
    id: preview.routeKey,
    name: preview.name,
    href: `/products/${preview.routeKey}`,
    image: approvedImage ? { src: approvedImage.src, alt: approvedImage.alt } : null,
  };
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      if (!isValidCartProduct(action.product)) return state;
      const existing = state.items.find((item) => item.id === action.product?.id);
      if (existing) {
        return {
          items: state.items.map((item) => item.id === existing.id
            ? { ...item, quantity: isPositiveInteger(item.quantity) && item.quantity < Number.MAX_SAFE_INTEGER ? item.quantity + 1 : 1 }
            : item),
        };
      }
      return { items: [...state.items, { ...action.product, quantity: 1 }] };
    }
    case "increase":
      return {
        items: state.items.map((item) => item.id === action.productId
          ? { ...item, quantity: isPositiveInteger(item.quantity) && item.quantity < Number.MAX_SAFE_INTEGER ? item.quantity + 1 : 1 }
          : item),
      };
    case "decrease":
      return {
        items: state.items.map((item) => item.id === action.productId && isPositiveInteger(item.quantity) && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item),
      };
    case "remove":
      return { items: state.items.filter((item) => item.id !== action.productId) };
    case "clear":
      return state.items.length ? initialCartState : state;
  }
}

export function getCartItemCount(state: CartState): number {
  return state.items.reduce((total, item) => total + (isPositiveInteger(item.quantity) ? item.quantity : 0), 0);
}
