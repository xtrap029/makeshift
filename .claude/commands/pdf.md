# PDF

Rebuild `GUIDE.pdf` from `GUIDE.md`. This is the **only** thing that rebuilds the PDF — no hook or other command does it automatically, so only run this when asked.

1. **Rebuild** — run:

   ```bash
   cd /Users/kelvinbarsana/Projects/MakeShift && npx md-to-pdf GUIDE.md --highlight-style github < /dev/null
   ```

   Keep the `< /dev/null`: whenever stdin isn't a terminal (as when Claude runs it), `md-to-pdf` converts **stdin instead of the named file** and `GUIDE.pdf` is silently left untouched.

2. **Verify** it actually rebuilt — don't install anything to do this:
   - `GUIDE.pdf`'s modified time is now, e.g. `ls -la GUIDE.pdf`.
   - Page count looks right (about 20 pages currently):
     `python3 -c "import re; print(len(re.findall(rb'/Type\s*/Page[^s]', open('GUIDE.pdf','rb').read())))"`

3. **Report** the page count and file size, and say whether `GUIDE.md` had changed since `GUIDE.pdf` was last committed (`git diff --quiet $(git log -1 --format=%H -- GUIDE.pdf) -- GUIDE.md`, plus any uncommitted edits to `GUIDE.md`). If it hadn't, point out that the rebuilt PDF differs only by its embedded build timestamps, so `git restore GUIDE.pdf` safely undoes it.

4. **Don't commit.** Leave `GUIDE.pdf` for the user to review and commit.
