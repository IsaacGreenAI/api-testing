# Claude Code Agent Library

This directory contains specialized agent templates for use with Claude Code's Task tool. Since custom subagents in `settings.local.json` don't work with the Task tool, these templates provide consistent, reusable agent personas.

## 📁 Available Agents

### 🧪 Vitest API Testing Specialist
**File:** `vitest-api-testing-specialist.md`
**Specialization:** Modern API testing with Vitest, ES Modules, TypeScript
**Key Focus:** Vitest framework, mocking strategies, coverage, CI/CD integration, async patterns
**Official Docs:** https://vitest.dev

**Quick Usage:**
```typescript
Task({
  subagent_type: "general-purpose",
  description: "Build Vitest API test suite",
  prompt: `[See vitest-api-testing-specialist.md template]

SPECIFIC TASK: Create comprehensive integration tests for Universe Service API with planets and galaxies endpoints using Vitest and TypeScript`
})
```

### 🎭 Playwright API Testing Specialist
**File:** `playwright-api-testing-specialist.md`
**Specialization:** Server-side API testing with Playwright's APIRequestContext
**Key Focus:** Pure API testing, mixed UI+API testing, storage state, fixtures, parallel execution
**Official Docs:** https://playwright.dev

**Quick Usage:**
```typescript
Task({
  subagent_type: "general-purpose",
  description: "Build Playwright API tests",
  prompt: `[See playwright-api-testing-specialist.md template]

SPECIFIC TASK: Design API test suite using APIRequestContext with authentication and CRUD validation for user management endpoints`
})
```

### ☕ Mocha + Chai API Testing Specialist
**File:** `mocha-chai-api-testing-specialist.md`
**Specialization:** Flexible API testing with Mocha framework and Chai assertions
**Key Focus:** BDD/TDD patterns, async testing, Supertest integration, Sinon mocking, multiple assertion styles
**Official Docs:** https://mochajs.org | https://www.chaijs.com

**Quick Usage:**
```typescript
Task({
  subagent_type: "general-purpose",
  description: "Build Mocha+Chai API tests",
  prompt: `[See mocha-chai-api-testing-specialist.md template]

SPECIFIC TASK: Implement Express API test suite with Mocha, Chai, and Supertest including route testing and middleware validation`
})
```

### 📚 API Documentation Analyst
**File:** `api-documentation-analyst.md`
**Specialization:** OpenAPI specifications, developer experience, documentation quality
**Key Focus:** Technical writing, DX optimization, Swagger/OpenAPI, interactive docs

**Quick Usage:**
```typescript
Task({
  subagent_type: "general-purpose",
  description: "API documentation analysis",
  prompt: `[See api-documentation-analyst.md template]

SPECIFIC TASK: Review and improve Universe Service API Swagger documentation for developer experience and completeness`
})
```

### 💻 C# Microservices Expert
**File:** `csharp-microservices-expert.md`
**Specialization:** .NET ecosystem development, microservices architecture, distributed systems
**Key Focus:** ASP.NET Core, Entity Framework, xUnit testing, Docker deployment, enterprise patterns

**Quick Usage:**
```typescript
Task({
  subagent_type: "general-purpose",
  description: "C# microservices architecture",
  prompt: `[See csharp-microservices-expert.md template]

SPECIFIC TASK: Enhance Universe Service with additional API endpoints, repository patterns, and comprehensive unit test coverage`
})
```

### 🚀 GitHub Actions Pipeline Specialist
**File:** `github-actions-pipeline-specialist.md`
**Specialization:** CI/CD pipeline design, workflow optimization, enterprise automation
**Key Focus:** GitHub Actions workflows, multi-technology pipelines, security hardening, deployment automation, caching strategies
**Official Docs:** https://docs.github.com/en/actions

**Quick Usage:**
```typescript
Task({
  subagent_type: "general-purpose",
  description: "Build CI/CD pipeline",
  prompt: `[See github-actions-pipeline-specialist.md template]

SPECIFIC TASK: Design complete CI/CD pipeline for Node.js and .NET project with testing, Docker builds, and deployment automation`
})
```

---

## 🚀 How to Use Agents

1. **Choose an Agent:** Browse available agents by specialization
2. **Copy Template:** Use the full prompt template from the agent's `.md` file
3. **Customize Task:** Replace `[INSERT_TASK_HERE]` with your specific request
4. **Execute:** Run via Claude Code's Task tool with `subagent_type: "general-purpose"`

## 📋 Agent Template Structure

Each agent includes:
- **Overview** - Agent's purpose and specialization
- **Official Documentation References** - Links to official docs for the technology
- **Clarification Protocol** - Questions to ask users when requirements are ambiguous
- **Full Prompt Template** - Complete Task tool template
- **Usage Examples** - Common scenarios and implementations
- **Task Categories** - Organized use cases
- **Customization Variables** - Placeholder replacements
- **Success Metrics** - Expected deliverables

## 🎯 Best Practices

### Creating Effective Agent Prompts
- Be specific about expertise areas and methodologies
- Include clear deliverable standards and format expectations
- Reference official documentation for all recommendations
- Ask clarifying questions when requirements are ambiguous
- Consider domain-specific constraints and considerations
- Provide structured response formats
- Include quality metrics and success criteria

### Using Agents Effectively
- Always customize the `[INSERT_TASK_HERE]` section
- Be specific with technical constraints and requirements
- Answer clarifying questions for better results
- Test prompts with realistic scenarios
- Combine agents for complex multi-domain tasks
- Save successful prompt variations for reuse

### Agent Development Guidelines
- Focus on deep domain expertise rather than broad generalization
- Include official documentation references
- Implement clarification protocols for ambiguous requirements
- Provide multiple usage examples across different scenarios
- Structure templates for easy customization
- Include troubleshooting and edge case handling

## 🛠️ Adding New Agents

### File Naming Convention
`[technology]-[specialization].md`

Examples:
- `vitest-api-testing-specialist.md`
- `playwright-api-testing-specialist.md`
- `graphql-schema-specialist.md`
- `docker-compose-specialist.md`

### Required Sections
1. **Overview** - Purpose and scope
2. **Official Documentation References** - Links to official docs
3. **Agent Template** - Full Task tool prompt with clarification protocol
4. **Usage Examples** - 3-5 realistic scenarios
5. **Task Categories** - Organized use cases
6. **Customization Variables** - Placeholder guide
7. **Success Metrics** - Quality standards

### Update Index
Add new agents to this README with:
- Brief description and key focus areas
- Official documentation links
- Quick usage example
- Link to detailed documentation

## 💡 Repository Alignment

This agent library is specifically tailored to the **api-testing** repository's technology stack:

### Testing Frameworks
- ✅ **Vitest** (Primary framework - implemented)
- ✅ **Playwright** (Work in progress)
- ✅ **Mocha/Chai** (Work in progress)

### Backend Services
- ✅ **ASP.NET Core** (UniverseService API)
- ✅ **PostgreSQL** (Database)
- ✅ **Docker** (Containerization)

### Shared Libraries
- ✅ **ES Modules** (ESM)
- ✅ **TypeScript** (Type safety)
- ✅ **SOLID Principles** (Interface-based design)
- ✅ **HTTP Clients** (Axios, Fetch implementations)

## 🎯 Agent Usage Patterns

### Testing Framework Development
Use framework-specific agents when:
- Creating new test suites
- Implementing integration tests
- Setting up CI/CD pipelines
- Configuring coverage reporting
- Optimizing test performance

**Recommended Agents:** Vitest, Playwright, or Mocha/Chai specialists

### Backend Service Development
Use C# Microservices Expert when:
- Enhancing Universe Service API
- Adding new endpoints or features
- Implementing repository patterns
- Writing unit tests for .NET code
- Configuring Docker deployment

**Recommended Agent:** C# Microservices Expert

### Documentation and DX
Use Documentation Analyst when:
- Improving API documentation
- Updating Swagger/OpenAPI specs
- Creating developer guides
- Enhancing README files
- Documenting test patterns

**Recommended Agent:** API Documentation Analyst

### Multi-Domain Tasks
Combine agents for comprehensive solutions:
1. **C# Microservices Expert** → Build API endpoint
2. **Vitest Specialist** → Create integration tests
3. **Documentation Analyst** → Update Swagger docs

## 🔄 Agent Versioning

Track agent improvements with version notes:
- **v1.0** - Initial implementation
- **v1.1** - Enhanced prompt clarity, added examples
- **v2.0** - Major restructure, new capabilities

Update version info in agent files and this index when making significant changes.

## 🤝 Contributing

### Improvement Suggestions
- Test agents with real scenarios and provide feedback
- Suggest additional usage examples
- Identify common edge cases or limitations
- Recommend prompt clarity improvements
- Add official documentation references

### Quality Standards
- All agents must work with `general-purpose` subagent type
- Templates must be immediately usable without modification
- Include official documentation references
- Implement clarification protocols for ambiguous requirements
- Examples should reflect realistic, practical scenarios
- Documentation must be clear and actionable

---

**Last Updated:** October 2025
**Total Agents:** 6
**Status:** Production Ready
**Repository:** api-testing (Vitest, Playwright, Mocha/Chai, ASP.NET Core, GitHub Actions)

## 📚 Additional Resources

- **Vitest Documentation**: https://vitest.dev
- **Playwright Documentation**: https://playwright.dev
- **Mocha Documentation**: https://mochajs.org
- **Chai Documentation**: https://www.chaijs.com
- **ASP.NET Core Documentation**: https://docs.microsoft.com/aspnet/core
- **GitHub Actions Documentation**: https://docs.github.com/en/actions
