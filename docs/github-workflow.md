# Git and GitHub Configuration Management Workflow

The repository is prepared for a feature-branch workflow. You must perform the operations below in your own GitHub repository so that the history and screenshots prove your own work.

## 1. Initial repository setup

From the project root:

```bash
git init
git add .
git commit -m "chore: initialize StockWise inventory management system"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/stockwise-inventory-management-system.git
git push -u origin main
```

Before committing, confirm `.env`, SQLite database files, and `node_modules` are ignored. Never commit passwords, API keys, or personal credentials.

## 2. Branch naming convention

Use short, descriptive names:

```text
feature/product-management
feature/supplier-management
feature/stock-control
feature/sales-billing
feature/swagger-api-docs
fix/negative-stock-validation
```

Example:

```bash
git checkout -b feature/product-management
# make a small change, add tests, and run them
git add .
git commit -m "feat: add product catalogue management"
git push -u origin feature/product-management
```

## 3. Pull-request review evidence

For the assignment, demonstrate at least:

- One pull request that is reviewed and accepted/merged.
- One pull request that receives requested changes, is revised, and is then updated (or is rejected/closed after review, as permitted by the instructor).

Suggested genuine workflow:

1. Open a PR from `feature/product-management` to `main`.
2. Ask a classmate/teammate to review the code and tests.
3. Address the review comments and merge after approval.
4. Open another PR with a small intentional documentation or validation issue.
5. Have the reviewer request a change. Update the branch and show the revised PR. Do not merge intentionally broken code.

Do not create fake reviews or claim that a PR was rejected if GitHub does not show that event. Use the exact state accepted by your instructor and document what actually happened.

## 4. Demonstrate a merge conflict safely

Use two branches that change the same line in a disposable documentation file. Do not create a conflict in production code merely for a screenshot.

Example sequence (adapt the branch names if needed):

```bash
git checkout main
git checkout -b feature/conflict-demo-a
# Change the same sentence in docs/prototype.md to wording A
git add docs/prototype.md
git commit -m "docs: update prototype note from branch A"

git checkout main
git checkout -b feature/conflict-demo-b
# Change that same sentence in docs/prototype.md to different wording B
git add docs/prototype.md
git commit -m "docs: update prototype note from branch B"

git checkout feature/conflict-demo-a
git merge feature/conflict-demo-b
```

Git should report a conflict if both branches edited the same lines. Resolve it by opening the conflicted file, keeping one correct final version, and deleting the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`). Then:

```bash
git add docs/prototype.md
git commit -m "merge: resolve prototype documentation conflict"
```

Use `git status` and `git log --oneline --graph --decorate --all` to show the result. The exact conflict must be created and resolved by you; it cannot be truthfully pre-created as evidence in a downloaded starter package.

## 5. Commit message examples

```text
feat: add supplier management endpoints
feat: record stock movements
fix: prevent sales when stock is insufficient
test: cover stock-out validation
refactor: separate inventory business logic
 docs: add Swagger API usage guide
ci: run backend tests and frontend build
```

Use meaningful messages that describe the actual change.

## 6. README and repository evidence

Keep the root README current. For the final report, capture:

1. Repository page with README.
2. Branch list.
3. Commit history with meaningful messages.
4. Accepted pull request and its review.
5. Revised/rejected pull request and review comments.
6. Merge conflict and the resolved file/commit.
7. GitHub Actions workflow with a successful run.

Paste actual repository and PR links into your report. The starter code does not contain fabricated PR history or merge-conflict evidence.
