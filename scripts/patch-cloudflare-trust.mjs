import fs from 'node:fs'

const filePath = 'C:\\Users\\veman.chippa\\AppData\\Roaming\\npm\\node_modules\\@deepseek-ai\\dsh\\node_modules\\@deepseek-ai\\dsh-client-connection\\lib\\index.js'

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8')
  const target = 'return new URL(origin).host === hostUrl.host;'
  const replacement = 'const oh = new URL(origin).host; return oh === hostUrl.host || oh.endsWith(".trycloudflare.com");'
  if (content.includes(target)) {
    content = content.replace(target, replacement)
    fs.writeFileSync(filePath, content, 'utf8')
    console.log('Patched runtime index.js successfully')
  } else if (content.includes(replacement)) {
    console.log('Already patched runtime index.js')
  } else {
    console.warn('Target string not found in index.js')
  }
} else {
  console.warn('File not found:', filePath)
}
