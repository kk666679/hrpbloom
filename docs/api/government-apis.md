# Government APIs Integration Documentation

## Overview

The Government APIs module provides integration with Malaysian government agencies for HR compliance and verification. This module handles validation, submission, and verification processes for tax, EPF, SOCSO, HRDF claims, and identity verification.

## Base URL

```
/api/government
```

## Authentication

All government API requests require authentication via JWT token:

```
Authorization: Bearer <jwt_token>
```

## Endpoints

### POST /api/government/lhdn

LHDN (Inland Revenue Board) API for tax validation and submission.

**Request Body:**
```json
{
  "action": "validate|submit",
  "taxNumber": "1234567890",
  "taxData": {
    "taxpayerId": "1234567890",
    "taxYear": 2024,
    "income": 50000,
    "deductions": 5000
  }
}
```

**Response:**
```json
{
  "valid": true,
  "taxpayerName": "John Doe",
  "taxCategory": "Individual",
  "submissionId": "SUB1234567890"
}
```

### POST /api/government/kwsp

KWSP (EPF) API for EPF validation and contribution submission.

**Request Body:**
```json
{
  "action": "validate|submit",
  "epfNumber": "123456789",
  "contributionData": {
    "employeeId": "EMP001",
    "amount": 550,
    "month": "2024-01"
  }
}
```

**Response:**
```json
{
  "valid": true,
  "accountBalance": 25000,
  "lastContribution": "2024-01-15",
  "transactionId": "EPF_TXN_1234567890"
}
```

### POST /api/government/perkeso

PERKESO (SOCSO) API for SOCSO validation and contribution submission.

**Request Body:**
```json
{
  "action": "validate|submit",
  "socsoNumber": "123456789012",
  "contributionData": {
    "employeeId": "EMP001",
    "amount": 0.4,
    "month": "2024-01"
  }
}
```

**Response:**
```json
{
  "valid": true,
  "coverage": "Employment Injury",
  "premiumRate": 0.4,
  "transactionId": "SOCSO_TXN_1234567890"
}
```

### POST /api/government/hrdf

HRDF API for claims validation and submission.

**Request Body:**
```json
{
  "action": "validate|submit",
  "claimData": {
    "companyId": "COMP001",
    "trainingProgram": "Digital Skills Training",
    "participants": 20,
    "hours": 40,
    "cost": 10000
  }
}
```

**Response:**
```json
{
  "valid": true,
  "claimAmount": 5000,
  "approvedHours": 40,
  "claimId": "HRDF_CLAIM_1234567890"
}
```

### POST /api/government/myworkid

MyWorkID API for identity verification and employment history.

**Request Body:**
```json
{
  "action": "verify|employmentHistory",
  "icNumber": "123456789012"
}
```

**Response:**
```json
{
  "verified": true,
  "fullName": "Ahmad bin Abdullah",
  "nationality": "Malaysian",
  "employmentHistory": [
    {
      "employer": "ABC Company",
      "position": "Software Engineer",
      "startDate": "2020-01-01",
      "endDate": "2023-12-31"
    }
  ]
}
```

## Data Synchronization

### syncEmployeeData Function

Synchronizes employee data across all government agencies.

```javascript
import { syncEmployeeData } from '@/lib/government-apis';

const result = await syncEmployeeData({
  icNumber: '123456789012',
  epfNumber: '123456789',
  socsoNumber: '123456789012',
  taxNumber: '1234567890'
});

console.log('Sync result:', result);
// {
//   synced: true,
//   sources: ['MyWorkID', 'KWSP', 'PERKESO', 'LHDN'],
//   errors: [],
//   lastSync: new Date()
// }
```

## Error Handling

All endpoints return standardized error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `UNAUTHORIZED`: Authentication required
- `INVALID_ACTION`: Unsupported action type
- `VALIDATION_FAILED`: Input validation failed
- `API_ERROR`: Government API communication error

## Rate Limiting

- 50 requests per minute per user
- 500 requests per hour per organization
- Government API calls are subject to their respective rate limits

## Compliance Notes

- All submissions are validated against current Malaysian compliance requirements
- Tax calculations follow LHDN 2024 rates
- EPF and SOCSO contributions follow KWSP and PERKESO guidelines
- HRDF claims must meet PEMANDU requirements
- Identity verification uses MyWorkID standards

## Integration with AI Agents

Government APIs are integrated with AI agents for automated compliance:

- **Compliance Agent**: Uses government APIs for payroll validation and compliance checks
- **TA Agent**: Uses MyWorkID for candidate verification during recruitment
- **L&D Agent**: Uses HRDF API for training claims automation

## Examples

### Tax Validation

```javascript
const response = await fetch('/api/government/lhdn', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    action: 'validate',
    taxNumber: '1234567890'
  })
});

const result = await response.json();
console.log('Tax validation:', result);
```

### EPF Contribution Submission

```javascript
const response = await fetch('/api/government/kwsp', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    action: 'submit',
    epfNumber: '123456789',
    contributionData: {
      employeeId: 'EMP001',
      amount: 550,
      month: '2024-01'
    }
  })
});

const result = await response.json();
console.log('EPF submission:', result);
```

### Identity Verification

```javascript
const response = await fetch('/api/government/myworkid', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    action: 'verify',
    icNumber: '123456789012'
  })
});

const result = await response.json();
console.log('Identity verification:', result);
