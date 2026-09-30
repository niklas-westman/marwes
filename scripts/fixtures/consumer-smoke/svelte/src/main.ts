import { mount } from "svelte"
import App from "./app.svelte"

const target = document.getElementById("app")
if (!target) throw new Error("Missing #app root")

mount(App, { target })
