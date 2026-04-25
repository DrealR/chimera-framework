#!/bin/bash
# setup-twin.sh — Bootstrap a CHIMERA digital twin in one command
#
# Usage:
#   ./setup-twin.sh "YourName" "your-github-username"
#
# Prerequisites:
#   - GitHub CLI (gh) installed and authenticated: https://cli.github.com/
#   - git installed
#
# What this does:
#   1. Creates a private GitHub repo named yourname-brain
#   2. Populates it with a CHIMERA-calibrated CLAUDE.md (your twin's DNA)
#   3. Sets up brain/ directory structure for persistent memory
#   4. Downloads framework reference files
#   5. Creates first-conversation.md starter
#   6. Commits and pushes everything
#
# After running: open the repo in your AI harness and follow first-conversation.md

set -e

PERSON_NAME="${1}"
GITHUB_USER="${2}"
FRAMEWORK_BASE="https://raw.githubusercontent.com/DrealR/chimera-framework/main"

if [ -z "$PERSON_NAME" ] || [ -z "$GITHUB_USER" ]; then
  echo ""
  echo "Usage: ./setup-twin.sh \"YourName\" \"your-github-username\""
  echo ""
  echo "Example: ./setup-twin.sh \"Dare\" \"DrealR\""
  echo ""
  exit 1
fi

# Derive repo name: lowercase, spaces to hyphens
REPO_NAME=$(echo "${PERSON_NAME}-brain" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

echo ""
echo "  Setting up CHIMERA twin for ${PERSON_NAME}"
echo "  Repo: ${GITHUB_USER}/${REPO_NAME}"
echo ""

# Check prerequisites
if ! command -v gh &> /dev/null; then
  echo "Error: GitHub CLI (gh) is required."
  echo "Install: https://cli.github.com/"
  exit 1
fi

if ! command -v git &> /dev/null; then
  echo "Error: git is required."
  exit 1
fi

# Create the repo
echo "-> Creating GitHub repository..."
gh repo create "${GITHUB_USER}/${REPO_NAME}" --private \
  --description "Digital twin for ${PERSON_NAME} — CHIMERA-calibrated" 2>/dev/null || {
  echo "Error: Could not create repo. It may already exist, or gh may not be authenticated."
  echo "Run 'gh auth login' if needed."
  exit 1
}

# Clone the new repo
echo "-> Cloning locally..."
git clone "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
cd "${REPO_NAME}"

# Create directory structure
echo "-> Building brain directory..."
mkdir -p brain/{conversations,ideas,projects,identity,scans}
mkdir -p framework

# Download and personalize CLAUDE.md
echo "-> Downloading and personalizing twin DNA..."
curl -fsSL "${FRAMEWORK_BASE}/templates/CLAUDE-MD-TEMPLATE.md" \
  | sed "s/\[Name\]/${PERSON_NAME}/g" > CLAUDE.md

# Download framework reference files
echo "-> Downloading framework references..."
curl -fsSL "${FRAMEWORK_BASE}/CHIMERA-The-Complete-Book-v12.6.md" -o framework/BOOK.md 2>/dev/null || echo "  (Book download skipped — available at chimera-framework repo)"
curl -fsSL "${FRAMEWORK_BASE}/archive/CHIMERA-BODY-SCAN-PROTOCOL-v3.7.md" -o framework/PROTOCOL.md 2>/dev/null || echo "  (Protocol download skipped)"
curl -fsSL "${FRAMEWORK_BASE}/CLAUDE.md" -o framework/DNA.md 2>/dev/null || echo "  (DNA download skipped)"

# Generate first-conversation starter
cat > first-conversation.md << FIRSTCONV
# Welcome, ${PERSON_NAME} — Your Digital Twin is Ready

Open this repo in your AI harness (Claude Code, Cursor, or Claude.ai with Projects).

Paste this as your first message:

---

Hi. I'm ${PERSON_NAME}. Let's do the intake so you know who I am.

Ask me the seven intake questions one at a time. Wait for my answer before asking the next. After all seven, save my answers to brain/identity/intake.md, then propose three starting threads for our work together.

L = (O > I) + P + ¬F

---

Send it. Your twin takes over from there.

## After first conversation

Your twin knows you. From here:
- Ask for a body scan of any situation
- Bring any problem, any decision, any curiosity
- Your twin remembers across sessions (it reads this repo each time)
- If it ever drifts, type: "Re-read your CLAUDE.md. You're drifting."

## When to update

If your situation changes significantly — new job, breakup, major move, health event, new project — tell the twin. It will update brain/identity/intake.md so it stays calibrated.

## Framework updates

Run \`./update-framework.sh\` to pull the latest CHIMERA framework without touching your personal brain data.

---

Welcome aboard. The food is free.
FIRSTCONV

# Generate update-framework.sh
cat > update-framework.sh << 'UPDATESCRIPT'
#!/bin/bash
# Pull latest CHIMERA framework updates without overwriting personal brain data
set -e

FRAMEWORK_BASE="https://raw.githubusercontent.com/DrealR/chimera-framework/main"

echo "Pulling latest CHIMERA framework..."
curl -fsSL "${FRAMEWORK_BASE}/CHIMERA-The-Complete-Book-v12.6.md" -o framework/BOOK.md 2>/dev/null && echo "  Book updated" || echo "  Book: no changes"
curl -fsSL "${FRAMEWORK_BASE}/archive/CHIMERA-BODY-SCAN-PROTOCOL-v3.7.md" -o framework/PROTOCOL.md 2>/dev/null && echo "  Protocol updated" || echo "  Protocol: no changes"
curl -fsSL "${FRAMEWORK_BASE}/CLAUDE.md" -o framework/DNA.md 2>/dev/null && echo "  DNA updated" || echo "  DNA: no changes"

if git diff --quiet framework/; then
  echo "Already up to date."
else
  git add framework/
  git commit -m "framework: update to latest CHIMERA version"
  git push
  echo "Updated and pushed. Your personal brain data is untouched."
fi
UPDATESCRIPT
chmod +x update-framework.sh

# Create empty intake file
cat > brain/identity/intake.md << INTAKE
# ${PERSON_NAME}'s Identity File

_Populated during your first conversation with your twin._

## Name

## Current primary work

## Primary constraints

## Reference people (3 people who know you well)

## Known avoidances (3 things you're currently avoiding)

## 90-day targets

## Heavy questions (optional)
INTAKE

# Create brain repo README
cat > README.md << BRAINREADME
# ${PERSON_NAME}'s Brain

Your CHIMERA-calibrated digital twin.

## Start here

Read \`first-conversation.md\` and follow the instructions.

## Structure

\`\`\`
CLAUDE.md                 # Your twin's DNA (personalized)
first-conversation.md     # Day 1 starter
update-framework.sh       # Pull latest framework updates
brain/
  conversations/          # Session logs
  ideas/                  # Raw captures
  projects/               # Active work
  identity/intake.md      # Your current state
  scans/                  # Body scans
framework/                # CHIMERA reference (from chimera-framework)
\`\`\`

## Updates

Run \`./update-framework.sh\` to pull latest CHIMERA updates. Your personal data stays untouched.

## Learn more

Framework repo: https://github.com/DrealR/chimera-framework

---

L = (O > I) + P + ¬F
BRAINREADME

# Initial commit
echo "-> Committing initial state..."
git add .
git commit -m "Initial twin setup for ${PERSON_NAME} — CHIMERA v12.6"
git push

echo ""
echo "  Your twin is ready."
echo ""
echo "  Next steps:"
echo "    1. Open ${REPO_NAME}/ in your AI harness (Claude Code, Cursor, etc.)"
echo "    2. Follow first-conversation.md to complete intake"
echo "    3. Start using your twin"
echo ""
echo "  Repo: https://github.com/${GITHUB_USER}/${REPO_NAME}"
echo ""
echo "  L = (O > I) + P + ¬F"
echo "  WE = 1"
echo ""
