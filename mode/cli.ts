import {select ,isCancel} from "@clack/prompts";
import chalk from "chalk";
import figlet from "figlet";
import {runAgentMode} from "./agent/orchestrator";

export async function runCliMode() {
    while(true){
        const mode = await select({
            message: "Select a wake-up mode",
            options: [
                {value: "agent", label: "Agent Mode"},
                {value: "plan",label: "Plan Mode"},
                {value: "ask",label: "Ask Mode"},
                {value: "back",label: "Back to main menu"}
            ]
        });

        if(isCancel(mode) || mode === "back"){
            console.log(chalk.red("\n Goodbye! \n"));
            return;
        }
        if(mode === "agent"){
            await runAgentMode();
        }
        if(mode === "plan"){
            console.log(chalk.green("You selected Plan Mode. Starting the plan mode..."));
        }
        if(mode === "ask"){
            console.log(chalk.green("You selected Ask Mode. Starting the ask mode..."));
        }
        if(mode !== "agent" && mode !== "plan" && mode !== "ask" && mode !== "back"){
            console.log(chalk.yellow("\n Invalid option. \n")); 
        }
}
}