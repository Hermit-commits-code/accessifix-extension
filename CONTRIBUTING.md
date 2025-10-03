# Contributing to AccessiFix

Thank you for your interest in contributing to AccessiFix! We're building the most comprehensive accessibility extension for browsers, and we welcome contributions from developers, accessibility experts, designers, and users.

## 🎯 Project Vision

AccessiFix aims to make the web more accessible by automatically fixing common accessibility issues in real-time. We use deterministic, rule-based logic to ensure predictable and reliable fixes that comply with WCAG guidelines.

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [conduct@accessifix.tools](mailto:conduct@accessifix.tools).

## 🚀 Ways to Contribute

### 1. 🐛 Bug Reports

Found a bug? Help us fix it!

**Before submitting:**

- Search existing issues to avoid duplicates
- Test on the latest version
- Check if it's reproducible across different websites

**When submitting:**

- Use the bug report template
- Include browser version and extension version
- Provide steps to reproduce
- Include screenshots/videos if helpful
- Mention specific websites where the issue occurs

### 2. 💡 Feature Requests

Have an idea for a new accessibility fix or feature?

**Before submitting:**

- Check our [roadmap](./ROADMAP.md) to see if it's already planned
- Search existing feature requests
- Consider the WCAG compliance aspect

**When submitting:**

- Use the feature request template
- Explain the accessibility problem it solves
- Provide examples of affected websites
- Reference relevant WCAG guidelines

### 3. 🔧 Code Contributions

Ready to dive into the code?

**Good first issues:**

- Look for issues labeled `good-first-issue`
- Documentation improvements
- Test coverage expansion
- Simple rule implementations

**Development areas:**

- Accessibility rule development
- Performance optimizations
- UI/UX improvements
- Cross-browser compatibility
- Testing and quality assurance

### 4. 📚 Documentation

Help improve our documentation!

- User guides and tutorials
- Developer API documentation
- Code comments and examples
- Translation and localization

### 5. 🧪 Testing

Help ensure AccessiFix works perfectly!

- Test on different websites
- Verify accessibility improvements
- Performance testing
- Cross-browser compatibility testing
- Screen reader compatibility testing

## 🛠️ Development Setup

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Firefox Developer Edition (for testing)
- Git

### Getting Started

1. **Fork and Clone**

   ```bash
   git clone https://github.com/yourusername/accessifix-extension.git
   cd accessifix-extension
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Development Commands**
   ```bash
   npm run watch          # Start development build
   npm test              # Run tests
   npm run lint          # Check code quality
   npm run format        # Format code
   npm run dev:firefox   # Load in Firefox Developer Edition
   ```

### Project Structure

```
accessifix-extension/
├── background/           # Service worker and rule engine
│   ├── background.js     # Main background script
│   └── rules/           # Individual accessibility rules
├── content/             # Content scripts for DOM manipulation
├── popup/               # Browser action popup interface
├── options/             # Settings and configuration page
├── utils/               # Shared utility functions
├── tests/               # Test suites
└── docs/                # Documentation
```

## 📝 Development Guidelines

### Code Style

We use automated tools to ensure consistent code quality:

- **ESLint**: For code quality and consistency
- **Prettier**: For code formatting
- **Jest**: For testing
- **Conventional Commits**: For commit message format

### Coding Standards

```javascript
// Good: Use meaningful variable names
const contrastRatio = calculateContrastRatio(foreground, background);

// Good: Add JSDoc comments for functions
/**
 * Calculates WCAG contrast ratio between two colors
 * @param {string} foreground - Foreground color (hex/rgb)
 * @param {string} background - Background color (hex/rgb)
 * @returns {number} Contrast ratio (1-21)
 */
function calculateContrastRatio(foreground, background) {
  // Implementation
}

// Good: Handle errors gracefully
try {
  const element = document.querySelector(selector);
  if (!element) {
    console.warn(`Element not found: ${selector}`);
    return;
  }
  applyFix(element);
} catch (error) {
  console.error('Fix application failed:', error);
}
```

### Accessibility Rules Development

When creating new accessibility rules:

1. **Follow WCAG Guidelines**: Ensure compliance with WCAG 2.1/2.2
2. **Be Conservative**: Don't break existing functionality
3. **Test Thoroughly**: Verify on multiple websites
4. **Document Impact**: Explain what the rule fixes
5. **Consider Performance**: Optimize for speed and memory usage

```javascript
// Example rule structure
export class ContrastRule extends AccessibilityRule {
  name = 'contrast-enhancement';
  priority = 10;
  wcagLevel = 'AA';
  wcagCriteria = '1.4.3';

  detect(element) {
    // Detection logic
  }

  apply(element) {
    // Fix application logic
  }

  undo(element) {
    // Undo logic for reversibility
  }
}
```

### Testing Requirements

- **Unit Tests**: Test individual functions and classes
- **Integration Tests**: Test rule application on DOM elements
- **Performance Tests**: Ensure fixes don't impact page performance
- **Accessibility Tests**: Verify the extension itself is accessible

```javascript
// Example test
describe('ContrastRule', () => {
  test('should enhance low contrast text', () => {
    const element = createTestElement({
      color: '#ccc',
      backgroundColor: '#ddd',
    });

    const rule = new ContrastRule();
    rule.apply(element);

    const ratio = getContrastRatio(element);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});
```

## 🔄 Pull Request Process

### Before Submitting

1. **Create an Issue**: Discuss the change first (unless it's a small fix)
2. **Fork the Repository**: Work on your own fork
3. **Create a Branch**: Use descriptive branch names (`feature/aria-label-enhancement`)
4. **Write Tests**: Include tests for new functionality
5. **Update Documentation**: Update relevant docs and README if needed

### Submission Checklist

- [ ] Code follows project style guidelines
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] Commits follow conventional format
- [ ] No merge conflicts with main branch
- [ ] Changes are focused and atomic

### Commit Message Format

We use [Conventional Commits](https://conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```
feat(rules): add ARIA label injection for buttons
fix(contrast): improve color detection algorithm
docs(readme): update installation instructions
test(scanner): add DOM traversal performance tests
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests and quality checks
2. **Code Review**: Maintainers review code for quality and functionality
3. **Accessibility Review**: Verify accessibility improvements are effective
4. **Testing**: Manual testing on various websites
5. **Documentation**: Ensure documentation is clear and complete

## 🏷️ Release Process

### Version Numbers

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes or major feature overhauls
- **MINOR** (0.1.0): New features in backward-compatible manner
- **PATCH** (0.0.1): Backward-compatible bug fixes

### Release Timeline

- **Patch releases**: As needed for critical bug fixes
- **Minor releases**: Every 2-3 weeks during active development
- **Major releases**: Quarterly or for significant architecture changes

## 🎖️ Recognition

Contributors are recognized in several ways:

- **README Contributors Section**: All contributors listed
- **Release Notes**: Major contributions highlighted
- **Hall of Fame**: Outstanding contributors featured
- **Swag**: Active contributors receive AccessiFix merchandise

## 💬 Communication

### Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Discord**: Real-time chat for development coordination
- **Email**: [contributors@accessifix.tools](mailto:contributors@accessifix.tools)

### Community Guidelines

- Be respectful and inclusive
- Focus on accessibility impact
- Provide constructive feedback
- Help newcomers get started
- Share knowledge and expertise

## 📚 Resources

### Accessibility Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [A11y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### Development Resources

- [WebExtensions API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Jest Testing Framework](https://jestjs.io/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Conventional Commits](https://conventionalcommits.org/)

## ❓ Questions?

Don't hesitate to ask questions! We're here to help:

1. **Check existing documentation** first
2. **Search closed issues** for similar questions
3. **Ask in GitHub Discussions** for general questions
4. **Create an issue** for specific problems
5. **Join our Discord** for real-time help

Thank you for contributing to making the web more accessible! 🌟
