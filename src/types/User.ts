export interface IUser {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  photo: Buffer | null;
  idDefaultList: number | null;
  createdAt: Date;
  isVerified: boolean;
}
