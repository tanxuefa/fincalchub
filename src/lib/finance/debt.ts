// Loan & Debt calculations

export interface LoanInput {
  amount: number;
  interestRate: number;
  term: number; // months
  fees?: number;
}

export interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  totalFees: number;
  apr: number;
  schedule: { month: number; payment: number; principal: number; interest: number; balance: number }[];
}

export function calculateLoan(input: LoanInput): LoanResult {
  const { amount, interestRate, term, fees = 0 } = input;
  const monthlyRate = interestRate / 100 / 12;

  const monthlyPayment =
    monthlyRate === 0
      ? amount / term
      : (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) /
        (Math.pow(1 + monthlyRate, term) - 1);

  let balance = amount;
  const schedule: LoanResult['schedule'] = [];
  let totalInterest = 0;

  for (let m = 1; m <= term; m++) {
    const interest = balance * monthlyRate;
    const principal = monthlyPayment - interest;
    balance = Math.max(0, balance - principal);
    totalInterest += interest;
    schedule.push({ month: m, payment: monthlyPayment, principal, interest, balance: Math.round(balance * 100) / 100 });
  }

  // APR calculation: the rate that makes PV of payments = loan amount - fees
  const netAmount = amount - fees;
  let aprRate = monthlyRate;
  for (let iter = 0; iter < 100; iter++) {
    let pv = 0;
    for (let m = 1; m <= term; m++) {
      pv += monthlyPayment / Math.pow(1 + aprRate, m);
    }
    if (Math.abs(pv - netAmount) < 0.01) break;
    const pvPrime = -term * monthlyPayment / Math.pow(1 + aprRate, term + 1);
    aprRate -= (pv - netAmount) / pvPrime;
  }

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(monthlyPayment * term * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalFees: fees,
    apr: Math.round(aprRate * 12 * 10000) / 100,
    schedule,
  };
}

export interface AutoLoanInput {
  carPrice: number;
  downPayment: number;
  tradeInValue: number;
  interestRate: number;
  term: number; // months
  salesTaxRate: number;
  registrationFees?: number;
  dealerFees?: number;
}

export interface AutoLoanResult {
  loanAmount: number;
  monthlyPayment: number;
  totalCost: number;
  totalInterest: number;
  firstPaymentBreakdown: { principal: number; interest: number };
  schedule: { month: number; payment: number; principal: number; interest: number; balance: number }[];
}

export function calculateAutoLoan(input: AutoLoanInput): AutoLoanResult {
  const { carPrice, downPayment, tradeInValue, interestRate, term, salesTaxRate, registrationFees = 200, dealerFees = 300 } = input;

  const taxableAmount = carPrice - tradeInValue;
  const salesTax = taxableAmount * (salesTaxRate / 100);
  const totalCost = carPrice + salesTax + registrationFees + dealerFees;
  const loanAmount = totalCost - downPayment - tradeInValue;

  const result = calculateLoan({ amount: loanAmount, interestRate, term });

  return {
    loanAmount: Math.round(loanAmount * 100) / 100,
    monthlyPayment: result.monthlyPayment,
    totalCost: Math.round(totalCost * 100) / 100,
    totalInterest: result.totalInterest,
    firstPaymentBreakdown: {
      principal: result.schedule[0]?.principal ?? 0,
      interest: result.schedule[0]?.interest ?? 0,
    },
    schedule: result.schedule,
  };
}

export interface StudentLoanInput {
  balance: number;
  interestRate: number;
  term: number; // months for standard repayment
  annualIncome?: number;
  repaymentPlan?: 'standard' | 'ibr' | 'paye' | 'repaye';
  familySize?: number;
  state?: string;
}

export interface StudentLoanResult {
  standardPayment: number;
  idrPayment: number | null;
  recommendedPayment: number;
  totalInterestStandard: number;
  totalInterestIDR: number | null;
  forgivenessAmount: number | null;
}

export function calculateStudentLoan(input: StudentLoanInput): StudentLoanResult {
  const { balance, interestRate, term, annualIncome = 0, repaymentPlan = 'standard', familySize = 1 } = input;

  const standard = calculateLoan({ amount: balance, interestRate, term });

  // IDR plans: 10-15% of discretionary income
  const povertyLine = 14580 + (familySize - 1) * 5140; // 2024 US federal poverty guidelines
  const discretionaryIncome = Math.max(0, annualIncome - 1.5 * povertyLine);
  let idrPayment = null;
  let totalInterestIDR = null;
  let forgivenessAmount = null;

  if (repaymentPlan !== 'standard' && discretionaryIncome > 0) {
    const idrRate = repaymentPlan === 'repaye' || repaymentPlan === 'paye' ? 0.1 : 0.15;
    idrPayment = discretionaryIncome * idrRate / 12;

    // Simulate IDR payoff
    let bal = balance;
    let interests = 0;
    const monthlyInterest = interestRate / 100 / 12;
    for (let m = 0; m < 300 && bal > 0; m++) {
      const int = bal * monthlyInterest;
      interests += int;
      bal = bal + int - Math.min(idrPayment, bal + int);
      if (m === 239) { // 20 year forgiveness for some plans
        forgivenessAmount = bal;
        bal = 0;
      }
    }
    totalInterestIDR = interests;
  }

  return {
    standardPayment: standard.monthlyPayment,
    idrPayment: idrPayment ? Math.round(idrPayment * 100) / 100 : null,
    recommendedPayment: idrPayment ? Math.max(standard.monthlyPayment, Math.round(idrPayment * 100) / 100) : standard.monthlyPayment,
    totalInterestStandard: standard.totalInterest,
    totalInterestIDR: totalInterestIDR ? Math.round(totalInterestIDR * 100) / 100 : null,
    forgivenessAmount: forgivenessAmount ? Math.round(forgivenessAmount * 100) / 100 : null,
  };
}

export interface DebtPayoffInput {
  debts: { name: string; balance: number; interestRate: number; minimumPayment: number }[];
  extraPayment: number; // extra money per month
  strategy: 'avalanche' | 'snowball'; // avalanche = highest rate first, snowball = smallest balance first
}

export interface DebtPayoffResult {
  totalMonths: number;
  totalInterest: number;
  totalPaid: number;
  payoffOrder: string[];
  schedule: { month: number; debts: { name: string; balance: number }[]; totalPaid: number }[];
}

export function calculateDebtPayoff(input: DebtPayoffInput): DebtPayoffResult {
  const { debts, extraPayment, strategy } = input;
  const remaining = debts.map(d => ({ ...d }));
  const payoffOrder: string[] = [];
  const schedule: DebtPayoffResult['schedule'] = [];
  let totalInterest = 0;
  let month = 0;

  while (remaining.some(d => d.balance > 0) && month < 1200) {
    month++;
    // Apply minimum payments + extra to first debt in strategy order
    const sorted = [...remaining]
      .filter(d => d.balance > 0)
      .sort((a, b) =>
        strategy === 'avalanche'
          ? b.interestRate - a.interestRate
          : a.balance - b.balance
      );

    let extraRemaining = extraPayment;
    for (const debt of sorted) {
      const monthlyInterest = (debt.interestRate / 100 / 12) * debt.balance;
      totalInterest += monthlyInterest;
      debt.balance += monthlyInterest;

      let payment = debt.minimumPayment;
      if (debt === sorted[0]) {
        payment += extraRemaining;
        extraRemaining = 0;
      }

      payment = Math.min(payment, debt.balance);
      debt.balance -= payment;

      if (debt.balance < 0.01 && debt.balance > 0) debt.balance = 0;
      if (debt.balance === 0 && !payoffOrder.includes(debt.name)) {
        payoffOrder.push(debt.name);
        extraRemaining += debt.minimumPayment; // Snowball freed-up payment
      }
    }

    if (month % 6 === 0 || remaining.every(d => d.balance === 0)) {
      schedule.push({
        month,
        debts: remaining.map(d => ({ name: d.name, balance: Math.round(d.balance * 100) / 100 })),
        totalPaid: Math.round(totalInterest + debts.reduce((s, d) => s + d.balance, 0) - remaining.reduce((s, d) => s + d.balance, 0)),
      });
    }
  }

  return {
    totalMonths: month,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPaid: Math.round((totalInterest + debts.reduce((s, d) => s + d.balance, 0)) * 100) / 100,
    payoffOrder,
    schedule,
  };
}

export interface LoanComparisonInput {
  loans: { name: string; amount: number; rate: number; term: number; fees?: number }[];
}

export interface LoanComparisonResult {
  loans: { name: string; monthly: number; total: number; totalInterest: number; apr: number }[];
  bestOverall: string;
  bestMonthly: string;
}

export function compareLoans(input: LoanComparisonInput): LoanComparisonResult {
  const results = input.loans.map(loan => {
    const result = calculateLoan({ amount: loan.amount, interestRate: loan.rate, term: loan.term, fees: loan.fees });
    return { name: loan.name, monthly: result.monthlyPayment, total: result.totalPayment, totalInterest: result.totalInterest, apr: result.apr };
  });

  return {
    loans: results,
    bestOverall: results.reduce((a, b) => a.total < b.total ? a : b).name,
    bestMonthly: results.reduce((a, b) => a.monthly < b.monthly ? a : b).name,
  };
}
