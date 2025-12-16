import { CsvRow, xmlSafe } from "../types/salesforce.types.js";

class Package {
  buildPackageXml(rows: CsvRow[], profileName: string): string {
    const fieldMembers = rows
      .slice(1)
      .map((r) => `<members>${r.sobject}.${r.fieldName}</members>`)
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">

  <types>
${fieldMembers}
    <name>CustomField</name>
  </types>

  <types>
    <members>${profileName}</members>
    <name>Profile</name>
  </types>

  <version>60.0</version>
</Package>`;

    return xmlSafe(xml);
  }
}

export const packageXml = new Package();
