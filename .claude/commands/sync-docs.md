# Sync Docs

Manually sync all project documentation to reflect the current state of the codebase.

Run `git log --oneline -5` and `git status` to understand what has changed recently, then:

1. **Update GUIDE.md** — check if any recent commits affect user-visible features, admin pages, booking flow, settings, or public website behavior. Update only the affected sections using plain language for non-technical staff.

2. **Regenerate GUIDE.pdf** — run: `cd /Applications/XAMPP/xamppfiles/htdocs/MakeShift && npx md-to-pdf GUIDE.md --highlight-style github`

3. **Update HANDOVER.md** — refresh the "Last updated" date to today, update the Recent Work table with any missing commits, update Known Issues (add new ones, mark resolved ones), and update What's Likely Next.

Report what was changed in each file when done.
