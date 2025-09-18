// Government API Integration Clients
// This module provides integration with Malaysian government APIs for HR compliance

export interface ValidationResult {
  valid: boolean;
  error?: string;
  [key: string]: any;
}

export interface SubmissionResult {
  success: boolean;
  transactionId?: string;
  submissionId?: string;
  status: string;
  error?: string;
  [key: string]: any;
}

export interface SyncResult {
  synced: boolean;
  sources: string[];
  errors: string[];
  lastSync: Date;
  partialSuccess: boolean;
}

// LHDN (Inland Revenue Board) Client
export class LHDNClient {
  private baseUrl = 'https://api.lhdn.gov.my'; // Placeholder URL

  async validateTaxNumber(taxNumber: string): Promise<ValidationResult> {
    try {
      // Mock implementation - replace with actual API call
      if (taxNumber.length !== 10 || taxNumber === 'invalid') {
        return { valid: false, error: 'Invalid tax number format' };
      }

      // Simulate API call
      return {
        valid: true,
        taxpayerName: 'John Doe',
        taxCategory: 'Individual'
      };
    } catch (error) {
      return { valid: false, error: 'API call failed' };
    }
  }

  async submitTaxReturn(taxData: any): Promise<SubmissionResult> {
    try {
      // Mock implementation
      return {
        success: true,
        submissionId: `SUB${Date.now()}`,
        status: 'submitted',
        estimatedProcessingDays: 14
      };
    } catch (error) {
      return {
        success: false,
        status: 'failed',
        error: 'Submission failed'
      };
    }
  }
}

// KWSP (EPF) Client
export class KWSPClient {
  private baseUrl = 'https://api.kwsp.gov.my'; // Placeholder URL

  async validateEPF(epfNumber: string): Promise<ValidationResult> {
    try {
      // Mock implementation
      if (epfNumber.length !== 9 || epfNumber === 'invalid') {
        return { valid: false, error: 'Invalid EPF number format' };
      }

      return {
        valid: true,
        accountBalance: 25000,
        lastContribution: '2024-01-15'
      };
    } catch (error) {
      return { valid: false, error: 'API call failed' };
    }
  }

  async submitContribution(contributionData: any): Promise<SubmissionResult> {
    try {
      // Mock validation - fail with invalid data
      if (!contributionData.employeeId || contributionData.amount <= 0 || !contributionData.month) {
        return {
          success: false,
          status: 'validation_failed',
          error: 'Invalid contribution data'
        };
      }

      // Mock implementation
      return {
        success: true,
        transactionId: `EPF_TXN_${Date.now()}`,
        status: 'processed',
        contributionAmount: contributionData.amount
      };
    } catch (error) {
      return {
        success: false,
        status: 'failed',
        error: 'Contribution submission failed'
      };
    }
  }
}

// PERKESO (SOCSO) Client
export class PERKESOClient {
  private baseUrl = 'https://api.perkeso.gov.my'; // Placeholder URL

  async validateSOCSO(socsoNumber: string): Promise<ValidationResult> {
    return this.withRetry(async () => {
      // Mock implementation
      if (socsoNumber === 'invalid') {
        return {
          valid: false,
          error: 'Invalid SOCSO number'
        };
      }

      return {
        valid: true,
        coverage: 'Employment Injury',
        premiumRate: 0.4
      };
    });
  }

  private async withRetry<T>(operation: () => Promise<T>, maxRetries: number = 2): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
        }
      }
    }

    throw lastError!;
  }

  async submitContribution(contributionData: any): Promise<SubmissionResult> {
    try {
      // Mock implementation
      return {
        success: true,
        transactionId: `SOCSO_TXN_${Date.now()}`,
        status: 'confirmed',
        coveragePeriod: '2024-01 to 2024-12'
      };
    } catch (error) {
      return {
        success: false,
        status: 'failed',
        error: 'Contribution submission failed'
      };
    }
  }
}

// HRDF Client
export class HRDFClient {
  private baseUrl = 'https://api.hrdf.gov.my'; // Placeholder URL

  async validateClaim(claimData: any): Promise<ValidationResult> {
    try {
      // Mock validation - fail with missing required data
      if (!claimData.trainingProgram || !claimData.participants || claimData.participants.length === 0) {
        return {
          valid: false,
          error: 'Missing required claim data: training program and participants'
        };
      }

      // Mock implementation
      return {
        valid: true,
        claimAmount: 5000,
        approvedHours: 40
      };
    } catch (error) {
      return { valid: false, error: 'API call failed' };
    }
  }

  async submitClaim(claimData: any): Promise<SubmissionResult> {
    try {
      // Mock implementation
      return {
        success: true,
        claimId: `HRDF_CLAIM_${Date.now()}`,
        status: 'submitted',
        processingTime: '2-3 weeks'
      };
    } catch (error) {
      return {
        success: false,
        status: 'failed',
        error: 'Claim submission failed'
      };
    }
  }
}

// MyWorkID Client
export class MyWorkIDClient {
  private baseUrl = 'https://api.myworkid.gov.my'; // Placeholder URL

  async verifyIdentity(icNumber: string): Promise<ValidationResult> {
    return this.withRetry(async () => {
      // Mock implementation
      if (icNumber.length !== 12) {
        return { valid: false, error: 'Invalid IC number format' };
      }

      return {
        valid: true,
        verified: true,
        fullName: 'Ahmad bin Abdullah',
        icNumber,
        nationality: 'Malaysian'
      };
    });
  }

  private async withRetry<T>(operation: () => Promise<T>, maxRetries: number = 2): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
        }
      }
    }

    throw lastError!;
  }

  async getEmploymentHistory(icNumber: string): Promise<any> {
    try {
      // Mock implementation
      return {
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
      };
    } catch (error) {
      throw new Error('Failed to retrieve employment history');
    }
  }
}

// Data Synchronization Utility
export async function syncEmployeeData(employeeData: {
  icNumber: string;
  epfNumber: string;
  socsoNumber: string;
  taxNumber: string;
}): Promise<SyncResult> {
  const result: SyncResult = {
    synced: true,
    sources: [],
    errors: [],
    lastSync: new Date(),
    partialSuccess: false
  };

  const clients = {
    myWorkID: myWorkIDClient,
    kwsp: kwspClient,
    perkeso: perkesoClient,
    lhdn: lhdnClient
  };

  let successCount = 0;
  const totalSources = 4;

  try {
    // Verify identity
    const identityResult = await clients.myWorkID.verifyIdentity(employeeData.icNumber);
    if (identityResult.verified) {
      result.sources.push('MyWorkID');
      successCount++;
    } else {
      result.errors.push('Identity verification failed');
    }

    // Validate EPF
    const epfResult = await clients.kwsp.validateEPF(employeeData.epfNumber);
    if (epfResult.valid) {
      result.sources.push('KWSP');
      successCount++;
    } else {
      result.errors.push('EPF validation failed');
    }

    // Validate SOCSO
    const socsoResult = await clients.perkeso.validateSOCSO(employeeData.socsoNumber);
    if (socsoResult.valid) {
      result.sources.push('PERKESO');
      successCount++;
    } else {
      result.errors.push('SOCSO validation failed');
    }

    // Validate tax number
    const taxResult = await clients.lhdn.validateTaxNumber(employeeData.taxNumber);
    if (taxResult.valid) {
      result.sources.push('LHDN');
      successCount++;
    } else {
      result.errors.push('Tax number validation failed');
    }

    // Determine sync status
    if (successCount === totalSources) {
      result.synced = true;
      result.partialSuccess = false;
    } else if (successCount === 0) {
      result.synced = false;
      result.partialSuccess = false;
    } else {
      result.synced = false;
      result.partialSuccess = true;
    }

  } catch (error) {
    result.synced = false;
    result.partialSuccess = false;
    result.errors.push('Synchronization failed: ' + (error as Error).message);
  }

  return result;
}

// Export singleton instances
export const lhdnClient = new LHDNClient();
export const kwspClient = new KWSPClient();
export const perkesoClient = new PERKESOClient();
export const hrdfClient = new HRDFClient();
export const myWorkIDClient = new MyWorkIDClient();
