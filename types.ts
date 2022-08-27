

//Objects

//referrer
//referee
// campaign
type Address = string;

interface User {
    id: Address;
    totalPayout: TokenTotal;
    payouts: Array<Payout>;
}

interface Referee extends User {
    campaign: Array<Campaign>;
    referrer: Array<Referrer>;
}

interface Referrer extends User {
    twitterHandle: string;
    githubHandle: string;
    address: string; 
    usersReferred: Array<User>;
}

type SuperUser = Referrer & Referee 

interface Campaign {
    id: string;
    kpis: Array<KPI>; //kpis and incentives are linked. The first kpi cooresponds to the first incentive.
    incentives: Array<Incentive>;
    totalEarnings: TokenTotal;
    payouts: Array<Payout>;
    actions: Array<Action>;
}

interface KPI {
    id: string;
    description: string;
    action: Array<Action>;
}


interface GoodAction extends Action {

}

interface BadAction extends Action {

}

interface Action {
    campaign: Campaign;
    kpi: KPI;
    description: string;
    points: string;
    date: Date;
    payout?: Payout;
    //link to some other adapter
}

interface Incentive {
    id: string;
    description: string;
    rewardTokens: Array<Token>;
}

interface TokenForPayout extends Token {
    payout: Array<Payout>;
}

interface TokenTotal {
    id: string;
    total: Array<string>; // if USD, total will be length 0. If denomination is token, then 
    tokens: Array<Token>;
    date: Date;
}

interface Token {
    id: string;
    amount: string;
    decimals: number;
    price: TokenPrice;
}

interface TokenMatchedToUSD {
    id: string;
    usd: string;
    decimals: string;
}

interface TokenPrice {
    token: Token;
    priceUSD: string;
}

interface Payout {
    id: string;
    status: 'claimed' | 'unclaimed' | 'expired' | 'locked';
    expires?: Date;
    tokens: Array<TokenForPayout>;
    user: User;
    kpi: KPI;
    campaign: Campaign;
    date: Date;
    action: Action;
}


interface TotalPayouts {
    level: 'campaign' | 'protocol' | 'root';

}