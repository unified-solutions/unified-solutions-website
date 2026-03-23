export const config = {
  maxDuration: 30,
};

export default async function handler(req, res) {
  const host = process.env.RUSTDESK_HOST;
  const key  = process.env.RUSTDESK_KEY;

  if (!host || !key) {
    return res.status(500).send('Missing RUSTDESK_HOST or RUSTDESK_KEY env vars.');
  }

  try {
    const apiRes = await fetch(
      'https://api.github.com/repos/rustdesk/rustdesk/releases/latest',
      { headers: { 'User-Agent': 'unified-solutions-rustdesk-installer' } }
    );
    const data = await apiRes.json();

    const asset = data.assets.find(
      a => a.name.includes('x86_64') && a.name.endsWith('.exe')
    );
    if (!asset) return res.status(404).send('Installer not found.');

    const dlRes = await fetch(asset.browser_download_url);
    const buffer = await dlRes.arrayBuffer();

    const filename = `rustdesk-host=${host},key=${key}=.exe`;

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-cache');
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
}
