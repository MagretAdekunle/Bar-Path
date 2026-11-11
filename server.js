import express from 'express'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
const PORT = process.env.PORT || 3001
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'barpath-api' })
})

app.get('/api/teambuildr', async (_req, res) => {
  try {
    const data = await readFile(path.join(__dirname, 'public', 'data', 'teambuildr.json'), 'utf8')
    res.json(JSON.parse(data))
  } catch (error) {
    res.status(500).json({ error: 'Unable to read TeamBuildr data', details: error.message })
  }
})

app.get('/api/vesync', async (_req, res) => {
  try {
    const data = await readFile(path.join(__dirname, 'public', 'data', 'vesync.json'), 'utf8')
    res.json(JSON.parse(data))
  } catch (error) {
    res.status(500).json({ error: 'Unable to read VeSync data', details: error.message })
  }
})

app.get('/api/apple-health', async (_req, res) => {
  try {
    const data = await readFile(path.join(__dirname, 'public', 'data', 'apple-health.json'), 'utf8')
    res.json(JSON.parse(data))
  } catch (error) {
    res.status(500).json({ error: 'Unable to read Apple Health data', details: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`BarPath API running on http://localhost:${PORT}`)
})
