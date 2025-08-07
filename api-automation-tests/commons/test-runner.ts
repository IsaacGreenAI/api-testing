import { testConfig, TestConfig } from '../config/test-config';
import { testDataFactory, TestDataFactory } from './test-data-factory';
import { ApiClient } from './api-client';

/**
 * Enhanced test runner with data-driven testing capabilities
 * Provides structured test execution with configuration management and data generation
 */
export class TestRunner {
  private config: TestConfig;
  private dataFactory: TestDataFactory;
  private apiClients: Map<string, ApiClient>;

  constructor() {
    this.config = testConfig;
    this.dataFactory = testDataFactory;
    this.apiClients = new Map();
  }

  /**
   * Initialize test environment with configuration validation
   */
  async initialize(): Promise<void> {
    const validation = this.config.validateConfig();
    
    if (!validation.valid) {
      throw new Error(`Configuration validation failed: ${validation.errors.join(', ')}`);
    }

    if (validation.warnings.length > 0) {
      console.warn('Configuration warnings:', validation.warnings.join(', '));
    }

    // Initialize API clients for different services
    await this.initializeApiClients();
  }

  /**
   * Get API client for specific service
   */
  getApiClient(serviceName: string): ApiClient {
    const client = this.apiClients.get(serviceName);
    if (!client) {
      throw new Error(`API client not found for service: ${serviceName}`);
    }
    return client;
  }

  /**
   * Execute data-driven test suite
   */
  async executeDataDrivenTests<T>(
    testSuite: DataDrivenTestSuite<T>,
    options: TestExecutionOptions = {}
  ): Promise<TestSuiteResult> {
    const results: TestResult[] = [];
    const startTime = Date.now();

    try {
      // Generate test data based on suite configuration
      const testData = await this.generateTestData(testSuite.dataProvider);
      
      // Execute tests with generated data
      for (const dataSet of testData) {
        const testResult = await this.executeTestCase(testSuite, dataSet, options);
        results.push(testResult);
        
        // Stop on first failure if configured
        if (!testResult.success && options.stopOnFailure) {
          break;
        }
      }

      const endTime = Date.now();
      
      return {
        suiteName: testSuite.name,
        totalTests: results.length,
        passedTests: results.filter(r => r.success).length,
        failedTests: results.filter(r => !r.success).length,
        executionTime: endTime - startTime,
        results,
        success: results.every(r => r.success)
      };
    } catch (error) {
      return {
        suiteName: testSuite.name,
        totalTests: 0,
        passedTests: 0,
        failedTests: 1,
        executionTime: Date.now() - startTime,
        results: [],
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate test data based on data provider configuration
   */
  private async generateTestData<T>(dataProvider: DataProvider<T>): Promise<T[]> {
    switch (dataProvider.type) {
      case 'factory':
        return this.generateFactoryData(dataProvider);
      case 'file':
        return this.loadFileData(dataProvider);
      case 'api':
        return this.fetchApiData(dataProvider);
      case 'database':
        return this.queryDatabaseData(dataProvider);
      default:
        throw new Error(`Unsupported data provider type: ${(dataProvider as any).type}`);
    }
  }

  /**
   * Generate test data using factory methods
   */
  private generateFactoryData<T>(dataProvider: DataProvider<T>): T[] {
    const data: T[] = [];
    const count = dataProvider.count || 1;
    
    for (let i = 0; i < count; i++) {
      if (dataProvider.generator) {
        data.push(dataProvider.generator(i));
      } else {
        // Use built-in factory methods
        data.push(this.generateBuiltInData(dataProvider.dataType!, i) as T);
      }
    }
    
    return data;
  }

  /**
   * Load test data from file
   */
  private async loadFileData<T>(dataProvider: DataProvider<T>): Promise<T[]> {
    if (!dataProvider.filePath) {
      throw new Error('File path is required for file data provider');
    }

    try {
      const fs = require('fs').promises;
      const content = await fs.readFile(dataProvider.filePath, 'utf-8');
      
      if (dataProvider.filePath.endsWith('.json')) {
        return JSON.parse(content);
      } else if (dataProvider.filePath.endsWith('.csv')) {
        return this.parseCsvData(content);
      } else {
        throw new Error(`Unsupported file format: ${dataProvider.filePath}`);
      }
    } catch (error) {
      throw new Error(`Failed to load test data from file: ${error.message}`);
    }
  }

  /**
   * Fetch test data from API endpoint
   */
  private async fetchApiData<T>(dataProvider: DataProvider<T>): Promise<T[]> {
    if (!dataProvider.apiEndpoint) {
      throw new Error('API endpoint is required for API data provider');
    }

    const client = this.getApiClient(dataProvider.serviceClient || 'default');
    const response = await client.get(dataProvider.apiEndpoint);
    
    if (response.status !== 200) {
      throw new Error(`Failed to fetch test data from API: ${response.status}`);
    }
    
    return dataProvider.dataExtractor ? dataProvider.dataExtractor(response.data) : response.data;
  }

  /**
   * Query test data from database
   */
  private async queryDatabaseData<T>(dataProvider: DataProvider<T>): Promise<T[]> {
    // This would integrate with actual database connection
    // For now, return mock data
    console.warn('Database data provider not fully implemented, using mock data');
    return [];
  }

  /**
   * Execute individual test case with data
   */
  private async executeTestCase<T>(
    testSuite: DataDrivenTestSuite<T>,
    testData: T,
    options: TestExecutionOptions
  ): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      await testSuite.testFunction(testData, this);
      
      return {
        testName: `${testSuite.name} with data set`,
        success: true,
        executionTime: Date.now() - startTime,
        testData
      };
    } catch (error) {
      return {
        testName: `${testSuite.name} with data set`,
        success: false,
        executionTime: Date.now() - startTime,
        error: error.message,
        testData
      };
    }
  }

  /**
   * Generate built-in test data types
   */
  private generateBuiltInData(dataType: string, index: number): any {
    switch (dataType) {
      case 'user':
        return this.dataFactory.generateUser();
      case 'payment':
        return this.dataFactory.generatePaymentData();
      case 'product':
        return this.dataFactory.generateProduct();
      case 'order':
        return this.dataFactory.generateOrder();
      case 'auth':
        return this.dataFactory.generateAuthCredentials();
      default:
        throw new Error(`Unknown built-in data type: ${dataType}`);
    }
  }

  /**
   * Parse CSV data into objects
   */
  private parseCsvData<T>(csvContent: string): T[] {
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data: T[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const obj: any = {};
      
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      
      data.push(obj as T);
    }
    
    return data;
  }

  /**
   * Initialize API clients for different services
   */
  private async initializeApiClients(): Promise<void> {
    const apiConfig = this.config.getApiConfig();
    const authConfig = this.config.getAuthConfig();

    // Main API client
    const mainClient = ApiClient.withBearerAuth(
      apiConfig.baseUrl,
      authConfig.adminToken,
      {
        timeout: apiConfig.timeout,
        retryConfig: {
          maxRetries: apiConfig.retries,
          initialWait: apiConfig.retryDelay,
          maxWait: apiConfig.retryDelay * 4,
          retryOnStatus: [500, 502, 503, 504, 429]
        }
      }
    );

    this.apiClients.set('default', mainClient);
    this.apiClients.set('main', mainClient);

    // Payment service client
    const externalConfig = this.config.getExternalConfig();
    const paymentClient = ApiClient.withApiKey(
      'https://api.stripe.com',
      externalConfig.paymentGateway.apiKey,
      'Authorization'
    );

    this.apiClients.set('payment', paymentClient);

    // User client with user token
    const userClient = ApiClient.withBearerAuth(
      apiConfig.baseUrl,
      authConfig.userToken
    );

    this.apiClients.set('user', userClient);
  }

  /**
   * Clean up resources
   */
  async cleanup(): Promise<void> {
    this.apiClients.clear();
  }
}

// Type definitions for data-driven testing
export interface DataDrivenTestSuite<T> {
  name: string;
  description?: string;
  dataProvider: DataProvider<T>;
  testFunction: (data: T, runner: TestRunner) => Promise<void>;
  beforeEach?: (data: T) => Promise<void>;
  afterEach?: (data: T) => Promise<void>;
}

export interface DataProvider<T> {
  type: 'factory' | 'file' | 'api' | 'database';
  count?: number;
  
  // Factory provider options
  generator?: (index: number) => T;
  dataType?: string;
  
  // File provider options
  filePath?: string;
  
  // API provider options
  apiEndpoint?: string;
  serviceClient?: string;
  dataExtractor?: (responseData: any) => T[];
  
  // Database provider options
  query?: string;
  connectionString?: string;
}

export interface TestExecutionOptions {
  stopOnFailure?: boolean;
  parallel?: boolean;
  timeout?: number;
  retries?: number;
}

export interface TestSuiteResult {
  suiteName: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  executionTime: number;
  results: TestResult[];
  success: boolean;
  error?: string;
}

export interface TestResult {
  testName: string;
  success: boolean;
  executionTime: number;
  error?: string;
  testData?: any;
}

// Singleton instance for easy access
export const testRunner = new TestRunner();