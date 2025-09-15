// Malaysian statutory rates and calculations for 2024
export const MALAYSIA_EPF_EMPLOYEE_RATE = 11 // 11% employee contribution
export const MALAYSIA_EPF_EMPLOYER_RATE = 12 // 12% employer contribution
export const MALAYSIA_SOCSO_EMPLOYEE_RATE = 0.5 // 0.5% employee contribution
export const MALAYSIA_SOCSO_EMPLOYER_RATE = 1.75 // 1.75% employer contribution

interface PayrollCalculation {
  basicSalary: number
  allowances: number
  deductions: number
}

interface PayrollResult {
  grossSalary: number
  epfEmployee: number
  epfEmployer: number
  socsoEmployee: number
  socsoEmployer: number
  taxAmount: number
  netSalary: number
}

export function calculateMalaysianPayroll(input: PayrollCalculation): PayrollResult {
  const { basicSalary, allowances, deductions } = input

  // Calculate gross salary
  const grossSalary = basicSalary + allowances

  // Calculate EPF contributions
  const epfEmployee = Math.min(grossSalary * (MALAYSIA_EPF_EMPLOYEE_RATE / 100), 693) // Max RM693
  const epfEmployer = Math.min(grossSalary * (MALAYSIA_EPF_EMPLOYER_RATE / 100), 756) // Max RM756

  // Calculate SOCSO contributions (capped at RM4,000 salary)
  const socsoSalary = Math.min(grossSalary, 4000)
  const socsoEmployee = socsoSalary * (MALAYSIA_SOCSO_EMPLOYEE_RATE / 100)
  const socsoEmployer = socsoSalary * (MALAYSIA_SOCSO_EMPLOYER_RATE / 100)

  // Calculate taxable income
  const taxableIncome = grossSalary - epfEmployee - socsoEmployee - deductions

  // Calculate tax (simplified progressive tax)
  const taxAmount = calculateMalaysianTax(taxableIncome * 12) / 12 // Monthly tax

  // Calculate net salary
  const netSalary = grossSalary - epfEmployee - socsoEmployee - taxAmount - deductions

  return {
    grossSalary,
    epfEmployee,
    epfEmployer,
    socsoEmployee,
    socsoEmployer,
    taxAmount,
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
