import { CsvRow, xmlSafe } from "../types/salesforce.types.js";

class Metadata {
  buildCustomFieldXml(row: CsvRow): string {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
  <fullName>${row.fieldName}</fullName>
  <label>${row.label}</label>
  <type>${row.type}</type>
`;

    if (row.type === "Text" && row.length) {
      xml += `  <length>${row.length}</length>\n`;
    }

    xml += `  <required>${row.required}</required>\n`;

    if (row.type === "Picklist" && row.values) {
      const valuesXml = row.values
        .split("|")
        .map(
          (v) => `
      <value>
        <fullName>${v}</fullName>
        <label>${v}</label>
      </value>`
        )
        .join("");

      xml += `
  <valueSet>
    <valueSetDefinition>
      ${valuesXml}
    </valueSetDefinition>
  </valueSet>
`;
    }

    xml += `</CustomField>`;
    return xmlSafe(xml);
  }
}

export const metadata = new Metadata();
