# API Testing Framework - Testing Guide

## Overview

This is a production-ready API testing framework built with **TypeScript** and **Jest**. The framework provides comprehensive tools for API testing including security auditing, performance testing, integration validation, and automated documentation generation.

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
cd api-automation-tests
npm install
```

### Running Tests

#### Basic Test Execution
```bash
# Run all tests
npm test

# Run only integration tests
npm run test-specs

# Run only utility tests
npm run test-commons

# Debug specific test
npm run debug
```

#### Test Coverage
```bash
# Tests include coverage reports by default
npm test

# View coverage in ./coverage directory
open coverage/lcov-report/index.html
```

## Framework Architecture

### 🏗️ Core Components

#### **Commons Utilities** (`/commons`)
- **API Client** - Enhanced HTTP client with retry logic and batch operations
- **Authorization Factory** - Flexible authentication header management
- **Test Data Factory** - Realistic data generation for various domains
- **Test Runner** - Data-driven test execution framework
- **URL Builder** - Dynamic URL construction with path parameters
- **Retry Mechanism** - Configurable retry logic for resilient testing
- **Date Formatter** - Timezone-aware date formatting utilities

#### **Configuration Management** (`/config`)
- **Test Config** - Centralized environment and feature flag management
- **Environment Variables** - Secure credential and endpoint management
- **Feature Flags** - Toggle test suites based on capabilities

#### **AI Testing Agents** (`/agents`)
- **API Security Auditor** - OWASP Top 10 vulnerability analysis
- **API Performance Engineer** - Load testing and optimization
- **API Automation Specialist** - CI/CD integration and framework development
- **API Integration Tester** - End-to-end workflow validation
- **API Documentation Analyst** - OpenAPI specification and DX optimization

### 🔧 Key Features

#### **Advanced API Client**
```typescript
// Bearer token authentication
const client = ApiClient.withBearerAuth('https://api.example.com', 'token');

// Batch requests with concurrency control
const results = await client.batch([
  { method: 'GET', endpoint: '/users' },
  { method: 'GET', endpoint: '/orders' }
], 3);

// Health check monitoring
const health = await client.healthCheck();
```

#### **Data-Driven Testing**
```typescript
// Generate realistic test data
const user = testDataFactory.generateUser();
const payment = testDataFactory.generatePaymentData({ amount: 2500 });
const product = testDataFactory.generateProduct();

// Execute data-driven test suites
const result = await testRunner.executeDataDrivenTests({
  name: 'User Management Tests',
  dataProvider: {
    type: 'factory',
    dataType: 'user',
    count: 5
  },
  testFunction: async (userData, runner) => {
    const client = runner.getApiClient('main');
    const response = await client.post('/users', userData);
    expect(response.status).toBe(201);
  }
});
```

#### **Comprehensive Configuration**
```typescript
const config = testConfig.getConfig();

// Environment-specific settings
if (config.isProduction()) {
  // Production-specific test configuration
}

// Feature flag-based test execution
if (config.isFeatureEnabled('paymentProcessing')) {
  // Run payment tests
}
```

#### **Custom Jest Matchers**
```typescript
describe('Payment API', () => {
  it('should process payment', async () => {
    global.testUtils.step('Generate payment data', () => {
      paymentData = testDataFactory.generatePaymentData();
    });
    
    const response = await paymentAPI.processPayment(paymentData);
    
    // Custom matchers for API validation
    expect(response).toHaveValidApiResponse();
    expect(response.data).toMatchApiSchema(['id', 'status', 'amount']);
    
    // Attach response data for debugging
    global.testUtils.attachApiResponse(response);
  });
});
```

## Test Categories

### 🔒 Security Testing
- **Authentication/Authorization** - JWT, OAuth 2.0, API key validation
- **Input Validation** - SQL injection, XSS, LDAP injection prevention
- **Rate Limiting** - DDoS protection and throttling validation
- **Data Encryption** - TLS/SSL and data protection verification
- **OWASP API Top 10** - Comprehensive vulnerability assessment

### ⚡ Performance Testing
- **Load Testing** - Concurrent user simulation
- **Stress Testing** - Breaking point identification
- **Endurance Testing** - Memory leak and degradation detection
- **Scalability Testing** - Horizontal and vertical scaling validation

### 🔗 Integration Testing
- **Third-party APIs** - Payment gateways, email services, SMS providers
- **Microservices Communication** - Service mesh and discovery validation
- **Event-Driven Architecture** - Message queue and pub/sub testing
- **Database Integration** - Transaction boundary and consistency testing

### 📋 Functional Testing
- **CRUD Operations** - Create, read, update, delete validation
- **Business Logic** - Domain-specific rule verification
- **Data Validation** - Schema compliance and constraint testing
- **Error Handling** - Exception scenarios and recovery testing

## Environment Configuration

### Environment Variables
```bash
# API Configuration
API_BASE_URL=https://api.example.com
API_TIMEOUT=30000
API_RETRIES=3

# Authentication
ADMIN_JWT_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
USER_JWT_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
API_KEY=test_api_key_123456

# External Services
PAYMENT_API_KEY=pk_test_123456789
PAYMENT_SECRET_KEY=sk_test_123456789
EMAIL_API_KEY=sg.test_key_123

# Feature Flags
ENABLE_PAYMENT_TESTS=true
ENABLE_SECURITY_TESTS=true
ENABLE_PERFORMANCE_TESTS=false

# Test Execution
PARALLEL_TESTS=true
MAX_CONCURRENCY=5
VERBOSE_LOGGING=false
```

### Configuration Validation
The framework automatically validates configuration completeness:
```typescript
const validation = testConfig.validateConfig();
if (!validation.valid) {
  console.error('Configuration errors:', validation.errors);
}
```

## Reporting and Analytics

### 📊 Jest Coverage Reports
Comprehensive test reporting with:
- **Test execution summaries**
- **Code coverage metrics**
- **Pass/fail statistics**
- **Test timing analysis**
- **Console output capture**
- **Error stack traces**

### 📈 Coverage Reports
- **Code coverage** via Jest
- **API endpoint coverage**
- **Test scenario coverage**
- **Risk-based testing metrics**

### 🎯 Custom Metrics
```typescript
// Performance metrics
const metrics = {
  responseTime: endTime - startTime,
  throughput: requestCount / duration,
  errorRate: failures / totalRequests
};

// Log metrics for analysis
global.testUtils.attachTestData(metrics, 'Performance Metrics');
console.log('Performance Metrics:', metrics);
```

## AI-Powered Testing Agents

The framework includes specialized AI agents for comprehensive testing:

### 🛡️ Security Auditor Agent
```typescript
Task({
  subagent_type: "general-purpose",
  description: "API security assessment",
  prompt: `[Security Auditor Agent Template]
  
  SPECIFIC TASK: Conduct comprehensive security assessment of e-commerce REST API focusing on OWASP API Top 10 vulnerabilities`
});
```

### ⚡ Performance Engineer Agent
```typescript
Task({
  subagent_type: "general-purpose", 
  description: "Load testing strategy",
  prompt: `[Performance Engineer Agent Template]
  
  SPECIFIC TASK: Design load testing strategy for 50K concurrent users during Black Friday sale period`
});
```

### 🤖 Automation Specialist Agent
```typescript
Task({
  subagent_type: "general-purpose",
  description: "CI/CD test automation", 
  prompt: `[Automation Specialist Agent Template]
  
  SPECIFIC TASK: Design comprehensive test automation framework for microservices platform with contract testing`
});
```

## Best Practices

### ✅ Test Organization
- **Group related tests** in describe blocks
- **Use descriptive test names** following Given-When-Then format
- **Implement proper setup/teardown** for test isolation
- **Mock external dependencies** when appropriate

### ✅ Data Management
- **Generate fresh test data** for each test run
- **Clean up test data** after execution
- **Use realistic data** that matches production patterns
- **Implement data privacy** measures for sensitive information

### ✅ Error Handling
- **Implement retry logic** for flaky network operations
- **Validate error responses** with appropriate status codes
- **Test timeout scenarios** and recovery mechanisms
- **Log detailed error information** for debugging

### ✅ Performance Considerations
- **Implement connection pooling** for database operations
- **Use parallel execution** where appropriate
- **Monitor resource usage** during test execution
- **Set appropriate timeouts** for different test types

### ✅ Security Testing
- **Never commit credentials** to version control
- **Use secure test environments** that mirror production
- **Implement proper authentication** for all test scenarios
- **Validate data encryption** and secure transmission

## Troubleshooting

### Common Issues

#### **Authentication Failures**
```bash
# Verify token validity
curl -H "Authorization: Bearer $JWT_TOKEN" https://api.example.com/health
```

#### **Network Timeouts**
```typescript
// Increase timeout for slow endpoints
const client = ApiClient.withBearerAuth(baseUrl, token, {
  timeout: 60000 // 60 seconds
});
```

#### **Test Data Conflicts**
```typescript
// Use unique identifiers
const uniqueEmail = `test.${Date.now()}@example.com`;
```

#### **Coverage Report Issues**
```bash
# Clear previous coverage data
rm -rf coverage
npm test

# View detailed coverage
open coverage/lcov-report/index.html
```

### Debug Mode
```bash
# Run with verbose logging
VERBOSE_LOGGING=true npm test

# Debug specific test file
npm run debug -- user-management.spec.ts
```

## Contributing

### Adding New Test Suites
1. Create test file in `/specs` directory
2. Use framework utilities and patterns
3. Follow Given-When-Then test naming
4. Include data cleanup procedures
5. Update documentation

### Extending Framework
1. Add utilities to `/commons` directory
2. Include comprehensive unit tests
3. Update TypeScript type definitions
4. Document new functionality

### Creating New Agents
1. Create agent template in `/agents` directory
2. Follow existing agent structure
3. Include usage examples
4. Add to agents README

## Support

For issues and questions:
- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Comprehensive guides and API references
- **Examples**: Sample implementations and use cases

---

**Framework Version**: 1.0.0  
**Last Updated**: January 2025  
**Status**: Production Ready