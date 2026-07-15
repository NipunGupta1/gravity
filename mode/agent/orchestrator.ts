import {isCancel, text} from "@clack/prompts";
import chalk from "chalk";
import {defaultAgentConfig} from "./type";
import {ActionTracker} from "./actionTracker";
import {ToolExecuter} from "./toolExecuter";
import {createAgentTools} from "./agentTools";
import { stepCountIs, ToolLoopAgent } from "ai";
import { getAgentModel } from "../../ai/ai.config";
import { renderterminalMarkdown } from "../../tui/termialMd";
import { executionAsyncResource } from "node:async_hooks";
import { runApprovalFlow } from "./approval";

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
    const tools  = createAgentTools(executer);

    const agent = new ToolLoopAgent({
        model: getAgentModel(),
        stopWhen: stepCountIs(40),
        instructions: [
            `Workspace root: ${config.codebasePath}`,
            'All mutations are staged until approval',
        ].join('\n'),
        tools,
    })

    const result = await agent.generate({
        prompt: goal.trim(),
        onStepFinish:({toolCalls})=> {
            for(const call of toolCalls){
                const preview = JSON.stringify(call.input).slice(0,100);
                console.log(
                    chalk.green(' Tool Call: '),
                    chalk.bold(chalk.yellow(call.toolName)),
                    chalk.dim(`(${preview}${preview.length === 100 ? '...' : ''})`)
                )
            }
        }
    })

    if(result.text?.trim()){
        console.log(renderterminalMarkdown(result.text));
    }

    const ok = await runApprovalFlow(tracker);
    if(!ok) return executer.clearStaging();

    const {errors} = executer.applyApprovedFromTracker();

    if(errors.length){
        console.log(chalk.red("Errors occurred during execution:\n"));
        for(const err of errors){
            console.log(chalk.red(`- ${err}`));
        }
    }else{
        console.log(chalk.green("All approved actions executed successfully."));
    }
    executer.clearStaging();
}