import { Dispatch, SetStateAction } from "react";

export interface DisplayCategoriesTypes {
  _id: string;
  title: string;
  image: {
    public_id: string;
    url: string;
  };
}

export interface CategoryActionTypes {
  type: "update" | "add";
  data?: DisplayCategoriesTypes | null;
}

export interface UpdateCategoryPropsTypes {
  fetchData: () => void;
  action: CategoryActionTypes | null;
  setAction: Dispatch<SetStateAction<CategoryActionTypes | null>>;
}
