#!/usr/bin/env node
import { runCreateMarwesCli } from "@marwes-ui/cli"

const exitCode = await runCreateMarwesCli(process.argv.slice(2))
process.exitCode = exitCode
