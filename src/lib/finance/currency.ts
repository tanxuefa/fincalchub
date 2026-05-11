// Currency & Inflation calculators

export interface CurrencyConvertInput {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  exchangeRate?: number; // if not provided, uses cached rates
}

export interface CurrencyConvertResult {
  convertedAmount: number;
  exchangeRate: number;
  inverseRate: number;
  lastUpdated: string;
}

// Common exchange rates (relative to USD)
export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1, EUR: 0.925, GBP: 0.79, JPY: 150.5, CAD: 1.365,
  AUD: 1.53, CHF: 0.905, CNY: 7.24, INR: 83.5, MXN: 17.1,
  BRL: 5.05, KRW: 1325, SEK: 10.45, NOK: 10.55, DKK: 6.9,
  NZD: 1.62, SGD: 1.345, HKD: 7.82, TRY: 31.2, ZAR: 18.6,
  PLN: 4.02, THB: 35.8, IDR: 15750, MYR: 4.72, PHP: 56.2,
  CZK: 23.15, HUF: 361, ILS: 3.68, AED: 3.673, SAR: 3.75,
};

export const CURRENCY_NAMES: Record<string, string> = {
  USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound', JPY: 'Japanese Yen',
  CAD: 'Canadian Dollar', AUD: 'Australian Dollar', CHF: 'Swiss Franc',
  CNY: 'Chinese Yuan', INR: 'Indian Rupee', MXN: 'Mexican Peso',
  BRL: 'Brazilian Real', KRW: 'South Korean Won', SEK: 'Swedish Krona',
  NOK: 'Norwegian Krone', DKK: 'Danish Krone', NZD: 'New Zealand Dollar',
  SGD: 'Singapore Dollar', HKD: 'Hong Kong Dollar', TRY: 'Turkish Lira',
  ZAR: 'South African Rand', PLN: 'Polish Zloty', THB: 'Thai Baht',
  IDR: 'Indonesian Rupiah', MYR: 'Malaysian Ringgit', PHP: 'Philippine Peso',
  CZK: 'Czech Koruna', HUF: 'Hungarian Forint', ILS: 'Israeli Shekel',
  AED: 'UAE Dirham', SAR: 'Saudi Riyal',
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'C$', AUD: 'A$',
  CHF: 'Fr', CNY: '¥', INR: '₹', MXN: 'Mex$', BRL: 'R$', KRW: '₩',
  SEK: 'kr', NOK: 'kr', DKK: 'kr', NZD: 'NZ$', SGD: 'S$', HKD: 'HK$',
  TRY: '₺', ZAR: 'R', PLN: 'zł', THB: '฿', HUF: 'Ft', AED: 'د.إ',
};

export function convertCurrency(input: CurrencyConvertInput): CurrencyConvertResult {
  const { amount, fromCurrency, toCurrency, exchangeRate } = input;

  let rate: number;
  if (exchangeRate) {
    rate = exchangeRate;
  } else {
    const fromUSD = EXCHANGE_RATES[fromCurrency.toUpperCase()] ?? 1;
    const toUSD = EXCHANGE_RATES[toCurrency.toUpperCase()] ?? 1;
    rate = toUSD / fromUSD;
  }

  return {
    convertedAmount: Math.round(amount * rate * 100) / 100,
    exchangeRate: Math.round(rate * 10000) / 10000,
    inverseRate: Math.round((1 / rate) * 10000) / 10000,
    lastUpdated: new Date().toISOString().split('T')[0],
  };
}

export interface InflationInput {
  amount: number;
  fromYear: number;
  toYear: number;
  country?: string;
}

export interface InflationResult {
  adjustedAmount: number;
  cumulativeInflation: number;
  averageAnnualRate: number;
  purchasingPowerChange: number;
}

// US CPI historical data (year: CPI index)
const US_CPI: Record<number, number> = {
  1913: 9.9, 1920: 20.0, 1930: 16.7, 1940: 14.0, 1950: 24.1,
  1960: 29.6, 1970: 38.8, 1980: 82.4, 1990: 130.7, 2000: 172.2,
  2005: 195.3, 2010: 218.1, 2015: 237.0, 2020: 258.8, 2021: 271.0,
  2022: 292.7, 2023: 304.7, 2024: 314.2, 2025: 323.4, 2026: 332.8,
};

// Euro area HICP (Harmonised Index of Consumer Prices)
const EU_HICP: Record<number, number> = {
  2000: 80.9, 2005: 87.8, 2010: 94.3, 2015: 101.6, 2020: 107.4,
  2021: 110.3, 2022: 119.5, 2023: 126.5, 2024: 129.3, 2025: 132.1, 2026: 134.8,
};

// UK CPI
const UK_CPI: Record<number, number> = {
  2000: 75.8, 2005: 82.3, 2010: 93.5, 2015: 101.5, 2020: 110.3,
  2021: 113.1, 2022: 123.8, 2023: 131.5, 2024: 135.1, 2025: 138.0, 2026: 140.8,
};

function getCPI(year: number, country: string = 'US'): number {
  const data = country === 'EU' ? EU_HICP : country === 'UK' ? UK_CPI : US_CPI;
  const years = Object.keys(data).map(Number);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  if (year <= minYear) return data[minYear];
  if (year >= maxYear) return data[maxYear];

  const exact = data[year];
  if (exact) return exact;

  // Interpolate
  const lower = years.filter(y => y < year).sort((a, b) => b - a)[0];
  const upper = years.filter(y => y > year).sort((a, b) => a - b)[0];
  const ratio = (year - lower) / (upper - lower);
  return data[lower] + (data[upper] - data[lower]) * ratio;
}

export function calculateInflation(input: InflationInput): InflationResult {
  const { amount, fromYear, toYear, country = 'US' } = input;

  const fromCPI = getCPI(fromYear, country);
  const toCPI = getCPI(toYear, country);
  const cumulativeInflation = ((toCPI - fromCPI) / fromCPI) * 100;
  const adjustedAmount = amount * (toCPI / fromCPI);
  const years = toYear - fromYear;
  const averageAnnualRate = years > 0 ? (Math.pow(toCPI / fromCPI, 1 / years) - 1) * 100 : 0;
  const purchasingPowerChange = ((amount / adjustedAmount) - 1) * 100;

  return {
    adjustedAmount: Math.round(adjustedAmount * 100) / 100,
    cumulativeInflation: Math.round(cumulativeInflation * 100) / 100,
    averageAnnualRate: Math.round(averageAnnualRate * 100) / 100,
    purchasingPowerChange: Math.round(purchasingPowerChange * 100) / 100,
  };
}

export interface ExchangeFeeInput {
  amount: number;
  sourceCurrency: string;
  targetCurrency: string;
  providerFee?: number; // percentage
  exchangeMarkup?: number; // percentage over mid-market
  fixedFee?: number;
}

export interface ExchangeFeeResult {
  midMarketAmount: number;
  afterFees: number;
  totalFee: number;
  effectiveRate: number;
  comparedTo: { provider: string; amount: number; fee: number }[];
}

export function calculateExchangeFee(input: ExchangeFeeInput): ExchangeFeeResult {
  const { amount, sourceCurrency, targetCurrency, providerFee = 0, exchangeMarkup = 0, fixedFee = 0 } = input;

  const midRate = EXCHANGE_RATES[targetCurrency.toUpperCase()] / EXCHANGE_RATES[sourceCurrency.toUpperCase()];
  const midMarketAmount = amount * midRate;

  const adjustedRate = midRate * (1 - exchangeMarkup / 100);
  const afterFees = amount * adjustedRate * (1 - providerFee / 100) - fixedFee;
  const totalFee = midMarketAmount - afterFees;

  // Compare with common providers
  const providers = [
    { name: 'Wise', markup: 0.5, fee: 0 },
    { name: 'Bank Wire', markup: 3, fee: 15 },
    { name: 'PayPal', markup: 4, fee: 2.99 },
    { name: 'Western Union', markup: 2.5, fee: 5 },
  ];

  const comparedTo = providers.map(p => {
    const pRate = midRate * (1 - p.markup / 100);
    const pAmount = amount * pRate - p.fee;
    return {
      provider: p.name,
      amount: Math.round(pAmount * 100) / 100,
      fee: Math.round((midMarketAmount - pAmount) * 100) / 100,
    };
  });

  return {
    midMarketAmount: Math.round(midMarketAmount * 100) / 100,
    afterFees: Math.round(afterFees * 100) / 100,
    totalFee: Math.round(totalFee * 100) / 100,
    effectiveRate: Math.round(adjustedRate * 10000) / 10000,
    comparedTo,
  };
}
