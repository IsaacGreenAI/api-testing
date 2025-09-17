/**
 * Centralized test configuration management
 * Handles environment-specific settings, test data, and feature flags
 */
export class TestConfig {
  private static instance: TestConfig;
  private config: ConfigData;

  private constructor() {
    this.config = this.loadConfiguration();
  }

  public static getInstance(): TestConfig {
    if (!TestConfig.instance) {
      TestConfig.instance = new TestConfig();
    }
    return TestConfig.instance;
  }

  /**
   * Load configuration from environment variables and defaults
   */
  private loadConfiguration(): ConfigData {
    const env = process.env.NODE_ENV || 'test';

    return {
      environment: env,
      api: {
        baseUrl: process.env.API_BASE_URL || 'https://api.example.com',
        timeout: parseInt(process.env.API_TIMEOUT || '30000'),
        retries: parseInt(process.env.API_RETRIES || '3'),
        retryDelay: parseInt(process.env.API_RETRY_DELAY || '1000'),
        rateLimitDelay: parseInt(process.env.RATE_LIMIT_DELAY || '100')
      },
      authentication: {
        adminToken: process.env.ADMIN_JWT_TOKEN || 'mock-admin-token',
        userToken: process.env.USER_JWT_TOKEN || 'mock-user-token',
        apiKey: process.env.API_KEY || 'test_api_key_123',
        basicAuth: {
          username: process.env.BASIC_AUTH_USER || 'testuser',
          password: process.env.BASIC_AUTH_PASS || 'testpass'
        }
      },
      database: {
        connectionString: process.env.DB_CONNECTION_STRING || 'sqlite::memory:',
        cleanupAfterTests: process.env.DB_CLEANUP !== 'false',
        seedTestData: process.env.DB_SEED_DATA !== 'false'
      },
      testing: {
        parallelExecution: process.env.PARALLEL_TESTS !== 'false',
        maxConcurrency: parseInt(process.env.MAX_CONCURRENCY || '5'),
        screenshotOnFailure: process.env.SCREENSHOT_ON_FAILURE === 'true',
        generateReports: process.env.GENERATE_REPORTS !== 'false',
        verboseLogging: process.env.VERBOSE_LOGGING === 'true'
      },
      features: {
        paymentProcessing: process.env.ENABLE_PAYMENT_TESTS !== 'false',
        userManagement: process.env.ENABLE_USER_TESTS !== 'false',
        integrationTests: process.env.ENABLE_INTEGRATION_TESTS !== 'false',
        performanceTests: false,
        securityTests: false
      },
      external: {
        paymentGateway: {
          apiKey: process.env.PAYMENT_API_KEY || 'pk_test_123456789',
          secretKey: process.env.PAYMENT_SECRET_KEY || 'sk_test_123456789',
          webhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || 'whsec_test_secret'
        },
        emailService: {
          apiKey: process.env.EMAIL_API_KEY || 'email_test_key',
          fromAddress: process.env.EMAIL_FROM || 'test@example.com'
        },
        smsService: {
          accountSid: process.env.SMS_ACCOUNT_SID || 'test_account_sid',
          authToken: process.env.SMS_AUTH_TOKEN || 'test_auth_token'
        }
      },
      reporting: {
        outputDir: process.env.REPORT_OUTPUT_DIR || './test-results',
        formats: ['json', 'html', 'junit'],
        includeTimings: true,
        includeCoverage: true
      }
    };
  }

  /**
   * Get full configuration object
   */
  getConfig(): ConfigData {
    return { ...this.config };
  }

  /**
   * Get API configuration
   */
  getApiConfig(): ApiConfig {
    return { ...this.config.api };
  }

  /**
   * Get authentication configuration
   */
  getAuthConfig(): AuthConfig {
    return { ...this.config.authentication };
  }

  /**
   * Get feature flags
   */
  getFeatures(): FeatureFlags {
    return { ...this.config.features };
  }

  /**
   * Get external service configurations
   */
  getExternalConfig(): ExternalConfig {
    return { ...this.config.external };
  }

  /**
   * Check if feature is enabled
   */
  isFeatureEnabled(feature: keyof FeatureFlags): boolean {
    return this.config.features[feature] === true;
  }

  /**
   * Get environment-specific configuration
   */
  getEnvironment(): string {
    return this.config.environment;
  }

  /**
   * Check if running in production-like environment
   */
  isProduction(): boolean {
    return ['production', 'prod', 'staging'].includes(this.config.environment);
  }

  /**
   * Check if running in development environment
   */
  isDevelopment(): boolean {
    return ['development', 'dev', 'local'].includes(this.config.environment);
  }

  /**
   * Check if running in test environment
   */
  isTest(): boolean {
    return ['test', 'testing', 'ci'].includes(this.config.environment);
  }

  /**
   * Get configuration for specific test type
   */
  getTestConfig(testType: 'unit' | 'integration' | 'e2e'): TestTypeConfig {
    const baseConfig = {
      timeout: this.config.api.timeout,
      retries: this.config.api.retries,
      parallel: this.config.testing.parallelExecution
    };

    switch (testType) {
    case 'unit':
      return {
        ...baseConfig,
        timeout: 5000,
        retries: 1,
        parallel: true
      };
    case 'integration':
      return {
        ...baseConfig,
        timeout: 15000,
        retries: 2,
        parallel: this.config.testing.maxConcurrency <= 3
      };
    case 'e2e':
      return {
        ...baseConfig,
        timeout: 60000,
        retries: 3,
        parallel: false
      };
    default:
      return baseConfig;
    }
  }

  /**
   * Update configuration at runtime
   */
  updateConfig(updates: Partial<ConfigData>): void {
    this.config = {
      ...this.config,
      ...updates
    };
  }

  /**
   * Reset configuration to defaults
   */
  resetConfig(): void {
    this.config = this.loadConfiguration();
  }

  /**
   * Validate configuration completeness
   */
  validateConfig(): ConfigValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields validation
    if (!this.config.api.baseUrl) {
      errors.push('API base URL is required');
    }

    if (this.isProduction() && this.config.authentication.adminToken.includes('mock')) {
      errors.push('Production environment requires real authentication tokens');
    }

    // Warning for insecure configurations
    if (!this.config.api.baseUrl.startsWith('https://') && this.isProduction()) {
      warnings.push('Production APIs should use HTTPS');
    }

    if (this.config.testing.maxConcurrency > 10) {
      warnings.push('High concurrency may overwhelm test environments');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// Configuration type definitions
export interface ConfigData {
  environment: string;
  api: ApiConfig;
  authentication: AuthConfig;
  database: DatabaseConfig;
  testing: TestingConfig;
  features: FeatureFlags;
  external: ExternalConfig;
  reporting: ReportingConfig;
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  retryDelay: number;
  rateLimitDelay: number;
}

export interface AuthConfig {
  adminToken: string;
  userToken: string;
  apiKey: string;
  basicAuth: {
    username: string;
    password: string;
  };
}

export interface DatabaseConfig {
  connectionString: string;
  cleanupAfterTests: boolean;
  seedTestData: boolean;
}

export interface TestingConfig {
  parallelExecution: boolean;
  maxConcurrency: number;
  screenshotOnFailure: boolean;
  generateReports: boolean;
  verboseLogging: boolean;
}

export interface FeatureFlags {
  paymentProcessing: boolean;
  userManagement: boolean;
  integrationTests: boolean;
  performanceTests: boolean;
  securityTests: boolean;
}

export interface ExternalConfig {
  paymentGateway: {
    apiKey: string;
    secretKey: string;
    webhookSecret: string;
  };
  emailService: {
    apiKey: string;
    fromAddress: string;
  };
  smsService: {
    accountSid: string;
    authToken: string;
  };
}

export interface ReportingConfig {
  outputDir: string;
  formats: string[];
  includeTimings: boolean;
  includeCoverage: boolean;
}

export interface TestTypeConfig {
  timeout: number;
  retries: number;
  parallel: boolean;
}

export interface ConfigValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// Singleton instance for easy access
export const testConfig = TestConfig.getInstance();
