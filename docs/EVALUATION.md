# Evidence-based reviewer guide

This is an unofficial review worksheet for humans or automated reviewers. It uses the published challenge weights, scaled to a maximum of 1,000 points for convenience. No earned total, official rating, winning probability or perfect score is claimed. Automated checks establish specific behavior, not eligibility or subjective creativity.

Source: [official challenge requirements and rubric](https://builder.aws.com/build/hackathons/3bff5627-ef21-3bfc-acfc-fce21d39a4f6/aws-student-builder-challenge-build-your-tech-superpower), checked 3 November 2026. Consult the official Rules tab for complete eligibility and conditions; its detailed content was not accessible through the documentation fetch used for this review.

## Qualification before scoring

| Gate | Evidence and status |
|---|---|
| Personal eligibility | **Owner confirmation required.** Student verification was reported; the code does not establish age, profile or other conditions |
| Originality | **Organizer confirmation required.** The portfolio was previously public; editing or rehosting does not resolve this |
| Public Amplify site | **Pending deployment.** Configuration exists; no public AWS URL or successful job evidence is supplied |
| Core sections | **Implemented.** About, Skills and Projects exist; confirm them on the final public site |
| Interactive feature | **Implemented.** Terminal is visible in navigation and the mobile menu; final public review remains pending |
| Public source | [srivilliamsai/portfolio](https://github.com/srivilliamsai/portfolio); confirm the expected source and latest checks in GitHub |
| Published entry | **Pending.** The draft exists; no completed Builder Center entry is claimed |

An unresolved qualification gate is not compensated for by a high worksheet score.

## Review journey

1. Start on the public site when one exists. Open Projects, Skills and About me without using the terminal.
2. Open Terminal from navigation; on mobile use the menu. Try `story`, `porjects`, `glassora`, then `its free`.
3. Change to `wyndra`, then ask `its free`; confirm the answer does not borrow Glassora's price.
4. Use `oss`, open a linked contribution and verify the upstream record independently. The site's dated record is not a fresh external verification.
5. Open a project and a blog article directly, refresh them, and check images, fonts, résumé and contact links.
6. Compare the public behavior with the [architecture](ARCHITECTURE.md), [test evidence](TESTING.md) and actual Amplify build/settings screenshots.

## 1,000-point worksheet

The category weights come from the official rubric. The subcriteria and point allocations below are this project's review aid, not the organizers' scoring formula. Awarded values remain unassigned until a reviewer examines the relevant evidence.

| Review category | Maximum |
|---|---:|
| Creative feature | 300 |
| AWS implementation | 250 |
| Communication | 250 |
| Completeness and usability | 200 |
| **Total available** | **1,000** |

No current total is awarded. The following criteria describe the evidence for each category.

### Creative feature — 300 maximum

- **Personal connection — 100 points:** assess the Java/SwiftUI story, About me and project records.
- **Useful interaction — 100 points:** try typo handling, project follow-ups and explicit unknown/ambiguous cases; assess originality subjectively.
- **Discovery and navigation — 100 points:** find Terminal and use the core sections before, during and after the interaction.

### AWS implementation — 250 maximum

- **Public site and direct routes — 100 points:** examine the actual Amplify HTTPS URL and direct-route refreshes. Deployment evidence is pending.
- **Assets and links — 50 points:** combine the local asset check with deployed image, font, PDF and link tests.
- **Build and service description — 50 points:** inspect the lockfile, build specification, output directory, URL validation and deployment guide.
- **Deployment and availability evidence — 50 points:** inspect successful job/settings screenshots and availability checks. These remain pending.

### Communication — 250 maximum

- **Overview and architecture — 80 points:** review the README, component boundaries and terminal sequence.
- **Screenshots — 80 points:** local desktop/mobile/terminal captures exist; actual AWS and final deployed captures remain pending.
- **Honest learning and history — 60 points:** examine the author-confirmed lessons, challenges and publication-history eligibility record.
- **Reproducible verification — 30 points:** use the test commands, results, evidence metadata and manual scenarios.

### Completeness and usability — 200 maximum

- **Core content — 60 points:** inspect About, Skills, Projects and the problem/contribution/tools/status context.
- **Responsive and keyboard use — 70 points:** check the mobile menu, card fit, focus, terminal controls and reduced motion.
- **Accurate readable claims — 40 points:** examine shared records, dated facts and illustrative-article notices.
- **Contact and source journeys — 30 points:** verify public destinations, résumé download and source repository access.

If a reviewer wants a ten-point scale, divide the earned total by 100. A test pass count is not used in that conversion. A full worksheet score is not represented as achievable while required evidence is missing.

## Improvements in priority order

1. Resolve the publication-history eligibility question. The source URL is now recorded; review its published files and workflow results.
2. Have the owner deploy the prepared build to Amplify, set the actual HTTPS origin, and apply the rewrite rules.
3. Complete deployed-route, asset, mobile and keyboard scenarios; capture real product and AWS evidence.
4. Confirm the author's personal learning/challenges and project claims; replace pending submission fields with verified details.
5. Reassess how memorable the terminal feels to an unfamiliar visitor. Demonstrate its personal story and follow-up behavior instead of relying on the terminal theme alone.
6. Consider prerendered article content and bounded terminal history later if review evidence identifies a practical need.

Reassess after supplying the missing evidence; use observed outcomes and the official rules for the final judgment.
