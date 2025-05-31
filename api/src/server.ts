import { fastify } from "fastify"
import { getAllPromptsRoute } from "./routes/get-all-prompts"

const app = fastify()

app.register(getAllPromptsRoute)

app.listen({
  port: 3333,
  host: "0.0.0.0"
}).then(() => {
  console.log("HTTP Server running on http://localhost:3333")
})