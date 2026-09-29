// Usage: node templates/build-lab-pdf.js L06 "L6_Snap_Fit_Speaker_Case.pdf"
// Renders docs/Labs/<lab>/index.html with the site stylesheet into a PDF in the same folder.
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const [, , lab, outName] = process.argv;
if (!lab || !outName) {
  console.error('usage: node templates/build-lab-pdf.js <lab folder, e.g. L06> <output pdf name>');
  process.exit(1);
}

const labDir = path.resolve(__dirname, '..', 'docs', 'Labs', lab);
const cssPath = path.resolve(__dirname, '..', 'docs', 'assets', 'css', 'style.css');
let body = fs.readFileSync(path.join(labDir, 'index.html'), 'utf8').replace(/^---[\s\S]*?---\s*/, '');

const stillFrame = 'PrintVideoFrame.jpg';
body = body.replace(/<video[\s\S]*?<\/video>/g, fs.existsSync(path.join(labDir, stillFrame))
  ? `<img src="${stillFrame}" alt="Still frame from the print video">\n<p><em>Still frame from the print video. The full video is on the portfolio page.</em></p>`
  : '<p><em>Print video is on the portfolio page.</em></p>');

body = body.replace(/(<img [^>]*>)\s*(<p>[\s\S]*?<\/p>)/g, '<div class="fig">$1$2</div>');

const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<link rel="stylesheet" href="${cssPath}">
<style>
  .content { padding: 0; max-width: none; }
  .fig { break-inside: avoid; margin: 0.6rem 0; }
  .fig p { font-size: 0.82rem; margin: 0.3rem 0 0; }
  .fig img { display: block; width: auto; max-width: 100%; margin: 0; }
  .fig.portrait { display: inline-block; vertical-align: top; width: 31%; margin-right: 1.5%; }
  .fig.portrait img { max-height: 290px; }
  .fig.landscape img { max-height: 400px; }
  .fig.big img { max-height: 560px; }
  .fig.shot { display: flex; gap: 14px; align-items: flex-start; }
  .fig.shot img { flex: 0 0 auto; max-width: 380px; max-height: 700px; }
  .fig.shot p { flex: 1; margin-top: 0; }
  .content h2, .content h3 { break-after: avoid; }
  .content tr, .content li { break-inside: avoid; }
  .content .table-wrap { break-inside: avoid; }
  .content mark { background: #fff3a3; }
</style></head>
<body><main class="content">${body}</main></body></html>`;

const tmp = path.join(labDir, '.pdf-build.html');
fs.writeFileSync(tmp, html);

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage();
  await page.goto('file://' + tmp, { waitUntil: 'load' });
  await page.evaluate(() => {
    document.querySelectorAll('.fig').forEach((fig) => {
      const img = fig.querySelector('img');
      const file = img.getAttribute('src');
      if (/HandSketch|VideoFrame/.test(file)) fig.classList.add('big');
      else if (/^slicer(quality|wall|infill|speed|support|printdata)/.test(file)) fig.classList.add('shot');
      else if (/^(SpeakersOverview|SpeakerBack|Measure)/.test(file)) fig.classList.add('portrait');
      else fig.classList.add(img.naturalHeight > img.naturalWidth ? 'portrait' : 'landscape');
    });
  });
  await page.pdf({
    path: path.join(labDir, outName),
    format: 'Letter',
    printBackground: true,
    margin: { top: '0.7in', bottom: '0.7in', left: '0.75in', right: '0.75in' },
  });
  await browser.close();
  fs.unlinkSync(tmp);
  console.log('wrote', path.join(labDir, outName));
})();
