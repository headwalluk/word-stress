# Publishing to npm

This guide explains how to publish `word-stress` to the npm registry.

## Prerequisites

1. Node.js 21+ installed
2. npm account (you have one at https://www.npmjs.com/~headwall)
3. Git repository with all changes committed

## Publishing Steps

### 1. Ensure You're Logged Into npm

```bash
npm login
# Enter your npm username: headwall
# Enter your password: [your npm password]
# Enter your email: [your registered email]
```

### 2. Verify Package Details

Before publishing, verify the package information:

```bash
# Check the package will be published correctly
npm publish --dry-run

# Review what files will be included
npm pack --dry-run
```

### 3. Publish to npm Registry

```bash
npm publish
```

This will:
- Upload `word-stress` to npm registry
- Make it available at https://www.npmjs.com/package/word-stress
- Allow users to install via: `npm install -g word-stress` or `npx word-stress`

### 4. Verify Publication

After publishing, verify it's available:

```bash
npm info word-stress
npm view word-stress versions
```

### 5. Test Installation via npx

After publication, anyone with Node.js 21+ can run:

```bash
npx word-stress --duration 10 example.com
```

## Updating the Package

To release a new version:

1. Update version in `package.json`:
   ```bash
   npm version patch  # for bugfixes (1.0.0 → 1.0.1)
   npm version minor  # for features (1.0.0 → 1.1.0)
   npm version major  # for breaking changes (1.0.0 → 2.0.0)
   ```

2. Create git tag:
   ```bash
   git tag -a v1.0.1 -m "Release version 1.0.1"
   git push origin main --tags
   ```

3. Publish new version:
   ```bash
   npm publish
   ```

## Package Size Optimization

The `.npmignore` file ensures minimal package size by excluding:
- Development configuration files
- Development notes
- Tests
- GitHub workflows
- IDE configuration

Current estimated package size: ~50KB (with dependencies ~500KB installed)

## Reverting a Publication

If you need to unpublish a version within 72 hours of publication:

```bash
npm unpublish word-stress@1.0.0
```

For production packages, it's better to release a patch version instead of unpublishing.
