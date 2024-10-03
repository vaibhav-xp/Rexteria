export interface UserType {
  _id: string;
  name: string;
  role: "ADMIN" | "USER";
  email: string;
  country: string;
  phone: string;
  avatar: {
    public_id: string;
    url: string;
  };
  instagram: string;
  youtube: string;
  x: string;
  active: boolean;
}
