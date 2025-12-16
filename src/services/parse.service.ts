import { CsvRow } from "../types/salesforce.types.js";

class Parse {
  parseCsv(csv: string): CsvRow[] {
    return csv
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line, index) => {
        const parts = line.split(",");

        if (parts.length < 7) {
          throw new Error(
            `Invalid CSV format at line ${index + 1}. Expected 7 columns, got ${
              parts.length
            }`
          );
        }

        const [sobject, fieldName, label, type, length, values, required] =
          parts.map((p) => (p ?? "").trim());

        return {
          sobject,
          fieldName,
          label,
          type,
          length: length ? Number(length) : undefined,
          values: values || undefined,
          required: required.toLowerCase() === "true",
        };
      });
  }
}

export const parse = new Parse();
