# CS61A – Am I Cooked

A grade calculator for UC Berkeley's CS 61A, **Fall 2026**, taught by John DeNero and Kay Ousterhout. 

Type in the scores you have, leave the rest blank, and see your current grade, your best case, and what you still need for every letter grade.

**Unofficial.** This is a student-made tool and is not affiliated with or endorsed by CS 61A staff. Grading rules change between semesters, so always check the official syllabus at [cs61a.org](https://cs61a.org/) (open its Syllabus page). If anything here differs from the syllabus, the syllabus wins.

Live site: https://potatoshines.github.io/amicooked61a/

## Features

- Enter exams, quizzes, homework, projects, lab, discussion and contest points. Anything you leave blank counts as "not yet".
- Scores above the maximum are fine (for example 26/25 on a project for early-submission extra credit).
- **A+ tracking.** Add 5 to an exam score (like 25 out of 20) if you solved that exam's A+ question. A small "A+" appears next to it, and your A+ points are shown as `(regular + bonus) total A+`.
- **Midterm recovery.** Each midterm is raised to at least 90% of your final exam percentage. It is on by default and can be switched off. Each recovered midterm shows a small green `+n` and its new score. A "?" button explains the rule.
- **Best case.** A progress bar shows what you've earned, what is still possible, and the farthest you can still reach. Hover (or tap) the letters on the bar to see the points each grade needs.
- **How far to each grade.** Pick A, B, C, D or All grades. For each grade you see the points you still need and the final-exam score required, based on how well you expect to do on the rest of your remaining work (slider).
- Your entries are saved in your browser (local storage). "Clear all fields" resets them.
- Light and dark mode follow your device setting.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and text |
| `style.css` | Matcha and coffee theme, layout, dark mode |
| `script.js` | All grading logic and rendering |

No build step and no dependencies. The only outside request is the Google Fonts stylesheet (Fraunces and DM Sans). Without it, the page falls back to system fonts.

## Run it locally

Download the three files into one folder and open `index.html` in a browser.

## Grading rules used

Total of 300 points. These come from the course grading section and may not match your semester.

| Component | Points | Notes |
| --- | --- | --- |
| Midterm 1 | 20 | |
| Midterm 2 | 20 | |
| Midterm 3 | 45 | |
| Final | 75 | |
| Quizzes | 10 | Best 5 of 8 count |
| Homework | 10 | |
| Projects | 100 | Four projects, 25 each |
| Lab | 10 | |
| Discussion | 10 | |
| Early-submission extra credit | up to 4 | Included in your project score |

Letter grade cutoffs: A ≥ 285, A- ≥ 270, B+ ≥ 255, B ≥ 230, B- ≥ 210, C+ ≥ 190, C ≥ 180, C- ≥ 175, D+ ≥ 170, D ≥ 165, D- ≥ 160.

**A+** needs at least 305 A+ points. Every regular point is worth 1 A+ point, A+ exam questions are worth 5 A+ points each, and contests can add more.

**Midterm recovery:** a midterm's adjusted score is at least 90% of your final exam percentage times that midterm's total points. For example, 5/20 on Midterm 1 and 37.5/75 (50%) on the final gives 50% × 90% × 20 = 9/20.

## Assumptions and limits

- Each quiz is treated as worth 2 points (5 × 2 = 10). Change `QMAX` if yours differ.
- An exam score at least 5 above its maximum is read as "A+ question solved," and the 5 is removed from your regular points. Real extra credit that happens to be 5 or more over the max would be misread.
- For the best case, each project you haven't entered can earn up to 1 extra credit point.
- If your final is over 100%, 100% is used for midterm recovery.
- Future A+ questions and contests are not counted in the best case.
- The "final score needed" is an estimate that depends on the percentage you expect on your other remaining work.

## Customizing

The constants are at the top of `script.js`: grade cutoffs (`GRADES`), `APLUS`, exam maximums (`EXAMS`), the quiz settings (`QN`, `QK`, `QMAX`), and the project settings (`PROJ`, `PMAX`). The colors are CSS variables at the top of `style.css`. The tab title is the `<title>` tag in `index.html`.