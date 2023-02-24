import { Command } from "@oclif/core";
import chalk = require("chalk");
import { AccountData, ensureSwankyProject, getSwankyConfig } from "@arthswap/swanky-core";

export class CreateAccount extends Command {
  static description = "List dev accounts stored in config";
  static aliases = [`account:ls`];

  async run(): Promise<void> {
    await ensureSwankyProject();

    const config = await getSwankyConfig();
    this.log(`${chalk.greenBright("✔")} Stored dev accounts:`);

    config.accounts.forEach((account: AccountData) => {
      this.log(`\t${chalk.yellowBright("Alias: ")} ${account.alias}`);
    });
  }
}
