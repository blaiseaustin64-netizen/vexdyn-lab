import type { Challenge, TestCase } from '../types';

export interface EvaluationResult {
  success: boolean;
  message: string;
  details?: string[];
  passedTests?: number;
  totalTests?: number;
}

/**
 * V1 local evaluator.
 * This is intentionally simple and replaceable.
 * Future: swap for a secure backend evaluation service.
 */
export function evaluateChallenge(
  challenge: Challenge,
  userCode: string,
  selectedAnswer?: number | string
): EvaluationResult {
  try {
    // Multiple choice / Predict the output
    if (
      challenge.type === 'multiple-choice' ||
      challenge.type === 'predict-the-output'
    ) {
      if (selectedAnswer === undefined || selectedAnswer === null) {
        return {
          success: false,
          message: 'Please select an answer.',
        };
      }
      const correct = challenge.correctAnswer;
      const isCorrect =
        selectedAnswer === correct ||
        String(selectedAnswer) === String(correct);

      if (isCorrect) {
        return {
          success: true,
          message: 'All checks passed.',
          details: ['Correct answer selected.'],
        };
      }
      return {
        success: false,
        message: 'Your solution doesn\'t produce the expected result.',
        details: ['The selected answer is not correct. Review the concept and try again.'],
      };
    }

    // Code-based challenges
    if (!userCode || userCode.trim().length === 0) {
      return {
        success: false,
        message: 'Please write some code before running.',
      };
    }

    const tests = challenge.tests || [];
    if (tests.length === 0) {
      // Fallback: simple containment checks against expected strings
      return evaluateByContainment(challenge, userCode);
    }

    // JavaScript challenges with validate functions
    if (challenge.course === 'javascript') {
      return evaluateJavaScript(challenge, userCode, tests);
    }

    // HTML / CSS / React — string / pattern based for V1
    return evaluateByContainment(challenge, userCode);
  } catch (err) {
    return {
      success: false,
      message: 'Unable to verify',
      details: [
        'Something went wrong while checking this challenge.',
        err instanceof Error ? err.message : 'Unknown error',
      ],
    };
  }
}

function evaluateByContainment(
  challenge: Challenge,
  userCode: string
): EvaluationResult {
  const tests = challenge.tests || [];
  const details: string[] = [];
  let passed = 0;

  for (const test of tests) {
    const ok = userCode.toLowerCase().includes(test.expected.toLowerCase());
    if (ok) {
      passed += 1;
      details.push(`✓ ${test.description}`);
    } else {
      details.push(`✗ ${test.description}`);
    }
  }

  const success = passed === tests.length && tests.length > 0;

  return {
    success,
    message: success
      ? 'All tests passed.'
      : 'Your solution doesn\'t produce the expected result.',
    details,
    passedTests: passed,
    totalTests: tests.length,
  };
}

function evaluateJavaScript(
  challenge: Challenge,
  userCode: string,
  tests: TestCase[]
): EvaluationResult {
  const details: string[] = [];
  let passed = 0;

  // Create a sandboxed function scope
  // Note: This is V1 only — not production secure.
  for (const test of tests) {
    if (!test.validate) {
      // Fallback to string check
      const ok = userCode.includes(test.expected);
      if (ok) {
        passed += 1;
        details.push(`✓ ${test.description}`);
      } else {
        details.push(`✗ ${test.description}`);
      }
      continue;
    }

    try {
      // Combine user code + validation
      const runner = new Function(
        `"use strict";\n${userCode}\n; return (function(){ ${test.validate} })();`
      );
      const result = runner();
      if (result === true) {
        passed += 1;
        details.push(`✓ ${test.description}`);
      } else {
        details.push(`✗ ${test.description}`);
      }
    } catch (e) {
      details.push(
        `✗ ${test.description} — ${e instanceof Error ? e.message : 'Error'}`
      );
    }
  }

  const success = passed === tests.length && tests.length > 0;

  return {
    success,
    message: success
      ? 'All tests passed.'
      : 'Your solution doesn\'t produce the expected result.',
    details,
    passedTests: passed,
    totalTests: tests.length,
  };
}
