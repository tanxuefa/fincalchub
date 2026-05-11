export interface AffiliateLink {
  text: string;
  url: string;
  description: string;
  disclosure: string; // required by FTC
}

export interface AffiliateCategory {
  category: string;
  calculators: string[]; // calculator slugs
  links: AffiliateLink[];
}

export const affiliateRegistry: AffiliateCategory[] = [
  {
    category: 'mortgage',
    calculators: ['mortgage-payment', 'mortgage-amortization', 'refinance', 'home-affordability', 'rent-vs-buy'],
    links: [
      {
        text: 'Compare Mortgage Rates',
        url: 'https://www.lendingtree.com', // placeholder
        description: 'Get matched with multiple lenders and compare rates',
        disclosure: 'We may earn a commission if you apply through this link.',
      },
      {
        text: 'Refinance Your Home',
        url: 'https://www.better.com', // placeholder
        description: 'Check your refinance rate in 3 minutes with no credit impact',
        disclosure: 'We may earn a commission if you apply through this link.',
      },
      {
        text: 'First-Time Home Buyer Guide',
        url: 'https://www.nerdwallet.com/mortgages', // placeholder
        description: 'Everything you need to know about buying your first home',
        disclosure: 'Affiliate partner. We may earn a commission.',
      },
    ],
  },
  {
    category: 'investment',
    calculators: ['compound-interest', 'retirement', 'cagr', 'dca', 'fire', 'drip'],
    links: [
      {
        text: 'Open a Brokerage Account',
        url: 'https://www.interactivebrokers.com', // placeholder
        description: 'Start investing with commission-free trades',
        disclosure: 'We may earn a commission if you open an account.',
      },
      {
        text: 'Best Robo-Advisors',
        url: 'https://www.nerdwallet.com/investing', // placeholder
        description: 'Automated investing platforms compared',
        disclosure: 'Affiliate partner. We may earn a commission.',
      },
    ],
  },
  {
    category: 'savings',
    calculators: ['savings-goal', 'emergency-fund', 'cd-calculator', 'college-529'],
    links: [
      {
        text: 'Compare High-Yield Savings Accounts',
        url: 'https://www.bankrate.com/banking/savings', // placeholder
        description: 'Earn 4%+ APY on your savings',
        disclosure: 'We may earn a commission from partner banks.',
      },
      {
        text: 'Open a 529 College Savings Plan',
        url: 'https://www.savingforcollege.com', // placeholder
        description: 'Tax-advantaged college savings plans by state',
        disclosure: 'Affiliate partner. We may earn a commission.',
      },
    ],
  },
  {
    category: 'debt',
    calculators: ['auto-loan', 'personal-loan', 'student-loan', 'debt-payoff', 'apr'],
    links: [
      {
        text: 'Compare Personal Loan Rates',
        url: 'https://www.credible.com', // placeholder
        description: 'Get prequalified rates from multiple lenders',
        disclosure: 'We may earn a commission if you take out a loan.',
      },
      {
        text: 'Auto Loan Refinancing',
        url: 'https://www.rateGenius.com', // placeholder
        description: 'Lower your car payment through refinancing',
        disclosure: 'Affiliate partner. We may earn a commission.',
      },
    ],
  },
  {
    category: 'credit-card',
    calculators: ['credit-card-payoff', 'balance-transfer'],
    links: [
      {
        text: 'Best Balance Transfer Cards',
        url: 'https://www.creditkarma.com', // placeholder
        description: '0% intro APR balance transfer offers',
        disclosure: 'We may earn a commission if you apply.',
      },
    ],
  },
  {
    category: 'currency',
    calculators: ['currency-converter', 'exchange-fee'],
    links: [
      {
        text: 'Send Money with Wise',
        url: 'https://wise.com', // placeholder
        description: 'International transfers at the real exchange rate',
        disclosure: 'We may earn a commission if you use this service.',
      },
    ],
  },
];

export function getAffiliateLinks(calculatorSlug: string): AffiliateLink[] {
  const category = affiliateRegistry.find(c => c.calculators.includes(calculatorSlug));
  return category?.links ?? [];
}
