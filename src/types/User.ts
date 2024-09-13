export interface IUser {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  photoURL: string | null;
  idDefaultList: number | null;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
}
