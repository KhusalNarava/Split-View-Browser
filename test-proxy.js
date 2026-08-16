const express = require('express');
const app = express();
app.get('/api/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  const urlObj = new URL(targetUrl);
  const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
  });
  let text = await response.text();
  const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
  const injectedScript = `
    <base href="${baseUrl}/">
    <script>
      try {
        window.history.replaceState(null, '', '${urlObj.pathname}${urlObj.search}');
      } catch (e) {
        console.error(e);
      }
    </script>
  `;
  text = text.replace('<head>', '<head>' + injectedScript);
  res.send(text);
});
app.listen(3001, () => console.log('listening'));
