import { firestore } from 'firebase/app';
import { inherits } from 'util';

export class User {
   uid: string;
   email: string;
   username: string;
   venmo?: string;
   balance: number;
   admin: boolean;
}

export class Bet {
   betID?: string;
   event: string;
   eventID: string;
   cat1: string;
   cat2: string;
   cat3: string;
   creator: {
      uid: string;
      username: string; // do we want to show this on home feed
      amount: number;
      side: string;
   };
   acceptor: {
      uid?: string;
      // username?: string; // probably not necessary
      amount: number;
      side: string;
   };
   pot: number;
   open: boolean;
   // status: number; // 0-open, 1-active, 2-resolved, necessary?
   dtCreated: string | firestore.Timestamp;
}

export class Event {
   eventID?: string;
   name: string;
   sides: {
      name: string;
      decOdds: number;
   }[];
   estResolve: string | Date;
   current: boolean;
   cat1: string;
   cat2: string;
   cat3: string;
}

export class UserBet {
   betID: string;
   cora: string;
   open: boolean;
}

export class Withdraw {
   wdID?: string;
   uid: string;
   amount: number;
   method: string;
   methodUname: string;
   resolved: boolean;
   dtRequested: string | firestore.Timestamp;
}

export class SiteData {
   siteTotal: number;
   ourMoney: number;
}
