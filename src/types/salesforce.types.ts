export type CsvRow = {
  sobject: string;
  fieldName: string;
  label: string;
  type: string;
  length?: number;
  values?: string;
  required: boolean;
};

export function xmlSafe(xml: string): string {
  return xml.replace(/^\uFEFF/, "").trimStart();
}
