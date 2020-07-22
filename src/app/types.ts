export class User {
   uid: string;
   email: string;
   photoURL?: string;
   displayName?: string;
   offers?: {
      gameID: string;
      price: number;
   }[];
   venmo?: string;
   phone?: string;
}
