export interface IInvitation {
  id: number;
  code: string;
  listId: number;
  inviterId: number;
  expiresAt: Date;
  createdAt: Date;
}
