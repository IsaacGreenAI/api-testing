# Claude Code Agent Library

This directory contains specialized agent templates for use with Claude Code's Task tool. Since custom subagents in `settings.local.json` don't work with the Task tool, these templates provide consistent, reusable agent personas.

## 📁 Available Agents

### 🔒 API Security Auditor
**File:** `api-security-auditor.md`  
**Specialization:** REST API security analysis, vulnerability assessment, secure development practices  
**Key Focus:** OWASP API Top 10, authentication/authorization, penetration testing, compliance

**Quick Usage:**
```typescript
Task({
  subagent_type: "general-purpose",
  description: "API security vulnerability assessment", 
  prompt: `[See api-security-auditor.md template]
  
SPECIFIC TASK: Conduct comprehensive security assessment of e-commerce REST API`
})
```

### ⚡ API Performance Engineer
**File:** `api-performance-engineer.md`  
**Specialization:** Load testing, scalability optimization, performance monitoring  
**Key Focus:** JMeter/K6 testing, bottleneck analysis, infrastructure scaling, APM integration

**Quick Usage:**
```typescript
Task({
  subagent_type: "general-purpose",
  description: "API performance optimization", 
  prompt: `[See api-performance-engineer.md template]
  
SPECIFIC TASK: Design load testing strategy for 50K concurrent users during peak traffic`
})
```

### 🤖 API Automation Specialist
**File:** `api-automation-specialist.md`  
**Specialization:** Test automation frameworks, CI/CD integration, automated validation  
**Key Focus:** Jest/RestAssured frameworks, contract testing, data-driven testing, pipeline integration

**Quick Usage:**
```typescript
Task({
  subagent_type: "general-purpose",
  description: "API test automation framework", 
  prompt: `[See api-automation-specialist.md template]
  
SPECIFIC TASK: Design comprehensive test automation framework for microservices platform`
})
```

### 🔗 API Integration Tester
**File:** `api-integration-tester.md`  
**Specialization:** End-to-end workflows, third-party integrations, microservices communication  
**Key Focus:** Service integration, event-driven testing, external API validation, resilience testing

**Quick Usage:**
```typescript
Task({
  subagent_type: "general-purpose",
  description: "Integration testing strategy", 
  prompt: `[See api-integration-tester.md template]
  
SPECIFIC TASK: Test payment gateway integrations with failure scenario validation`
})
```

### 📚 API Documentation Analyst
**File:** `api-documentation-analyst.md`  
**Specialization:** OpenAPI specifications, developer experience, documentation quality  
**Key Focus:** Technical writing, DX optimization, interactive docs, compliance documentation

**Quick Usage:**
```typescript
Task({
  subagent_type: "general-purpose",
  description: "API documentation audit", 
  prompt: `[See api-documentation-analyst.md template]
  
SPECIFIC TASK: Audit and improve developer portal documentation for public API platform`
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
- **Full Prompt Template** - Complete Task tool template
- **Usage Examples** - Common scenarios and implementations
- **Task Categories** - Organized use cases
- **Customization Variables** - Placeholder replacements
- **Success Metrics** - Expected deliverables

## 🎯 Best Practices

### Creating Effective Agent Prompts
- Be specific about expertise areas and methodologies
- Include clear deliverable standards and format expectations
- Consider domain-specific constraints and considerations
- Provide structured response formats
- Include quality metrics and success criteria

### Using Agents Effectively
- Always customize the `[INSERT_TASK_HERE]` section
- Be specific with geographic, demographic, or technical constraints
- Test prompts with realistic scenarios
- Combine agents for complex multi-domain tasks
- Save successful prompt variations for reuse

### Agent Development Guidelines
- Focus on deep domain expertise rather than broad generalization
- Include real-world constraints and considerations
- Provide multiple usage examples across different scenarios
- Structure templates for easy customization
- Include troubleshooting and edge case handling

## 🛠️ Adding New Agents

### File Naming Convention
`[domain]-[specialization]-[optional-modifier].md`

Examples:
- `security-penetration-tester.md`
- `finance-investment-analyst.md`
- `healthcare-clinical-researcher.md`
- `legal-contract-analyzer.md`

### Required Sections
1. **Overview** - Purpose and scope
2. **Agent Template** - Full Task tool prompt
3. **Usage Examples** - 3-5 realistic scenarios
4. **Task Categories** - Organized use cases
5. **Customization Variables** - Placeholder guide
6. **Success Metrics** - Quality standards

### Update Index
Add new agents to this README with:
- Brief description and key focus areas
- Quick usage example
- Link to detailed documentation

## 💡 Future Agent Development Ideas

### Advanced API Specialists
- **GraphQL Schema Analyst** - Schema design, query optimization, federation strategies
- **API Gateway Architect** - Kong/Ambassador configuration, policy management
- **WebSocket Testing Expert** - Real-time communication testing, connection management
- **gRPC Service Validator** - Protocol buffer validation, streaming service testing

### Domain-Specific API Experts
- **Healthcare API Compliance** - FHIR standards, HIPAA compliance, medical data validation
- **Financial API Auditor** - PCI DSS compliance, payment processing, fraud prevention
- **IoT API Specialist** - Device communication, telemetry validation, edge computing
- **Gaming API Performance** - Real-time multiplayer, leaderboards, matchmaking systems

### Infrastructure and DevOps
- **Kubernetes API Validator** - Custom resource definitions, operator testing
- **Cloud API Integration** - Multi-cloud strategies, serverless API testing
- **Database API Optimizer** - Connection pooling, query performance, caching strategies
- **Monitoring API Specialist** - Metrics collection, alerting integration, observability

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

### Quality Standards
- All agents must work with `general-purpose` subagent type
- Templates must be immediately usable without modification
- Examples should reflect realistic, practical scenarios
- Documentation must be clear for non-technical users

---

**Last Updated:** January 2025  
**Total Agents:** 5  
**Status:** Production Ready

## 🎯 Agent Combination Strategies

### Comprehensive API Quality Assessment
Combine multiple agents for complete API evaluation:
1. **Security Auditor** → Identify vulnerabilities and compliance gaps
2. **Performance Engineer** → Optimize for scale and efficiency  
3. **Documentation Analyst** → Ensure developer experience excellence
4. **Integration Tester** → Validate end-to-end workflows
5. **Automation Specialist** → Implement continuous validation

### API Development Lifecycle Integration
- **Design Phase:** Documentation Analyst + Security Auditor
- **Development Phase:** Automation Specialist + Performance Engineer
- **Testing Phase:** Integration Tester + Security Auditor
- **Production Phase:** Performance Engineer + Automation Specialist
- **Maintenance Phase:** Documentation Analyst + All specialists for ongoing optimization