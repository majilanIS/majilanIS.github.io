# CI/CD & GitHub Actions — Self-Study Guide

*Built from your real project (`majilanIS.github.io`) — a React/Vite site deployed to GitHub Pages.*

This guide walks you through **exactly** the workflow you just deployed, section by section, so you can teach yourself CI/CD. Read it in order, then do the exercises at the end.

---

## 1. What is CI/CD?

Two ideas that always come together:

- **CI — Continuous Integration**: every time you push code, the server automatically *builds* it and runs checks (compile, tests, lint). Goal: catch problems early, before they reach users.
- **CD — Continuous Deployment (or Delivery)**: if the build passes, the server automatically puts the result where users can access it (a website, an API, a server).

Your site is a perfect example:
- **Build** = `vite build` (turns your React/JS source into static files in `dist/`).
- **Deploy** = uploading `dist/` to GitHub Pages and publishing it.

CI/CD is usually written as **a YAML file** that lives in your repo. GitHub reads it and runs it for you on their servers (called **runners**). This is what GitHub Actions is.

---

## 2. Where does GitHub look for workflows?

```
.github/
└── workflows/
    └── deploy.yml
```

That file is a workflow. GitHub reads it on every push. You only need one file to get automation.

**Watch-out**: this folder must be committed and pushed — a workflow only exists if it's on the remote branch GitHub is watching.

---

## 3. Anatomy of your workflow

Here is the file you created, labeled.

```yaml
name: Deploy GitHub Pages                          # ← human-readable name
                                                   #
on:                                                # ← EVENT (trigger): WHEN does it run?
  push:                                            #
    branches: ["main"]                             #   → on every push to 'main'
                                                   #
permissions:                                       # ← SECURITY: what the token may do
  contents: read                                   #   read repo files
  pages: write                                     #   update GitHub Pages
  id-token: write                                  #   mint a short-lived OIDC token
                                                   #
jobs:                                              # ← WORK: WHAT does it do (parallel work units)
  build:                                           #   ── job #1 ──
    runs-on: ubuntu-latest                         #   runs on a fresh Linux machine
    steps:                                         #
      - uses: actions/checkout@v4                  #     copy repo into the machine
      - uses: actions/setup-node@v4                #     install Node.js
      - run: npm ci                                #     install dependencies
      - run: npm run build                         #     compile → creates dist/
      - uses: actions/upload-pages-artifact@v3     #     save dist/ for the next job
        with:                                      #
          path: ./dist                             #
                                                   #
  deploy:                                          #   ── job #2 ──
    needs: build                                   #   waits for 'build' to finish
    runs-on: ubuntu-latest                         #
    environment:                                   #   deploy protection rules attach here
      name: github-pages                           #
      url: ${{ steps.deployment.outputs.page_url }}#
    steps:                                         #
      - id: deployment                             #     name this step 'deployment'
        uses: actions/deploy-pages@v4              #     publish the artifact to Pages
```

This is the whole mental model of GitHub Actions:

```
event  →  jobs  →  steps  →  actions / run
```

Start by understanding these six words, and you understand 90% of CI/CD files.

---

## 4. The six concepts you must understand

### 4.1 `on:` — the trigger (event)
Defines *when* the workflow starts. Yours runs on a push to `main`.
Other common triggers:

```yaml
on:
  push:                               # any push to any branch
  pull_request:                       # a PR is opened/updated
  schedule:
    - cron: "0 3 * * *"               # every night at 03:00 UTC
  workflow_dispatch:                  # a manual "Run workflow" button in the UI
```

### 4.2 `jobs:` — the work units
A job is a **fresh, isolated machine** (VM). Each job gets its own copy of your repo — jobs can't share files directly. That's why you have two jobs:

- `build`: makes `dist/`
- `deploy`: publishes it

Job A → Job B handover happens with `needs:` and **artifacts**.

### 4.3 `steps:` — do the work
Inside each job, steps run top-to-bottom. Each step is either:

- `uses:` — a **pre-made action** from the marketplace (like a function someone else wrote), or
- `run:` — a shell command you type yourself.

> **Reading a version tag:** `actions/checkout@v4` — the `@v4` is a Git tag/ref meaning "use version 4". Pinning a major version (not floating `@main`) keeps builds stable.

### 4.4 `needs:` — ordering jobs
`deploy` has `needs: build`, so `build` must complete *successfully* first. If the build fails, deploy is skipped automatically. **This is CI/CD working: bad code never ships.**

### 4.5 `permissions:` — what the token may do
When the workflow runs, GitHub gives it a special **`GITHUB_TOKEN`** — an automatic, short-lived token representing the workflow (not a human). It starts with minimal power, and `permissions:` opens up exactly what's needed:

```yaml
permissions:
  contents: read      # checkout needs to read the repo
  pages: write        # deploy-pages needs to update the Pages API
  id-token: write     # lets GitHub verify the token via OpenID Connect
```

### 4.6 `environment:` — rules and visibility
Environments (like `github-pages`) let you attach *protections* (who may deploy, approval required) and show you **deployment history** in the UI. You can have `production`, `staging`, `test`, etc. — each with its own rules and secrets.

---

## 5. The bug you fixed (and why you should feel good)

Your deploy failed with `HttpError: Requires authentication (status: 401)`.

- **Symptom**: the deploy step tried to call GitHub's API to create a Pages deployment, but the token was rejected.
- **Cause**: the workflow file had **no `permissions:` block**, so the default token had no `pages: write` scope. You literally asked it to do a thing it was not allowed to do — GitHub answered `401 Unauthorized`.
- **Fix**: declare `permissions: { contents: read, pages: write, id-token: write }` at the workflow top.

**Lesson to internalize:** never hardcode a personal token in the file. Use the automatic `GITHUB_TOKEN` — or, better, **secrets** (see below).

### When you still see 401 even WITH permissions
It usually means one of these. Always check in this order:
1. Repo → **Settings → Pages → Build and deployment → Source = "GitHub Actions"**.
2. No custom `token:` input is overriding the default.
3. The environment `github-pages` doesn't have approval rules blocking you.
4. The run came from a fork/PR (forks get read-only tokens for safety).

---

## 6. Real quick glossary — stamp these in your head

| Term | Meaning |
|---|---|
| **Workflow** | One `.yml` file = one automation |
| **Event** | What starts the workflow (`push`, `pull_request`, `schedule`) |
| **Job** | A unit of work on a fresh VM |
| **Step** | One action (= `uses:`) or one command (= `run:`) |
| **Action** | A reusable block of code, versioned like a library |
| **Runner** | GitHub's machine that executes the job (`ubuntu-latest`) |
| **Artifact** | Files saved from one job, passed to another (`upload-pages-artifact`) |
| **Token** | `GITHUB_TOKEN` — the automation's automatic identity |
| **Secret** | Private value stored on GitHub, injected at runtime (`${{ secrets.X }}`) |
| **Environment** | Named target + protection rules (`github-pages`) |
| **Expression** | Dynamic value like `${{ steps.deployment.outputs.page_url }}` |

---

## 7. Reading variables & secrets (so nothing is hardcoded)

```yaml
- run: echo "Branch is ${{ github.ref }}"
- run: echo "Committing user is ${{ github.actor }}"
- run: echo "My secret is ${{ secrets.API_KEY }}"   # never print this in prod!
```

**Secrets** live in Settings → Secrets and variables → Actions, and are injected only at runtime. Never commit secrets.

**Expressions** in `${{ ... }}` are evaluated by GitHub. `steps.deployment.outputs.page_url` reads the output named `deployment` from `actions/deploy-pages` → that's how the deploy gets its URL.

---

## 8. The 3 mental checkpoints when writing any workflow

Before pushing a workflow, ask yourself:

1. **When?** → `on:` correct? Branch name right?
2. **What token can do?** → `permissions:` include what each action needs?
3. **What must happen first?** → `needs:` + artifacts wired correctly?

If your workflow touches GitHub *state* (deploy, issues, PRs, releases), you must grant a permission. That's the #1 cause of 401/403 errors — congratulations, you've already hit it.

---

## 9. How to teach yourself further (practical path)

### Step 1: Watch your own pipeline
Repo → **Actions** tab. For each run: click it → you'll see each job, each step, its logs, and the exit code. Get comfortable debugging from the UI.

### Step 2: Make a small change on purpose
Trigger `workflow_dispatch` manually (add `workflow_dispatch:` under `on:`) so you can click "Run workflow" without pushing. Watch it.

### Step 3: Run a build locally with `act`
`act` (https://github.com/nektos/act) runs workflows on your machine with Docker, so you test before pushing:

```bash
act -j build          # run only the build job
act --list            # list jobs
```

### Step 4: Do these mini-exercises (in a scratch repo!)
1. Add a job that echos the current branch and commit SHA.
2. Add a lint step (`npm run lint`) before build — this is classic CI: fail fast.
3. Create a secret, use it in a step, print its length (never its value).
4. Make `deploy` only run `if: github.ref == 'refs/heads/main'`.

### Step 5: Read one official doc slowly
- https://docs.github.com/en/actions/writing-workflows → "Workflow syntax" and "Variables and expressions".

### Level up ladder (deps, not RNG)
1. Static Vite site → GitHub Pages (**done** ✅)
2. Add lint/test job to the same pipeline
3. Deploy to Azure/AWS/Netlify (same concepts, different actions)
4. Docker build + push to a registry
5. Learn `act`, then move to branching strategies (trunk-based, GitFlow)

---

## 10. The "one picture" summary

```
You push            GitHub sees event            Fresh machine boots
   ▼                        ▼                          ▼
 on: push ─────────► runs workflow ───────────► job build (ubuntu-latest)
   [main]                                 │        npm ci → npm run build
                                          │        upload artifact (dist/)
                                          ▼        (artifacts cross the wire)
                                      job deploy ─ requires all of build passed
                                          │        deploy-pages publishes it
                                          ▼
                                   https://<you>.github.io/  🎉
```

---

## Final thought
You don't need to learn "GitHub Actions" first. You need to learn **the event → jobs → steps** model, and that any tool they give you (GitLab CI, Azure DevOps, CircleCI) is the same model with a different name. You already understand your own pipeline end-to-end — that's the hard 80%. Keep going.