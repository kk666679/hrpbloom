# Government API Integration Guide

## Overview

This guide covers the integration with Malaysian government APIs for HR compliance and verification purposes. The system provides seamless integration with LHDN (tax authority), KWSP (EPF), PERKESO (SOCSO), HRDF, and MyWorkID for automated compliance checks and employee verification.

## Supported Government APIs

### 1. LHDN (Inland Revenue Board)
- **Purpose**: Tax number validation and tax return submission
- **Use Cases**: Employee tax compliance verification, automated tax filing

### 2. KWSP (Employees Provident Fund)
- **Purpose**: EPF account validation and contribution tracking
- **Use Cases**: Retirement savings compliance, contribution verification

### 3. PERKESO (Social Security Organization)
- **Purpose**: SOCSO number validation and contribution management
- **Use Cases**: Workplace injury insurance, invalidity pension tracking

### 4. HRDF (Human Resources Development Fund)
- **Purpose**: Training levy claims and compliance
- **Use Cases**: Training program funding, compliance reporting

### 5. MyWorkID
- **Purpose**: Employment verification and history tracking
- **Use Cases**: Background checks, employment verification for candidates

## API Endpoints

### LHDN Integration

**POST /api/government/lhdn**

Validate tax number:
```json
{
  "action": "validate",
  "taxNumber": "1234567890"
}
```

Submit tax return:
```json
{
  "action": "submit",
  "taxData": {
    "taxpayerId": "1234567890",
    "taxYear": 2024,
    "income": 50000,
    "deductions": 5000
  }
}
```

### KWSP Integration

**POST /api/government/kwsp**

Validate EPF number:
```json
{
  "action": "validate",
  "epfNumber": "123456789"
}
```

Submit contribution:
```json
{
  "action": "submit",
  "contributionData": {
    "employeeId": "EMP001",
    "amount": 550,
    "month": "2024-01"
  }
}
```

### PERKESO Integration

**POST /api/government/perkeso**

Validate SOCSO number:
```json
{
  "action": "validate",
  "socsoNumber": "123456789012"
}
```

Submit contribution:
```json
{
  "action": "submit",
  "contributionData": {
    "employeeId": "EMP001",
    "amount": 0.4,
    "month": "2024-01"
  }
}
```

### HRDF Integration

**POST /api/government/hrdf**

Validate claim:
```json
{
  "action": "validate",
  "claimData": {
    "companyId": "COMP001",
    "trainingProgram": "Digital Skills Training",
    "participants": 20,
    "hours": 40,
    "cost": 10000
  }
}
```

Submit claim:
```json
{
  "action": "submit",
  "claimData": {
    "companyId": "COMP001",
    "trainingProgram": "Leadership Development",
    "participants": 15,
    "hours": 60,
    "cost": 15000
  }
}
```

### MyWorkID Integration

**POST /api/government/myworkid**

Verify identity:
```json
{
  "action": "verify",
  "icNumber": "123456789012"
}
```

Get employment history:
```json
{
  "action": "employmentHistory",
  "icNumber": "123456789012"
}
```

## Integration Examples

### Employee Onboarding Verification

```javascript
async function verifyNewEmployee(employeeData) {
  const results = {
    identity: false,
    epf: false,
    socso: false,
    tax: false
  };

  try {
    // Verify identity with MyWorkID
    const identityResult = await fetch('/api/government/myworkid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'verify',
        icNumber: employeeData.icNumber
      })
    });
    const identity = await identityResult.json();
    results.identity = identity.verified;

    // Validate EPF account
    const epfResult = await fetch('/api/government/kwsp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'validate',
        epfNumber: employeeData.epfNumber
      })
    });
    const epf = await epfResult.json();
    results.epf = epf.valid;

    // Validate SOCSO number
    const socsoResult = await fetch('/api/government/perkeso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'validate',
        socsoNumber: employeeData.socsoNumber
      })
    });
    const socso = await socsoResult.json();
    results.socso = socso.valid;

    // Validate tax number
    const taxResult = await fetch('/api/government/lhdn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'validate',
        taxNumber: employeeData.taxNumber
      })
    });
    const tax = await taxResult.json();
    results.tax = tax.valid;

    return results;
  } catch (error) {
    console.error('Verification failed:', error);
    return results;
  }
}
```

### Automated Payroll Compliance

```javascript
async function processPayrollCompliance(employeeId, payrollData) {
  try {
    // Validate payroll with Compliance Agent
    const complianceResult = await fetch('/api/ai/dispatch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        taskType: 'PAYROLL_VALIDATE',
        input: payrollData
      })
    });

    const compliance = await complianceResult.json();

    if (compliance.response.result.compliant) {
      // Submit EPF contribution
      await fetch('/api/government/kwsp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit',
          contributionData: {
            employeeId,
            amount: compliance.response.result.payroll.epfEmployee,
            month: new Date().toISOString().slice(0, 7)
          }
        })
      });

      // Submit SOCSO contribution
      await fetch('/api/government/perkeso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit',
          contributionData: {
            employeeId,
            amount: compliance.response.result.payroll.socsoEmployee,
            month: new Date().toISOString().slice(0, 7)
          }
        })
      });

      return { success: true, message: 'Payroll processed and contributions submitted' };
    } else {
      return {
        success: false,
        message: 'Payroll compliance issues found',
        issues: compliance.response.result.alerts
      };
    }
  } catch (error) {
    console.error('Payroll processing failed:', error);
    return { success: false, message: 'Processing failed' };
  }
}
```

### HRDF Claims Automation

```javascript
async function submitHRDFClaim(trainingData) {
  try {
    // Validate claim first
    const validationResult = await fetch('/api/government/hrdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'validate',
        claimData: trainingData
      })
    });

    const validation = await validationResult.json();

    if (validation.valid) {
      // Submit the claim
      const submissionResult = await fetch('/api/government/hrdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit',
          claimData: trainingData
        })
      });

      const submission = await submissionResult.json();

      return {
        success: true,
        claimId: submission.claimId,
        status: submission.status,
        amount: validation.claimAmount
      };
    } else {
      return {
        success: false,
        message: 'Claim validation failed',
        errors: validation.errors
      };
    }
  } catch (error) {
    console.error('HRDF claim submission failed:', error);
    return { success: false, message: 'Submission failed' };
  }
}
```

## Error Handling

### Common Error Responses

```json
{
  "error": "Invalid IC number format",
  "code": "VALIDATION_ERROR"
}
```

```json
{
  "error": "API call failed",
  "code": "API_ERROR"
}
```

```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_ERROR"
}
```

### Retry Logic

Implement exponential backoff for transient failures:

```javascript
async function retryWithBackoff(operation, maxRetries = 3) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
```

## Data Synchronization

### Employee Data Sync

Use the `syncEmployeeData` utility for comprehensive verification:

```javascript
import { syncEmployeeData } from '@/lib/government-apis';

async function syncEmployee(employeeData) {
  const result = await syncEmployeeData({
    icNumber: employeeData.icNumber,
    epfNumber: employeeData.epfNumber,
    socsoNumber: employeeData.socsoNumber,
    taxNumber: employeeData.taxNumber
  });

  if (result.synced) {
    console.log('All data synchronized successfully');
    console.log('Sources verified:', result.sources);
  } else if (result.partialSuccess) {
    console.log('Partial synchronization completed');
    console.log('Errors:', result.errors);
  } else {
    console.log('Synchronization failed');
    console.log('Errors:', result.errors);
  }

  return result;
}
```

## Compliance Considerations

### Data Privacy
- Only collect necessary government identifiers
- Implement proper data encryption
- Comply with PDPA requirements
- Regular data cleanup and retention policies

### Audit Trail
- Log all government API interactions
- Maintain compliance records
- Regular audit reviews
- Document data processing activities

### Rate Limiting
- Respect government API rate limits
- Implement queuing for bulk operations
- Monitor API usage and costs
- Plan for peak usage periods

## Monitoring and Alerts

### Health Checks

```javascript
async function checkGovernmentAPIsHealth() {
  const apis = ['lhdn', 'kwsp', 'perkeso', 'hrdf', 'myworkid'];
  const results = {};

  for (const api of apis) {
    try {
      const response = await fetch(`/api/government/${api}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'health' })
      });

      results[api] = {
        status: response.ok ? 'healthy' : 'unhealthy',
        responseTime: Date.now() - startTime
      };
    } catch (error) {
      results[api] = {
        status: 'error',
        error: error.message
      };
    }
  }

  return results;
}
```

### Alert Configuration

Set up alerts for:
- API failures or timeouts
- Rate limit approaches
- Data synchronization issues
- Compliance deadline reminders
- Manual intervention requirements

## Troubleshooting

### Connection Issues
- Verify API endpoints are accessible
- Check network connectivity
- Confirm authentication credentials
- Review firewall and proxy settings

### Data Format Issues
- Validate input data formats
- Check required field completeness
- Verify data type conversions
- Review error messages for specific issues

### Rate Limiting
- Implement request queuing
- Add delay between requests
- Monitor usage patterns
- Consider premium API access

### Data Synchronization Failures
- Check data consistency across systems
- Verify government database updates
- Review error logs for patterns
- Implement manual verification processes

## Support and Resources

### Documentation
- Government API official documentation
- Integration examples and code samples
- Troubleshooting guides
- Compliance checklists

### Support Channels
- Technical support team
- Government API helpdesks
- Community forums
- Regular training sessions

### Version Updates
- Monitor government API changes
- Plan for API deprecation
- Test integrations with new versions
- Update documentation accordingly

## Best Practices

1. **Test Thoroughly**: Always test integrations in staging environments
2. **Monitor Performance**: Track response times and error rates
3. **Handle Failures Gracefully**: Implement fallback mechanisms
4. **Stay Compliant**: Keep up with regulatory changes
5. **Document Everything**: Maintain detailed integration logs
6. **Plan for Scale**: Design for increased usage over time
7. **Security First**: Implement proper authentication and encryption
8. **Regular Audits**: Conduct periodic security and compliance reviews
