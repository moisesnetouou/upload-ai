import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { fastifyMultipart } from "@fastify/multipart"
import path from "node:path";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { prisma } from "../lib/prisma";

const pump = promisify(pipeline)

const ONE_MEGA = 1_048_576

export async function uploadVideoRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: ONE_MEGA * 25
    }
  })
  
  app.post("/videos", async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await request.file()

    if(!data) {
      return reply.status(400).send({ error: "Missing file input." })
    }

    const extension = path.extname(data.filename)

    if(extension !== ".mp3") {
      return reply.status(400).send({ error: "Invalid input type, please upload a MP3." })
    }

    const fileBaseName = path.basename(data.filename, extension)

    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`

    const uploadDestination = path.resolve(__dirname, "../../tmp", fileUploadName)

    await pump(data.file, fs.createWriteStream(uploadDestination))

    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: uploadDestination
      }
    })

    return {
      video
    }
  })
}