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
- `.gitignore` - Git ignore patterns- `.prettierrc.json` - Prettier formatting configuration
- `.eslintrc.json` - ESLint rules configuration
## Coding Standards

### General Principles
- Write clean, readable, and maintainable code
- Follow Node.js best practices
- Use consistent formatting and naming conventions

### Code Formatting & Linting

**Prettier** is used for automatic code formatting:
```bash
# Format all files (write changes)
npm run format

# Check formatting without writing
npm run format:check
```

**ESLint** is used for code quality and standards:
```bash
# Check code for issues
npm run lint

# Fix issues automatically
npm run lint:fix
```

All code MUST:
- Be formatted with Prettier before commit
- Pass ESLint checks
- Use 2-space indentation
- Have no unused variables or imports
- Use consistent quotes (single quotes preferred)
- Include trailing semicolons

### Before Committing
Always run:
```bash
npm run format
npm run lint:fix
npm test
npm audit
```

This ensures clean, consistent code style, passes all tests, and checks for security vulnerabilities before committing.

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

## Code Quality Tools

### Prettier Configuration

**`.prettierrc.json`** - Prettier formatting configuration:

```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "printWidth": 100,
  "arrowParens": "avoid"
}
```

- Single quotes preferred
- Trailing commas in objects and arrays
- 2-space indentation
- Semicolons required
- 100 character line width
- Arrow function parens only when necessary

### ESLint Configuration

**`eslint.config.cjs`** - ESLint rules configuration:

```json
{
  "env": {
    "node": true,
    "es2021": true
  },
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-console": "off",
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "prefer-const": "error",
    "eqeqeq": ["error", "always"],
    "curly": "error"
  }
}
```

Key rules:
- Console usage allowed (for CLI apps)
- Unused variables prohibited (unless prefixed with `_`)
- Const preferred over let/var
- Strict equality required (`===`)
- Explicit braces required

### npm Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.js\" \"bin/**/*.js\" \"tests/**/*.js\"",
    "format:check": "prettier --check \"src/**/*.js\" \"bin/**/*.js\" \"tests/**/*.js\"",
    "lint": "eslint \"src/**/*.js\" \"bin/**/*.js\" \"tests/**/*.js\"",
    "lint:fix": "eslint \"src/**/*.js\" \"bin/**/*.js\" \"tests/**/*.js\" --fix",
    "test": "node --test tests/**/*.js",
    "precommit": "npm run format && npm run lint:fix"
  }
}
```

Use these scripts:
- `npm run format` - Format all code with Prettier
- `npm run format:check` - Check formatting without writing (CI)
- `npm run lint` - Check code quality with ESLint
- `npm run lint:fix` - Auto-fix linting issues
- `npm run test` - Run test suite (when implemented)
- `npm run precommit` - Run before commits (optional git hook)

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
