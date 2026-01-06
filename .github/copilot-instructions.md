# AI Instructions for Node.js CLI Projects

## Project Structure

### Directory Layout
- `src/` - Source code
- `bin/` - CLI executable scripts
- `tests/` - Test files
- `docs/` - Public-facing documentation (users, system admins, etc.) - can be used to populate a website or PDF
- `dev-notes/` - Development notes and discussions

### Key Files
- `package.json` - Project configuration and dependencies
- `README.md` - Project documentation
- `.gitignore` - Git ignore patterns

## Coding Standards

### General Principles
- Write clean, readable, and maintainable code
- Follow Node.js best practices
- Use consistent formatting and naming conventions

### File Organization
- One module per file
- Clear separation of concerns
- Logical grouping of related functionality

### Error Handling
- Always handle errors appropriately
- Provide meaningful error messages
- Use try-catch blocks where necessary

### Documentation
- Add JSDoc comments for public functions
- Keep README.md up to date
- Document complex logic inline

## Environment Configuration

### Configuration Normalization

**CRITICAL:** Avoid `process.env.VAR_NAME` references scattered throughout your codebase. Centralize all environment variable access in a single configuration module that:

- Loads and normalizes environment variables at startup
- Provides sensible defaults for all configuration values
- Validates required variables in production
- Exposes a strongly-typed configuration object

This approach provides:

- Single source of truth for configuration
- Type safety throughout the application
- Easy testing (mock the config object, not `process.env`)
- Clear defaults visible in one place

**Example pattern:**
```javascript
// src/config.js
module.exports = {
  port: process.env.PORT || 3000,
  logLevel: process.env.LOG_LEVEL || 'info',
  apiKey: process.env.API_KEY || null,
  // ... all other config
};

// Validate required config in production
if (process.env.NODE_ENV === 'production' && !module.exports.apiKey) {
  throw new Error('API_KEY is required in production');
}
```

### Environment File Structure

Standard `.env` file organization:

```
.env              # Development secrets (gitignored, 0600 permissions)
.env.example      # Development template (tracked in git)
.env.test         # Test secrets (gitignored, 0600 permissions)
.env.test.example # Test template (tracked in git)
```

**Example `.env.example`:**

```bash
##
# .env.example
#
# Example environment configuration file
# Copy this file to .env and modify the values as needed
#
LOG_LEVEL=info
```

**Git tracking:**

- `.env` and `.env.test` - NEVER commit (add to .gitignore)
- `.env.example` and `.env.test.example` - ALWAYS commit (tracked in git)

**File permissions on Linux/macOS:**

- `.env` and `.env.test` MUST have 0600 permissions (read/write for owner only)
- Application startup should validate permissions and fail if incorrect
- This prevents accidental exposure of secrets through misconfigured file permissions

**.gitignore:**

```
# Environment files
.env
.env.test
```

## CLI Development

### Command Structure
- Use clear, descriptive command names
- Provide help text for all commands
- Support common flags (--help, --version, etc.)

### User Experience
- Provide clear output and feedback
- Use colors/formatting for better readability
- Handle edge cases gracefully

### Configuration
- Support configuration files
- Allow environment variable overrides
- Provide sensible defaults

## Dependencies

### Package Management
- Keep dependencies minimal and up to date
- Document why each dependency is needed
- Prefer well-maintained packages

### Preferred Packages

**Command Parsing:**
- Use `commander` - Industry standard, simple API, excellent for subcommands

**Interactive Prompts:**
- Use `inquirer` - Best-in-class interactive CLI prompts

**Terminal Output:**
- Use `chalk` - Terminal string styling and colors
- Use `ora` - Elegant terminal spinners for progress indication
- Use `cli-table3` - Pretty unicode tables for displaying results

**Configuration:**
- Use `dotenv` - Essential for loading environment variables from .env files

**HTTP Requests:**
- Prefer Node's built-in **Fetch API** for HTTP requests
- Only use `axios` if advanced features are needed that Fetch doesn't provide

**Logging:**
- Create a simple custom logger that wraps `console.log()` and `console.error()`
- Monitor `LOG_LEVEL` from the global config object
- Keep it minimal - avoid external logging libraries

### Packages to Avoid

- **winston** - Too heavy; use simple custom logger instead
- **pino** - Too heavy; use simple custom logger instead
- **axios** - Only use if Fetch API is insufficient; prefer built-in Fetch

## Testing

### Test Coverage
- Write tests for core functionality
- Test edge cases and error conditions
- Maintain good test coverage

## Git Workflow

### Commits
- Write clear, descriptive commit messages
- Make atomic commits
- Reference issues where applicable

### Branching
- Use feature branches for new work
- Keep main branch stable
- Review changes before merging
