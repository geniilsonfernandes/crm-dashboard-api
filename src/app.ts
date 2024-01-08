import express from 'express'
import { port } from './config/env-validation'

const app = express()

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})
