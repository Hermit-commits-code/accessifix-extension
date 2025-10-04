# Changelog

All notable changes to the AccessiFix extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Extensibility: dynamic plugin and rule registration API in DOMScanner
- Per-site and per-rule configuration support for rule engine

### Changed

- Developer documentation updated for extensibility and configuration features

## [0.3.0] - DOMScanner Performance & Integration

### Added

- DOMScanner performance optimizations: selector-based traversal, rule filtering, debounced MutationObserver scans
- Expanded Playwright integration tests for DOMScanner (SPA, dynamic, real-world scenarios)

### Changed

- DOMScanner.scan now uses targeted queries for rules, reducing memory and CPU usage
- MutationObserver in DOMScanner.observeAndScan is debounced to batch DOM changes

## [0.2.3] - Minor improvements

### Added

- Finalized DOMScanner integration with robust Playwright tests
- Documented jsdom limitations in unit tests

## [0.2.2] - Minor improvements

### Added

- Finalized storage system implementation, documentation, and tests

## [0.2.1] - Storage System Enhancements

## [0.2.0] - Rule Engine Foundation

## [0.1.4] - Minor improvements

### Fixed

- Cleaned up CI workflow and prepared for proper release

## [0.1.3] - Minor improvements

### Changed

- Prepared for v0.1.2 release and tagging

## [0.1.2] - Minor improvements

### Added

- Installed ts-loader and verified local build success

## [0.1.1] - Minor improvements

### Added

- Installed ts-loader and verified local build success

## [0.1.0] - Initial project setup

## Release Notes Format

Each version will include:

## Version Numbering

Examples:

## Development Version Tags

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

## [0.2.0] - Rule Engine Foundation

### Added

- Modular, extensible rule engine architecture
- Robust ARIA, contrast, navigation, and typography rules (WCAG/ARIA standards)
- Professional documentation and inline comments
- Type-safe test suite for rule engine and rules
- Linting and CI/CD ready for automation

## [0.2.1] - Storage System Enhancements

### Added

- Local storage wrapper with error handling
- Settings schema validation (TypeScript + Zod)
- Per-site configuration structure
- Import/export functionality base for settings

## [0.1.0] - Initial project setup

### Added

- Project structure, documentation, and CI/CD pipeline
- Initial manifest.json and extension scaffolding
- Development tooling (TypeScript, Webpack, ESLint, Prettier, Jest)
- Professional README, CHANGELOG, LICENSE, CONTRIBUTING, CODE_OF_CONDUCT
