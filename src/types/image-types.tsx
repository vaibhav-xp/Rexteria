export interface ImageType {
  url: string | undefined;
  public_id: string | undefined;
}

export interface ImageTypeWithID extends ImageType {
  _id: string;
}
