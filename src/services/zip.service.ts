import JSZip from "jszip";
import { CsvRow } from "../types/salesforce.types.js";
import { metadata } from "./metadata.service.js";
import { packageXml } from "./package.service.js";

export class ZipBuilder {
  async buildDeployZip(rows: CsvRow[], profileName: string): Promise<string> {
    const zip = new JSZip();

    for (const row of rows.slice(1)) {
      zip.file(
        `objects/${row.sobject}/fields/${row.fieldName}.field-meta.xml`,
        metadata.buildCustomFieldXml(row)
      );
    }

    // zip.file(
    //   `profiles/${profileName}.profile`,
    //   profile.buildProfileXml(profileName, rows)
    // );

    zip.file("package.xml", packageXml.buildPackageXml(rows, profileName));

    return zip.generateAsync({ type: "base64" });
  }
}

export const zip = new ZipBuilder();
