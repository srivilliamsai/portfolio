# WILL reference artwork

The tour robot body (`public/static/media/assistant/vill-robot-body.webp`) was copied from the owner-supplied reference checkout at `/Users/sriwilliamsai/OP/toobajatoi-clone/public/assets/nemo-body-CcHo2tcC.webp`, following the request to match the NEMO robot. The face, state animation and navigation launcher are implemented locally for VILL. Source: Tooba Jatoi portfolio, https://toobajatoi.com/.

The five temporary reference photos were removed from the website on 6 November 2026 and archived outside the checkout. At the owner’s subsequent request, the Lionel Messi illustration was retained as an explicitly labelled football-interest image, not a portrait of Sri. Eight owner-supplied photos now accompany it. Their source mapping and image conversion notes are recorded in [WILL gallery photos](will-gallery-photos.md).


On 6 November 2026, the public `GuideTour-DKODfk9G.js` bundle at [Tooba Jatoi’s portfolio](https://toobajatoi.com/#mn-work) was inspected for caption timing. The local implementation follows its audio-clock word queue and paced word-duration pattern, with native speech-boundary support added for browser voices. The downloaded inspection copy is kept outside the website source in the task artifacts.


The same public tour bundle was also inspected for its synthesized UI effects. `src/services/willSounds.js` adapts the boot, shutdown, tick, send, listen, think, photo and transcript oscillator/noise patterns to the site’s existing sound engine, with per-tour mute and source cleanup.
