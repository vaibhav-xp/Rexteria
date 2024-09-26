import { Dispatch, SetStateAction } from "react";

export interface SpecificationsTypes {
  type: string;
  value: string;
}

export interface EditSepecificationPropsTypes {
  specifications: SpecificationsTypes[];
  setSpecifications: Dispatch<SetStateAction<SpecificationsTypes[]>>;
}

interface Image {
  _id: string;
  url: string;
  public_id: string;
}

interface Specification {
  type: string;
  value: string;
}

interface Category {
  _id: string;
  title: string;
}

export interface ModType {
  _id: string;
  title: string;
  slug: string;
  specifications: Specification[];
  content: string;
  main_image: Image;
  images: Image[];
  categoryId: Category;
  price: number;
  likes: number;
  discount: number;
  discount_price: number;
  rating: number;
  views: number;
  status: boolean;
  reviews: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ModFormTypes {
  title: string;
  price: number;
  discount: number;
  content: string;
  categoryId: string;
  isPublic: boolean;
}
