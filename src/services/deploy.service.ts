import { DeployResult } from "jsforce/lib/api/metadata.js";
import { zipper } from "../types/zipper.types.js";
import { salesforceService } from "./connection.service.js";
import { errors } from "./errors.service.js";
import { parse } from "./parse.service.js";

class Deploy {
  async deploy(userEmail: string, csv: string) {
    const conn = await salesforceService.login(userEmail);

    const rows = parse.parseCsv(csv);

    const zipBase64 = await zipper.buildDeployZip(rows);

    const check = await conn.metadata.deploy(zipBase64, {
      checkOnly: true,
      singlePackage: true,
      rollbackOnError: true
    });

    let result: DeployResult;

    do {
      await new Promise((r) => setTimeout(r, 3000));
      result = await conn.metadata.checkDeployStatus(check.id, true);
    } while (!result.done);

    if (!result.success) {
      throw new Error(errors.buildDeployError(result));
    }

    const deploy = await conn.metadata.deploy(zipBase64, {
      checkOnly: false,
      singlePackage: true,
      rollbackOnError: true
    });

    do {
      await new Promise((r) => setTimeout(r, 3000));
      result = await conn.metadata.checkDeployStatus(deploy.id, true);
    } while (!result.done);

    return result;
  }
}

export const deployX = new Deploy();
