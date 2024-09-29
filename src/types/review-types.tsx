import { ModType } from "./mod-types";
import { UserType } from "./store-types";

export interface ReviewType {
  createdAt: string;
  likes: boolean;
  mod_id: ModType | string;
  rating: number;
  user_id: UserType | string;
  _id: string;
}
