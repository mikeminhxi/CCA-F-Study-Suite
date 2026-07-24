# Quickstart: Validate the Blueprint Taxonomy Restructure

End-to-end validation that the restructure works. Prereqs: the session's
Playwright setup (Chromium already installed; no Node). App file:
`cca-f-study-suite.html`.

## 1. Structural validation (no browser)

Run a PowerShell + `System.Text.Json` script against `cca-f-study-suite.html`
that asserts:

- `TASK_STATEMENTS` parses, length **30**, per-domain **7/5/6/6/6**, every
  `domain === "D"+id.charAt(3)`.
- `CONCEPTS` parses, length **59**, per-domain **12/8/10/14/15**, every `ts`
  present in `TASK_STATEMENTS`, every `domain` matches its task statement.
- Every `QDATA[].ts` is present and one of the 30; print the per-task-statement
  and per-domain question distribution (0-count task statements are allowed).
- All six `__I18N_*__` dictionaries still parse (case-sensitive).

**Expected**: all assertions pass; distribution table printed for review.

## 2. Browser validation (Playwright, `file://`)

Drive `file:///.../cca-f-study-suite.html`:

1. **Learning Path**: 5 domains render in weight order (27→15%); each expands to
   its task statements; a known/total count shows at domain and task-statement
   level.
2. **Study mode**: filtering to a single task statement shows only that task
   statement's questions; the "Mixed / Applied" filter yields a cross-cutting
   pool.
3. **Exam by Domain**: task-statement chips grouped under domains; selecting a
   set shows the available count; starting yields a shuffled scored run; a miss
   shows its explanation; the quiz meta line shows the question's task
   statement.
4. **Concepts tab**: present in the tab bar; lists 59 concepts grouped by
   domain → task statement, each with an insight line and a
   Foundation/Intermediate/Advanced level chip.
5. **Neuron Map**: renders task-statement leaves per domain with no layout
   breakage or console error.
6. **Languages**: switch through all 7; **zero console errors**; new blueprint
   content shows in English under the 6 non-English languages (fallback), no
   layout breakage.
7. **Progress preserved**: mark a question known, reload — the mark persists
   (question ids unchanged).

**Expected**: all of the above; screenshots captured for Learning Path,
Concepts tab, and Neuron Map in both themes.

## 3. Theme parity

Repeat the Learning Path, Concepts tab, and Neuron Map checks in **both Light
and Dark** themes (SC-006). No dark-only or light-only regression.

## 4. Docs

- `CHANGELOG.md` describes the restructure and records the translation
  follow-up as outstanding.
- All 7 READMEs describe the domain → task-statement → concept taxonomy (no
  stale "14 modules / 7 phases").
