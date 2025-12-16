class Errors {
  buildDeployError(result: any): string {
    const messages: string[] = [];

    if (result.details?.componentFailures) {
      const failures = Array.isArray(result.details.componentFailures)
        ? result.details.componentFailures
        : [result.details.componentFailures];

      failures.forEach((f: any) => {
        messages.push(
          `[${f.componentType || "Unknown"}] ${f.fileName || f.fullName}: ${
            f.problem
          }`
        );
      });
    }

    if (result.details?.runTestResult?.failures) {
      const testFailures = Array.isArray(result.details.runTestResult.failures)
        ? result.details.runTestResult.failures
        : [result.details.runTestResult.failures];

      testFailures.forEach((t: any) => {
        messages.push(`[TEST FAILED] ${t.name}.${t.methodName}: ${t.message}`);
      });
    }

    if (messages.length === 0 && result.errorMessage) {
      messages.push(result.errorMessage);
    }

    return messages.join("\n");
  }
}
export const errors = new Errors();
