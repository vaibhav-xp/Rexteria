export interface AddCategory {
  image?: File;
  title: string;
}

export interface UpdateCategory extends AddCategory {
  id: string;
}
