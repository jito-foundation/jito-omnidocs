---
title: "Searcher API"
description: "Guide to using Jito's Searcher API for MEV opportunities"
section_type: "page"
order: 20
domain: "jitosol"
---

# Test API Documentation

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies.

## Getting Started

### Test Access

To access the Test API:

1. Register at [test.example.com](https://test.example.com)
2. Generate test credentials
3. Deposit test funds

### Test Endpoints

The main test endpoints are:

| Endpoint | Description |
|----------|-------------|
| `v1/test/submit` | Submit a test request |
| `v1/test/status` | Check test status |
| `v1/test/balance` | Check test balance |
| `v1/test/history` | View test history |

## Test Submission

Lorem ipsum dolor sit amet, consectetur adipiscing elit:

```javascript
// This is test code
import { TestClient, TestBundle } from '@test/client';

// Create a test client
const testClient = new TestClient({
  url: 'https://api.test.example.com',
  authToken: 'test_token',
});

// Create test data
const testData1 = {/* test data */};
const testData2 = {/* test data */};

// Create a test bundle
const testBundle = new TestBundle({
  data: [testData1, testData2],
  options: {
    testOption1: 10000,
    testOption2: 0,
  },
});

// Submit the test
const result = await testClient.submitTest(testBundle);
console.log(`Test submitted with ID: ${result.testId}`);
```

### Test Options

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies.

## Common Test Strategies

Using the Test API, you can implement various test strategies:

### Test Strategy One

```javascript
// Example test strategy
const testStrategyOne = async (
  testParam1,
  testParam2,
  testParam3,
  testParam4
) => {
  // Step 1: Test operation
  const testOperation1 = createTestOperation(testParam1, testParam2);
  
  // Step 2: Another test operation
  const testOperation2 = createTestOperation(testParam3, testParam4);
  
  // Create a test result
  const testBundle = new TestBundle({
    operations: [testOperation1, testOperation2],
    options: {
      testOption1: 100000,
      testOption2: 0,
    },
  });
  
  return testBundle;
};
```

### Test Strategy Two

```javascript
// Example of another test strategy
const testStrategyTwo = async (
  testParam1,
  testParam2,
  testParam3,
  testParam4
) => {
  // Test check
  const testCheck = await checkTestCondition(testParam1);
  if (!testCheck.isValid) {
    return null;
  }
  
  // Create test operation
  const testOperation = createTestOperation(testParam1, testParam4);
  
  // Create a test bundle
  const testBundle = new TestBundle({
    operations: [testOperation],
    options: {
      testOption1: 500000,
      testOption2: 20,
    },
  });
  
  return testBundle;
};
```

## Best Practices

For optimal test results:

1. **Test Practice One**: Lorem ipsum dolor sit amet
2. **Test Practice Two**: Consectetur adipiscing elit
3. **Test Practice Three**: Nullam euismod, nisl eget aliquam
4. **Test Practice Four**: Nunc nisl aliquet nunc
5. **Test Practice Five**: Quis aliquam nisl nunc quis nisl

## Test Monitoring

Test monitoring examples:

```javascript
// Check test status
const testStatus = await testClient.getTestStatus(testId);
console.log(`Test status: ${testStatus.status}`);

// Get test account balance
const testBalance = await testClient.getTestBalance();
console.log(`Test balance: ${testBalance.value}`);

// View test history
const testHistory = await testClient.getTestHistory({
  limit: 10,
});
console.log(`Test history:`, testHistory);
```

For more information, see the [Test Reference](/test/reference). 