/**
 * Test data factory for generating realistic test data across different domains
 * Provides consistent, predictable data generation for API testing scenarios
 */
export class TestDataFactory {
  private static instance: TestDataFactory;
  private sequenceCounter: number = 1;

  private constructor() {}

  public static getInstance(): TestDataFactory {
    if (!TestDataFactory.instance) {
      TestDataFactory.instance = new TestDataFactory();
    }
    return TestDataFactory.instance;
  }

  /**
   * Generate a unique sequence number for test isolation
   */
  private getSequence(): number {
    return this.sequenceCounter++;
  }

  /**
   * Generate a timestamp-based unique identifier
   */
  public generateUniqueId(prefix: string = 'test'): string {
    const timestamp = Date.now();
    const sequence = this.getSequence();
    return `${prefix}_${timestamp}_${sequence}`;
  }

  /**
   * User data generation for user management API testing
   */
  public generateUser(overrides: Partial<UserData> = {}): UserData {
    const sequence = this.getSequence();
    const baseEmail = `testuser${sequence}@example.com`;
    
    return {
      email: overrides.email || baseEmail,
      firstName: overrides.firstName || this.generateFirstName(),
      lastName: overrides.lastName || this.generateLastName(),
      role: overrides.role || 'USER',
      isActive: overrides.isActive ?? true,
      dateOfBirth: overrides.dateOfBirth || this.generateDateOfBirth(),
      phoneNumber: overrides.phoneNumber || this.generatePhoneNumber(),
      address: overrides.address || this.generateAddress(),
      ...overrides
    };
  }

  /**
   * Payment data generation for payment processing API testing
   */
  public generatePaymentData(overrides: Partial<PaymentData> = {}): PaymentData {
    return {
      amount: overrides.amount || this.generateAmount(),
      currency: overrides.currency || 'USD',
      paymentMethodId: overrides.paymentMethodId || this.generatePaymentMethodId(),
      customerId: overrides.customerId || this.generateCustomerId(),
      description: overrides.description || `Test payment for order #${this.generateOrderNumber()}`,
      metadata: {
        orderId: this.generateOrderNumber(),
        customerEmail: `customer${this.getSequence()}@example.com`,
        source: 'automated_test',
        ...overrides.metadata
      },
      ...overrides
    };
  }

  /**
   * Product data generation for e-commerce API testing
   */
  public generateProduct(overrides: Partial<ProductData> = {}): ProductData {
    const productNames = [
      'Premium Wireless Headphones',
      'Smart Fitness Tracker',
      'Eco-Friendly Water Bottle',
      'Bluetooth Speaker',
      'Laptop Stand',
      'Wireless Charging Pad'
    ];

    const categories = ['Electronics', 'Fitness', 'Home & Garden', 'Accessories'];
    
    return {
      name: overrides.name || productNames[Math.floor(Math.random() * productNames.length)],
      description: overrides.description || 'High-quality product designed for everyday use.',
      price: overrides.price || this.generatePrice(),
      category: overrides.category || categories[Math.floor(Math.random() * categories.length)],
      sku: overrides.sku || this.generateSKU(),
      inventory: overrides.inventory || Math.floor(Math.random() * 100) + 1,
      isActive: overrides.isActive ?? true,
      tags: overrides.tags || this.generateProductTags(),
      dimensions: overrides.dimensions || this.generateDimensions(),
      weight: overrides.weight || Math.round((Math.random() * 5 + 0.1) * 100) / 100,
      ...overrides
    };
  }

  /**
   * Order data generation for order management API testing
   */
  public generateOrder(overrides: Partial<OrderData> = {}): OrderData {
    const items = overrides.items || [
      {
        productId: this.generateUniqueId('prod'),
        quantity: Math.floor(Math.random() * 3) + 1,
        unitPrice: this.generatePrice(),
        name: 'Test Product'
      }
    ];

    const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax
    const shipping = 9.99;
    const total = subtotal + tax + shipping;

    return {
      customerId: overrides.customerId || this.generateCustomerId(),
      items,
      subtotal,
      tax,
      shipping,
      total,
      status: overrides.status || 'pending',
      shippingAddress: overrides.shippingAddress || this.generateAddress(),
      billingAddress: overrides.billingAddress || this.generateAddress(),
      paymentMethodId: overrides.paymentMethodId || this.generatePaymentMethodId(),
      notes: overrides.notes || 'Test order created for automated testing',
      ...overrides
    };
  }

  /**
   * Authentication data generation
   */
  public generateAuthCredentials(overrides: Partial<AuthCredentials> = {}): AuthCredentials {
    return {
      username: overrides.username || `testuser_${this.getSequence()}`,
      email: overrides.email || `auth${this.getSequence()}@example.com`,
      password: overrides.password || this.generateSecurePassword(),
      confirmPassword: overrides.confirmPassword || overrides.password || this.generateSecurePassword(),
      ...overrides
    };
  }

  /**
   * API Key and token generation for authentication testing
   */
  public generateApiCredentials(overrides: Partial<ApiCredentials> = {}): ApiCredentials {
    return {
      apiKey: overrides.apiKey || this.generateApiKey(),
      secretKey: overrides.secretKey || this.generateSecretKey(),
      accessToken: overrides.accessToken || this.generateJWTToken(),
      refreshToken: overrides.refreshToken || this.generateRefreshToken(),
      expiresIn: overrides.expiresIn || 3600,
      ...overrides
    };
  }

  // Private helper methods for realistic data generation
  private generateFirstName(): string {
    const names = [
      'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Jessica',
      'William', 'Ashley', 'James', 'Amanda', 'Christopher', 'Stephanie', 'Daniel', 'Jennifer'
    ];
    return names[Math.floor(Math.random() * names.length)];
  }

  private generateLastName(): string {
    const names = [
      'Smith', 'Johnson', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor',
      'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Garcia', 'Rodriguez'
    ];
    return names[Math.floor(Math.random() * names.length)];
  }

  private generateDateOfBirth(): string {
    const year = Math.floor(Math.random() * 50) + 1950; // Between 1950-2000
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  private generatePhoneNumber(): string {
    const areaCode = Math.floor(Math.random() * 700) + 200;
    const exchange = Math.floor(Math.random() * 700) + 200;
    const number = Math.floor(Math.random() * 9000) + 1000;
    return `+1-${areaCode}-${exchange}-${number}`;
  }

  private generateAddress(): AddressData {
    const streets = ['Main St', 'Oak Ave', 'First St', 'Second Ave', 'Park Rd', 'Elm St'];
    const cities = ['Springfield', 'Franklin', 'Riverside', 'Georgetown', 'Clinton', 'Madison'];
    const states = ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'MI', 'NC'];
    
    return {
      street: `${Math.floor(Math.random() * 9999) + 1} ${streets[Math.floor(Math.random() * streets.length)]}`,
      city: cities[Math.floor(Math.random() * cities.length)],
      state: states[Math.floor(Math.random() * states.length)],
      zipCode: Math.floor(Math.random() * 90000) + 10000,
      country: 'US'
    };
  }

  private generateAmount(): number {
    return Math.floor(Math.random() * 10000) + 100; // $1.00 to $100.00 in cents
  }

  private generatePrice(): number {
    return Math.round((Math.random() * 999 + 1) * 100) / 100; // $1.00 to $999.99
  }

  private generatePaymentMethodId(): string {
    const types = ['visa', 'mastercard', 'amex'];
    const type = types[Math.floor(Math.random() * types.length)];
    return `pm_test_card_${type}_${Math.floor(Math.random() * 1000000)}`;
  }

  private generateCustomerId(): string {
    return `cust_test_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  private generateOrderNumber(): string {
    return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  }

  private generateSKU(): string {
    const prefix = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
    const numbers = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `${prefix}${prefix}${numbers}`;
  }

  private generateProductTags(): string[] {
    const allTags = ['premium', 'eco-friendly', 'bestseller', 'new', 'sale', 'wireless', 'portable', 'durable'];
    const numTags = Math.floor(Math.random() * 3) + 1;
    const shuffled = allTags.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numTags);
  }

  private generateDimensions(): DimensionData {
    return {
      length: Math.round((Math.random() * 50 + 1) * 100) / 100,
      width: Math.round((Math.random() * 50 + 1) * 100) / 100,
      height: Math.round((Math.random() * 50 + 1) * 100) / 100,
      unit: 'cm'
    };
  }

  private generateSecurePassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  private generateApiKey(): string {
    const prefix = 'ak_test_';
    const key = Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    return prefix + key;
  }

  private generateSecretKey(): string {
    const prefix = 'sk_test_';
    const key = Array.from({ length: 48 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    return prefix + key;
  }

  private generateJWTToken(): string {
    const header = btoa('{"alg":"HS256","typ":"JWT"}');
    const payload = btoa(`{"sub":"test_user","exp":${Math.floor(Date.now() / 1000) + 3600}}`);
    const signature = Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    return `${header}.${payload}.${signature}`;
  }

  private generateRefreshToken(): string {
    return Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }
}

// Type definitions for generated data
export interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  dateOfBirth?: string;
  phoneNumber?: string;
  address?: AddressData;
}

export interface PaymentData {
  amount: number;
  currency: string;
  paymentMethodId: string;
  customerId: string;
  description: string;
  metadata: Record<string, any>;
}

export interface ProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  inventory: number;
  isActive: boolean;
  tags: string[];
  dimensions: DimensionData;
  weight: number;
}

export interface OrderData {
  customerId: string;
  items: OrderItemData[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: string;
  shippingAddress: AddressData;
  billingAddress: AddressData;
  paymentMethodId: string;
  notes?: string;
}

export interface OrderItemData {
  productId: string;
  quantity: number;
  unitPrice: number;
  name: string;
}

export interface AddressData {
  street: string;
  city: string;
  state: string;
  zipCode: number;
  country: string;
}

export interface DimensionData {
  length: number;
  width: number;
  height: number;
  unit: string;
}

export interface AuthCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ApiCredentials {
  apiKey: string;
  secretKey: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Singleton instance for easy access
export const testDataFactory = TestDataFactory.getInstance();