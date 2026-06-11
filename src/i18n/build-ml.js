const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PARTIALS = path.join(ROOT, 'partials');
const CONTENT = path.join(ROOT, 'content');
const CSS = path.join(ROOT, 'css');
const JS = path.join(ROOT, 'js');
const I18N = path.join(ROOT, 'i18n');

const langs = require('./langs.json');

// Determine build mode
const args = process.argv.slice(2);
const buildAll = args.includes('--all');
const langArg = args.find(a => a.startsWith('--lang='));
const targetLang = langArg ? langArg.split('=')[1] : null;

const buildLangs = buildAll
  ? langs
  : targetLang
    ? langs.filter(l => l.code === targetLang)
    : [langs[0]]; // English only by default

// Clean dist
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true, force: true });
}

// Copy static assets (shared across languages)
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

// Breadcrumb i18n: "Home" label + path segment translations for each language
var breadcrumbI18n = {
  en: { home: 'Home' },
  'zh-CN': { home: '首页',
    'sod-calculator': '草皮计算器','seed-calculator': '草籽计算器','topsoil-calculator': '表土计算器','mulch-calculator': '覆盖物计算器',
    'sod-vs-seed': '草皮 vs 草籽','climate-zones': '气候区域','warm-vs-cool-season-grass': '暖季草 vs 冷季草',
    'grass-types': '草种类型','grass-by-sunlight': '按光照选草',
    'how-to-lay-sod': '铺设草皮指南','how-to-plant-grass-seed': '播种草籽指南','how-to-prepare-soil-for-sod': '草皮土壤准备','when-to-lay-sod': '草皮铺设时机','new-sod-care': '新草皮养护','how-to-get-rid-of-lawn': '清除草坪指南',
    'common-sod-mistakes': '常见草皮错误','privacy-policy': '隐私政策','terms-of-use': '使用条款'
  },
  es: { home: 'Inicio',
    'sod-calculator': 'Calculadora de Césped','seed-calculator': 'Calculadora de Semillas','topsoil-calculator': 'Calculadora de Tierra','mulch-calculator': 'Calculadora de Mantillo',
    'sod-vs-seed': 'Césped vs Semilla','climate-zones': 'Zonas Climáticas','warm-vs-cool-season-grass': 'Césped de Estación Cálida vs Fría',
    'grass-types': 'Tipos de Césped','grass-by-sunlight': 'Césped por Luz Solar',
    'how-to-lay-sod': 'Cómo Colocar Césped','how-to-plant-grass-seed': 'Cómo Sembrar Césped','how-to-prepare-soil-for-sod': 'Cómo Preparar el Suelo','when-to-lay-sod': 'Cuándo Colocar Césped','new-sod-care': 'Cuidado del Césped Nuevo','how-to-get-rid-of-lawn': 'Cómo Eliminar el Césped',
    'common-sod-mistakes': 'Errores Comunes','privacy-policy': 'Política de Privacidad','terms-of-use': 'Términos de Uso'
  },
  hi: { home: 'होम',
    'sod-calculator': 'सॉड कैलकुलेटर','seed-calculator': 'बीज कैलकुलेटर','topsoil-calculator': 'मिट्टी कैलकुलेटर','mulch-calculator': 'मल्च कैलकुलेटर',
    'sod-vs-seed': 'सॉड बनाम बीज','climate-zones': 'जलवायु क्षेत्र','warm-vs-cool-season-grass': 'गर्म मौसम बनाम ठंडे मौसम की घास',
    'grass-types': 'घास के प्रकार','grass-by-sunlight': 'धूप के अनुसार घास',
    'how-to-lay-sod': 'सॉड कैसे बिछाएं','how-to-plant-grass-seed': 'घास के बीज कैसे लगाएं','how-to-prepare-soil-for-sod': 'सॉड के लिए मिट्टी की तैयारी','when-to-lay-sod': 'सॉड कब बिछाएं','new-sod-care': 'नई सॉड की देखभाल','how-to-get-rid-of-lawn': 'लॉन कैसे हटाएं',
    'common-sod-mistakes': 'सामान्य गलतियां','privacy-policy': 'गोपनीयता नीति','terms-of-use': 'उपयोग की शर्तें'
  },
  ar: { home: 'الرئيسية',
    'sod-calculator': 'حاسبة العشب','seed-calculator': 'حاسبة البذور','topsoil-calculator': 'حاسبة التربة','mulch-calculator': 'حاسبة المهاد',
    'sod-vs-seed': 'العشب مقابل البذور','climate-zones': 'المناطق المناخية','warm-vs-cool-season-grass': 'عشب الموسم الدافئ مقابل البارد',
    'grass-types': 'أنواع العشب','grass-by-sunlight': 'العشب حسب ضوء الشمس',
    'how-to-lay-sod': 'كيفية تركيب العشب','how-to-plant-grass-seed': 'كيفية زراعة بذور العشب','how-to-prepare-soil-for-sod': 'تحضير التربة للعشب','when-to-lay-sod': 'متى يتم تركيب العشب','new-sod-care': 'العناية بالعشب الجديد','how-to-get-rid-of-lawn': 'كيفية إزالة العشب',
    'common-sod-mistakes': 'أخطاء شائعة','privacy-policy': 'سياسة الخصوصية','terms-of-use': 'شروط الاستخدام'
  },
  pt: { home: 'Início',
    'sod-calculator': 'Calculadora de Grama','seed-calculator': 'Calculadora de Sementes','topsoil-calculator': 'Calculadora de Solo','mulch-calculator': 'Calculadora de Cobertura',
    'sod-vs-seed': 'Grama vs Semente','climate-zones': 'Zonas Climáticas','warm-vs-cool-season-grass': 'Grama de Estação Quente vs Fria',
    'grass-types': 'Tipos de Grama','grass-by-sunlight': 'Grama por Luz Solar',
    'how-to-lay-sod': 'Como Instalar Grama','how-to-plant-grass-seed': 'Como Plantar Sementes','how-to-prepare-soil-for-sod': 'Preparo do Solo','when-to-lay-sod': 'Quando Instalar Grama','new-sod-care': 'Cuidados com Grama Nova','how-to-get-rid-of-lawn': 'Como Remover Gramado',
    'common-sod-mistakes': 'Erros Comuns','privacy-policy': 'Política de Privacidade','terms-of-use': 'Termos de Uso'
  },
  fr: { home: 'Accueil',
    'sod-calculator': 'Calculateur de Gazon','seed-calculator': 'Calculateur de Semences','topsoil-calculator': 'Calculateur de Terre','mulch-calculator': 'Calculateur de Paillis',
    'sod-vs-seed': 'Gazon vs Semence','climate-zones': 'Zones Climatiques','warm-vs-cool-season-grass': 'Gazon de Saison Chaude vs Froide',
    'grass-types': 'Types de Gazon','grass-by-sunlight': 'Gazon par Ensoleillement',
    'how-to-lay-sod': 'Comment Poser du Gazon','how-to-plant-grass-seed': 'Comment Semer du Gazon','how-to-prepare-soil-for-sod': 'Préparation du Sol','when-to-lay-sod': 'Quand Poser du Gazon','new-sod-care': 'Entretien du Nouveau Gazon','how-to-get-rid-of-lawn': 'Comment Enlever une Pelouse',
    'common-sod-mistakes': 'Erreurs Courantes','privacy-policy': 'Politique de Confidentialité','terms-of-use': 'Conditions d\'Utilisation'
  },
  ja: { home: 'ホーム',
    'sod-calculator': '芝生計算機','seed-calculator': '種子計算機','topsoil-calculator': '表土計算機','mulch-calculator': 'マルチ計算機',
    'sod-vs-seed': '芝生 vs 種子','climate-zones': '気候区分','warm-vs-cool-season-grass': '暖地型芝 vs 寒地型芝',
    'grass-types': '芝生の種類','grass-by-sunlight': '日照別の芝生',
    'how-to-lay-sod': '芝生の敷き方','how-to-plant-grass-seed': '種のまき方','how-to-prepare-soil-for-sod': '芝生用の土壌準備','when-to-lay-sod': '芝生を敷く時期','new-sod-care': '新しい芝生の手入れ','how-to-get-rid-of-lawn': '芝生の除去方法',
    'common-sod-mistakes': 'よくある失敗','privacy-policy': 'プライバシーポリシー','terms-of-use': '利用規約'
  }
};

// 404 page i18n: title and description for each language
var notFoundI18n = {
  en: { title: 'Page Not Found - SodCalc', desc: 'Page not found' },
  'zh-CN': { title: '页面未找到 - SodCalc', desc: '页面未找到' },
  es: { title: 'Página No Encontrada - SodCalc', desc: 'Página no encontrada' },
  hi: { title: 'पृष्ठ नहीं मिला - SodCalc', desc: 'पृष्ठ नहीं मिला' },
  ar: { title: 'الصفحة غير موجودة - SodCalc', desc: 'الصفحة غير موجودة' },
  pt: { title: 'Página Não Encontrada - SodCalc', desc: 'Página não encontrada' },
  fr: { title: 'Page Introuvable - SodCalc', desc: 'Page introuvable' },
  ja: { title: 'ページが見つかりません - SodCalc', desc: 'ページが見つかりません' }
};

// Read English source files (templates)
const enHeader = fs.readFileSync(path.join(PARTIALS, 'header.html'), 'utf8');
const enFooter = fs.readFileSync(path.join(PARTIALS, 'footer.html'), 'utf8');

// Read English pages config (used as base, overridden by language-specific)
const enPages = require('../data/pages.json');

// Generate sitemap entries for all languages
let sitemapUrls = [];
// Get current date in ISO format (YYYY-MM-DD) for lastmod
const today = new Date().toISOString().split('T')[0];

// Build each language
for (const lang of buildLangs) {
  const isEnglish = lang.code === 'en';
  const langDist = isEnglish ? DIST : path.join(DIST, lang.code);

  // Language-specific base path prefix
  const pathPrefix = isEnglish ? '' : '/' + lang.code;

  // Read language-specific partials or fall back to English
  let headerTemplate, footerTemplate;
  const langPartials = path.join(I18N, lang.code, 'src', 'partials');
  if (!isEnglish && fs.existsSync(path.join(langPartials, 'header.html'))) {
    headerTemplate = fs.readFileSync(path.join(langPartials, 'header.html'), 'utf8');
    var langFooterPath = path.join(langPartials, 'footer.html');
    footerTemplate = fs.existsSync(langFooterPath)
      ? fs.readFileSync(langFooterPath, 'utf8')
      : enFooter;
  } else {
    headerTemplate = enHeader;
    footerTemplate = enFooter;
  }

  // Read language-specific pages or fall back to English
  let pages;
  const langPagesPath = path.join(I18N, lang.code, 'src', 'data', 'pages.json');
  if (!isEnglish && fs.existsSync(langPagesPath)) {
    pages = JSON.parse(fs.readFileSync(langPagesPath, 'utf8'));
  } else {
    pages = enPages;
  }

  // Language-specific content directory
  const langContent = !isEnglish
    ? path.join(I18N, lang.code, 'src', 'content')
    : CONTENT;

  // Copy CSS/JS to language subdirectory if not English
  if (!isEnglish) {
    copyDir(CSS, path.join(langDist, 'css'));
    copyDir(JS, path.join(langDist, 'js'));
  }

  console.log('\n--- Building ' + lang.name + ' (' + lang.code + ') ---');

  // Build each page
  for (const page of pages) {
    const pageDir = path.join(langDist, page.path);
    fs.mkdirSync(pageDir, { recursive: true });

    // Breadcrumb
    const isHome = page.path === '' || page.path === '/';
    const pathSegments = isHome ? [] : page.path.split('/').filter(Boolean);
    const bcLabels = breadcrumbI18n[lang.htmlLang] || breadcrumbI18n.en;
    const homeLabel = bcLabels.home || 'Home';
    const breadcrumb = isHome ? '' : '<nav class="breadcrumb" aria-label="Breadcrumb"><a href="' + pathPrefix + '/">' + homeLabel + '</a>' + pathSegments.map(function(seg, i) {
      const url = pathPrefix + '/' + pathSegments.slice(0, i + 1).join('/') + '/';
      var label = bcLabels[seg];
      if (!label) {
        // Fallback: English title case for untranslated segments (e.g. grass type proper nouns)
        label = seg.replace(/-/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); })
          .replace(/\b(Of|And|The|For|Vs|To|By)\b/g, function(m) { return m.toLowerCase(); })
          .replace(/\bSt\b/g, 'St.');
      }
      if (i === pathSegments.length - 1) {
        return ' <span aria-current="page"> &rsaquo; ' + label + '</span>';
      }
      return ' <a href="' + url + '"> &rsaquo; ' + label + '</a>';
    }).join('') + '</nav>';

    // Build header
    const basePath = (isHome || !page.path) ? '' : page.path + '/';
    let header = headerTemplate
      .replace(/\{\{title\}\}/g, page.title)
      .replace(/\{\{description\}\}/g, page.description)
      .replace(/\{\{path\}\}/g, isEnglish ? basePath : lang.code + '/' + basePath)
      .replace(/\{\{basePath\}\}/g, basePath)
      .replace(/\{\{lang\}\}/g, lang.htmlLang)
      .replace(/\{\{dir\}\}/g, lang.dir)
      .replace(/\{\{langPathPrefix\}\}/g, pathPrefix)
      .replace('{{schema}}', JSON.stringify(buildSchema(page, lang)))
      .replace('{{breadcrumb}}', breadcrumb);

    // Read content
    const contentFile = page.contentFile || (isHome ? 'homepage.html' : page.path.replace(/\//g, '-').replace(/^-|-$/g, '') + '.html');
    let content = '';
    const contentPath = path.join(langContent, contentFile);
    if (fs.existsSync(contentPath)) {
      content = fs.readFileSync(contentPath, 'utf8');
      // For non-English: rewrite internal links to include language prefix
      if (!isEnglish && pathPrefix) {
        content = content.replace(/href="\/([a-z0-9])/g, 'href="' + pathPrefix + '/$1');
        content = content.replace(/href='\/([a-z0-9])/g, "href='" + pathPrefix + "/$1");
        // Handle root links: href="/" → href="/zh/"
        content = content.replace(/href="\/"/g, 'href="' + pathPrefix + '/"');
        content = content.replace(/href='\/'/g, "href='" + pathPrefix + "/'");
      }
    } else {
      console.warn('  WARNING: Content file not found: ' + contentPath);
    }

    // Build footer
    let footer = footerTemplate;
    const scripts = (page.scripts || []).map(function(s) {
      return '<script src="' + pathPrefix + '/js/' + s + '"></script>';
    }).join('\n');
    footer = footer.replace('{{scripts}}', scripts)
      .replace(/\{\{langPathPrefix\}\}/g, pathPrefix);

    // Combine
    const html = header + content + footer;
    fs.writeFileSync(path.join(pageDir, 'index.html'), html);

    // Sitemap entry (exclude 404 page)
    if (page.path === '404') { console.log('  Skipped sitemap: ' + page.path); continue; }
    const url = isHome ? 'https://sodcalc.com/' + (isEnglish ? '' : lang.code + '/') : 'https://sodcalc.com/' + (isEnglish ? '' : lang.code + '/') + page.path + '/';
    const priority = isHome && isEnglish ? '1.0' : getPriority(page.path);
    sitemapUrls.push('  <url>\n    <loc>' + url + '</loc>\n    <lastmod>' + today + '</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>' + priority + '</priority>\n  </url>');

    console.log('  Built: ' + (isHome ? '/' : page.path));
  }

  // Generate 404 page for this language
  const notFoundDir = path.join(langDist, '404');
  fs.mkdirSync(notFoundDir, { recursive: true });
  const nfLabels = notFoundI18n[lang.htmlLang] || notFoundI18n.en;
  const notFoundHtml = headerTemplate
    .replace(/\{\{title\}\}/g, nfLabels.title)
    .replace(/\{\{description\}\}/g, nfLabels.desc)
    .replace(/\{\{path\}\}/g, isEnglish ? '404/' : lang.code + '/404/')
    .replace(/\{\{lang\}\}/g, lang.htmlLang)
    .replace(/\{\{dir\}\}/g, lang.dir)
    .replace(/\{\{langPathPrefix\}\}/g, pathPrefix)
    .replace(/\{\{basePath\}\}/g, '404/')
    .replace('{{schema}}', JSON.stringify(buildSchema({schemaType: 'WebSite'}, lang)))
    .replace('{{breadcrumb}}', '')
    + (fs.existsSync(path.join(langContent, '404.html')) ? fs.readFileSync(path.join(langContent, '404.html'), 'utf8') : fs.readFileSync(path.join(CONTENT, '404.html'), 'utf8'))
    + footerTemplate.replace('{{scripts}}', '').replace(/\{\{langPathPrefix\}\}/g, pathPrefix);
  fs.writeFileSync(path.join(notFoundDir, 'index.html'), notFoundHtml);
  if (isEnglish) {
    fs.writeFileSync(path.join(DIST, '404.html'), notFoundHtml);
  }

  // Generate language-specific robots.txt
  const robots = 'User-agent: *\nAllow: /\n\nSitemap: https://sodcalc.com/' + (isEnglish ? '' : lang.code + '/') + 'sitemap.xml';
  fs.writeFileSync(path.join(langDist, 'robots.txt'), robots);

  console.log('  Language complete: ' + lang.code);
}

// Generate combined sitemap
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + sitemapUrls.join('\n') + '\n</urlset>';
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);

console.log('\nBuild complete! ' + sitemapUrls.length + ' URLs in sitemap.');
console.log('Output: ' + DIST);

function getPriority(path) {
  var high = ['sod-calculator', 'grass-seed-calculator', 'topsoil-calculator', 'mulch-calculator',
    'sod-vs-seed', 'grass-types', 'grass-by-sunlight'];
  for (var i = 0; i < high.length; i++) {
    if (path === high[i] || path.startsWith(high[i] + '/')) return '0.9';
  }
  var medium = ['warm-vs-cool-season-grass', 'climate-zones', 'grass-types/',
    'how-to-lay-sod', 'how-to-plant-grass-seed', 'how-to-prepare-soil-for-sod',
    'when-to-lay-sod', 'new-sod-care', 'common-sod-mistakes'];
  for (var j = 0; j < medium.length; j++) {
    if (path === medium[j] || path.startsWith(medium[j] + '/') || (medium[j].endsWith('/') && path.startsWith(medium[j]))) return '0.8';
  }
  return '0.7';
}

function buildSchema(page, lang) {
  const siteName = lang.code === 'en' ? 'SodCalc' : 'SodCalc';
  var schema;
  if (page.schemaType === 'FAQPage' && page.faq) {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': page.faq.map(function(q) {
        return { '@type': 'Question', 'name': q.q, 'acceptedAnswer': { '@type': 'Answer', 'text': q.a } };
      })
    };
  } else if (page.schemaType === 'HowTo' && page.steps) {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      'name': page.title,
      'step': page.steps.map(function(s, i) {
        return { '@type': 'HowToStep', 'position': i + 1, 'text': s };
      })
    };
  } else {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': siteName,
      'url': 'https://sodcalc.com'
    };
  }
  // Add BreadcrumbList
  var bcSchema = buildBreadcrumbSchema(page.path, lang);
  if (bcSchema) {
    return [schema, bcSchema];
  }
  return schema;
}

function buildBreadcrumbSchema(pagePath, lang) {
  if (!pagePath || pagePath === '/' || pagePath === '' || pagePath === '404') return null;
  var segments = pagePath.split('/').filter(Boolean);
  if (segments.length === 0) return null;
  var bcLabels = breadcrumbI18n[lang.htmlLang] || breadcrumbI18n.en;
  var homeLabel = bcLabels.home || 'Home';
  var pathPrefix = lang.code === 'en' ? '' : '/' + lang.code;
  var items = [];
  // Home
  items.push({
    '@type': 'ListItem',
    'position': 1,
    'name': homeLabel,
    'item': 'https://sodcalc.com' + pathPrefix + '/'
  });
  // Each segment
  for (var i = 0; i < segments.length; i++) {
    var label = bcLabels[segments[i]];
    if (!label) {
      label = segments[i].replace(/-/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); })
        .replace(/\b(Of|And|The|For|Vs|To|By)\b/g, function(m) { return m.toLowerCase(); })
        .replace(/\bSt\b/g, 'St.');
    }
    var segUrl = 'https://sodcalc.com' + pathPrefix + '/' + segments.slice(0, i + 1).join('/') + '/';
    items.push({
      '@type': 'ListItem',
      'position': i + 2,
      'name': label,
      'item': segUrl
    });
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items
  };
}