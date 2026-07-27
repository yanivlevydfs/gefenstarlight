# Contributing to GefenStarlight

Thank you for your interest in contributing to **GefenStarlight**! We appreciate all contributions, from bug reports and documentation fixes to feature additions and architectural enhancements.

---

## 📋 Table of Contents

1. [Code of Conduct](#-code-of-conduct)
2. [Getting Started](#-getting-started)
3. [Development Workflow](#-development-workflow)
4. [Commit Conventions](#-commit-conventions)
5. [Pull Request Process](#-pull-request-process)
6. [Reporting Issues](#-reporting-issues)

---

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any unacceptable behavior to project maintainers.

---

## 🚀 Getting Started

1. **Fork the Repository**: Create a personal fork on GitHub.
2. **Clone your Fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/gefenstarlight.git
   cd gefenstarlight
   ```
3. **Set Up Upstream Remote**:
   ```bash
   git remote add upstream https://github.com/yanivlevydfs/gefenstarlight.git
   ```

---

## 🔄 Development Workflow

1. **Create a Feature Branch**:
   Always work in a descriptive feature branch created from `main`:
   ```bash
   git checkout main
   git pull upstream main
   git checkout -b feature/your-feature-name
   ```
2. **Make & Test Changes**:
   Ensure all existing and new tests pass locally before committing.

---

## 📝 Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/) for clear and structured commit messages. Format your commit messages as:

```text
<type>(<scope>): <short summary>

[optional body]

[optional footer(s)]
```

### Allowed Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (whitespace, formatting, missing semi-colons)
- `refactor`: Code changes that neither fix a bug nor add a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Build process, dependencies, or auxiliary tool changes

### Example
```text
feat(auth): add OAuth2 token refresh support

Implements automatic token renewal when expired.

Closes #42
```

---

## 🔀 Pull Request Process

1. Ensure documentation is updated for any new features or changed behaviors.
2. Update `CHANGELOG.md` under the `[Unreleased]` header.
3. Open a Pull Request targeting the `main` branch.
4. Provide a clear description using the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md).
5. Address code review feedback promptly.

---

## 🐛 Reporting Issues

Before opening a new issue, please check existing issues to avoid duplicates.

- **Bug Reports**: Use the [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md).
- **Feature Requests**: Use the [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md).
- **Security Concerns**: Refer to our [Security Policy](SECURITY.md).
