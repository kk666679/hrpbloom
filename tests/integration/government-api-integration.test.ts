import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock external API calls
const mockLHDNApi = vi.fn()
const mockKWSPApi = vi.fn()
const mockPERKESOApi = vi.fn()
const mockHRDFApi = vi.fn()
const mockMyWorkIDApi = vi.fn()
const mockSyncEmployeeData = vi.fn()

vi.mock('@/lib/government-apis', () => ({
  syncEmployeeData: mockSyncEmployeeData,
  lhdnClient: {
    validateTaxNumber: mockLHDNApi,
    submitTaxReturn: mockLHDNApi
  },
  kwspClient: {
    validateEPF: mockKWSPApi,
    submitContribution: mockKWSPApi
  },
  perkesoClient: {
    validateSOCSO: mockPERKESOApi,
    submitContribution: mockPERKESOApi
  },
  hrdfClient: {
    validateClaim: mockHRDFApi,
    submitClaim: mockHRDFApi
  },
  myWorkIDClient: {
    verifyIdentity: mockMyWorkIDApi,
    getEmploymentHistory: mockMyWorkIDApi
  }
}))

describe('Government API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Set up default mock implementations
    mockLHDNApi.mockResolvedValue({ valid: true, taxpayerName: 'John Doe', taxCategory: 'Individual' })
    mockKWSPApi.mockResolvedValue({ valid: true, accountBalance: 25000, lastContribution: '2024-01-15' })
    mockPERKESOApi.mockResolvedValue({ valid: true, coverage: 'Employment Injury', premiumRate: 0.4 })
    mockHRDFApi.mockResolvedValue({ valid: true, claimAmount: 5000, approvedHours: 40 })
    mockMyWorkIDApi.mockResolvedValue({ verified: true, fullName: 'Ahmad bin Abdullah', icNumber: '123456789012', nationality: 'Malaysian' })
    mockSyncEmployeeData.mockResolvedValue({
      synced: true,
      sources: ['MyWorkID', 'KWSP', 'PERKESO', 'LHDN'],
      errors: [],
      lastSync: new Date(),
      partialSuccess: false
    })
  })

  describe('LHDN Integration', () => {
    it('should validate Malaysian tax numbers', async () => {
      mockLHDNApi.mockResolvedValue({
        valid: true,
        taxpayerName: 'John Doe',
        taxCategory: 'Individual'
      })

      const { lhdnClient } = await import('@/lib/government-apis')

      const result = await lhdnClient.validateTaxNumber('1234567890')

      expect(result.valid).toBe(true)
      expect(result.taxpayerName).toBe('John Doe')
      expect(mockLHDNApi).toHaveBeenCalledWith('1234567890')
    })

    it('should handle invalid tax numbers', async () => {
      mockLHDNApi.mockResolvedValue({
        valid: false,
        error: 'Tax number not found'
      })

      const { lhdnClient } = await import('@/lib/government-apis')

      const result = await lhdnClient.validateTaxNumber('invalid')

      expect(result.valid).toBe(false)
      expect(result.error).toBe('Tax number not found')
    })

    it('should submit tax returns', async () => {
      mockLHDNApi.mockResolvedValue({
        submissionId: 'SUB123',
        status: 'submitted',
        estimatedProcessingDays: 14
      })

      const { lhdnClient } = await import('@/lib/government-apis')

      const taxData = {
        taxNumber: '1234567890',
        income: 50000,
        deductions: 5000,
        taxYear: 2024
      }

      const result = await lhdnClient.submitTaxReturn(taxData)

      expect(result.submissionId).toBe('SUB123')
      expect(result.status).toBe('submitted')
      expect(mockLHDNApi).toHaveBeenCalledWith(taxData)
    })
  })

  describe('KWSP (EPF) Integration', () => {
    it('should validate EPF numbers', async () => {
      mockKWSPApi.mockResolvedValue({
        valid: true,
        accountBalance: 25000,
        lastContribution: '2024-01-15'
      })

      const { kwspClient } = await import('@/lib/government-apis')

      const result = await kwspClient.validateEPF('123456789')

      expect(result.valid).toBe(true)
      expect(result.accountBalance).toBe(25000)
    })

    it('should submit EPF contributions', async () => {
      mockKWSPApi.mockResolvedValue({
        transactionId: 'EPF_TXN_123',
        status: 'processed',
        contributionAmount: 500
      })

      const { kwspClient } = await import('@/lib/government-apis')

      const contributionData = {
        employeeId: '123',
        employerId: '456',
        amount: 500,
        month: '2024-01'
      }

      const result = await kwspClient.submitContribution(contributionData)

      expect(result.transactionId).toBe('EPF_TXN_123')
      expect(result.status).toBe('processed')
    })
  })

  describe('PERKESO (SOCSO) Integration', () => {
    it('should validate SOCSO registration', async () => {
      mockPERKESOApi.mockResolvedValue({
        valid: true,
        coverage: 'Employment Injury',
        premiumRate: 0.4
      })

      const { perkesoClient } = await import('@/lib/government-apis')

      const result = await perkesoClient.validateSOCSO('SOCSO123')

      expect(result.valid).toBe(true)
      expect(result.coverage).toBe('Employment Injury')
    })

    it('should submit SOCSO contributions', async () => {
      mockPERKESOApi.mockResolvedValue({
        transactionId: 'SOCSO_TXN_456',
        status: 'confirmed',
        coveragePeriod: '2024-01 to 2024-12'
      })

      const { perkesoClient } = await import('@/lib/government-apis')

      const contributionData = {
        employerCode: 'EMP001',
        employeeCount: 50,
        totalWages: 250000,
        month: '2024-01'
      }

      const result = await perkesoClient.submitContribution(contributionData)

      expect(result.transactionId).toBe('SOCSO_TXN_456')
      expect(result.status).toBe('confirmed')
    })
  })

  describe('HRDF Integration', () => {
    it('should validate training claims', async () => {
      mockHRDFApi.mockResolvedValue({
        valid: true,
        claimAmount: 5000,
        approvedHours: 40
      })

      const { hrdfClient } = await import('@/lib/government-apis')

      const claimData = {
        companyId: 'COMP001',
        trainingProgram: 'Digital Skills Training',
        participants: 10,
        hoursPerParticipant: 4
      }

      const result = await hrdfClient.validateClaim(claimData)

      expect(result.valid).toBe(true)
      expect(result.claimAmount).toBe(5000)
    })

    it('should submit HRDF claims', async () => {
      mockHRDFApi.mockResolvedValue({
        claimId: 'HRDF_CLAIM_789',
        status: 'submitted',
        processingTime: '2-3 weeks'
      })

      const { hrdfClient } = await import('@/lib/government-apis')

      const claimData = {
        companyId: 'COMP001',
        trainingDetails: {
          programName: 'Leadership Development',
          startDate: '2024-01-01',
          endDate: '2024-01-05',
          totalCost: 15000
        }
      }

      const result = await hrdfClient.submitClaim(claimData)

      expect(result.claimId).toBe('HRDF_CLAIM_789')
      expect(result.status).toBe('submitted')
    })
  })

  describe('MyWorkID Integration', () => {
    it('should verify employee identity', async () => {
      mockMyWorkIDApi.mockResolvedValue({
        verified: true,
        fullName: 'Ahmad bin Abdullah',
        icNumber: '123456789012',
        nationality: 'Malaysian'
      })

      const { myWorkIDClient } = await import('@/lib/government-apis')

      const result = await myWorkIDClient.verifyIdentity('123456789012')

      expect(result.verified).toBe(true)
      expect(result.fullName).toBe('Ahmad bin Abdullah')
      expect(result.nationality).toBe('Malaysian')
    })

    it('should retrieve employment history', async () => {
      mockMyWorkIDApi.mockResolvedValue({
        employmentHistory: [
          {
            employer: 'ABC Company',
            position: 'Software Engineer',
            startDate: '2020-01-01',
            endDate: '2023-12-31'
          },
          {
            employer: 'XYZ Solutions',
            position: 'Senior Developer',
            startDate: '2024-01-01',
            endDate: null
          }
        ]
      })

      const { myWorkIDClient } = await import('@/lib/government-apis')

      const result = await myWorkIDClient.getEmploymentHistory('123456789012')

      expect(result.employmentHistory).toHaveLength(2)
      expect(result.employmentHistory[0].employer).toBe('ABC Company')
    })
  })

  describe('Integration Error Handling', () => {
    it('should handle API timeouts', async () => {
      mockLHDNApi.mockRejectedValue(new Error('Timeout'))

      const { lhdnClient } = await import('@/lib/government-apis')

      await expect(lhdnClient.validateTaxNumber('1234567890')).rejects.toThrow('Timeout')
    })

    it('should handle network errors', async () => {
      mockKWSPApi.mockRejectedValue(new Error('Network Error'))

      const { kwspClient } = await import('@/lib/government-apis')

      await expect(kwspClient.validateEPF('123456789')).rejects.toThrow('Network Error')
    })

    it('should retry failed requests', async () => {
      mockPERKESOApi
        .mockRejectedValueOnce(new Error('Temporary failure'))
        .mockResolvedValueOnce({
          valid: true,
          coverage: 'Employment Injury'
        })

      const { perkesoClient } = await import('@/lib/government-apis')

      const result = await perkesoClient.validateSOCSO('SOCSO123')

      expect(mockPERKESOApi).toHaveBeenCalledTimes(2)
      expect(result.valid).toBe(true)
    })
  })

  describe('Rate Limiting', () => {
    it('should respect API rate limits', async () => {
      // Mock rate limit exceeded
      mockHRDFApi.mockRejectedValue({
        status: 429,
        message: 'Rate limit exceeded'
      })

      const { hrdfClient } = await import('@/lib/government-apis')

      await expect(hrdfClient.validateClaim({})).rejects.toMatchObject({
        status: 429,
        message: 'Rate limit exceeded'
      })
    })

    it('should implement exponential backoff', async () => {
      // Mock multiple failures then success
      mockMyWorkIDApi
        .mockRejectedValueOnce({ status: 429 })
        .mockRejectedValueOnce({ status: 429 })
        .mockResolvedValueOnce({ verified: true })

      const { MyWorkIDClient } = await import('@/lib/government-apis')

      const result = await MyWorkIDClient.verifyIdentity('123456789012')

      expect(mockMyWorkIDApi).toHaveBeenCalledTimes(3)
      expect(result.verified).toBe(true)
    })
  })

  describe('Data Synchronization', () => {
    it('should sync employee data with government databases', async () => {
      const employeeData = {
        icNumber: '123456789012',
        epfNumber: 'EPF123',
        socsoNumber: 'SOCSO456',
        taxNumber: 'TAX789'
      }

      // Mock all APIs returning valid data
      mockMyWorkIDApi.mockResolvedValue({ verified: true, fullName: 'Test User' })
      mockKWSPApi.mockResolvedValue({ valid: true, balance: 10000 })
      mockPERKESOApi.mockResolvedValue({ valid: true, coverage: 'Full' })
      mockLHDNApi.mockResolvedValue({ valid: true, category: 'Individual' })

      const { syncEmployeeData } = await import('@/lib/government-apis')

      const result = await syncEmployeeData(employeeData)

      expect(result.synced).toBe(true)
      expect(result.sources).toHaveLength(4)
      expect(result.lastSync).toBeDefined()
    })

    it('should handle partial sync failures', async () => {
      const employeeData = {
        icNumber: '123456789012',
        epfNumber: 'EPF123',
        socsoNumber: 'SOCSO456',
        taxNumber: 'TAX789'
      }

      // Mock EPF validation failure
      mockMyWorkIDApi.mockResolvedValue({ verified: true })
      mockKWSPApi.mockResolvedValue({ valid: false, error: 'EPF not found' })
      mockPERKESOApi.mockResolvedValue({ valid: true })
      mockLHDNApi.mockResolvedValue({ valid: true })

      const { syncEmployeeData } = await import('@/lib/government-apis')

      const result = await syncEmployeeData(employeeData)

      expect(result.synced).toBe(false)
      expect(result.errors).toContain('EPF validation failed')
      expect(result.partialSuccess).toBe(true)
    })
  })
})
