export const achievements = [
  {
    slug: 'restaurant-turnover-prediction',
    title: 'Restaurant Annual Turnover Prediction — Hackathon Winner',
    cardTitle: 'Restaurant Turnover Prediction',
    category: 'Hackathon winner',
    date: '2026-10-29',
    dateLabel: '29 October 2026',
    mediaSize: 'compact',
    summary: 'A machine learning challenge: turn restaurant data into annual revenue estimates, then test every improvement.',
    introduction: 'A hackathon-winning project exploring how structured restaurant data can help predict annual turnover. I worked through data preparation, model comparisons, and carefully validated ensembles to improve the final submission.',
    description: 'Sri Villiam Sai’s restaurant annual turnover prediction project, hackathon recognition on 29 October 2026, and historical model results.',
    cardCover: {
      src: '/static/media/achievements/hackathon-cover.svg',
      alt: 'Better data. Better estimates. Monochrome rising bars introduce the restaurant turnover prediction project.',
      width: 1200,
      height: 600,
    },
    cover: {
      src: '/static/media/achievements/restaurant-turnover.svg',
      alt: 'Restaurant data flows through preprocessing, validation, and an ensemble to estimate annual turnover in INR.',
      width: 1200,
      height: 360,
      caption: 'The workflow: prepare restaurant features, validate models, and blend the selected predictions.',
    },
    facts: [
      { label: 'Recognition', value: 'Hackathon winner' },
      { label: 'Date', value: '29 October 2026', date: '2026-10-29' },
      { label: 'Focus', value: 'Tabular machine learning' },
    ],
    technologies: ['Python', 'pandas', 'scikit-learn', 'TabPFN', 'Google Colab'],
    sections: [
      {
        id: 'problem',
        label: '01 / The problem',
        title: 'Estimate revenue from an uneven set of signals.',
        paragraphs: [
          'The task was to predict a restaurant’s annual turnover in INR from structured attributes such as cuisine, city, location, popularity, facilities, and customer ratings. Some fields were missing or inconsistent, and large turnover values had a strong influence on the error.',
          'The evaluation used root mean squared error, or RMSE. That made it important to measure predictions on the original revenue scale and understand whether a change helped across several validation splits.',
        ],
      },
      {
        id: 'approach',
        label: '02 / The approach',
        title: 'Prepare, compare, validate. Then blend.',
        paragraphs: [
          'I normalised inconsistent field names, handled missing values, and preserved the original ordering of the test records. Preprocessing and feature decisions were evaluated within training folds so validation records stayed outside the fitting process.',
          'I compared model settings on matched folds, froze promising choices, and checked them on additional split assignments. The selected V14 submission blended 25% of the earlier V9 predictions with 75% TabPFN-3.5 Base predictions.',
          'Reproduction checks tied the exported predictions to the matching executed notebook. Local validation guided the choice, while the portal result remained the measure of the submitted model.',
        ],
      },
      {
        id: 'outcome',
        label: '03 / The outcome',
        title: 'A hackathon win, and a measurable improvement.',
        paragraphs: [
          'This project earned hackathon winner recognition on 29 October 2026. It brought together the practical work of preparing data, evaluating models, and delivering a reproducible submission.',
          'The historical portal records below compare the earlier V9 submission with V14. They describe model performance separately from the award; they are not a final leaderboard placing.',
        ],
        comparison: {
          title: 'Historical model comparison',
          context: 'Recorded portal results · October 2026 · lower RMSE is better',
          unit: 'INR RMSE',
          baseline: { label: 'V9', value: 11904515.9864996 },
          selected: { label: 'V14', value: 11736110.7877709 },
          caption: 'V14’s score was recorded on 28 October 2026. These scores are historical results, not a live ranking or a measure of the award.',
        },
        figure: {
          src: '/static/media/achievements/restaurant-turnover-hackathon-result.jpg',
          alt: 'SRM M.Tech. MLA Hackathon restaurant turnover prediction portal screenshot showing rank 1 and a notice that the rank is subject to change after final audit.',
          width: 2468,
          height: 716,
        },
      },
      {
        id: 'lessons',
        label: '04 / What I learned',
        title: 'A better experiment matters more than a bigger model.',
        paragraphs: [
          'The useful lesson was to keep comparisons fair: use matched folds, retain the original validation targets, and check whether an apparent improvement survives another split.',
          'Not every later experiment improved on V14. Keeping the strongest measured submission, documenting unsuccessful trials, and reproducing the final export were as important as trying a new model.',
        ],
      },
    ],
  },
  {
    "slug": "f1-race-analysis",
    "title": "F1 Race Analysis & Championship Predictions",
    "cardTitle": "F1 Race Analysis & Championship Predictions",
    "category": "Personal project",
    "summary": "A July title forecast, a frozen-clock replay, and the lessons behind an auditable F1 intelligence system on Amazon Bedrock.",
    "introduction": "An F1 intelligence project that connects race analysis, championship simulations, and Amazon Bedrock explanations. This case study follows the reported July call for Kimi Antonelli, compares it with the later season, and examines what the retrospective uncovered.",
    "attribution": "Retrospective and supplied figures: Vivek Raja P S, AWS Builder Center — “How our Amazon Bedrock powered F1 Agentic system called Kimi Antonelli as World Champion in July.”",
    "description": "An F1 case study covering deterministic championship simulations, Amazon Bedrock briefs, the reported July 2026 forecast, and its retrospective audit.",
    "cardCover": {
      "src": "/static/media/achievements/f1-cover.svg",
      "alt": "Race data. Clear insight. A bold F1 wordmark and understated speed lines introduce the race intelligence project.",
      "width": 1200,
      "height": 600
    },
    "cover": {
      "src": "/static/media/achievements/f1-july-forecast.webp",
      "alt": "Archived July 10, 2026 forecast gives Antonelli a 79.7% title probability, Russell 15.3%, and Hamilton 4.8%, beside the original predictor screenshot.",
      "width": 2560,
      "height": 1344,
      "caption": "Figure 1 · The retrospective’s record of the 10 July 2026 forecast beside the saved predictor. The 79.7% was the published call; later corrected values belong to the replay."
    },
    "facts": [
      {
        "label": "Type",
        "value": "Personal project"
      },
      {
        "label": "Forecast snapshot",
        "value": "10 July 2026",
        "date": "2026-07-10"
      },
      {
        "label": "Review through",
        "value": "Mexico City · November 2026"
      }
    ],
    "technologies": [
      "Python",
      "OpenF1",
      "Strands Agents",
      "Amazon Bedrock",
      "Amazon Nova Pro",
      "Amazon S3",
      "AWS App Runner"
    ],
    "sections": [
      {
        "id": "problem",
        "label": "01 / The problem",
        "title": "Make a prediction that can be checked.",
        "paragraphs": [
          "Race results contain more than a finishing order. Lap pace, tyre behaviour, pit timing, and season-long scoring patterns help explain both a driver’s performance and the championship possibilities ahead.",
          "The July snapshot favoured Antonelli at 79.7%, with Russell at 15.3% and Hamilton at 4.8%. Its most useful output was a concrete challenge: Russell needed 18.27 points per round over the remaining 13 rounds, plus a win. That turned a probability into a target a reader could follow each weekend."
        ]
      },
      {
        "id": "approach",
        "label": "02 / The approach",
        "title": "Calculate the numbers. Let agents explain them.",
        "paragraphs": [
          "The deterministic layer builds standings from OpenF1 results and resamples each driver’s per-round scores across 4,000 simulated seasons with a fixed seed. It produces title probabilities, projected points, gaps, and path-to-title scenarios before a language model receives anything.",
          "Amazon Bedrock agents turn those structured payloads into readable briefs. In the architecture described by the retrospective, Amazon Nova Pro explains the figures, an App Runner container serves the dashboard, and Amazon S3 preserves outputs for later inspection."
        ]
      },
      {
        "id": "replay",
        "label": "03 / Validation",
        "title": "Replay the season with the clock frozen.",
        "paragraphs": [
          "A retrospective replay truncates the standings after each round and runs the predictor using only the results available at that point. The article reports that replaying the archived July inputs reproduces the original probability of 0.797.",
          "Only the 10 July forecast was published in real time. The other round-by-round probabilities, and every value from the corrected model, are retrospective reconstructions. They show how the model behaves on historical inputs; they are not a series of forecasts published on those dates."
        ],
        "table": {
          "caption": "Selected historical probabilities reported in the retrospective",
          "columns": [
            "After round",
            "July model replay",
            "Corrected replay"
          ],
          "rows": [
            [
              "Australia",
              "Russell · 100.0%",
              "Russell · 100.0%"
            ],
            [
              "China",
              "Russell · 97.7%",
              "Russell · 96.9%"
            ],
            [
              "Japan",
              "Antonelli · 98.3%",
              "Antonelli · 97.8%"
            ],
            [
              "Great Britain · 10 July",
              "Antonelli · 79.7% (published)",
              "Antonelli · 89.2%"
            ],
            [
              "Mexico City",
              "Not reported",
              "Antonelli · champion"
            ]
          ],
          "note": "The corrected replay uses the final 23-round calendar. The shipped model included two cancelled rounds. These columns compare different input treatments, not two forecasts published in July."
        },
        "figures": [
          {
            "src": "/static/media/achievements/f1-frozen-clock-replay.webp",
            "alt": "Corrected retrospective heatmap: Russell leads the early rounds, then Antonelli remains the favourite from Japan through Mexico City. The July snapshot is highlighted.",
            "width": 2583,
            "height": 902,
            "caption": "Figure 2 · Corrected frozen-clock replay, not contemporaneously published forecasts. The highlighted July cell rounds 89.2% to 89%."
          }
        ]
      },
      {
        "id": "outcome",
        "label": "04 / The outcome",
        "title": "Compare the scoring target with what followed.",
        "paragraphs": [
          "Through Mexico City, the retrospective records another 201 points for Antonelli: 20.1 per round after the July snapshot. Russell added 96, or 9.6 per round, against the 18.27 the July brief said he needed. Hamilton added 112 at 11.2 per round, while Verstappen’s 185 points exposed how much a second-half improvement could outrun the model’s earlier expectations.",
          "Antonelli finished third in Mexico City and secured the 2026 championship. The comparison is more useful than the winner alone: the saved projection bands show Antonelli at the 84th percentile, Russell at the 8th, and Hamilton at the 20th of their July distributions. All three stayed within the illustrated 5th-to-95th-percentile bands.",
          "That is one reported season comparison, not proof that the probabilities are calibrated across seasons or a guarantee that the model will identify a future champion."
        ],
        "figures": [
          {
            "src": "/static/media/achievements/f1-points-after-july.webp",
            "alt": "Points gained after July: Antonelli 201, Verstappen 185, Hamilton 112, and Russell 96. Russell’s required pace of 18.27 points per round is shown as a dashed reference.",
            "width": 2353,
            "height": 1097,
            "caption": "Figure 3 · Reported points gained after the July call. Russell’s required pace and the original model’s expectation for Antonelli are reference lines, not actual scores."
          },
          {
            "src": "/static/media/achievements/f1-projection-bands.webp",
            "alt": "July projected points bands compared with actual points through Mexico: Antonelli 380, Russell 250, and Hamilton 259. Shading shows the 5th to 95th percentile, dashed lines the median, and solid lines the observed totals.",
            "width": 2353,
            "height": 985,
            "caption": "Figure 4 · Saved July projection bands against later results. Showing the spread makes it possible to inspect uncertainty as well as the favourite."
          }
        ]
      },
      {
        "id": "corrections",
        "label": "05 / The audit",
        "title": "Two missing results changed the sample.",
        "paragraphs": [
          "The article identifies a data-quality bug: the season builder counted the cancelled Bahrain and Saudi Arabian events as zero-point rounds for every driver. Nine completed races became an eleven-round bootstrap sample.",
          "Removing those phantom zeros raised Antonelli’s reported expected points per round from 16.3 to 19.9, compared with the 20.1 later observed. The corrected July title probability rose from 79.7% to 89.2%. The original number remains the published record; the corrected number is a later replay.",
          "The reported fix distinguishes a long-past race with no classification from a race still awaiting results. The broader lesson is to validate what a missing record means before treating it as a measured zero."
        ],
        "figures": [
          {
            "src": "/static/media/achievements/f1-cancelled-rounds.webp",
            "alt": "Two cancelled events appear as phantom zero-point rounds in Antonelli’s July sample. Correcting the sample changes expected points per round from 16.3 to 19.9 and title probability from 79.7% to 89.2%.",
            "width": 2381,
            "height": 1080,
            "caption": "Figure 5 · The retrospective’s cancelled-round correction. Shipped values, corrected replay values, and later observed scoring are labelled separately."
          }
        ]
      },
      {
        "id": "architecture",
        "label": "06 / Technical architecture",
        "title": "Who computes, and who writes?",
        "paragraphs": [
          "The revised architecture also checks numbers in a brief against its payload, retries generation up to three times, and records unresolved flags. This is the retrospective’s reported design, including later corrections; the figure is a saved architecture reference.",
          "Archived S3 snapshots preserve the inputs and outputs behind the July call. Offline replay grades that record later, while the dashboard presents calculations and agent explanations together."
        ],
        "figures": [
          {
            "src": "/static/media/achievements/f1-bedrock-architecture.webp",
            "alt": "Architecture: OpenF1 results enter a deterministic season builder and seeded predictor; Bedrock agents explain JSON payloads, a groundedness check precedes the dashboard, and S3 archives outputs for offline replay.",
            "width": 3200,
            "height": 1880,
            "caption": "Figure 6 · The retrospective’s revised architecture. Deterministic calculations produce the forecast; agents write explanations. Archived outputs support offline grading."
          }
        ]
      },
      {
        "id": "lessons",
        "label": "07 / Lessons & limits",
        "title": "Preserve the evidence. Keep questioning the model.",
        "paragraphs": [
          "A fixed seed and archived inputs make a forecast easier to audit. The important record is what was computed from the data available then, alongside the assumptions and any changes discovered later.",
          "A bootstrap has little evidence after one or two races and can report unjustified certainty. A minimum-sample gate or a prior is still needed. It also cannot anticipate a car upgrade or a team finding pace, and independently sampling teammates ignores their shared-car correlation.",
          "Checking whether a number exists in a payload does not establish that the surrounding sentence is correct. The retrospective reports that the dashboard had bypassed its earlier numeric check; later payload and grounding changes improved the checks, while semantic errors remained possible.",
          "Race-strategy counterfactuals also assume fixed pit loss and omit traffic and safety-car effects. Separately, the local project review identified pit-loss lookahead in a backtest, so the affected undercut-error claims are excluded here. This page presents saved evidence and reported findings, rather than running a live prediction service."
        ],
        "figures": [
          {
            "src": "/static/media/achievements/f1-mexico-celebration.webp",
            "alt": "Kimi Antonelli and members of the Mercedes team celebrating together in Mexico City.",
            "width": 3392,
            "height": 1908,
            "caption": "Antonelli and the Mercedes team celebrate in Mexico City. Photo credit: Getty Images / Formula 1, as supplied with the retrospective."
          }
        ]
      }
    ],
    "mediaSize": "compact"
  },
];

export const achievementPath = (achievement) => '/achievements/' + achievement.slug;
export const getAchievement = (slug) => achievements.find((achievement) => achievement.slug === slug);
