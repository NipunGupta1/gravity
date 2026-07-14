#!/usr/bin/env bun

import {Command} from "commander";
import {runWakeUp} from "./tui/wakeup.ts";

const program = new Command();

program
    .name("GRAVITY")
    .description("A simple CLI tool")
    .version("1.0.0");

program
.command("wake-up")
    .description("Wake up the system")
    .action(async () => {
        await runWakeUp();
    });
await program.parseAsync(process.argv);