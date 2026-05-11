// Credit Card calculators

export interface CreditCardPayoffInput {
  balance: number;
  annualRate: number;
  monthlyPayment?: number; // if omitted, use minimum payment
  minimumPaymentRate?: number; // percentage of balance
  minimumPaymentMinimum?: number; // minimum dollar amount
}

export interface CreditCardPayoffResult {
  monthsToPayoff: number;
  totalInterest: number;
  totalPaid: number;
  payoffDate: Date;
  schedule: { month: number; payment: number; interest: number; principal: number; balance: number }[];
  vsMinimum: { monthsFaster: number; interestSaved: number } | null;
}

export function calculateCreditCardPayoff(input: CreditCardPayoffInput): CreditCardPayoffResult {
  const {
    balance,
    annualRate,
    monthlyPayment,
    minimumPaymentRate = 2,
    minimumPaymentMinimum = 25,
  } = input;

  const monthlyRate = annualRate / 100 / 12;

  // Calculate with the fixed (or minimum) payment
  const calcPayoff = (useFixed: boolean, fixedAmount: number) => {
    let bal = balance;
    let totalInterest = 0;
    let month = 0;
    const schedule: CreditCardPayoffResult['schedule'] = [];

    while (bal > 0 && month < 1200) {
      month++;
      const interest = bal * monthlyRate;
      totalInterest += interest;
      bal += interest;

      const minPayment = Math.max(bal * (minimumPaymentRate / 100), minimumPaymentMinimum);
      const payment = useFixed ? Math.min(fixedAmount, bal) : Math.min(minPayment, bal);
      bal -= payment;

      if (month % 12 === 0 || bal <= 0) {
        schedule.push({ month, payment, interest: Math.round(interest * 100) / 100, principal: payment - interest, balance: Math.round(bal * 100) / 100 });
      }
    }

    return { months: month, totalInterest, schedule };
  };

  const useFixed = !!monthlyPayment;
  const payment = monthlyPayment ?? Math.max(balance * (minimumPaymentRate / 100), minimumPaymentMinimum);
  const fixedResult = calcPayoff(useFixed, payment);

  const minResult = useFixed ? calcPayoff(false, 0) : null;

  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + fixedResult.months);

  return {
    monthsToPayoff: fixedResult.months,
    totalInterest: Math.round(fixedResult.totalInterest * 100) / 100,
    totalPaid: Math.round((balance + fixedResult.totalInterest) * 100) / 100,
    payoffDate,
    schedule: fixedResult.schedule,
    vsMinimum: useFixed && minResult
      ? {
          monthsFaster: minResult.months - fixedResult.months,
          interestSaved: Math.round((minResult.totalInterest - fixedResult.totalInterest) * 100) / 100,
        }
      : null,
  };
}

export interface BalanceTransferInput {
  balance: number;
  currentRate: number;
  monthlyPayment: number;
  transferRate: number; // promotional rate
  transferFee: number; // percentage
  promoPeriod: number; // months
  postPromoRate: number; // rate after promo
}

export interface BalanceTransferResult {
  withoutTransfer: { months: number; totalInterest: number; totalPaid: number };
  withTransfer: { months: number; totalInterest: number; totalPaid: number; payoffWithinPromo: boolean };
  savings: number;
  isWorthwhile: boolean;
}

export function calculateBalanceTransfer(input: BalanceTransferInput): BalanceTransferResult {
  const { balance, currentRate, monthlyPayment, transferRate, transferFee, promoPeriod, postPromoRate } = input;

  const without = calculateCreditCardPayoff({ balance, annualRate: currentRate, monthlyPayment });

  // With transfer
  const transferAmount = balance * (1 + transferFee / 100);
  const promoMonthlyRate = transferRate / 100 / 12;
  const postMonthlyRate = postPromoRate / 100 / 12;

  let bal = transferAmount;
  let totalInterest = 0;
  let month = 0;
  let payoffWithinPromo = false;

  while (bal > 0 && month < 1200) {
    month++;
    const rate = month <= promoPeriod ? promoMonthlyRate : postMonthlyRate;
    const interest = bal * rate;
    totalInterest += interest;
    bal += interest - Math.min(monthlyPayment, bal + interest);
    if (month === promoPeriod && bal <= 0) payoffWithinPromo = true;
  }

  const transferFeeAmount = balance * (transferFee / 100);

  const withTransfer = {
    months: month,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPaid: Math.round((transferAmount + totalInterest) * 100) / 100,
    payoffWithinPromo,
  };

  const savings = without.totalInterest - withTransfer.totalInterest - transferFeeAmount;

  return {
    withoutTransfer: {
      months: without.monthsToPayoff,
      totalInterest: without.totalInterest,
      totalPaid: without.totalPaid,
    },
    withTransfer,
    savings: Math.round(savings * 100) / 100,
    isWorthwhile: savings > 0,
  };
}

export interface CardRewardsInput {
  annualSpending: number;
  cards: {
    name: string;
    cashbackRate: number; // overall effective cashback %
    annualFee: number;
    signupBonus: number;
    categories?: { name: string; rate: number; spending: number }[];
  }[];
}

export interface CardRewardsResult {
  cards: {
    name: string;
    annualRewards: number;
    netValue: number;
    effectiveRate: number;
  }[];
  best: string;
}

export function compareCardRewards(input: CardRewardsInput): CardRewardsResult {
  const results = input.cards.map(card => {
    let rewards = 0;
    if (card.categories && card.categories.length > 0) {
      for (const cat of card.categories) {
        rewards += cat.spending * (cat.rate / 100);
      }
      const categorizedSpending = card.categories.reduce((s, c) => s + c.spending, 0);
      const remaining = input.annualSpending - categorizedSpending;
      if (remaining > 0) rewards += remaining * (card.cashbackRate / 100);
    } else {
      rewards = input.annualSpending * (card.cashbackRate / 100);
    }
    rewards += card.signupBonus;
    const netValue = rewards - card.annualFee;

    return {
      name: card.name,
      annualRewards: Math.round(rewards * 100) / 100,
      netValue: Math.round(netValue * 100) / 100,
      effectiveRate: Math.round((rewards / input.annualSpending) * 10000) / 100,
    };
  });

  return {
    cards: results,
    best: results.reduce((a, b) => a.netValue > b.netValue ? a : b).name,
  };
}
