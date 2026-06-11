/* Grass Seed Calculator Logic */
(function() {
  'use strict';

  function getStrings(lang, unit) {
    var isMetric = unit === 'metric';
    var t = {
      en: {
        total: '# lbs',
        bags: '# bags (5 lb each)',
        rate: '# lbs / 1,000 sq ft',
        area: isMetric ? '# sq m' : '# sq ft'
      },
      'zh-CN': {
        total: '#磅',
        bags: '#袋（每袋5磅）',
        rate: '#磅 / 1,000平方英尺',
        area: isMetric ? '#平方米' : '#平方英尺'
      },
      es: {
        total: '# lb',
        bags: '# bolsas (5 lb c/u)',
        rate: '# lb / 1.000 pies²',
        area: isMetric ? '# m²' : '# pies²'
      },
      hi: {
        total: '# पौंड',
        bags: '# बैग (5 पौंड प्रति)',
        rate: '# पौंड / 1,000 वर्ग फुट',
        area: isMetric ? '# वर्ग मी' : '# वर्ग फुट'
      },
      ar: {
        total: '# رطل',
        bags: '# كيس (5 رطل لكل)',
        rate: '# رطل / 1,000 قدم²',
        area: isMetric ? '# م²' : '# قدم²'
      },
      pt: {
        total: '# lb',
        bags: '# sacos (5 lb cada)',
        rate: '# lb / 1.000 pés²',
        area: isMetric ? '# m²' : '# pés²'
      },
      fr: {
        total: '# lb',
        bags: '# sacs (5 lb chacun)',
        rate: '# lb / 1 000 pi²',
        area: isMetric ? '# m²' : '# pi²'
      },
      ja: {
        total: '#ポンド',
        bags: '#袋（1袋5ポンド）',
        rate: '#ポンド / 1,000平方フィート',
        area: isMetric ? '#平方メートル' : '#平方フィート'
      }
    };
    return t[lang] || t.en;
  }

  var seedRates = {
    'Bahia': { new: 10, overseed: 5 },
    'Bermuda': { new: 2, overseed: 1 },
    'Centipede': { new: 0.5, overseed: 0.3 },
    'Fine Fescue': { new: 5, overseed: 2.5 },
    'Kentucky Bluegrass': { new: 4, overseed: 2 },
    'Perennial Ryegrass': { new: 10, overseed: 5 },
    'Tall Fescue': { new: 10, overseed: 5 },
    'Zoysia': { new: 2, overseed: 1 },
    'Sun & Shade Mix': { new: 6, overseed: 3 }
  };

  var form = document.getElementById('seed-form');
  if (!form) return;
  var results = document.getElementById('seed-results');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    calculate();
  });

  form.querySelectorAll('input, select').forEach(function(el) {
    el.addEventListener('input', calculate);
  });

  function calculate() {
    var area = parseFloat(document.getElementById('seed-area').value);
    var grassType = document.getElementById('seed-type').value;
    var purpose = document.getElementById('seed-purpose').value;

    if (!area || area <= 0 || !grassType || !seedRates[grassType]) {
      results.classList.remove('visible');
      return;
    }

    var unitSystem = document.getElementById('seed-unit').value;
    var isMetric = unitSystem === 'metric';
    var lang = document.documentElement.lang || 'en';
    var areaSqFt = isMetric ? area * 10.764 : area;

    var rate = purpose === 'overseed' ? seedRates[grassType].overseed : seedRates[grassType].new;
    var totalLbs = (areaSqFt / 1000) * rate;
    var bags = Math.ceil(totalLbs / 5);

    var s = getStrings(lang, unitSystem);
    var areaDisplay = isMetric ? area.toLocaleString() : areaSqFt.toLocaleString();

    results.classList.add('visible');
    document.getElementById('seed-total').textContent = s.total.replace('#', totalLbs.toFixed(1));
    document.getElementById('seed-bags').textContent = s.bags.replace('#', bags);
    document.getElementById('seed-rate').textContent = s.rate.replace('#', rate);
    document.getElementById('seed-sqft').textContent = s.area.replace('#', areaDisplay);
  }

  calculate();
})();