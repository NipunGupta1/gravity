import {select ,isCancel} from "@clack/prompts";
import chalk from "chalk";
import figlet from "figlet";

const BANNER_FONT = "ANSI Shadow";
const SHADOW = chalk.hex("#5b4d9e");
const FACE = chalk.hex("#f5f5f5").bold;

function printBannerWithShadow(ascii: string) {

  const bannerLines = ascii.replace(/\s+$/, '').split('\n');
  const maxLen = Math.max(...bannerLines.map((l) => l.length), 0);
  const rowWidth = maxLen + 2;

  for (const line of bannerLines) {
    console.log(SHADOW(('  ' + line).padEnd(rowWidth)));
  }
  process.stdout.write(`\x1b[${bannerLines.length}A`);
  for (const line of bannerLines) {
    console.log(FACE(line.padEnd(rowWidth)));
  }
  console.log();
}


export async function runWakeUp() {
    let ascii: string;
    try{
        ascii = figlet.textSync("GRAVITY", { font: BANNER_FONT });
    }catch(error){
        ascii = figlet.textSync("GRAVITY", { font: "Standard" });
    }
    
    printBannerWithShadow(ascii);

    const mode = await select({
        message: "Select a wake-up mode",
        options: [
            { value: "cli", label: "Command Line Interface (CLI)" },
            { value: "telegram", label: "Telegram Bot" }
        ]
    });

    if (isCancel(mode)) {
        process.exit(0);
    }

    if(mode === "cli"){
        console.log(chalk.green("You selected CLI mode. Starting the CLI..."));
    }else {
        console.log(chalk.green("You selected Telegram Bot mode. Starting the bot..."));
    }
}