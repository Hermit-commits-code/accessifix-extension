# Changelog

All notable changes to the AccessiFix extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial project structure and development environment setup
- Professional documentation framework (README, CHANGELOG, ROADMAP)
- Comprehensive package.json with all development scripts and dependencies
- WebExtensions manifest.json with proper permissions and configuration
- Development tooling setup (ESLint, Prettier, Jest, Webpack)

### Fixed

- Installed missing ESLint plugin: @typescript-eslint/eslint-plugin for linting TypeScript files

### Changed

### Deprecated

### Removed

### Fixed

### Security

---

## Release Notes Format

Each version will include:

- **Added**: New features and capabilities
- **Changed**: Modifications to existing functionality
- **Deprecated**: Features marked for removal in future versions
- **Removed**: Features that have been removed
- **Fixed**: Bug fixes and issue resolutions
- **Security**: Security-related improvements and fixes

## Version Numbering

- **MAJOR** version: Incompatible API changes or major feature overhauls
- **MINOR** version: New functionality added in backward-compatible manner
- **PATCH** version: Backward-compatible bug fixes and minor improvements

Examples:

- `1.0.0` → `1.0.1`: Bug fix release
- `1.0.1` → `1.1.0`: New feature release
- `1.1.0` → `2.0.0`: Breaking change release

## Development Version Tags

- `0.x.x`: Pre-release versions during initial development
- `x.x.x-alpha.x`: Alpha releases for early testing
- `x.x.x-beta.x`: Beta releases for broader testing
- `x.x.x-rc.x`: Release candidates before stable release

## Release Process

1. Update version in `package.json` and `manifest.json`
2. Update `CHANGELOG.md` with all changes since last release
3. Run full test suite and validation
4. Create signed commit with conventional commit message
5. Tag release with semantic version
6. Build production artifacts
7. Create GitHub release with detailed notes
8. Publish to extension stores (Firefox Add-ons, Chrome Web Store)

Every release, no matter how small, will be properly documented and tagged.
