#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDirectory, "..");
const source = fs.readFileSync(path.join(repoRoot, "js/game.js"), "utf8");
const context = vm.createContext({
  console,
  Math,
  sessionStorage: { getItem: () => null, setItem: () => {} },
  window: { setTimeout: callback => callback() }
});

vm.runInContext(
  `${source}\nglobalThis.__GAME_TEST_API__ = {
    NEWSVENDOR_PROFILES,
    buildNewsvendorScenarios,
    calculateNewsvendorOutcome,
    calculateNewsvendorCriticalRatio,
    calculateOptimalNewsvendorOrder,
    inverseStandardNormal,
    NEWSVENDOR_GAME,
    chooseNewsvendorProfile
  };`,
  context,
  { filename: "js/game.js" }
);

const api = context.__GAME_TEST_API__;
const baseline = api.NEWSVENDOR_PROFILES[0].baseline;

assert.equal(api.NEWSVENDOR_PROFILES.length, 6, "Six replay profiles should remain available");
assert.equal(
  api.chooseNewsvendorProfile(api.NEWSVENDOR_PROFILES, "A", () => 0).id,
  "B",
  "Replay selection should avoid the immediately previous profile"
);
assert.equal(
  api.chooseNewsvendorProfile([api.NEWSVENDOR_PROFILES[0]], "A", () => 0).id,
  "A",
  "A one-profile adaptation should remain playable"
);
assert.throws(
  () => api.chooseNewsvendorProfile([], null, () => 0),
  /At least one Newsvendor profile/
);
const economicFields = ["meanDemand", "demandSd", "sellingPrice", "unitCost", "salvageValue"];
for (const profile of api.NEWSVENDOR_PROFILES) {
  const scenarios = api.buildNewsvendorScenarios(profile);
  assert.equal(
    scenarios.length,
    api.NEWSVENDOR_GAME.rounds,
    `Profile ${profile.id} should match the configured round count`
  );
  const baselineOrder = api.calculateOptimalNewsvendorOrder(scenarios[0]);

  scenarios.forEach((scenario, scenarioIndex) => {
    assert.ok(scenario.meanDemand > 0);
    assert.ok(scenario.demandSd > 0);
    assert.ok(scenario.sellingPrice > scenario.unitCost);
    assert.ok(scenario.unitCost > scenario.salvageValue);
    const ratio = api.calculateNewsvendorCriticalRatio(scenario);
    assert.ok(ratio > 0 && ratio < 1, `${profile.id}/${scenario.shortName} needs a valid critical ratio`);

    const optimalOrder = api.calculateOptimalNewsvendorOrder(scenario);
    assert.ok(
      optimalOrder >= api.NEWSVENDOR_GAME.minimumOrder
        && optimalOrder <= api.NEWSVENDOR_GAME.maximumOrder,
      `${profile.id}/${scenario.shortName} Q* must fit the supported order range`
    );

    const actualChangedFields = economicFields.filter(
      field => scenario[field] !== profile.baseline[field]
    );
    assert.deepEqual(
      [...scenario.changedFields].sort(),
      actualChangedFields.sort(),
      `${profile.id}/${scenario.shortName} changedFields must match its economics`
    );

    const comparison = scenarioIndex === 0
      ? optimalOrder - scenario.meanDemand
      : optimalOrder - baselineOrder;
    const expectedPrediction = scenarioIndex > 0 && Math.abs(comparison) <= 2
      ? "same"
      : comparison > 0
        ? "higher"
        : comparison < 0
          ? "lower"
          : "same";
    assert.equal(
      scenario.correctPrediction,
      expectedPrediction,
      `${profile.id}/${scenario.shortName} prediction must match Q*`
    );
  });
}

assert.ok(Math.abs(api.calculateNewsvendorCriticalRatio(baseline) - 2 / 3) < 1e-12);
assert.equal(api.calculateOptimalNewsvendorOrder(baseline), 109);
assert.deepEqual(
  JSON.parse(JSON.stringify(api.calculateNewsvendorOutcome(100, 80, baseline))),
  { sales: 80, leftover: 20, lostSales: 0, profit: 420 }
);
assert.ok(Math.abs(api.inverseStandardNormal(0.5)) < 1e-12);
assert.ok(Math.abs(api.inverseStandardNormal(0.8) + api.inverseStandardNormal(0.2)) < 1e-9);
assert.ok(Math.abs(api.inverseStandardNormal(0.975) - 1.9599639845) < 1e-6);
assert.throws(() => api.inverseStandardNormal(0), error => error?.name === "RangeError");
assert.throws(() => api.inverseStandardNormal(1), error => error?.name === "RangeError");

console.log("Newsvendor engine tests passed.");
