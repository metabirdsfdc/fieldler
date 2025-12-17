import JSZip from "jszip";
import { CsvRow } from "../types/salesforce.types.js";

export class ZipBuilder {
  async buildDeployZip(rows: CsvRow[]): Promise<string> {
    const zip = new JSZip();

    const dataRows = rows.slice(1);

    const grouped = this.groupByObject(dataRows);

    for (const [sobject, objectRows] of Object.entries(grouped)) {
      const objectXml = this.buildCustomObjectXml(objectRows);
      zip.file(`objects/${sobject}.object`, objectXml);
    }

    zip.file("package.xml", this.buildPackageXml(dataRows));

    return zip.generateAsync({ type: "base64" });
  }


  private groupByObject(rows: CsvRow[]): Record<string, CsvRow[]> {
    return rows.reduce((acc, row) => {
      if (!acc[row.sobject]) {
        acc[row.sobject] = [];
      }
      acc[row.sobject].push(row);
      return acc;
    }, {} as Record<string, CsvRow[]>);
  }


  private buildCustomObjectXml(rows: CsvRow[]): string {
    const fieldsXml = rows.map((row) => this.buildFieldXml(row)).join("");

    return `<?xml version="1.0" encoding="UTF-8"?>
<CustomObject xmlns="http://soap.sforce.com/2006/04/metadata">
${fieldsXml}
</CustomObject>`;
  }

  private buildFieldXml(row: CsvRow): string {
    return `
  <fields>
    <fullName>${row.fieldName}</fullName>
    <label>${row.label}</label>
    <type>${row.type}</type>
    ${row.length ? `<length>${row.length}</length>` : ""}
    <required>${row.required}</required>
    ${this.buildPicklistXml(row)}
  </fields>`;
  }

  private buildPicklistXml(row: CsvRow): string {
    if (row.type !== "Picklist" || !row.values) {
      return "";
    }

    const valuesXml = row.values
      .split("|")
      .map(
        (value) => `
        <value>
          <fullName>${value}</fullName>
          <label>${value}</label>
          <default>false</default>
        </value>`
      )
      .join("");

    return `
    <valueSet>
      <restricted>false</restricted>
      <valueSetDefinition>
${valuesXml}
      </valueSetDefinition>
    </valueSet>`;
  }


  private buildPackageXml(rows: CsvRow[]): string {
    const objects = Array.from(new Set(rows.map((r) => r.sobject)));

    return `<?xml version="1.0" encoding="UTF-8"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">

  <types>
${objects.map((o) => `    <members>${o}</members>`).join("\n")}
    <name>CustomObject</name>
  </types>

  <version>60.0</version>
</Package>`;
  }
}

export const zipper = new ZipBuilder();
