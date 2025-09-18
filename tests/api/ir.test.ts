import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock the auth and AI agents
vi.mock('next-auth/next', () => ({
  unstable_getServerSession: vi.fn()
}))

vi.mock('@/lib/auth', () => ({
  runtime: "nodejs",
  handler: {},
  GET: {},
  POST: {},
  User: {},
  DEMO_USERS: [],
  validateCredentials: vi.fn(),
  setAuthToken: vi.fn(),
  getAuthToken: vi.fn(),
  clearAuthToken: vi.fn(),
  authOptions: {},
  generateToken: vi.fn(),
  getUserFromRequest: vi.fn(() => ({ id: '1', email: 'admin@company.com', name: 'Admin User', role: 'hr', companyId: '1' }))
}))

vi.mock('@/lib/ai-agents', () => ({
  agentRegistry: {
    executeTask: vi.fn(() => Promise.resolve({
      success: true,
      output: {
        predictedRiskLevel: 'HIGH',
        confidence: 0.85,
        recommendations: ['Investigate immediately']
      },
      agentId: 'dispute-predictor',
      confidence: 0.85
    }))
  },
  createTask: vi.fn(),
  createContext: vi.fn()
}))

vi.mock('@/lib/db', () => ({
  prisma: {
    iRCase: {
      create: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn()
    }
  }
}))

vi.mock('@/lib/auth', () => ({
  runtime: "nodejs",
  handler: {},
  GET: {},
  POST: {},
  User: {},
  DEMO_USERS: [],
  validateCredentials: vi.fn(),
  setAuthToken: vi.fn(),
  getAuthToken: vi.fn(),
  clearAuthToken: vi.fn(),
  authOptions: {},
  generateToken: vi.fn(),
  getUserFromRequest: vi.fn(() => ({ id: '1', email: 'admin@company.com', name: 'Admin User', role: 'hr', companyId: '1' }))
}))

describe('IR API', () => {
  let mockGetUserFromRequest: any
  let mockAgentRegistry: any
  let mockCreateTask: any
  let mockCreateContext: any
  let mockPrisma: any

  beforeEach(async () => {
    // Reset mocks
    vi.clearAllMocks()

    // Get mock references
    const auth = await import('@/lib/auth')
    mockGetUserFromRequest = auth.getUserFromRequest

    const aiAgents = await import('@/lib/ai-agents')
    mockAgentRegistry = aiAgents.agentRegistry
    mockCreateTask = aiAgents.createTask
    mockCreateContext = aiAgents.createContext

    const db = await import('@/lib/db')
    mockPrisma = db.prisma
  })

  describe('POST /api/ir', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockGetUserFromRequest.mockReturnValue(null)

      const { POST } = await import('@/app/api/ir/route')
      const request = new NextRequest('http://localhost:3000/api/ir', {
        method: 'POST',
        body: JSON.stringify({ employeeId: 1, type: 'DISPUTE', description: 'Test case' })
      })

      const response = await POST(request)
      expect(response.status).toBe(401)

      const data = await response.json()
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 400 when required fields are missing', async () => {
      mockGetUserFromRequest.mockReturnValue({
        id: '1', companyId: '1', role: 'HR'
      })

      const { POST } = await import('@/app/api/ir/route')
      const request = new NextRequest('http://localhost:3000/api/ir', {
        method: 'POST',
        body: JSON.stringify({ employeeId: 1 })
      })

      const response = await POST(request)
      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toBe('employeeId, type, and description are required')
    })

    it('should successfully create IR case with valid input', async () => {
      mockGetUserFromRequest.mockReturnValue({
        id: '1', companyId: '1', role: 'HR'
      })

      // Mock Prisma client
      mockPrisma.iRCase.create.mockResolvedValue({
        id: 1,
        caseNumber: 'IR-1234567890-ABCDEF',
        employeeId: 1,
        type: 'DISPUTE',
        status: 'OPEN',
        description: 'Employee dispute case',
        allegations: ['Unfair treatment'],
        riskLevel: 'MEDIUM',
        assignedTo: 1,
        createdAt: new Date()
      })
      mockPrisma.iRCase.update.mockResolvedValue({
        id: 1,
        riskLevel: 'HIGH'
      })

      const mockCase = {
        id: 1,
        caseNumber: 'IR-1234567890-ABCDEF',
        employeeId: 1,
        type: 'DISPUTE',
        status: 'OPEN',
        description: 'Employee dispute case',
        allegations: ['Unfair treatment'],
        riskLevel: 'MEDIUM',
        assignedTo: 1,
        createdAt: new Date()
      }

      const mockTask = { id: 'task_123', type: 'DISPUTE_PREDICT' }
      const mockContext = { userId: 1, companyId: 1 }
      const mockResponse = {
        success: true,
        taskId: 'task_123',
        agentId: 'ir',
        output: {
          predictedRiskLevel: 'HIGH',
          escalationProbability: 0.8,
          recommendedActions: ['Investigate immediately'],
          legalPrecedents: ['Case A', 'Case B']
        },
        confidence: 0.85,
        completedAt: new Date()
      }

      mockPrisma.iRCase.create.mockResolvedValue(mockCase)
      mockPrisma.iRCase.update.mockResolvedValue({ ...mockCase, riskLevel: 'HIGH' })
      mockCreateTask.mockReturnValue(mockTask)
      mockCreateContext.mockReturnValue(mockContext)
      mockAgentRegistry.executeTask.mockResolvedValue(mockResponse)

      const { POST } = await import('@/app/api/ir/route')
      const request = new NextRequest('http://localhost:3000/api/ir', {
        method: 'POST',
        body: JSON.stringify({
          employeeId: 1,
          type: 'DISPUTE',
          description: 'Employee dispute case',
          allegations: ['Unfair treatment'],
          riskLevel: 'MEDIUM'
        })
      })

      const response = await POST(request)
      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.case).toBeDefined()
      expect(data.case.caseNumber).toMatch(/^IR-\d+-[A-Z0-9]{6}$/)
      expect(data.predictions).toBeDefined()
      expect(data.agentUsed).toBe('ir')
      expect(data.confidence).toBe(0.85)
    })

    it('should handle agent execution errors', async () => {
      const mockUser = { id: '1', companyId: '1', role: 'HR' }
      mockGetUserFromRequest.mockReturnValue(mockUser)

      const mockCase = {
        id: 1,
        caseNumber: 'IR-1234567890-ABCDEF',
        employeeId: 1,
        type: 'DISPUTE',
        status: 'OPEN',
        description: 'Employee dispute case',
        allegations: [],
        riskLevel: 'LOW',
        assignedTo: null,
        createdAt: new Date()
      }

      const mockTask = { id: 'task_123', type: 'DISPUTE_PREDICT' }
      const mockContext = { userId: 1, companyId: 1 }
      const mockResponse = {
        success: false,
        taskId: 'task_123',
        error: 'Prediction failed',
        completedAt: new Date()
      }

      mockPrisma.iRCase.create.mockResolvedValue(mockCase)
      mockCreateTask.mockReturnValue(mockTask)
      mockCreateContext.mockReturnValue(mockContext)
      mockAgentRegistry.executeTask.mockResolvedValue(mockResponse)

      const { POST } = await import('@/app/api/ir/route')
      const request = new NextRequest('http://localhost:3000/api/ir', {
        method: 'POST',
        body: JSON.stringify({
          employeeId: 1,
          type: 'DISPUTE',
          description: 'Employee dispute case'
        })
      })

      const response = await POST(request)
      expect(response.status).toBe(500)

      const data = await response.json()
      expect(data.error).toBe('Prediction failed')
    })
  })

  describe('GET /api/ir', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockGetUserFromRequest.mockReturnValue(null)

      const { GET } = await import('@/app/api/ir/route')
      const request = new NextRequest('http://localhost:3000/api/ir')

      const response = await GET(request)
      expect(response.status).toBe(401)

      const data = await response.json()
      expect(data.error).toBe('Unauthorized')
    })

    it('should return IR cases with pagination', async () => {
      mockGetUserFromRequest.mockReturnValue({
        id: '1', companyId: '1', role: 'hr'
      })

      const mockCases = [
        {
          id: 1,
          caseNumber: 'IR-1234567890-ABCDEF',
          type: 'DISPUTE',
          status: 'OPEN',
          riskLevel: 'MEDIUM',
          description: 'Test case',
          createdAt: new Date(),
          employee: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            department: 'IT',
            position: 'Developer'
          },
          actions: [],
          documents: []
        }
      ]

      mockPrisma.iRCase.findMany.mockResolvedValue(mockCases)
      mockPrisma.iRCase.count.mockResolvedValue(1)

      const { GET } = await import('@/app/api/ir/route')
      const request = new NextRequest('http://localhost:3000/api/ir?limit=10&offset=0')

      const response = await GET(request)
      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data.cases).toBeDefined()
      expect(data.cases.length).toBe(1)
      expect(data.pagination).toBeDefined()
      expect(data.pagination.total).toBe(1)
      expect(data.pagination.limit).toBe(10)
      expect(data.pagination.offset).toBe(0)
    })

    it('should filter cases by status and risk level', async () => {
      mockGetUserFromRequest.mockReturnValue({
        id: '1', companyId: '1', role: 'hr'
      })

      const mockCases = [
        {
          id: 1,
          caseNumber: 'IR-1234567890-ABCDEF',
          type: 'DISPUTE',
          status: 'OPEN',
          riskLevel: 'HIGH',
          description: 'High risk case',
          createdAt: new Date(),
          employee: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            department: 'IT',
            position: 'Developer'
          },
          actions: [],
          documents: []
        }
      ]

      mockPrisma.iRCase.findMany.mockResolvedValue(mockCases)
      mockPrisma.iRCase.count.mockResolvedValue(1)

      const { GET } = await import('@/app/api/ir/route')
      const request = new NextRequest('http://localhost:3000/api/ir?status=OPEN&riskLevel=HIGH')

      const response = await GET(request)
      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data.cases).toBeDefined()
      expect(data.cases.length).toBe(1)
      expect(data.cases[0].status).toBe('OPEN')
      expect(data.cases[0].riskLevel).toBe('HIGH')
    })
  })
})
