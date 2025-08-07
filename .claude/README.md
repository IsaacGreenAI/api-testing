# Claude Code Configuration Catalog

This directory contains your Claude Code settings and subagent configurations. Use this as your reference guide for managing and customizing Claude Code.

## 📁 File Structure

```
.claude/
├── settings.local.json    # Your personal project settings (not in git)
├── settings.json          # Shared project settings (committed to git)
└── README.md             # This file - your configuration guide
```

## 🎛️ Managing Settings

### Interactive Commands (Within Claude Code Session)

```bash
# View/modify configuration
/config

# Manage custom subagents
/agents

# View or update permissions
/permissions

# Select or change AI model
/model

# Edit memory files
/memory
```

### CLI Commands (Outside Claude Code)

```bash
# Start with specific permissions
claude --permission-mode restricted

# Add additional directories
claude --add-dir /path/to/other/project

# Override allowed/disallowed tools
claude --allowedTools "Bash:npm:*" --disallowedTools "Bash:rm:*"

# Use specific model
claude --model claude-3-5-sonnet-20241022

# Configure MCP servers
claude mcp

# Update Claude Code
claude update
```

## ⚙️ Configuration Options Reference

### Permissions
```json
{
  "permissions": {
    "allow": [
      "Bash(command:pattern)",     // Allow specific bash commands
      "Write:path/pattern",        // Allow writing to paths
      "WebFetch(domain:example.com)" // Allow web fetching from domain
    ],
    "deny": [
      "Bash(rm -rf:*)"            // Block dangerous commands
    ]
  }
}
```

### Environment Variables
```json
{
  "env": {
    "NODE_ENV": "development",
    "API_KEY": "your-api-key",
    "CUSTOM_SETTING": "value"
  }
}
```

### Hooks (Advanced)
```json
{
  "hooks": {
    "beforeToolCall": {
      "Write": "echo 'About to write: $TOOL_ARG_file_path'",
      "Bash": "echo 'Running: $TOOL_ARG_command'"
    },
    "afterToolCall": {
      "Write": "echo 'File written successfully'",
      "Bash": "echo 'Command completed with code: $TOOL_EXIT_CODE'"
    }
  }
}
```

### Global Settings
```json
{
  "model": "claude-3-5-sonnet-20241022",
  "verbose": true,
  "autoUpdates": false,
  "theme": "dark",
  "additionalDirectories": ["/path/to/other/project"]
}
```

## 🤖 Subagent Catalog

### Creating Custom Subagents

```json
{
  "subagents": {
    "your-subagent-name": {
      "prompt": "Detailed description of the subagent's role and expertise",
      "permissions": {
        "allow": ["specific", "permissions", "for", "this", "agent"],
        "deny": ["blocked", "permissions"]
      }
    }
  }
}
```

### Subagent Ideas for Your Catalog

```json
{
  "subagents": {
    "security-auditor": {
      "prompt": "You are a security specialist focused on finding vulnerabilities, analyzing dependencies, and ensuring secure coding practices.",
      "permissions": {
        "allow": ["Bash(npm audit:*)", "Read:**/*", "WebFetch(domain:cve.mitre.org)"]
      }
    },
    "performance-optimizer": {
      "prompt": "You specialize in performance analysis, bundle optimization, and identifying bottlenecks in web applications.",
      "permissions": {
        "allow": ["Bash(npm run build:*)", "Bash(webpack:*)", "Read:**/*"]
      }
    },
    "documentation-writer": {
      "prompt": "You excel at creating comprehensive documentation, API docs, and maintaining README files with clear examples.",
      "permissions": {
        "allow": ["Write:**/*.md", "Read:**/*"]
      }
    },
    "test-generator": {
      "prompt": "You specialize in generating comprehensive test suites, writing test cases, and ensuring high test coverage.",
      "permissions": {
        "allow": ["Write:specs/**/*", "Write:**/*.test.ts", "Bash(jest:*)", "Bash(npm test:*)"]
      }
    },
    "code-reviewer": {
      "prompt": "You are a senior developer focused on code quality, best practices, and maintaining coding standards across the codebase.",
      "permissions": {
        "allow": ["Read:**/*", "Bash(eslint:*)", "Bash(prettier:*)"]
      }
    }
  }
}
```

## 🚀 Usage Examples

### Using Subagents
```typescript
// Within Claude Code session
Task({
  subagent_type: "playwright-expert",
  description: "Optimize test performance",
  prompt: "Review our API tests and suggest improvements for faster execution"
})

Task({
  subagent_type: "typescript-specialist",
  description: "Improve type safety",
  prompt: "Review our types and suggest stricter TypeScript configurations"
})
```

## 🔧 Best Practices

1. **Keep settings.local.json out of git** - Contains personal preferences
2. **Use settings.json for team settings** - Shared configurations
3. **Create specialized subagents** - Each with focused expertise
4. **Use hooks for automation** - Automate common tasks
5. **Be specific with permissions** - Principle of least privilege
6. **Test subagents thoroughly** - Ensure they work as expected

## 📚 Configuration Hierarchy

1. **Enterprise policies** (highest priority)
2. **Command-line arguments** (`--model`, `--permission-mode`, etc.)
3. **settings.local.json** (personal project settings)
4. **settings.json** (shared project settings)
5. **~/.claude/settings.json** (user-level global settings)

## 🎯 Quick Start Templates

### Minimal Configuration
```json
{
  "permissions": {
    "allow": ["Bash(npm:*)", "Write:src/**/*"]
  }
}
```

### Power User Configuration
```json
{
  "permissions": {
    "allow": ["Bash(*)", "Write:**/*", "Read:**/*"],
    "deny": ["Bash(rm -rf:*)", "Bash(sudo:*)"]
  },
  "env": {
    "NODE_ENV": "development"
  },
  "hooks": {
    "afterToolCall": {
      "Write": "echo 'File saved: $TOOL_ARG_file_path'"
    }
  },
  "verbose": true
}
```

---

**💡 Pro Tip**: Use `/config` to view your current settings anytime, and `/agents` to manage your subagent catalog interactively!