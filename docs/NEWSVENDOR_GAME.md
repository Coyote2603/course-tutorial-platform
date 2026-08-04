# Newsvendor Challenge

The Newsvendor Challenge is a complete public game included with the platform. It can be shared directly, used alongside the synthetic sessions, or retained while every other course component is replaced.

## Learning design

Across eight rounds, a learner:

1. reads a market brief;
2. predicts how the optimal order quantity should move;
3. commits to an order quantity;
4. observes realized demand;
5. compares the chosen policy with the optimal quantity on the same demand realization; and
6. receives a short explanation of the governing intuition.

The early rounds change one input at a time. A later round combines offsetting changes, and the final round acts as a capstone. This progression makes comparative statics visible before requiring the full model.

## Model

For normally distributed demand with mean `mu` and standard deviation `sigma`:

```text
underage cost    Cu = selling price - unit cost
overage cost     Co = unit cost - salvage value
critical ratio   CR = Cu / (Cu + Co)
optimal quantity Q* = mu + sigma × inverseNormal(CR)
```

For an order quantity `Q` and realized demand `D`, the game computes:

```text
sales       = min(Q, D)
leftovers   = max(Q - D, 0)
profit      = sellingPrice × sales
              + salvageValue × leftovers
              - unitCost × Q
```

The learner's choice and the benchmark are evaluated on the same realized demand. That comparison helps separate decision quality from demand luck.

## Files

- `newsvendor-game.html` contains the learner-facing page structure and introductory copy.
- `css/game.css` contains the game presentation.
- `js/game.js` contains profiles, scenario construction, random demand, optimal-quantity logic, scoring, and interaction state.
- `scripts/test-game.mjs` validates the model and scenario invariants.

`js/site-config.js` controls the game card shown elsewhere on the platform. Setting `features.showGame` to `false` removes the entry point without changing the standalone game page.

## Change the framing without changing the model

You can rename the product, market, or activity in `newsvendor-game.html` and update scenario `name`, `story`, `changeLabel`, and `teachingPoint` values in `js/game.js`.

Keep each explanation aligned with the actual numeric change. If a story says only uncertainty changes, every other parameter must equal the baseline for that profile.

Use fictional and institution-neutral settings unless you have permission to publish the real context.

## Change scenario values

Profiles live in `NEWSVENDOR_PROFILES`. Each supplies a baseline and values used by the eight scenario patterns. When editing values, preserve these economic conditions:

```text
sellingPrice > unitCost
unitCost > salvageValue
demandSd > 0
```

Also verify that:

- the critical ratio remains strictly between zero and one;
- the resulting `Q*` stays within the supported order range;
- `correctPrediction` matches the actual movement relative to the relevant comparison;
- a one-change scenario changes exactly the field named in `changedFields`;
- the offsetting scenario genuinely produces the stated relationship; and
- feedback language remains correct for every profile, not only one example.

Run:

```bash
npm test
```

Then play all eight rounds in a browser. Automated numerical tests will not catch unclear wording or an interaction that is difficult to use.

## Preserve the decision-quality comparison

Do not draw separate random demand values for the learner and benchmark. Doing so would confound policy quality with luck. If you change the scoring interface, preserve the same realized demand for both quantities and explain the comparison accurately.

## Randomization and privacy

The game chooses among synthetic parameter profiles and avoids immediately repeating the prior profile when browser storage is available. This state is local to the browser session. It contains no identity, score submission, analytics, or leaderboard.

If you add persistent scores or class comparisons, you are introducing student data and a service backend. Complete a separate privacy, security, retention, and institutional review before deployment.

## Classroom uses

- **Individual warm-up:** learners predict the direction of `Q*` before calculating.
- **Pairs:** one learner argues from underage cost and the other from overage cost.
- **Live poll:** collect directional predictions, then reveal and discuss the round.
- **Debrief:** compare total profit with the benchmark and identify which errors came from intuition versus arithmetic.
- **Transfer:** ask learners to design a ninth scenario that changes one input and defend the expected direction.

The public game is a learning activity, not an assessment-security mechanism. Anyone can inspect its source and calculations.
