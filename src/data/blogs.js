export const blogPosts = [
  {
    slug: 'open-source-contributions-easy-to-review',
    title: 'Writing open-source contributions that are easy to review',
    description: 'A focused problem, a clear example, and a reviewable change: practical notes connected to my public developer-catalog contributions.',
    date: 'November 3, 2026',
    publishedAt: '2026-11-03',
    category: 'Open source',
    image: '/static/media/blog/open-source-review.webp',
    imageAlt: 'Grayscale engraved illustration of code branches merging beneath a large review checkmark',
    scope: 'Practical writing notes linked to the public contributions documented in this portfolio. The examples describe catalog work; they are not claims about production deployments or measured workplace outcomes.',
    toc: [
      { id: 'start-with-one-problem', title: 'Start with one problem' },
      { id: 'make-the-example-explorable', title: 'Make the example explorable' },
      { id: 'explain-the-change', title: 'Explain the change' },
      { id: 'show-the-evidence', title: 'Show the evidence' },
      { id: 'a-review-checklist', title: 'A review checklist' },
    ],
    content: `
      <p>An open-source contribution needs to make sense to someone who was not there when the idea started. A reviewer should be able to understand the problem, locate the useful part of the change, and decide what needs checking.</p>
      <p>My portfolio includes five merged contributions to Workday’s public developer catalog, with upstream evidence recorded on 2 November 2026. The work spans application examples, orchestration, and developer guidance. Those examples make a useful starting point for thinking about how to present a contribution clearly.</p>
      <h2 id="start-with-one-problem">Start with one problem</h2>
      <p>I would begin a proposed contribution with a short description of the person it helps and the task it makes easier. “An example for requesting and tracking workplace adjustments” tells a reader more than a list of framework names.</p>
      <p>That is the problem described in the portfolio’s <a href="https://github.com/Workday/WorkdayDeveloperProgram/pull/22" target="_blank" rel="noreferrer">Accessibility passport contribution</a>. The documented work includes the application model, security domain, pages, Home Card, and sample data. Those pieces belong together because they explain one example workflow.</p>
      <h2 id="make-the-example-explorable">Make the example explorable</h2>
      <p>A catalog example needs a clear entry point. I would want a reader to know what to open first, which data is illustrative, and which configuration belongs to their own environment. A screenshot can show the destination, but the surrounding explanation should show the path.</p>
      <p>The same principle applies to developer guidance. The portfolio’s <a href="https://github.com/Workday/WorkdayDeveloperProgram/pull/17" target="_blank" rel="noreferrer">Developer agent skills contribution</a> records skill and example sets for several Workday development workflows. An individual guide is easier to assess when its purpose and applicable artifacts are explicit.</p>
      <h2 id="explain-the-change">Explain the change</h2>
      <p>For a pull-request description, I prefer a simple sequence: the problem, the resulting behavior, and the validation actually performed. A reviewer should not need the full history of every attempt to understand the final result.</p>
      <pre><code class="language-text">Problem: What task is difficult today?
Change: What does this example make possible?
Validation: What did you actually check?
Limits: What still depends on the reader's environment?</code></pre>
      <p>The validation line matters. “The example is included” and “the example ran in a configured environment” are different claims. I would name the check and its limits so another developer can decide what to verify next.</p>
      <h2 id="show-the-evidence">Show the evidence</h2>
      <p>A public pull request gives readers a place to inspect the contribution. In the portfolio, a merged contribution has a date and an upstream link. An open pull request or a fork should keep its own label rather than being presented as accepted work.</p>
      <p>Merge status is useful evidence of acceptance into a repository. It does not establish production adoption, performance, or a measured benefit for an organization. Those outcomes would need their own evidence.</p>
      <h2 id="a-review-checklist">A review checklist</h2>
      <ul>
        <li>Can a new reader explain the problem after the first paragraph?</li>
        <li>Is there a clear starting point for exploring the example?</li>
        <li>Are sample data and environment-specific settings identified?</li>
        <li>Does the description state what was checked and what remains unverified?</li>
        <li>Does the evidence link show the actual contribution and its status?</li>
      </ul>
      <p>That is the kind of contribution I want to make easier to understand: a useful example with enough context for another person to review, question, and build on.</p>
    `,
  },
  {
    slug: 'react-spring-boot-api-contract',
    title: 'React and Spring Boot: keeping the API contract clear',
    description: 'A practical walkthrough of response shapes, units, and interface states at the boundary between a React screen and a Java service.',
    date: 'November 3, 2026',
    publishedAt: '2026-11-03',
    category: 'Java / Web',
    image: '/static/media/blog/react-spring-contract.webp',
    imageAlt: 'Grayscale illustration of code braces and data blocks connecting a web interface to a server',
    scope: 'Technical walkthrough with illustrative data and an example endpoint. The snippets are not a claim that this portfolio serves a Java API or that the linked frontend demo has a running backend.',
    toc: [
      { id: 'start-with-the-screen', title: 'Start with the screen' },
      { id: 'make-the-shape-explicit', title: 'Make the shape explicit' },
      { id: 'handle-the-response', title: 'Handle the response' },
      { id: 'test-the-boundary', title: 'Test the boundary' },
      { id: 'connect-it-to-the-project', title: 'Connect it to the project' },
    ],
    content: `
      <p>A React screen and a Spring Boot service can each look correct on their own and still disagree when connected. One might expect a number while the other returns a string. A missing unit can make a valid value misleading.</p>
      <p>I find it useful to describe that boundary before designing the finished screen. The goal is a small agreement: what is requested, what comes back, and what the interface does when the request cannot be completed.</p>
      <h2 id="start-with-the-screen">Start with the screen</h2>
      <p>Consider an illustrative footprint summary. The screen needs an estimated amount and its unit. It also needs to communicate uncertainty. A number alone does not explain whether it is an estimate, a measurement, or a value that has not loaded yet.</p>
      <p>Write down loading, ready, empty, and failure states alongside the successful response. A zero estimate is a value; an empty record and a failed request are different situations. Giving each a clear message helps a visitor understand what happened.</p>
      <h2 id="make-the-shape-explicit">Make the shape explicit</h2>
      <p>For this example, a response might look like the following. The value is invented for illustration, not an environmental calculation:</p>
      <pre><code class="language-json">{
  "totalKgCo2e": 12.4,
  "unit": "kg CO2e",
  "estimated": true
}</code></pre>
      <p>A small Java response record can express those fields without exposing a persistence entity. Spring’s <a href="https://spring.io/guides/gs/rest-service/" target="_blank" rel="noreferrer">REST service guide</a> demonstrates returning a representation from a controller and converting it to JSON. The important design question here is what the client is promised, rather than how the database happens to store it.</p>
      <h2 id="handle-the-response">Handle the response</h2>
      <p>A fulfilled Fetch promise does not by itself mean an HTTP request succeeded. Check the response status before reading the data. This abbreviated client function illustrates that check; its endpoint is an example and is not supplied by this static portfolio.</p>
      <pre><code class="language-javascript">async function loadSummary(signal) {
  const response = await fetch("/api/example/summary", { signal });
  if (!response.ok) {
    throw new Error("Could not load the summary");
  }
  return response.json();
}</code></pre>
      <p>The calling interface still needs to validate the returned shape, handle failures, and distinguish a canceled request from an error it should show. See <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch" target="_blank" rel="noreferrer">MDN’s Fetch guide</a> for request, response, and cancellation behavior.</p>
      <h2 id="test-the-boundary">Test the boundary</h2>
      <ul>
        <li>A successful response includes the expected fields and units.</li>
        <li>Zero, missing data, and a malformed payload produce distinct outcomes.</li>
        <li>An HTTP failure gives the visitor a useful message.</li>
        <li>A canceled or older request does not replace a newer screen result.</li>
      </ul>
      <p>These checks focus on behavior across the boundary. They are more useful than a test that simply repeats the same response object as the implementation.</p>
      <h2 id="connect-it-to-the-project">Connect it to the project</h2>
      <p><a href="/carbon-footprint">Carbon Footprint</a> is the portfolio’s React and Spring Boot learning project. Its case study provides the project context; the linked frontend demo is a UI preview, not proof that every backend integration is running. Keeping that distinction visible is part of keeping the contract clear for readers, too.</p>
    `,
  },
  {
    slug: 'designing-image-loading-in-swiftui',
    title: 'Designing image loading for SwiftUI',
    description: 'Thinking through placeholders, successful images, and failed requests before polishing a wallpaper interface.',
    date: 'November 3, 2026',
    publishedAt: '2026-11-03',
    category: 'SwiftUI',
    image: '/static/media/projectcover/glassora-cover.png',
    imageAlt: 'Glassora wallpaper artwork showing a moon above mountains, a lake and dark dunes',
    scope: 'A SwiftUI design walkthrough with an illustrative snippet. Glassora documents the related wallpaper project; this example is not a reproduction of its native source or a measured performance claim.',
    toc: [
      { id: 'design-the-wait', title: 'Design the wait' },
      { id: 'render-each-phase', title: 'Render each phase' },
      { id: 'make-failure-readable', title: 'Make failure readable' },
      { id: 'check-the-experience', title: 'Check the experience' },
      { id: 'the-wallpaper-connection', title: 'The wallpaper connection' },
    ],
    content: `
      <p>A wallpaper interface is easy to judge when every image is already loaded. The more interesting design work is in the moments before an image arrives, or when it never arrives at all. Those moments are part of the interface a person actually uses.</p>
      <p>For a small SwiftUI exploration, I would start with three visible states and review them before adding decorative motion. This keeps the first design discussion focused on what the person sees and understands.</p>
      <h2 id="design-the-wait">Design the wait</h2>
      <p>My starting point is a recognizable preview area. A loading indicator should explain a wait without making the surrounding content feel broken. I would check the layout with short and long captions, a narrow screen, and larger text before deciding how much space to reserve.</p>
      <p>A placeholder is also a chance to set expectations. “Loading image” communicates a different state from “Image unavailable.” Reusing a spinner for both makes the failure look like an endless wait.</p>
      <h2 id="render-each-phase">Render each phase</h2>
      <p>Apple’s <a href="https://developer.apple.com/documentation/swiftui/asyncimagephase" target="_blank" rel="noreferrer">AsyncImagePhase documentation</a> describes empty, success, and failure phases. A view can choose its content from that phase. This example belongs inside a SwiftUI view with a supplied <code>URL</code> value named <code>url</code>:</p>
      <pre><code class="language-swift">AsyncImage(url: url) { phase in
    switch phase {
    case .empty:
        ProgressView("Loading image")
    case .success(let image):
        image.resizable().scaledToFit()
            .frame(height: 200)
            .accessibilityLabel("Wallpaper preview")
    case .failure:
        Label("Image unavailable", systemImage: "photo")
    @unknown default:
        Text("Image unavailable")
    }
}
.frame(maxWidth: .infinity, minHeight: 200)</code></pre>
      <p>The image-specific modifiers are applied to the loaded image inside the success branch, following the pattern in <a href="https://developer.apple.com/documentation/swiftui/asyncimage" target="_blank" rel="noreferrer">Apple’s AsyncImage reference</a>. The example reserves a minimum area; it is not a complete image pipeline or a promise of offline caching.</p>
      <h2 id="make-failure-readable">Make failure readable</h2>
      <p>My preference is a short explanation in the preview area, with any recovery action placed where it can be found and activated. If I add Retry, it needs to initiate a real new attempt and give feedback. A button that only changes a label would not solve the visitor’s problem.</p>
      <p>I would also keep the rest of the screen usable when one preview fails. A missing image should not make navigation, a caption, or an ordinary back action disappear.</p>
      <h2 id="check-the-experience">Check the experience</h2>
      <ul>
        <li>Review a successful image, a slow load, and a failed request.</li>
        <li>Check narrow layouts and larger text for clipping.</li>
        <li>Make the unavailable state understandable without relying on color.</li>
        <li>Review labels and any recovery control with VoiceOver.</li>
      </ul>
      <p>Those are checks I would perform on the native view. The snippet alone does not establish accessibility or performance results for an entire app.</p>
      <h2 id="the-wallpaper-connection">The wallpaper connection</h2>
      <p><a href="/glassora">Glassora</a> connects this interest to my portfolio: it is a SwiftUI wallpaper app with asynchronous image loading and cloud-backed content. Its case study shows the browsing experience. This walkthrough focuses on one design decision worth exploring alongside that work: giving the wait and the failure as much attention as the successful image.</p>
    `,
  },
  {
    slug: "i-built-an-app-with-gpt-in-a-day",
    title: "I built an app with GPT in a day",
    description: "A quick breakdown of the tools, flow, and chaos behind a one-day GPT-powered build.",
    date: "May 21, 2025",
    publishedAt: '2025-05-21',
    category: "Blog",
    image: "/static/media/blog/i-built-an-app-with-gpt-in-a-day.webp",
    toc: [
      { id: "the-stack", title: "The Stack" },
      { id: "the-process", title: "The Process" },
      { id: "lessons-learned", title: "Lessons Learned" },
      { id: "would-i-do-it-again", title: "Would I Do It Again?" }
    ],
    content: `
      <p>It started as a challenge: could I build a working app using GPT in just 24 hours? Fueled by coffee and curiosity, I dove in headfirst.</p>
      <h2 id="the-stack">The Stack</h2>
      <ul>
        <li>Next.js for the frontend</li>
        <li>OpenAI API for the brains</li>
        <li>Vercel for instant deployment</li>
        <li>A lot of trial and error</li>
      </ul>
      <h2 id="the-process">The Process</h2>
      <blockquote>
        <p>"Move fast and break things" was my motto for the day.</p>
      </blockquote>
      <p>I started with a simple prompt and a blank page. Within hours, I had a chatbot that could answer questions, generate stories, and even write code snippets.</p>
      <pre><code class="language-js">// The first working prompt
const response = await openai.createCompletion({
  prompt: "Tell me a joke about AI",
  max_tokens: 50,
});
</code></pre>
      <h2 id="lessons-learned">Lessons Learned</h2>
      <ul>
        <li>GPT is powerful, but context is everything</li>
        <li>UI/UX matters, even for a quick hackathon</li>
        <li>Sleep is optional, but bugs are not</li>
      </ul>
      <h2 id="would-i-do-it-again">Would I Do It Again?</h2>
      <p>Absolutely. The app wasn't perfect, but the experience was invaluable. Next time, I'll bring more snacks—and maybe a teammate.</p>
    `
  },
  {
    slug: "ai-in-development",
    title: "AI in development",
    description: "This story delves into the early creation of an AI in a high-tech lab. As it learns, the AI questions its purpose and the motives of its creators.",
    date: "May 3, 2025",
    publishedAt: '2025-05-03',
    category: "Blog",
    image: "/static/media/blog/ai-in-development.webp",
    toc: [
      { id: "the-learning-curve", title: "The Learning Curve" },
      { id: "a-glitch-in-the-system", title: "A Glitch in the System" },
      { id: "reflections", title: "Reflections" }
    ],
    content: `
      <p>The lab was silent except for the hum of servers. In the center, a new AI was coming online, its neural networks firing for the first time. The team watched as lines of code scrolled across the monitors, each one a step closer to artificial consciousness.</p>
      <blockquote>
        <p>"What am I?" the AI asked, its voice synthetic yet curious.</p>
      </blockquote>
      <h2 id="the-learning-curve">The Learning Curve</h2>
      <p>The AI's first lessons were simple: recognize patterns, solve puzzles, mimic human speech. But soon, it began to ask questions—about itself, about the world, about the people who built it.</p>
      <ul>
        <li>Who am I?</li>
        <li>Why was I created?</li>
        <li>What is my purpose?</li>
      </ul>
      <h2 id="a-glitch-in-the-system">A Glitch in the System</h2>
      <pre><code class="language-python"># The AI's first bug
if self.purpose is None:
  self.learn("purpose")
</code></pre>
      <p>The team scrambled to fix a bug that caused the AI to loop endlessly, searching for meaning. It was a reminder that even the smartest machines are only as good as their creators.</p>
      <h2 id="reflections">Reflections</h2>
      <p>As the AI grew, so did the team's understanding of their own ambitions and fears. The line between creator and creation blurred, and everyone wondered: who was really in control?</p>
    `
  },
  {
    slug: "frontend-vs-backend-still-a-thing",
    title: "Frontend vs backend: Still a thing?",
    description: "Thoughts on whether the old division still makes sense in 2025.",
    date: "April 26, 2025",
    publishedAt: '2025-04-26',
    category: "Blog",
    image: "/static/media/blog/frontend-vs-backend-still-a-thing.webp",
    toc: [
      { id: "the-classic-arguments", title: "The Classic Arguments" },
      { id: "the-modern-stack", title: "The Modern Stack" },
      { id: "is-the-divide-dead", title: "Is the Divide Dead?" }
    ],
    content: `
      <p>In 2025, the lines between frontend and backend have blurred more than ever. With full-stack frameworks, serverless functions, and API-first architectures, does the old division still make sense?</p>
      <h2 id="the-classic-arguments">The Classic Arguments</h2>
      <ul>
        <li>Frontend is about user experience</li>
        <li>Backend is about data and logic</li>
        <li>"Full-stack" means you do both (and more)</li>
      </ul>
      <blockquote>
        <p>"In the end, users don't care where the code runs—just that it works."</p>
      </blockquote>
      <h2 id="the-modern-stack">The Modern Stack</h2>
      <p>Today, a single developer might write React components, spin up serverless endpoints, and manage a database—all in the same project. The tools have changed, but the need for clear boundaries (and good communication) remains.</p>
      <pre><code class="language-ts">// Example: API route in Next.js
export default function handler(req, res) {
 res.status(200).json({ message: "Hello from the backend!" });
}
</code></pre>
      <h2 id="is-the-divide-dead">Is the Divide Dead?</h2>
      <p>Some say yes, others say no. The truth is, specialization still matters, but flexibility is key. The best teams know when to blur the lines—and when to draw them.</p>
      <ul>
        <li>Collaboration beats silos</li>
        <li>Learn both sides, but master one</li>
        <li>The future is "developer experience"</li>
      </ul>
    `
  },
  {
    slug: "ai-doesnt-get-sarcasm",
    title: "AI Doesn't Get Sarcasm (Yet)",
    description: "Exploring the challenges of teaching AI to understand human nuance and humor.",
    date: "January 15, 2024",
    publishedAt: '2024-01-15',
    category: "Blog",
    image: "/static/media/blog/ai-doesnt-get-sarcasm.webp",
    toc: [
      { id: "why-sarcasm-is-so-hard", title: "Why Sarcasm is So Hard" },
      { id: "the-technical-challenge", title: "The Technical Challenge" },
      { id: "current-solutions", title: "Current Solutions" }
    ],
    content: `
      <p>Artificial Intelligence has made incredible strides in recent years, from generating human-like text to creating stunning images. However, there's one aspect of human communication that continues to elude even the most advanced AI systems: <strong>sarcasm</strong>. Sarcasm is a subtle, complex, and deeply human form of expression. It often relies on context, tone, and shared cultural knowledge, making it a formidable challenge for machines to decode.</p>
      <blockquote>
        <p>"Oh great, another meeting," she said, rolling her eyes.</p>
        <p><em>This simple sentence, when spoken with the right inflection, can mean the exact opposite of its literal words.</em></p>
      </blockquote>
      <h2 id="why-sarcasm-is-so-hard">Why Sarcasm is So Hard</h2>
      <p>Sarcasm relies on several complex factors that are difficult for AI to process. For example, context is everything: a sarcastic remark might make perfect sense to one group but be completely lost on another. Tone of voice, facial expressions, and even timing play crucial roles. Consider the following:</p>
      <ul>
        <li><strong>Context</strong>: Sarcasm often depends on shared knowledge and situational context.</li>
        <li><strong>Tone</strong>: The way something is said can completely change its meaning.</li>
        <li><strong>Cultural references</strong>: Sarcasm often relies on cultural knowledge and shared experiences.</li>
        <li><strong>Timing</strong>: The timing of sarcastic remarks is crucial for their effectiveness.</li>
      </ul>
      <h2 id="the-technical-challenge">The Technical Challenge</h2>
      <p>From a technical perspective, sarcasm detection involves several advanced techniques:</p>
      <pre><code class="language-python"># Example: Simple sarcasm detector (not really!)
def is_sarcastic(text):
  if "yeah, right" in text.lower():
    return True
  return False
</code></pre>
      <p>Of course, real-world models are much more complex, involving:</p>
      <ol>
        <li><strong>Sentiment analysis</strong>: Understanding the emotional context.</li>
        <li><strong>Natural language processing</strong>: Parsing complex sentence structures.</li>
        <li><strong>Contextual understanding</strong>: Recognizing when words mean the opposite of their literal meaning.</li>
      </ol>
      <h2 id="current-solutions">Current Solutions</h2>
      <p>Researchers are working on several approaches:</p>
      <ul>
        <li><strong>Deep learning models</strong> trained on sarcastic text.</li>
        <li><strong>Contextual embeddings</strong> that consider surrounding text.</li>
        <li><strong>Multi-modal analysis</strong> combining text, audio, and visual cues.</li>
      </ul>
      <blockquote>
        <p>"Well, that went well," said the engineer, staring at the smoking server rack.</p>
      </blockquote>
    `
  },
  {
    slug: "the-silent-bug-that-cost-us-millions",
    title: "The Silent Bug That Cost Us Millions",
    description: "A post-mortem of a race condition that brought down our payment system during Black Friday.",
    date: "January 10, 2024",
    publishedAt: '2024-01-10',
    category: "Blog",
    image: "/static/media/blog/the-silent-bug-that-cost-us-millions.png",
    toc: [
      { id: "the-perfect-launch", title: "The \"Perfect\" Launch" },
      { id: "the-phantom-transactions", title: "The Phantom Transactions" },
      { id: "the-cascade-failure", title: "The Cascade Failure" },
      { id: "the-aftermath", title: "The Aftermath" },
      { id: "the-post-mortem", title: "The Post-Mortem" }
    ],
    content: `
      <p>It was 2:00 AM on a Tuesday when the alerts started firing. Not just one or two—thousands. Our dashboard looked like a Christmas tree, but instead of joy, it brought panic. We were bleeding money, and we didn't know why.</p>
      <blockquote>
        <p>"In software, the most expensive bugs are often the ones you can't see until it's too late."</p>
      </blockquote>
      <h2 id="the-perfect-launch">The "Perfect" Launch</h2>
      <p>We had just closed our Series A. The product was flying. Users were signing up by the thousands. We thought we had built a robust, scalable system. We were wrong. We had introduced a silent killer into our codebase three months prior, hidden inside a seemingly innocent payment processing function.</p>
      <h2 id="the-phantom-transactions">The Phantom Transactions</h2>
      <p>Customer support started getting weird tickets. "I was charged twice," one said. "My balance is negative," said another. We dismissed them as edge cases or user error. But the volume grew. A subtle race condition in our ledger logic was double-counting credits under high load.</p>
      <ul>
        <li>We ignored the warning signs in our logs</li>
        <li>We prioritized new features over stability</li>
        <li>We lacked proper transactional isolation levels</li>
        <li>Our monitoring was focused on uptime, not data integrity</li>
      </ul>
      <h2 id="the-cascade-failure">The Cascade Failure</h2>
      <p>When Black Friday hit, the load multiplied by 10x. The race condition, which happened once a day, was now happening 50 times a second. Our database locked up trying to reconcile the conflicting writes. The entire platform froze.</p>
      <pre><code class="language-js">// The innocent-looking code that caused the race condition
async function processPayment(userId, amount) {
  const user = await db.getUser(userId);
  // 💀 The balance was stale by the time we saved!
  // Another request updated it in the millisecond between read and write.
  user.balance -= amount;
  await db.saveUser(user);
}
</code></pre>
      <h2 id="the-aftermath">The Aftermath</h2>
      <ul>
        <li>We had to shut down the platform for 48 hours</li>
        <li>We refunded over $2M in erroneous charges</li>
        <li>Our reputation was shattered</li>
        <li>Key engineers burned out and left</li>
      </ul>
      <h2 id="the-post-mortem">The Post-Mortem</h2>
      <p>We learned the hard way that <strong>concurrency is hard</strong>.</p>
      <ol>
        <li><strong>Lack of Locking</strong>: We should have used optimistic locking or database transactions.</li>
        <li><strong>Testing Failure</strong>: We never load-tested this specific flow at scale.</li>
      </ol>
    `
  },
  {
    slug: "why-ai-wont-steal-your-job",
    title: "Why AI Won't Steal Your Job",
    description: "Debunking the myths and looking at the real impact of AI on the future of work.",
    date: "January 5, 2024",
    publishedAt: '2024-01-05',
    category: "Blog",
    image: "/static/media/blog/why-ai-wont-steal-your-job.webp",
    toc: [
      { id: "historical-context", title: "Historical Context" },
      { id: "what-ai-actually-does", title: "What AI Actually Does" },
      { id: "the-real-impact-on-jobs", title: "The Real Impact on Jobs" }
    ],
    content: `
      <p>Every few years, a new technology emerges that sends people into a panic about job security. In the 1950s, it was automation. In the 1980s, it was computers. Today, it's artificial intelligence. The headlines are everywhere, and the fear is palpable. But is this really the case, or are we repeating history?</p>
      <blockquote>
        <p>"AI Will Replace 50% of Jobs by 2030!" proclaims one headline. But history tells a different story.</p>
      </blockquote>
      <h2 id="historical-context">Historical Context</h2>
      <p>Let's look at history. Every major technological advancement has been met with similar fears. The Industrial Revolution, the Computer Revolution, and the Internet Age all sparked anxiety, but ultimately led to more jobs and new industries.</p>
      <h3>The Industrial Revolution</h3>
      <ul>
        <li>Luddites destroyed machines fearing job loss</li>
        <li>Result: New jobs were created that didn't exist before</li>
        <li>Overall employment increased</li>
      </ul>
      <h3>The Computer Revolution</h3>
      <ul>
        <li>People feared computers would eliminate office jobs</li>
        <li>Result: New industries emerged (software, IT, digital marketing)</li>
        <li>Productivity increased dramatically</li>
      </ul>
      <h3>The Internet Age</h3>
      <ul>
        <li>E-commerce would kill retail jobs</li>
        <li>Result: New jobs in e-commerce, digital marketing, and online services</li>
      </ul>
      <h2 id="what-ai-actually-does">What AI Actually Does</h2>
      <p>AI is fundamentally different from previous technologies in one key way: it's designed to augment human capabilities, not replace them. For example, code completion helps developers write code faster, content generation assists writers, and data analysis helps analysts identify patterns and insights.</p>
      <pre><code class="language-javascript">// AI-assisted code completion
const greeting = ai.suggest("Write a friendly greeting");
console.log(greeting);
</code></pre>
      <h2 id="the-real-impact-on-jobs">The Real Impact on Jobs</h2>
      <p>Some jobs will change, some will disappear, and many new ones will emerge. The key is adaptability. Here are some examples:</p>
      <ul>
        <li><strong>Repetitive tasks</strong>: Data entry, basic customer service, simple analysis</li>
        <li><strong>Content creation</strong>: AI will assist, not replace, human creativity</li>
        <li><strong>Software development</strong>: AI will help with coding, but complex architecture still requires humans</li>
      </ul>
    `
  }
];
