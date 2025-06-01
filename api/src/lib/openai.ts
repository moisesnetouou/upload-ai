import 'dotenv/config'
import { createOpenAI } from "@ai-sdk/openai"

export const openai = createOpenAI({
  compatibility: 'strict'
})