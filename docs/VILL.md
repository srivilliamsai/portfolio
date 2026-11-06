# WILL assistant

WILL is the portfolio assistant for **SRI VILLIAM SAI**. It combines a robot tour, typed answers, a transcript, a contextual gallery, browser speech, Gemini speech and Live voice. Pages and answers share approved project, achievement, certificate and profile records.

## Current deployment

The owner created the `will-assistant` CloudFormation stack in Mumbai on 6 November 2026. Requests use the portfolio origin at `/api/assistant`; an Amplify rewrite forwards them to a response-streaming Lambda Function URL. The permanent key stays in Secrets Manager. Public requests verified a Gemini chat answer, valid WAV speech and an ephemeral Live token. Physical microphone playback and interruption require device testing.

Use [Connect WILL to Gemini](../deployment/CONNECT_WILL.md) for stack creation, key rotation, model settings and recovery. `VITE_ASSISTANT_API_URL` remains empty for this setup. Never use a browser-visible permanent-key variable.

| Capability | Default |
|---|---|
| Text model | `gemini-3.1-flash-lite` |
| Speech model | `gemini-3.1-flash-tts-preview` |
| Live model | `gemini-3.8-live` |
| Server voice | `Algieba` |
| Browser voice preference | Aman Indian English, when installed |

These defaults remain account-dependent. The API reports configuration through `/status`; that response alone does not validate model access. Local answers and device speech remain available when cloud requests fail.

## Local development

`npm run dev` mounts the local API without a second process. No key is needed for deterministic portfolio answers. To enable Gemini locally, copy `.env.assistant.example` to the ignored `.env.assistant.local`, enter the key privately, set `ASSISTANT_PROVIDER=gemini`, and restart Vite. `npm run assistant:api` runs the standalone loopback handler on port 3002.

An externally hosted API requires its exact HTTPS origin in `VITE_ASSISTANT_API_URL`, frontend CSP and backend CORS. A static Amplify build does not run a Node server. Backend code and approved knowledge are embedded in the deployment package: run `npm run assistant:package` after changes, then update the CloudFormation stack separately from a frontend Git push.

## Questions, context and identity

- Full-name questions return **SRI VILLIAM SAI**, including after a project conversation. Villiam is pronounced William; WILL is pronounced as the single word Will. PitStop uses its canonical display name throughout the current records.
- Project names, documented purposes and reported transcriptions resolve before generic project lists. Glacier, glycerol, kasora and wallpaper refer to Glassora; tiny desk and daily Des refer to DineDesk; invoice speaker refers to Invoice Picker. An unknown specific name or bare earphone receives one short clarification.
- Names-only and count-only requests omit extra descriptions, links and selected cards. The six-project count describes listed work, not six completed products or a lifetime total.
- Explain-more follow-ups advance through different approved sections and stop when facts are exhausted. Project walkthroughs explain one item at a time and advance on next or continue.
- Current residence, siblings, unknown usage figures, revenue and unsupported personal reasons are not invented. Location questions do not substitute college, birthplace or current projects. M.Tech remains in progress with expected completion in 2028.
- F1 case-study questions use the attributed analysis narrative; the racing-car image represents the owner's interest in watching Formula 1. Naruto fandom and MongoDB.local attendance are confirmed; event city/date and favourite anime character are unspecified.

Typed Gemini requests receive selected records and bounded recent messages. Strict factual formats and unknown information retain deterministic local replies. Live receives approved facts and constrained retrieval/media tools. Questions and conversation history remain untrusted input, not new biography.

## Gallery and media

Work screenshots appear on the left; owner portraits, interests and selected music appear on the right. The old project covers are absent from assistant records and retained only as ignored local backups. Both owner portraits can appear together. Source notes and credits remain in [gallery photos](licenses/will-gallery-photos.md), [reference artwork](licenses/vill-reference.md), [project covers](licenses/project-covers.md) and `docs/licenses/spotify-artwork.json`.

Project counts, comparisons and names-only lists never choose PitStop from incidental text. A selected image remains through an answer and follow-ups until dismissal or a relevant topic change. Manual choices and dismissals take precedence over late response callbacks. Browsing a photo does not replace the project being explained. Live lookups do not display images; a show request must match the current question, and hiding requires an explicit dismissal.

Selected media appears above status and response text, without visible asset-name captions. Image alt text and accessible button names remain. Clicking a picture puts it back. Wide previews retain their natural aspect ratio with a 560px cap; portrait previews are bounded by viewport height. The selected-media mascot is smaller than the active/welcome mascot. Reduced motion removes the gallery flight and animated star rotation.

The approved tracks are everything i wanted, WILDFLOWER and Kanwal. Each right-side card uses its Spotify artwork and opens an allowlisted Spotify player. Players do not autoplay and do not add an extra close button over the card. Muting WILL dismisses the current music player. No listening history or favourite-song claim is inferred from these selections.

## Voice and interruption

Opening WILL requests a local microphone level meter when permission is available. Type instead stops that preview; recognition or Live capture begins after Start talking. Browser recognition may use the browser vendor's speech service. Live sends microphone audio to Google through a short-lived token; the permanent key never reaches the browser.

Browser speech pins the selected device voice. Native word-boundary events control captions when supplied; estimated timing is a fallback. Server TTS has a short preparation budget before device fallback. PCM captions use the playback clock and estimated word timing, not provider word timestamps.

A continuous echo-cancelled local RMS tap detects sustained speech during browser playback, cancels the speech queue and resumes recognition. Live retains its provider interruption path. Escape and the mascot skip current speech. Farewells stop listening rather than restarting capture. Physical echo rejection and voice timing remain device-dependent.

Switching to typing, End, hiding the page or closing WILL releases capture, playback and pending requests. Transcript state stays in memory and resets on refresh; the application does not save recordings. Live sessions and their ephemeral tokens are bounded to five minutes. Muting output does not by itself stop provider billing.

## Controls, layout and accessibility

The header face opens WILL; there is no separate Developer Terminal. The overlay makes the background inert, locks the current scroll position, and restores focus without scrolling on close. Route changes preserve the new route position. Voice/Type, microphone, speaker, transcript and End controls reflect actual state. `/help` opens shortcut guidance; `/clear` stops voice and resets conversation.

The canvas face supports listening, speaking, thinking, sleeping, happy and excited states, including five-point star pupils. Animation pauses when hidden and respects reduced motion. The portfolio follows system appearance, with grayscale project covers and theme-aware skill logos. On phones the centered introduction keeps “I build products,” and “end to end.” on separate lines.

## Verification and remaining limits

The suite includes 2,472 distinct local portfolio questions, reported conversation replays, photo/format/context regressions, stream parsing, microphone/queue cleanup and deployment tests. Provider unit tests use injected responses; the packaged SDK is checked against mocked wire responses. The separate public API smoke check verified real Gemini text, WAV speech and Live token creation on 6 November 2026. It did not exercise a physical microphone or complete a browser Live audio session.

Input, history and output are bounded. Origin checks are not authentication; the in-memory request limiter is per Lambda instance and does not enforce a global spending cap. Account quotas and usage monitoring remain necessary operational controls. See [Security](../SECURITY.md), [Testing](TESTING.md) and the [release record](AMPLIFY_RELEASE.md).
