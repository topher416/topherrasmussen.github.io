# AGENTS.md

## Repo Identity

- GitHub owner: `topher416`
- Git identity: `Topher Rasmussen <topher416@gmail.com>`
- Canonical remote: `https://github.com/topher416/topherrasmussen.github.io.git`

## Required GitHub Auth Guardrail (Run Before Push)

Always run this sequence before any `git push` from this repository:

1. Check active GitHub CLI account:
   - `gh auth status`
2. If active account is not `topher416`, switch:
   - `gh auth switch -u topher416`
3. Verify repo-local credential helper uses GitHub CLI credentials:
   - `git config --local --get-all credential.helper`
4. If `!gh auth git-credential` is missing, set it:
   - `git config --local credential.helper ""`
   - `git config --local --add credential.helper "!gh auth git-credential"`
5. Verify remote points to this repo owner:
   - `git remote -v`
6. Push:
   - `git push origin <branch>`

## If Push Fails With 403 (Denied To `thtopher`)

Use this exact recovery:

1. `gh auth switch -u topher416`
2. `git config --local credential.helper ""`
3. `git config --local --add credential.helper "!gh auth git-credential"`
4. `git push origin <branch>`
