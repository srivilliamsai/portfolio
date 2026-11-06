# Builder Center submission draft

## Title

WILL — A Conversational Developer Portfolio on AWS

## Short description

A web and iOS developer portfolio with WILL: a voice-and-text guide that connects project stories, technical details and personal interests to a contextual image gallery. Built with React and Vite, hosted on AWS Amplify, with a separate Lambda assistant backend.

## Project write-up

### My story and goal

I am SRI VILLIAM SAI, a product developer who learns by building web and native iOS software. I wanted my portfolio to explain both what I build and how I think. It includes About Me, Skills / Tech Superpowers, Projects, Achievements and learning credentials, with clear desktop and mobile navigation.

The portfolio presents six main projects: PitStop, Carbon Footprint, Wyndra, Glassora, DineDesk and Invoice Picker. Their case studies explain the problem, user flows, architecture, implementation and current limits. I distinguish listed work from released products: some projects are still in development.

### Creative feature: meet WILL

The small robot face in the header is a visible invitation to open WILL. Visitors can type or choose voice, ask about a project, and explore an image gallery alongside the answer. For example, “Tell me about PitStop” opens its matching product screenshot; “What stack does it use?” stays in that project's context. Names-only requests return the names without selecting an unrelated image.

WILL also connects my software work with my interests through owner-supplied photos and selected music. Visitors can choose an image themselves, see both portraits, or open one of three Spotify players. Manual choices stay in place during a response. A transcript, mute controls, microphone controls and End keep the interaction under the visitor's control. The normal portfolio remains available without opening the assistant.

The robot presentation takes visual inspiration from Tooba Jatoi's NEMO portfolio; the reference artwork and media sources are credited in the repository. My portfolio content, project records, conversation routing and AWS integration are documented separately. Third-party visuals are not represented as artwork I created.

### AWS implementation

AWS Amplify Hosting builds the connected GitHub main branch with Node.js 22 and publishes the Vite dist output. A SPA fallback supports project and article URLs, while an earlier API rewrite forwards assistant requests to Lambda.

An AWS CloudFormation stack provisions the streamed Lambda API, a Secrets Manager secret for the permanent Gemini key, scoped IAM execution roles and CloudWatch log groups with seven-day retention. Lambda returns streamed text, WAV speech and short-lived Live session tokens. The browser uses the token for a Google Gemini Live connection; permanent credentials stay on the backend. Gemini is the external AI provider, not an Amazon Bedrock integration. Spotify provides the optional music players and Formspree handles the contact form.

The frontend and backend have separate release paths. Frontend pushes trigger Amplify; backend code or embedded knowledge changes require regenerating the CloudFormation package and updating the stack. The API has input/origin validation and per-instance request limits; those are not a global spending cap.

### What I learned and the challenges

The main challenge was keeping conversation, images and audio aligned. Early versions could select the wrong picture from incidental project names, lose a manual selection, or miss captions in Live voice. I learned to route media from the actual question, preserve turn context, explicitly request speech transcriptions and cancel stale callbacks when an answer is interrupted.

I also learned that a static deployment does not run a local Node API, and that frontend environment variables cannot safely hold a permanent key. Separating the backend, using Secrets Manager and verifying the same-origin proxy made the deployment boundary clear. A dotted Gemini key format exposed an overly narrow template validator, which I corrected without changing the key itself.

Automated checks cover portfolio answers, media retention, streaming, audio bytes, secret refresh, request limits, source/assets and deployment artifacts. Public API checks confirmed Gemini chat, a valid WAV response and ephemeral Live token creation. Physical microphone behavior and contact inbox delivery have their own acceptance limits; I do not claim automated tests prove them.

### Try it

Live portfolio: https://main.d229cwpntq8yz1.amplifyapp.com/

GitHub repository: https://github.com/srivilliamsai/portfolio

Open WILL from the header and try “Tell me about PitStop”, “Tell me about Glassora”, “Show both photos”, or “Project names only”. Explore the three core portfolio sections directly as well.

## Screenshot selection

1. Homepage: use the supplied 10:50:54 PM screenshot; it shows the identity, product focus and visible WILL launcher.
2. WILL answering a named project: capture the response with its matching screenshot selected. The welcome-only 10:51:02 PM image introduces WILL but does not demonstrate a working answer.
3. Mobile portfolio: show the centered introduction and accessible navigation; add Skills / Projects if the form allows more images.
4. Amplify: use the supplied 10:51:12 PM image showing main as Deployed, its public domain and release commit.
5. CloudFormation: show will-assistant as CREATE_COMPLETE. Never include a key or token; AWS account identifiers can be hidden when sharing publicly.

## Before publishing on Builder Center

The official hackathon page lists a deadline of 6 November 2026 at 11:59 PM Pacific, which is 7 November 2026 at 1:29 PM IST. It requires verified student status, age 18+, an individual entry, a public AWS-hosted URL, GitHub, all three core sections, an interactive feature with a visible hint, screenshots, AWS services and learning/challenge details. Keep the site available through judging, ending 23 November Pacific. The rules also require an original portfolio not previously published and all necessary rights to submitted material; this draft does not certify eligibility or artwork rights.

Sign in to Builder Center, open the hackathon's Your project tab, and paste the title, description and project write-up into the matching fields. Attach the screenshots and links, then review and publish the entry yourself. No submission has been made by this draft.

Official challenge and rules: https://builder.aws.com/build/hackathons/3bff5627-ef21-3bfc-acfc-fce21d39a4f6
