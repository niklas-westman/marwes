#!/usr/bin/env node
import { runMarwesCli } from "./index"

const exitCode = await runMarwesCli(process.argv.slice(2))
process.exitCode = exitCode
