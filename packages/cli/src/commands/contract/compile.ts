import { Command, Flags } from "@oclif/core";
import path = require("node:path");
import { readdirSync } from "node:fs";
import {
  moveArtifacts,
  ensureSwankyProject,
  getBuildCommandFor,
  getSwankyConfig,
  BuildData,
  Spinner,
  generateTypesFor,
} from "@arthswap/swanky-core";
import { writeJSON } from "fs-extra";

export class CompileContract extends Command {
  static description = "Compile the smart contract(s) in your contracts directory";

  static flags = {
    verbose: Flags.boolean({
      default: false,
      char: "v",
      description: "Display additional compilation output",
    }),
    release: Flags.boolean({
      default: false,
      char: "r",
      description: "A production contract should always be build in `release` mode for building optimized wasm"
    })
  };

  static args = [
    {
      name: "contractName",
      required: true,
      description: "Name of the contract to compile",
    },
  ];

  async run(): Promise<void> {
    const { args, flags } = await this.parse(CompileContract);

    await ensureSwankyProject();

    const config = await getSwankyConfig();

    const contractInfo = config.contracts[args.contractName];
    if (!contractInfo) {
      this.error(`Cannot find a contract named ${args.contractName} in swanky.config.json`);
    }

    const spinner = new Spinner();

    const contractList = readdirSync(path.resolve("contracts"));

    const contractPath = path.resolve("contracts", args.contractName);
    if (!contractList.includes(args.contractName)) {
      this.error(`Path to contract ${args.contractName} does not exist: ${contractPath}`);
    }

    await spinner.runCommand(
      async () => {
        return new Promise<void>((resolve, reject) => {
          const compile = getBuildCommandFor(contractInfo.language, contractPath, flags.release);
          compile.stdout.on("data", () => spinner.ora.clear());
          compile.stdout.pipe(process.stdout);
          if (flags.verbose) {
            compile.stderr.on("data", () => spinner.ora.clear());
            compile.stderr.pipe(process.stdout);
          }
          compile.on("exit", (code) => {
            if (code === 0) resolve();
            else reject();
          });
        });
      },
      "Compiling contract",
      "Contract compiled successfully",
    );

    await spinner.runCommand(
      async () => await generateTypesFor(contractInfo.language, contractInfo.name, contractPath),
      "Generating contract ts types",
      "TS types Generated successfully"
    );

    const buildData = (await spinner.runCommand(async () => {
      return moveArtifacts(contractInfo.name);
    }, "Moving artifacts")) as BuildData;

    await spinner.runCommand(async () => {
      contractInfo.build = buildData;

      await writeJSON(path.resolve("swanky.config.json"), config, {
        spaces: 2,
      });
    }, "Writing config");
  }
}
