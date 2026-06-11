const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');
const PARTIALS = path.join(__dirname, 'partials');
const CONTENT = path.join(__dirname, 'content');
const CSS = path.join(__dirname, 'css');
const JS = path.join(__dirname, 'js');

// Read partials
const headerTemplate = fs.readFileSync(path.join(PARTIALS, 'header.html'), 'utf8');
const footerTemplate = fs.readFileSync(path.join(PARTIALS, 'footer.html'), 'utf8');

// Read page config
const pages = require('./data/pages.json');

// Clean dist
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true, force: true });
}

// Copy static assets
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(CSS, path.join(DIST, 'css'));
copyDir(JS, path.join(DIST, 'js'));

// Generate sitemap entries
let sitemapUrls = [];

// Build each page
for (const page of pages) {
  const pageDir = path.join(DIST, page.path);
  fs.mkdirSync(pageDir, { recursive: true });

  // Breadcrumb
  const isHome = page.path === '';
  const pathSegments = isHome ? [] : page.path.split('/').filter(Boolean);
  const breadcrumb = isHome ? '' : '<nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a>' + pathSegments.map(function(seg, i) {
    const url = '/' + pathSegments.slice(0, i + 1).join('/') + '/';
    const label = seg.replace(/-/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); })
      .replace(/\b(Of|And|The|For|Vs|To|By)\b/g, function(m) { return m.toLowerCase(); })
      .replace(/\bSt\b/g, 'St.');
    if (i === pathSegments.length - 1) {
      return ' <span aria-current="page"> &rsaquo; ' + label + '</span>';
    }
    return ' <a href="' + url + '"> &rsaquo; ' + label + '</a>';
  }).join('') + '</nav>';

  // Build header
  let header = headerTemplate
    .replace(/\{\{title\}\}/g, page.title)
    .replace(/\{\{description\}\}/g, page.description)
    .replace(/\{\{path\}\}/g, page.path ? page.path + '/' : '')
    .replace('{{schema}}', JSON.stringify(buildSchema(page)))
    .replace('{{breadcrumb}}', breadcrumb);

  // Read content
  const contentFile = page.contentFile || (isHome ? 'homepage.html' : page.path.replace(/\//g, '-').replace(/^-|-$/g, '') + '.html');
  let content = '';
  const contentPath = path.join(CONTENT, contentFile);
  if (fs.existsSync(contentPath)) {
    content = fs.readFileSync(contentPath, 'utf8');
  }

  // Build footer
  let footer = footerTemplate;
  const scripts = (page.scripts || []).map(function(s) {
    return '<script src="/js/' + s + '"></script>';
  }).join('\n');
  footer = footer.replace('{{scripts}}', scripts);

  // Combine
  const html = header + content + footer;
  fs.writeFileSync(path.join(pageDir, 'index.html'), html);

  // Sitemap entry (exclude 404 page)
  if (page.path === '404') { console.log('  Skipped sitemap: ' + page.path); continue; }
  const url = page.path ? 'https://sodcalc.com/' + page.path + '/' : 'https://sodcalc.com/';
  const priority = isHome ? '1.0' : getPriority(page.path);
  sitemapUrls.push('  <url>\n    <loc>' + url + '</loc>\n    <changefreq>monthly</changefreq>\n    <priority>' + priority + '</priority>\n  </url>');

  console.log('  Built: ' + (page.path || '/'));
}

// Generate sitemap.xml
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + sitemapUrls.join('\n') + '\n</urlset>';
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);

// Generate robots.txt
const robots = 'User-agent: *\nAllow: /\n\nSitemap: https://sodcalc.com/sitemap.xml';
fs.writeFileSync(path.join(DIST, 'robots.txt'), robots);

// Generate 404 page
const notFoundDir = path.join(DIST, '404');
fs.mkdirSync(notFoundDir, { recursive: true });
const notFoundHtml = headerTemplate
  .replace(/\{\{title\}\}/g, 'Page Not Found - SodCalc')
  .replace(/\{\{description\}\}/g, 'Page not found')
  .replace(/\{\{path\}\}/g, '404/')
  .replace('{{schema}}', JSON.stringify(buildSchema({schemaType: 'WebSite'})))
  .replace('{{breadcrumb}}', '')
  + fs.readFileSync(path.join(CONTENT, '404.html'), 'utf8')
  + footerTemplate.replace('{{scripts}}', '');
fs.writeFileSync(path.join(notFoundDir, 'index.html'), notFoundHtml);
fs.writeFileSync(path.join(DIST, '404.html'), notFoundHtml);

console.log('\nBuild complete! ' + pages.length + ' pages generated.');
console.log('Output: ' + DIST);

function getPriority(path) {
  // High priority (0.9): calculators, grass type pages, decision tools
  var high = ['sod-calculator', 'grass-seed-calculator', 'topsoil-calculator', 'mulch-calculator',
    'sod-vs-seed', 'grass-types', 'grass-by-sunlight'];
  for (var i = 0; i < high.length; i++) {
    if (path === high[i] || path.startsWith(high[i] + '/')) return '0.9';
  }
  // Medium priority (0.8): execution guides, decision pages, care pages
  var medium = ['warm-vs-cool-season-grass', 'climate-zones', 'grass-types/',
    'how-to-lay-sod', 'how-to-plant-grass-seed', 'how-to-prepare-soil-for-sod',
    'when-to-lay-sod', 'new-sod-care', 'common-sod-mistakes'];
  for (var j = 0; j < medium.length; j++) {
    if (path === medium[j] || path.startsWith(medium[j] + '/') || (medium[j].endsWith('/') && path.startsWith(medium[j]))) return '0.8';
  }
  return '0.7';
}

function buildSchema(page) {
  if (page.schemaType === 'FAQPage' && page.faq) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': page.faq.map(function(q) {
        return { '@type': 'Question', 'name': q.q, 'acceptedAnswer': { '@type': 'Answer', 'text': q.a } };
      })
    };
  }
  if (page.schemaType === 'HowTo' && page.steps) {
    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      'name': page.title,
      'step': page.steps.map(function(s, i) {
        return { '@type': 'HowToStep', 'position': i + 1, 'text': s };
      })
    };
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'SodCalc',
    'url': 'https://sodcalc.com'
  };
}