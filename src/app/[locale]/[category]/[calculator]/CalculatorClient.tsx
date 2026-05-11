'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import type { CalculatorMeta } from '@/data/calculators';
import CalculatorLayout from '@/components/calculators/CalculatorLayout';
import ResultCard, { ResultGrid } from '@/components/calculators/ResultCard';
import Chart from '@/components/calculators/Chart';
import AmortizationTable from '@/components/calculators/AmortizationTable';
import AffiliateLinks from '@/components/ads/AffiliateLinks';
import { formatCurrency, formatNumber, formatPercent, formatDate } from '@/lib/utils';
import {
  calculateMortgage,
  calculateRefinance,
  calculateAffordability,
  calculateRentVsBuy,
  calculateCompoundInterest,
  calculateRetirement,
  calculateCAGR,
  calculateDCA,
  calculateFIRE,
  calculateDRIP,
  calculateLoan,
  calculateAutoLoan,
  calculateStudentLoan,
  calculateDebtPayoff,
  calculateCreditCardPayoff,
  calculateBalanceTransfer,
  compareCardRewards,
  calculateSavingsGoal,
  calculateEmergencyFund,
  calculateCD,
  calculateCollege529,
  calculateUSTax,
  calculateCapitalGains,
  calculateVAT,
  calculateROI,
  calculateRentalProperty,
  calculateBreakEven,
  calculateNPV,
  calculateCashFlow,
  calculateTVM,
  convertCurrency,
  calculateInflation,
  calculateExchangeFee,
} from '@/lib/finance';

interface Props {
  calculator: CalculatorMeta;
  locale: string;
}

export default function CalculatorClient({ calculator, locale }: Props) {
  const t = useTranslations();
  const tl = useTranslations('layout');

  const [values, setValues] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    for (const input of calculator.inputs) {
      defaults[input.name] = String(input.defaultValue ?? '');
    }
    return defaults;
  });
  const [results, setResults] = useState<Record<string, unknown> | null>(null);

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleCalculate = useCallback(() => {
    const numericValues: Record<string, number> = {};
    for (const [key, val] of Object.entries(values)) {
      numericValues[key] = parseFloat(val) || 0;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: Record<string, any> = {};

    try {
      switch (calculator.slug) {
        case 'mortgage-payment':
          result = calculateMortgage({
            homePrice: numericValues.homePrice,
            downPayment: numericValues.downPayment,
            interestRate: numericValues.interestRate,
            loanTerm: numericValues.loanTerm,
            propertyTax: numericValues.propertyTax,
            homeInsurance: numericValues.homeInsurance,
            hoa: numericValues.hoa,
          });
          break;
        case 'mortgage-amortization':
          result = calculateMortgage({
            homePrice: numericValues.homePrice,
            downPayment: numericValues.downPayment,
            interestRate: numericValues.interestRate,
            loanTerm: numericValues.loanTerm,
            extraPayment: numericValues.extraPayment,
          });
          break;
        case 'refinance':
          result = calculateRefinance({
            currentBalance: numericValues.currentBalance,
            currentRate: numericValues.currentRate,
            currentTermRemaining: numericValues.currentTermRemaining,
            newRate: numericValues.newRate,
            newTerm: numericValues.newTerm,
            closingCosts: numericValues.closingCosts,
          });
          break;
        case 'home-affordability':
          result = calculateAffordability({
            annualIncome: numericValues.annualIncome,
            monthlyDebts: numericValues.monthlyDebts,
            downPayment: numericValues.downPayment,
            interestRate: numericValues.interestRate,
            loanTerm: numericValues.loanTerm,
          });
          break;
        case 'rent-vs-buy':
          result = calculateRentVsBuy({
            homePrice: numericValues.homePrice,
            downPayment: numericValues.downPayment,
            interestRate: numericValues.interestRate,
            loanTerm: numericValues.loanTerm,
            monthlyRent: numericValues.monthlyRent,
            rentIncreaseRate: 3,
            homeAppreciationRate: 4,
            propertyTaxRate: 1.2,
            homeInsurance: 1200,
            maintenanceRate: 1,
            yearsToStay: numericValues.yearsToStay,
            closingCostsBuy: 3,
            closingCostsSell: 6,
            investmentReturnRate: 7,
          });
          break;
        case 'compound-interest':
          result = calculateCompoundInterest({
            principal: numericValues.principal,
            monthlyContribution: numericValues.monthlyContribution,
            annualRate: numericValues.annualRate,
            years: numericValues.years,
          });
          break;
        case 'retirement':
          result = calculateRetirement({
            currentAge: numericValues.currentAge,
            retirementAge: numericValues.retirementAge,
            currentSavings: numericValues.currentSavings,
            monthlyContribution: numericValues.monthlyContribution,
            annualReturn: numericValues.annualReturn,
            annualSalary: numericValues.annualSalary,
            employerMatch: numericValues.employerMatch,
          });
          break;
        case 'cagr':
          result = calculateCAGR({
            initialValue: numericValues.initialValue,
            finalValue: numericValues.finalValue,
            years: numericValues.years,
          });
          break;
        case 'dca':
          result = calculateDCA({
            investmentPerPeriod: numericValues.investmentPerPeriod,
            periods: numericValues.periods_months,
            annualReturn: numericValues.annualReturn,
          });
          break;
        case 'fire':
          result = calculateFIRE({
            currentAnnualExpenses: numericValues.currentAnnualExpenses,
            currentSavings: numericValues.currentSavings,
            annualIncome: numericValues.annualIncome,
            savingsRate: numericValues.savingsRate,
            annualReturn: numericValues.annualReturn,
          });
          break;
        case 'drip':
          result = calculateDRIP({
            initialInvestment: numericValues.initialInvestment,
            sharePrice: numericValues.sharePrice,
            annualDividendYield: numericValues.annualDividendYield,
            dividendGrowthRate: 5,
            sharePriceGrowth: numericValues.sharePriceGrowth,
            years: numericValues.years,
          });
          break;
        case 'auto-loan':
          result = calculateAutoLoan({
            carPrice: numericValues.carPrice,
            downPayment: numericValues.downPayment,
            tradeInValue: numericValues.tradeInValue,
            interestRate: numericValues.interestRate,
            term: numericValues.term,
            salesTaxRate: numericValues.salesTaxRate,
          });
          break;
        case 'personal-loan':
          result = calculateLoan({
            amount: numericValues.amount,
            interestRate: numericValues.interestRate,
            term: numericValues.term,
            fees: numericValues.fees,
          });
          break;
        case 'student-loan':
          result = calculateStudentLoan({
            balance: numericValues.balance,
            interestRate: numericValues.interestRate,
            term: numericValues.term,
            annualIncome: numericValues.annualIncome,
            familySize: numericValues.familySize,
          });
          break;
        case 'debt-payoff':
          result = calculateDebtPayoff({
            debts: [
              { name: 'Card A', balance: 5000, interestRate: 24, minimumPayment: 125 },
              { name: 'Card B', balance: 3000, interestRate: 18, minimumPayment: 75 },
              { name: 'Loan', balance: 10000, interestRate: 8, minimumPayment: 200 },
            ],
            extraPayment: numericValues.extraPayment || numericValues.extra_monthly_payment,
            strategy: (values.strategy as 'avalanche' | 'snowball') || 'avalanche',
          });
          break;
        case 'apr':
          result = calculateLoan({
            amount: numericValues.amount,
            interestRate: numericValues.interestRate,
            term: numericValues.term,
            fees: numericValues.fees,
          });
          break;
        case 'credit-card-payoff':
          result = calculateCreditCardPayoff({
            balance: numericValues.balance,
            annualRate: numericValues.annualRate,
            monthlyPayment: numericValues.monthlyPayment,
          });
          break;
        case 'balance-transfer':
          result = calculateBalanceTransfer({
            balance: numericValues.balance,
            currentRate: numericValues.currentRate,
            monthlyPayment: numericValues.monthlyPayment,
            transferRate: numericValues.transferRate,
            transferFee: numericValues.transferFee,
            promoPeriod: numericValues.promoPeriod,
            postPromoRate: numericValues.postPromoRate,
          });
          break;
        case 'savings-goal':
          result = calculateSavingsGoal({
            targetAmount: numericValues.targetAmount,
            currentSavings: numericValues.currentSavings,
            monthlyContribution: numericValues.monthlyContribution,
            annualInterestRate: numericValues.annualInterestRate,
          });
          break;
        case 'emergency-fund':
          result = calculateEmergencyFund({
            monthlyExpenses: numericValues.monthlyExpenses,
            currentSavings: numericValues.currentSavings,
            monthlyContribution: numericValues.monthlyContribution,
          });
          break;
        case 'cd-calculator':
          result = calculateCD({
            depositAmount: numericValues.depositAmount,
            annualInterestRate: numericValues.annualInterestRate,
            termMonths: numericValues.termMonths,
          });
          break;
        case 'college-529':
          result = calculateCollege529({
            childAge: numericValues.childAge,
            collegeStartAge: numericValues.collegeStartAge,
            currentSavings: numericValues.currentSavings,
            monthlyContribution: numericValues.monthlyContribution,
            annualReturn: numericValues.annualReturn,
            annualCollegeCost: numericValues.annualCollegeCost,
          });
          break;
        case 'us-tax':
          result = calculateUSTax({
            income: numericValues.income,
            filingStatus: (values.filingStatus as 'single' | 'married_joint' | 'head_household') || 'single',
            preTaxDeductions: numericValues.preTaxDeductions,
            state: values.state,
          });
          break;
        case 'capital-gains':
          result = calculateCapitalGains({
            purchasePrice: numericValues.purchasePrice,
            salePrice: numericValues.salePrice,
            holdingPeriod: numericValues.holdingPeriod,
            taxableIncome: numericValues.taxableIncome,
            filingStatus: (values.filingStatus as 'single' | 'married_joint') || 'single',
          });
          break;
        case 'vat':
          result = calculateVAT(
            numericValues.amount,
            values.country || 'DE',
            values.includeVAT !== 'false'
          );
          break;
        case 'roi':
          result = calculateROI({
            initialInvestment: numericValues.initialInvestment,
            annualReturn: numericValues.annualReturn || numericValues.annual_return_amount,
            years: numericValues.years,
            annualCosts: numericValues.annualCosts,
          });
          break;
        case 'rental-property':
          result = calculateRentalProperty({
            purchasePrice: numericValues.purchasePrice,
            downPayment: numericValues.downPayment,
            interestRate: numericValues.interestRate,
            loanTerm: numericValues.loanTerm,
            monthlyRent: numericValues.monthlyRent,
            propertyTax: numericValues.propertyTax,
            insurance: numericValues.insurance,
            maintenance: numericValues.maintenance,
          });
          break;
        case 'break-even':
          result = calculateBreakEven({
            fixedCosts: numericValues.fixedCosts,
            variableCostPerUnit: numericValues.variableCostPerUnit,
            pricePerUnit: numericValues.pricePerUnit,
          });
          break;
        case 'npv':
          result = calculateNPV({
            initialInvestment: numericValues.initialInvestment,
            cashFlows: [30000, 35000, 40000, 45000, 50000],
            discountRate: numericValues.discountRate,
          });
          break;
        case 'currency-converter':
          result = convertCurrency({
            amount: numericValues.amount,
            fromCurrency: values.fromCurrency || 'USD',
            toCurrency: values.toCurrency || 'EUR',
          });
          break;
        case 'inflation':
          result = calculateInflation({
            amount: numericValues.amount,
            fromYear: numericValues.fromYear,
            toYear: numericValues.toYear,
            country: values.country || 'US',
          });
          break;
        case 'exchange-fee':
          result = calculateExchangeFee({
            amount: numericValues.amount,
            sourceCurrency: values.sourceCurrency || 'USD',
            targetCurrency: values.targetCurrency || 'EUR',
            providerFee: numericValues.providerFee,
            exchangeMarkup: numericValues.exchangeMarkup,
          });
          break;
        default:
          result = { error: 'Calculator not implemented' };
      }
    } catch (err) {
      result = { error: String(err) };
    }

    setResults(result);
  }, [values, calculator.slug]);

  const formatValue = (key: string, value: unknown): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'number') {
      if (key.toLowerCase().includes('date') || key.toLowerCase().includes('months') || key.toLowerCase().includes('year') || key.toLowerCase().includes('age') || key === 'payoffOrder') {
        return String(value);
      }
      if (key.toLowerCase().includes('rate') || key.toLowerCase().includes('percent') || key.toLowerCase().includes('progress') || key.toLowerCase().includes('yield') || key === 'cagr' || key === 'roi') {
        return formatPercent(value, locale);
      }
      if (key.toLowerCase().includes('price') || key.toLowerCase().includes('payment') || key.toLowerCase().includes('cost') || key.toLowerCase().includes('amount') || key.toLowerCase().includes('value') || key.toLowerCase().includes('income') || key.toLowerCase().includes('tax') || key.toLowerCase().includes('balance') || key.toLowerCase().includes('cashflow') || key.toLowerCase().includes('revenue') || key.toLowerCase().includes('profit') || key.toLowerCase().includes('fee') || key.toLowerCase().includes('savings') || key.toLowerCase().includes('fund') || key.toLowerCase().includes('gap')) {
        return formatCurrency(value, locale, 'USD');
      }
      return formatNumber(value, locale);
    }
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value instanceof Date) return formatDate(value, locale);
    return String(value);
  };

  const inputFields = useMemo(() => (
    <div className="space-y-4">
      {calculator.inputs.map((input) => (
        <div key={input.name}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t(input.labelKey as Parameters<typeof t>[0])}
          </label>
          {input.type === 'select' && input.options ? (
            <select
              value={values[input.name]}
              onChange={(e) => handleChange(input.name, e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-900"
            >
              {input.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(opt.labelKey as Parameters<typeof t>[0])}
                </option>
              ))}
            </select>
          ) : (
            <div className="relative">
              {input.type === 'percent' && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
              )}
              <input
                type="number"
                value={values[input.name]}
                onChange={(e) => handleChange(input.name, e.target.value)}
                className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-900 ${input.type === 'percent' ? 'pr-10' : ''}`}
              />
            </div>
          )}
        </div>
      ))}
      <button
        onClick={handleCalculate}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
      >
        {tl('calculate')}
      </button>
    </div>
  ), [calculator.inputs, values, handleCalculate, t, tl]);

  const chartData = useMemo(() => {
    if (!results) return null;
    const schedule = results.schedule as { month: number; balance: number; principal?: number; interest?: number }[] | undefined;
    if (schedule && schedule.length > 0) {
      return {
        data: schedule.filter((r) => r.month % 12 === 0 || r.month === schedule.length).map((r) => ({
          month: r.month,
          balance: Math.round(r.balance),
          principal: Math.round(r.principal || 0),
          interest: Math.round(r.interest || 0),
        })),
        lines: [
          { key: 'balance', color: '#3B82F6', name: 'Balance' },
          { key: 'principal', color: '#10B981', name: 'Principal Paid' },
          { key: 'interest', color: '#EF4444', name: 'Interest' },
        ],
      };
    }
    const yearlyBreakdown = results.yearlyBreakdown as { year: number; balance: number; contributions?: number }[] | undefined;
    if (yearlyBreakdown) {
      return {
        data: yearlyBreakdown.map((y) => ({
          year: y.year,
          balance: Math.round(y.balance),
          contributions: Math.round(y.contributions || 0),
        })),
        lines: [
          { key: 'balance', color: '#3B82F6', name: 'Balance' },
        ],
      };
    }
    return null;
  }, [results]);

  const scheduleData = useMemo(() => {
    if (!results) return null;
    return results.schedule as { month: number; payment: number; principal: number; interest: number; balance: number; extraPayment?: number }[] | undefined;
  }, [results]);

  const resultCards = useMemo(() => {
    if (!results) return null;
    if (results.error) {
      return <p className="text-red-500">{String(results.error)}</p>;
    }
    return (
      <ResultGrid>
        {calculator.results.map((res) => (
          <ResultCard
            key={res.key}
            label={t(res.labelKey as Parameters<typeof t>[0])}
            value={formatValue(res.key, (results as Record<string, unknown>)[res.key])}
            highlight={res.key === 'monthlyPayment' || res.key === 'finalValue' || res.key === 'recommendation' || res.key === 'fireNumber'}
          />
        ))}
      </ResultGrid>
    );
  }, [results, calculator.results, t]);

  const chartElement = useMemo(() => {
    if (!chartData) return null;
    const firstItem = chartData.data[0] as Record<string, unknown>;
    return <Chart data={chartData.data} xKey={firstItem && 'month' in firstItem ? 'month' : 'year'} lines={chartData.lines} />;
  }, [chartData]);

  const scheduleElement = useMemo(() => {
    if (!scheduleData || scheduleData.length === 0) return null;
    return <AmortizationTable data={scheduleData} locale={locale} />;
  }, [scheduleData, locale]);

  return (
    <CalculatorLayout
      title={t(calculator.nameKey as Parameters<typeof t>[0])}
      description={t(calculator.descriptionKey as Parameters<typeof t>[0])}
      inputs={inputFields}
      results={resultCards}
      chart={chartElement}
      schedule={scheduleElement}
      affiliateContent={<AffiliateLinks calculatorSlug={calculator.slug} />}
    />
  );
}
