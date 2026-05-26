import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3'

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export const BUCKET_NAME = 'groopik-photos'
export const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL!

export const uploadToR2 = async (file: Buffer, filePath: string, contentType: string) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: filePath,
    Body: file,
    ContentType: contentType,
  })
  await r2Client.send(command)
  return `${R2_PUBLIC_URL}/${filePath}`
}

export const deleteFromR2 = async (filePath: string) => {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: filePath,
  })
  await r2Client.send(command)
}

export const putJson = async (key: string, data: any) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: JSON.stringify(data),
    ContentType: 'application/json',
  })
  await r2Client.send(command)
}

export const getJson = async (key: string): Promise<any | null> => {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
    const response = await r2Client.send(command)
    const body = await response.Body?.transformToString()
    return body ? JSON.parse(body) : null
  } catch (err: any) {
    if (err.name === 'NoSuchKey' || err.$metadata?.httpStatusCode === 404) {
      return null
    }
    throw err
  }
}

export const listObjects = async (prefix: string) => {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: prefix,
  })
  const response = await r2Client.send(command)
  return response.Contents || []
}