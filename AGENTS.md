# Universal Project Bootstrap & Agent Orchestration Guide

This document defines the automated operational protocol for any AI agent interacting with this workspace.

---

## 1. Global Registry Reference
The system's modular library is located at:
- **Rules & Guardrails:** `~/.gemini/antigravity/rules/`
- **Domain Skills & SOPs:** `~/.gemini/antigravity/skills/`
- **Specialized Subagents:** `~/.gemini/antigravity/agents/`

---

## 2. Dynamic Tech Stack & Rule Resolution
Before writing, refactoring, or reviewing code, the agent MUST:
1. **Always enforce common hygiene:** Read and comply with `~/.gemini/antigravity/rules/common/` (security, secrets prevention, and general hygiene).
2. **Auto-detect repository languages:** Inspect package manifests (e.g., `package.json`, `go.mod`, `Cargo.toml`, `pyproject.toml`, `build.gradle.kts`, etc.) and file extensions across the workspace.
3. **Load corresponding language rules:** Dynamically load and adhere to the relevant rule sets found in `~/.gemini/antigravity/rules/<detected-language>/`.

---

## 3. Just-In-Time (JIT) Skill & Agent Discovery
Do not flood the context window upfront. Dynamically locate and read relevant files only when execution demands it:
- **Planning & Architecture:** Assume roles from `~/.gemini/antigravity/agents/planner.md` or `architect.md` for major features or design decisions.
- **TDD & Logic Implementation:** Reference `~/.gemini/antigravity/skills/tdd-workflow/` or framework-specific testing skills prior to generating implementation code.
- **Domain-Specific Workflows:** Discover targeted SOPs under `~/.gemini/antigravity/skills/<topic>/` (e.g., database patterns, error handling, performance optimization).
- **Code & Security Audits:** Use `~/.gemini/antigravity/agents/code-reviewer.md` or `security-reviewer.md` before approving code changes or preparing commits.

---

## 4. Execution Workflow
1. **Context Check:** Detect stack $\rightarrow$ Read `rules/common/` + `rules/<detected-stack>/`.
2. **Scope & Plan:** Clarify requirements and break down multi-step tasks.
3. **Execute & Verify:** Apply relevant domain skills (TDD, contract-first, clean architecture) and verify against build/type errors.
4. **Audit:** Ensure no secrets are leaked, unnecessary dependencies are added, or dead code remains.