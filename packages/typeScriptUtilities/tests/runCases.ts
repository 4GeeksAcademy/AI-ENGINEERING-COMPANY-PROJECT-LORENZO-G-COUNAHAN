import { collectionCaseResults } from "./collectionCases";
import { searchCaseResults } from "./searchCases";
import { transformationCaseResults } from "./transformationCases";
import { validationCaseResults } from "./validationCases";

const results = [
  ...collectionCaseResults,
  ...searchCaseResults,
  ...transformationCaseResults,
  ...validationCaseResults,
];

const failures = results.filter((result) => !result.passed);
results.forEach(({ name, passed }) => {
  console.log(`${passed ? "PASS" : "FAIL"} ${name}`);
});

if (failures.length > 0) {
  throw new Error(`${failures.length} of ${results.length} checks failed.`);
}

console.log(`All ${results.length} checks passed.`);
