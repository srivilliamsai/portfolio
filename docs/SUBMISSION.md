# Builder Center submission draft

Status: drafting material only. The owner must confirm eligibility, confirm the deployed product screenshots, verify personal statements, and publish the final entry. This file is not evidence that an entry has been submitted.

## Project title

**Sri Villiam Sai — a developer portfolio with a local interactive shell**

## What I built

A portfolio about Java backend thinking, React interfaces and native iOS projects. Visitors can explore About me, Skills and Projects through ordinary navigation, browse nine articles, and open case studies including PitStop, Carbon Footprint, Glassora and Wyndra.

The personal feature is a developer terminal that responds locally to commands and a bounded set of portfolio questions. The visible Terminal navigation item provides a discovery hint; mobile visitors find it inside the menu.

## Why the feature reflects me

The site's reflection is: “I learn by building. Java lets me explore how software works behind the scenes; SwiftUI lets me explore how it feels to use.”

The terminal connects that reflection to concrete projects instead of functioning as a general chatbot. `story` explains the thread, `projects` shows the work, and `oss` surfaces dated contribution records and their upstream links. All core sections remain available without using the feature.

## How to try it

Open Terminal, type `story`, then `porjects`. Next type `glassora`, followed by `its free`. The feature corrects a small command typo, remembers the named project and qualifies the pricing answer using its dated record. Switch to `wyndra` and ask the same follow-up: pricing that is not recorded is not invented. Use `help` and `shortcuts` to discover other controls.

## Architecture and AWS

React and Vite build static assets. Shared records feed project cards and terminal responses. React Router handles pages, while local state tracks terminal input, history and project context. The answers require no AI endpoint, account or application database.

AWS Amplify Hosting serves the portfolio. The repository contains the Node 22 build specification, artifact checks, header settings and SPA rewrite rules. The connected `main` branch is live on Amplify. GitHub Production reporting verifies the published commit and files; the final submission should include the owner’s actual AWS evidence. Separately featured projects' services are not portfolio hosting resources.

## Challenges and engineering takeaways

The code addresses several concrete interaction problems: misspelled commands, ambiguous questions, context leaking between projects, losing an unsubmitted draft during history recall, and operating a modal from keyboard/mobile navigation. Pure answer logic and history transitions make these behaviors testable independently of the UI.

Shared summaries help keep cards and terminal answers aligned. Explicit unknown answers avoid inventing personal details, proficiency ratings or project prices. A static deployment still needs correct origin metadata and a hosting rewrite for direct project/blog visits.

These are observations from the implemented code, not a claim about which problems the author personally found hardest. Before publishing, add a short first-person account of the actual challenge, what was tried and what was learned. Verify any project implementation claims that are not independently evidenced by this portfolio repository.

## Evidence to supply before publication

| Item | Current state |
|---|---|
| Actual public Amplify URL | Recorded in the repository About field and deployment guide |
| Public source repository URL | [srivilliamsai/portfolio](https://github.com/srivilliamsai/portfolio) |
| Desktop/mobile product and feature captures | [Local product captures](TESTING.md) are available; capture/confirm the final deployed version |
| Successful Amplify job and build/repository/branch settings | Pending; use real screenshots with unnecessary identifiers hidden |
| Applied rewrite/header settings and direct-route check | See the deployment and testing guides; final public revision must be checked |
| Personal lessons and challenges | Owner to confirm and complete |
| Originality eligibility | Previously public portfolio; organizer confirmation unresolved |
| Published Builder Center project link | Pending owner publication |

The portfolio was previously published. Do not describe it as unpublished original work without a valid basis; a new host or repository does not change that history. Refer to the official [challenge page and Rules tab](https://builder.aws.com/build/hackathons/3bff5627-ef21-3bfc-acfc-fce21d39a4f6/aws-student-builder-challenge-build-your-tech-superpower) before treating this upgrade as an eligible entry.
