# Sync Docs

Manually sync all project documentation to reflect the current state of the codebase.

Run `git log --oneline -5` and `git status` to understand what has changed recently, then:

1. **Update GUIDE.md** — check if any recent commits affect user-visible features, admin pages, booking flow, settings, or public website behavior. Update only the affected sections using plain language for non-technical staff.

2. **Do not rebuild GUIDE.pdf.** The PDF is only rebuilt on request with `/pdf`. If GUIDE.md changed, end your report by suggesting the user run `/pdf`.

3. **Update HANDOVER.md** — refresh the "Last updated" date to today, update the Recent Work table with any missing commits, update Known Issues (add new ones, mark resolved ones), and update What's Likely Next.

Report what was changed in each file when done.
