export type RoleType = {
  created_at: string;
  guard_name: string;
  id: number;
  name: string;
  updated_at: string;
};
export type UserType = {
  id: number;
  name: string;
  email: string;
  photo: string;
  phone: string;
  roles: RoleType[];
};
