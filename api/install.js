{\rtf1\ansi\ansicpg1252\cocoartf2868
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 export const config = \{\
  maxDuration: 30,\
\};\
\
export default async function handler(req, res) \{\
  const host = process.env.RUSTDESK_HOST;\
  const key  = process.env.RUSTDESK_KEY;\
\
  if (!host || !key) \{\
    return res.status(500).send('Missing RUSTDESK_HOST or RUSTDESK_KEY env vars.');\
  \}\
\
  try \{\
    const apiRes = await fetch(\
      'https://api.github.com/repos/rustdesk/rustdesk/releases/latest',\
      \{ headers: \{ 'User-Agent': 'unified-solutions-rustdesk-installer' \} \}\
    );\
    const data = await apiRes.json();\
\
    const asset = data.assets.find(\
      a => a.name.includes('x86_64') && a.name.endsWith('.exe')\
    );\
    if (!asset) return res.status(404).send('Installer not found.');\
\
    const dlRes = await fetch(asset.browser_download_url);\
    const buffer = await dlRes.arrayBuffer();\
\
    const filename = `rustdesk-host=$\{host\},key=$\{key\}=.exe`;\
\
    res.setHeader('Content-Type', 'application/octet-stream');\
    res.setHeader('Content-Disposition', `attachment; filename="$\{filename\}"`);\
    res.setHeader('Cache-Control', 'no-cache');\
    res.send(Buffer.from(buffer));\
  \} catch (err) \{\
    res.status(500).send(`Error: $\{err.message\}`);\
  \}\
\}\
}