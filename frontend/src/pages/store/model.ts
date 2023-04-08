export interface Item {
  id: number;
  name: string;
  price: number;
  quatity: number;
  shop_id: number;
}

export interface CheckOutProps {
  base64: string;
}

export interface Pay {
  item_id: number;
  quantity: number;
}
