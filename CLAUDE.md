# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Testing Commands:**
- `npm run test` - Run all tests with coverage
- `npm run test-specs` - Run only spec tests (specs/*)
- `npm run test-commons` - Run only commons utility tests
- `npm run debug` - Debug a specific test

**Code Quality:**
- `npm run lint` - Run ESLint on specs directory
- `npm run pretest` - Automatically runs lint with --fix before tests

**Working Directory:**
All commands should be run from `api-automation-tests/` directory.

## Code Architecture

**Project Structure:**
- `commons/` - Production-ready utility functions and classes
  - **Enhanced API Client** - HTTP client with batch operations, retry logic, and health checks
  - **Authorization Factory** - Flexible authentication (Basic/Bearer/Custom/API Key)
  - **Configuration Management** - Environment-specific settings and feature flags
  - URL builder, retry mechanism, date formatting, and utility functions
- `config/` - Centralized configuration management with validation
- `agents/` - AI-powered testing agents for specialized testing scenarios
- `specs/` - Comprehensive test specifications
- `commons-tests/` - Unit tests for all utility functions

**Key Components:**

**Enhanced API Client (`commons/api-client.ts`):**
- Production-ready HTTP client with authentication presets
- Batch request processing with concurrency control
- Built-in retry logic and health check capabilities
- Support for Bearer, Basic Auth, and API Key authentication

**Configuration Management (`config/test-config.ts`):**
- Environment-specific configuration with validation
- Feature flags for conditional test execution
- Secure credential management
- Support for multiple environments (dev, staging, prod)

**AI Testing Agents (`agents/`):**
- **Automation Specialist** - CI/CD integration, framework development, contract testing
- **Integration Tester** - End-to-end workflows, third-party API validation, microservices testing
- **Documentation Analyst** - OpenAPI specifications, developer experience optimization

**Testing Framework:**
- Jest with TypeScript integration
- Custom matchers for API response validation
- Global test utilities and helper functions
- Comprehensive error handling and logging
- Support for parallel test execution

**Security and Best Practices:**
- No hardcoded credentials or sensitive data
- Proper test isolation and cleanup procedures
- Environment-specific configuration validation
- Comprehensive error handling and recovery
- Production-ready code quality standards