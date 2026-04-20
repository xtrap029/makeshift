# MakeShift — Claude Instructions

## On Session Start

**Always read `HANDOVER.md` first.** It contains the current project state, recent commits, known issues, and what's likely next. This prevents re-deriving context that's already been captured.

After reading it, check if it looks stale (compare its "Last updated" date against `git log --oneline -5`). If it's out of date, refresh it before starting work.

---

## HANDOVER.md Maintenance

`HANDOVER.md` is the developer context file. Keep it current so every session — and every developer — can pick up without losing context.

**Update `HANDOVER.md` after any commit that:**
- Adds, changes, or removes a feature or module
- Fixes a notable bug (add it to Known Issues or remove it once resolved)
- Changes the branch state, adds open tasks, or resolves pending work
- Introduces something another developer would need to know before touching the code

**Always update:**
- `Last updated` date at the top
- `Current Branch` section
- `Recent Work` table (keep the last ~15–20 commits)
- `Untracked / Uncommitted Files` if it changes
- `Known Issues / Watch Points` — add new ones, remove resolved ones
- `What's Likely Next` — reflect current direction

---

## GUIDE.md Maintenance

`GUIDE.md` is the primary user-facing documentation for MakeShift. It is written for non-technical staff and demo presenters.

**Keep `GUIDE.md` up to date whenever features change.** After any commit that adds, modifies, or removes a feature, review `GUIDE.md` and update the relevant sections to reflect what was changed. Do not rewrite sections that are unaffected.

### What warrants a GUIDE.md update

- New admin pages or public pages added
- Changes to booking status flow or rules
- New or removed fields on rooms, bookings, payments, schedules, or overrides
- New settings or configuration options
- Changes to email behavior or templates
- New modules (logs, tools, people, etc.)
- Changes to how the public website works

### What does NOT need a GUIDE.md update

- Bug fixes that don't change user-visible behavior
- Refactors, dependency updates, styling tweaks
- Performance improvements
- Internal changes with no effect on how staff or customers use the system

### Writing style

- Plain language, no technical jargon
- Present tense ("Click X to do Y", not "Clicking X will do Y")
- Tables for field definitions
- Keep the demo script (Part 13) in sync — if a feature changes, update the relevant demo step too
