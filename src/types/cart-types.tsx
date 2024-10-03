import { ModType } from "./mod-types";
import { UserType } from "./store-types";

export interface CartModType {
  mod_id: ModType | string;
  quantity: number;
  price: number;
}

export interface CartTypes {
  user_id: UserType | string;
  mods: CartModType[];
  totalAmount: number;
}
