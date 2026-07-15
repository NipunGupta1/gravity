import {isCancel, text} from "@clack/prompts";
import chalk from "chalk";
import {defaultAgentConfig} from "./type";
import {ActionTracker} from "./actionTracker";

export async function runAgentMode(){
    console.log(chalk.blueBright("Running in Agent Mode..."));

    const goal = await text({
        message: "What would you like the agent to do?",
        placeholder: "Enter your goal here...",
    });

    if(isCancel(goal) || !goal.trim()){
        console.log(chalk.red("Operation cancelled."));
        return;
    }

    const config = defaultAgentConfig();
    const tracker  = new ActionTracker();
    const executer = new ToolExecuter(tracker,config);
}