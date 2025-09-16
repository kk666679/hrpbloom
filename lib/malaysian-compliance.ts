// Malaysian statutory rates and calculations for 2024
export const MALAYSIA_EPF_EMPLOYEE_RATE = 11 // 11% employee contribution
export const MALAYSIA_EPF_EMPLOYER_RATE = 13 // 13% employer contribution (updated 2024)
export const MALAYSIA_SOCSO_EMPLOYEE_RATE = 0.5 // 0.5% employee contribution
export const MALAYSIA_SOCSO_EMPLOYER_RATE = 1.75 // 1.75% employer contribution
export const MALAYSIA_EIS_RATE = 0.2 // 0.2% Employment Insurance System
export const MALAYSIA_TABUNG_HAJI_RATE = 0.5 // 0.5% Tabung Haji contribution (optional)

interface PayrollCalculation {
  basicSalary: number
  allowances: number
  deductions: number
  tabungHajiOptIn?: boolean // Optional Tabung Haji contribution
  state?: string // For Zakat calculations
}

interface PayrollResult {
  grossSalary: number
  epfEmployee: number
  epfEmployer: number
  socsoEmployee: number
  socsoEmployer: number
  eisAmount: number // Employment Insurance System
  tabungHajiAmount: number // Optional Tabung Haji
  taxAmount: number
  zakatAmount: number // Zakat calculation
  netSalary: number
}

export function calculateMalaysianPayroll(input: PayrollCalculation): PayrollResult {
  const { basicSalary, allowances, deductions, tabungHajiOptIn = false, state } = input

  // Calculate gross salary
  const grossSalary = basicSalary + allowances

  // Calculate EPF contributions
  const epfEmployee = Math.min(grossSalary * (MALAYSIA_EPF_EMPLOYEE_RATE / 100), 693) // Max RM693
  const epfEmployer = Math.min(grossSalary * (MALAYSIA_EPF_EMPLOYER_RATE / 100), 832) // Max RM832 (updated 2024)

  // Calculate SOCSO contributions (capped at RM4,000 salary)
  const socsoSalary = Math.min(grossSalary, 4000)
  const socsoEmployee = socsoSalary * (MALAYSIA_SOCSO_EMPLOYEE_RATE / 100)
  const socsoEmployer = socsoSalary * (MALAYSIA_SOCSO_EMPLOYER_RATE / 100)

  // Calculate EIS (Employment Insurance System) - capped at RM4,000
  const eisAmount = socsoSalary * (MALAYSIA_EIS_RATE / 100)

  // Calculate Tabung Haji (optional)
  const tabungHajiAmount = tabungHajiOptIn ? grossSalary * (MALAYSIA_TABUNG_HAJI_RATE / 100) : 0

  // Calculate Zakat (annual basis, monthly estimate)
  const annualGross = grossSalary * 12
  const zakatAmount = calculateMalaysianZakat(annualGross, state) / 12

  // Calculate taxable income (includes all deductions)
  const taxableIncome = grossSalary - epfEmployee - socsoEmployee - eisAmount - deductions

  // Calculate tax (simplified progressive tax)
  const taxAmount = calculateMalaysianTax(taxableIncome * 12) / 12 // Monthly tax

  // Calculate net salary
  const netSalary = grossSalary - epfEmployee - socsoEmployee - eisAmount - tabungHajiAmount - taxAmount - zakatAmount - deductions

  return {
    grossSalary,
    epfEmployee,
    epfEmployer,
    socsoEmployee,
    socsoEmployer,
    eisAmount,
    tabungHajiAmount,
    taxAmount,
    zakatAmount,
    netSalary,
  }
}

// Malaysian personal income tax calculation (2024 rates)
export function calculateMalaysianTax(annualIncome: number): number {
  if (annualIncome <= 5000) return 0
  if (annualIncome <= 20000) return (annualIncome - 5000) * 0.01
  if (annualIncome <= 35000) return 150 + (annualIncome - 20000) * 0.03
  if (annualIncome <= 50000) return 600 + (annualIncome - 35000) * 0.06
  if (annualIncome <= 70000) return 1500 + (annualIncome - 50000) * 0.11
  if (annualIncome <= 100000) return 3700 + (annualIncome - 70000) * 0.19
  if (annualIncome <= 400000) return 9400 + (annualIncome - 100000) * 0.25
  if (annualIncome <= 600000) return 84400 + (annualIncome - 400000) * 0.26
  if (annualIncome <= 2000000) return 136400 + (annualIncome - 600000) * 0.28

  return 136400 + (2000000 - 600000) * 0.28 + (annualIncome - 2000000) * 0.3
}

// Simplified Zakat calculation for Malaysian states
export function calculateMalaysianZakat(annualIncome: number, state?: string): number {
  // Basic nisab threshold (minimum amount to pay zakat)
  const nisab = 5200 // RM equivalent of 85g gold approx

  if (annualIncome < nisab) return 0

  // Zakat rate varies by state, default 2.5%
  const zakatRate = state === "Selangor" ? 0.025 : 0.025

  return annualIncome * zakatRate
}
