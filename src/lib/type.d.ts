type CollectionType = {
  _id: string;
  title: string;
  description: string;
  image: string;
  productCount: number;
}
interface HomePage {
  _id:string;
  seo: {
    title?: string;
    desc?: string;
    keywords?: [string];
    url?: string;
    width?: number;
    height?: number;
    alt?: string;
},
  hero: {
    heading?: string;
    text?: string;
    imgUrl: string
    shade?: string;
    textColor?: string;
    link: string;
    textPosition?: 'end'|'center'|'start';
    textPositionV?: 'end'|'center'|'start';
    buttonText?: string;
    isVideo: boolean;
  },
  collections: [
    {
      heading?: string;
      text?: string;
      imgUrl: string;
      shade?: string;
      textColor?: string;
      link: string;
      textPosition?: 'end'|'center'|'start';
      textPositionV?: 'end'|'center'|'start';
      buttonText?: string;
      collection: string;
      isVideo: boolean;
    }
  ]
}
declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: "admin" | "moderator";
    };
  }
}

type ProductType = {
  _id: string;
  title: string;
  description: string;
  media: [string];
  category: string;
  slug: string;
  collections: [CollectionType];
  tags: [string];
  variants: [];
  stock: number;
  sold: number;
  price: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  numOfRevies: number;
  expense: number;
  createdAt: Date;
  updatedAt: Date;
}
interface Result {
  type: string
  resultCode: string
  token: string
};
type OrderColumnType = {
  _id: string;
  customer: string;
  products: { variantId: string; quantity: number }[];
  totalAmount: number;
  createdAt: string;
  status: string;
  exchangeRate: number;
  currency: string;
}

type OrderItemType = {
  product: ProductType
  color: string;
  size: string;
  quantity: number;
}
type Lol = { street: string; city: string; state: string; postalCode: string; country: string; phone: string; }
type Order = {
    _id: string
    customerEmail: String,
    customerPhone: String,
    products: [OrderItemType],
    shippingAddress: Lol,
    shippingRate: string,
    totalAmount: number,
    currency: string,
    isPaid: string,
    method: string,
    status: string,
    statusHistory: {
        status: string;
        changedAt: Date;
        _id: string;
    }[];
    exchangeRate: number,
    createdAt: Date,

}
type CustomerType = {
  _id: string;
  googleId?: string;
  image: string;
  ordersCount: number;
  name: string;
  city: string;
  country: string;
  email: string;
  orders: string[]
  createdAt: string;
}