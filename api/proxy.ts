export default async function handler(req, res) {
  const targetUrl = req.query.url;
  if (!targetUrl || typeof targetUrl !== 'string') {
    return res.status(400).send("Missing url parameter");
  }

  try {
    const urlObj = new URL(targetUrl);
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return res.status(400).send("Invalid protocol");
    }
    
    const hostname = urlObj.hostname.toLowerCase();
    const isLocalOrPrivate = 
      hostname === 'localhost' || 
      hostname.endsWith('.localhost') || 
      hostname === '127.0.0.1' || 
      hostname === '[::1]' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('169.254.') ||
      hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./);
      
    if (isLocalOrPrivate) {
      return res.status(403).send("Access to local or private networks is blocked.");
    }

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };
    
    ['accept', 'accept-language', 'content-type', 'authorization'].forEach(h => {
       if (req.headers[h]) headers[h] = req.headers[h];
    });

    let bodyData;
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
       if (typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
          bodyData = JSON.stringify(req.body);
       } else {
          bodyData = req.body;
       }
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: bodyData
    });

    const contentType = response.headers.get('content-type') || 'text/html';
    
    // Pass along the content type
    res.setHeader('Content-Type', contentType);

    // If it's not HTML, just stream it back
    if (!contentType.includes('text/html')) {
      response.headers.forEach((value, key) => {
        if (!['x-frame-options', 'content-security-policy', 'content-encoding', 'transfer-encoding'].includes(key.toLowerCase())) {
          res.setHeader(key, value);
        }
      });
      const arrayBuffer = await response.arrayBuffer();
      return res.send(Buffer.from(arrayBuffer));
    }

    // For HTML, inject base tag and interceptors
    let text = await response.text();
    const baseUrl = `${urlObj.protocol}//${urlObj.host}`;

    const injectedScript = `
      <base href="${baseUrl}/">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
      <script>
        (function() {
          try { window.history.replaceState(null, '', '${urlObj.pathname}${urlObj.search}'); } catch (e) {}

          const proxyUrl = '/api/proxy?url=';
          const targetOrigin = '${urlObj.origin}';
          
          function rewrite(url) {
             if (!url) return url;
             try {
                if (url.startsWith('blob:') || url.startsWith('data:')) return url;
                let finalUrl = url;
                if (url.startsWith('//')) finalUrl = '${urlObj.protocol}' + url;
                else if (url.startsWith('/')) finalUrl = targetOrigin + url;
                else if (!url.startsWith('http')) finalUrl = targetOrigin + window.location.pathname.replace(/\\/[^\\/]*$/, '/') + url;

                return proxyUrl + encodeURIComponent(finalUrl);
             } catch(e) { return url; }
          }

          const origFetch = window.fetch;
          window.fetch = async function(input, init) {
             try {
               if (typeof input === 'string') {
                 input = rewrite(input);
               } else if (input instanceof Request) {
                 const newUrl = rewrite(input.url);
                 input = new Request(newUrl, input);
               }
             } catch(e) {}
             return origFetch(input, init);
          };

          const origOpen = XMLHttpRequest.prototype.open;
          XMLHttpRequest.prototype.open = function(method, url, ...rest) {
             try {
               url = rewrite(url);
             } catch(e) {}
             return origOpen.call(this, method, url, ...rest);
          };
          
          window.addEventListener('message', async (e) => {
            if (!e.data) return;
            if (e.data.type === 'FIND') window.find(e.data.query, false, e.data.backwards, true, false, false, false);
            if (e.data.type === 'SCREENSHOT') {
              try {
                if (window.html2canvas) {
                  const canvas = await window.html2canvas(document.body, { useCORS: true, allowTaint: true });
                  e.source.postMessage({ type: 'SCREENSHOT_RESULT', dataUrl: canvas.toDataURL("image/png") }, '*');
                }
              } catch (err) {}
            }
          });
        })();
      </script>
    `;

    if (text.includes('<head>')) text = text.replace('<head>', '<head>' + injectedScript);
    else if (text.includes('<HEAD>')) text = text.replace('<HEAD>', '<HEAD>' + injectedScript);
    else text = '<head>' + injectedScript + '</head>' + text;

    res.send(text);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).send(`Failed to load ${targetUrl}`);
  }
}
