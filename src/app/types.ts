export class User {
   uid: string;
   email: string;
   username: string;
   venmo?: string;
   balance: number;
   admin: boolean;
}

export class Bet {
   event: string;
   eventID: string;
   cat1: string;
   cat2: string;
   cat3: string;
   creator: {
      uid: string;
      username: string;
      amount: number;
      side: string;
   };
   acceptor: {
      uid?: string;
      username?: string;
      amount: number; // FIXXXXX - need note in rules that money always refunded when tie
      side: string;
   };
   pot: number;
   status: number; // 0-open, 1-active, 2-resolved,
   dtCreated: string;
}

export class Event {
   name: string;
   sides: {
      name: string;
      decOdds: number;
   }[];
   estResolve: string | Date;
   current: boolean;
   eventID?: string;
   cat1: string;
   cat2: string;
   cat3: string;
}
