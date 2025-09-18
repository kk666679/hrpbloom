import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock the auth and AI agents
vi.mock('next-auth', () => ({
  getServerSession: vi.fn()
}))

vi.mock('@/lib/auth', () => ({
  authOptions: {}
}))

vi.mock('@/lib/ai-agents', () => ({
  agentRegistry: {
    executeTask: vi.fn()
  },
  createTask: vi.fn(),
  createContext: vi.fn()
}))

describe('Compliance Calculate API', () => {
  let mockGetServerSession: any
  let mockAgentRegistry: any
  let mockCreateTask: any
  let mockCreateContext: any

  beforeEach(async () => {
    // Reset mocks
    vi.clearAllMocks()

    // Get mock references
    const nextAuth = await import('next-auth')
    mockGetServerSession = nextAuth.getServerSession

    const aiAgents = await import('@/lib/ai-agents')
    mockAgentRegistry = aiAgents.agentRegistry
    mockCreateTask = aiAgents.createTask
    mockCreateContext = aiAgents.createContext
  })

  it('should export POST and GET handlers', async () => {
    expect(async () => {
      const { POST, GET } = await import('@/app/api/compliance/calculate/route')
      expect(typeof POST).toBe('function')
      expect(typeof GET).toBe('function')
    }).not.toThrow()
  })

  describe('POST /api/compliance/calculate', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const { POST } = await import('@/app/api/compliance/calculate/route')
      const request = new NextRequest('http://localhost:3000/api/compliance/calculate', {
        method: 'POST',
        body: JSON.stringify({ basicSalary: 3000 })
      })

      const response = await POST(request)
      expect(response.status).toBe(401)

      const data = await response.json()
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 400 when basicSalary is missing', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', companyId: '1', role: 'EMPLOYEE' }
      })

      const { POST } = await import('@/app/api/compliance/calculate/route')
      const request = new NextRequest('http://localhost:3000/api/compliance/calculate', {
        method: 'POST',
        body: JSON.stringify({})
      })

      const response = await POST(request)
      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toBe('Valid basicSalary is required')
    })

    it('should return 400 when basicSalary is invalid', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', companyId: '1', role: 'EMPLOYEE' }
      })

      const { POST } = await import('@/app/api/compliance/calculate/route')
      const request = new NextRequest('http://localhost:3000/api/compliance/calculate', {
        method: 'POST',
        body: JSON.stringify({ basicSalary: -100 })
      })

      const response = await POST(request)
      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toBe('Valid basicSalary is required')
    })

    it('should successfully calculate payroll with valid input', async () => {
      const mockSession = {
        user: { id: '1', companyId: '1', role: 'EMPLOYEE' }
      }
      mockGetServerSession.mockResolvedValue(mockSession)

      const mockTask = { id: 'task_123', type: 'PAYROLL_VALIDATE' }
      const mockContext = { userId: 1, companyId: 1 }
      const mockResponse = {
        success: true,
        taskId: 'task_123',
        agentId: 'compliance',
        output: {
          payroll: {
            grossSalary: 3500,
            epfEmployee: 429,
            epfEmployer: 514.5,
            socsoEmployee: 10.5,
            socsoEmployer: 36.75,
            eisAmount: 7,
            tabungHajiAmount: 0,
            taxAmount: 25,
            zakatAmount: 0,
            netSalary: 3027.5
          },
          validations: [],
          compliant: true
        },
        confidence: 0.95,
        completedAt: new Date()
      }

      mockCreateTask.mockReturnValue(mockTask)
      mockCreateContext.mockReturnValue(mockContext)
      mockAgentRegistry.executeTask.mockResolvedValue(mockResponse)

      const { POST } = await import('@/app/api/compliance/calculate/route')
      const request = new NextRequest('http://localhost:3000/api/compliance/calculate', {
        method: 'POST',
        body: JSON.stringify({
          basicSalary: 3000,
          allowances: 500,
          deductions: 100,
          tabungHajiOptIn: false,
          state: 'Selangor'
        })
      })

      const response = await POST(request)
      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data).toBeDefined()
      expect(data.processingTime).toBeDefined()
      expect(data.agentUsed).toBe('compliance')
      expect(data.confidence).toBe(0.95)
    })

    it('should handle agent execution errors', async () => {
      const mockSession = {
        user: { id: '1', companyId: '1', role: 'EMPLOYEE' }
      }
      mockGetServerSession.mockResolvedValue(mockSession)

      const mockTask = { id: 'task_123', type: 'PAYROLL_VALIDATE' }
      const mockContext = { userId: 1, companyId: 1 }
      const mockResponse = {
        success: false,
        taskId: 'task_123',
        error: 'Calculation failed',
        completedAt: new Date()
      }

      mockCreateTask.mockReturnValue(mockTask)
      mockCreateContext.mockReturnValue(mockContext)
      mockAgentRegistry.executeTask.mockResolvedValue(mockResponse)

      const { POST } = await import('@/app/api/compliance/calculate/route')
      const request = new NextRequest('http://localhost:3000/api/compliance/calculate', {
        method: 'POST',
        body: JSON.stringify({ basicSalary: 3000 })
      })

      const response = await POST(request)
      expect(response.status).toBe(500)

      const data = await response.json()
      expect(data.error).toBe('Calculation failed')
    })

    it('should handle unexpected errors', async () => {
      mockGetServerSession.mockRejectedValue(new Error('Database connection failed'))

      const { POST } = await import('@/app/api/compliance/calculate/route')
      const request = new NextRequest('http://localhost:3000/api/compliance/calculate', {
        method: 'POST',
        body: JSON.stringify({ basicSalary: 3000 })
      })

      const response = await POST(request)
      expect(response.status).toBe(500)

      const data = await response.json()
      expect(data.error).toBe('Internal server error')
    })
  })

  describe('GET /api/compliance/calculate', () => {
    it('should return API documentation when authenticated', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', companyId: '1', role: 'EMPLOYEE' }
      })

      const { GET } = await import('@/app/api/compliance/calculate/route')
      const request = new NextRequest('http://localhost:3000/api/compliance/calculate')

      const response = await GET(request)
      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data.description).toBe('Malaysian Payroll Compliance Calculator')
      expect(data.endpoint).toBe('/api/compliance/calculate')
      expect(data.method).toBe('POST')
      expect(data.requiredFields).toBeDefined()
      expect(data.optionalFields).toBeDefined()
      expect(data.responseFormat).toBeDefined()
      expect(data.exampleRequest).toBeDefined()
    })

    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const { GET } = await import('@/app/api/compliance/calculate/route')
      const request = new NextRequest('http://localhost:3000/api/compliance/calculate')

      const response = await GET(request)
      expect(response.status).toBe(401)

      const data = await response.json()
      expect(data.error).toBe('Unauthorized')
    })
  })
})
