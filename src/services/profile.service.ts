import { CsvRow, xmlSafe } from "../types/salesforce.types.js";

class Profile {
  buildProfileXml(profileName: string, rows: CsvRow[]): string {
    const permissions = rows
      .slice(1)
      .map(
        (r) => `
  <fieldPermissions>
    <field>${r.sobject}.${r.fieldName}</field>
    <readable>true</readable>
    <editable>true</editable>
  </fieldPermissions>`
      )
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Profile xmlns="http://soap.sforce.com/2006/04/metadata">
${permissions}
</Profile>`;

    return xmlSafe(xml);
  }
}

export const profile = new Profile();
