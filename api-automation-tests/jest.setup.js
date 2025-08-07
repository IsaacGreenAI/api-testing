// Only log once
if (!global._testSetupComplete) {
  console.log('📋 Test Setup Complete - Framework Ready');
  global._testSetupComplete = true;
}

// Global test utilities
global.testUtils = {
  formatTestData: (data) => JSON.stringify(data, null, 2),
  generateTimestamp: () => new Date().toISOString(),
  attachApiResponse: (response, name = 'API Response') => {
    // Response attachment functionality removed (was Allure-specific)
    console.log(`${name}:`, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    });
  },
  attachTestData: (data, name = 'Test Data') => {
    // Test data attachment functionality removed (was Allure-specific)
    console.log(`${name}:`, data);
  },
  step: (stepName, fn) => {
    console.log(`Test Step: ${stepName}`);
    return fn();
  }
};

// Add custom matchers for API testing
expect.extend({
  toHaveValidApiResponse(received) {
    const pass = received &&
                 typeof received.status === 'number' &&
                 received.status >= 200 &&
                 received.status < 600;

    if (pass) {
      return {
        message: () => 'Expected response not to be a valid API response',
        pass: true,
      };
    } else {
      return {
        message: () => 'Expected response to be a valid API response with status code between 200-599',
        pass: false,
      };
    }
  },

  toMatchApiSchema(received, schema) {
    const hasRequiredProperties = schema.every(prop => received.hasOwnProperty(prop));

    if (hasRequiredProperties) {
      return {
        message: () => 'Expected object not to match schema',
        pass: true,
      };
    } else {
      const missingProps = schema.filter(prop => !received.hasOwnProperty(prop));
      return {
        message: () => `Expected object to match schema. Missing properties: ${missingProps.join(', ')}`,
        pass: false,
      };
    }
  }
});
