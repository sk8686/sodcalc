/* Mulch Calculator Logic */
(function() {
  'use strict';

  function getStrings(lang, unit) {
    var isMetric = unit === 'metric';
    var t = {
      en: {
        cy: '# cubic yards',
        bags: '# bags (2 cu ft each)',
        coverage: isMetric ? '# sq m at #" depth' : '# sq ft at #" depth'
      },
      'zh-CN': {
        cy: '#立方码',
        bags: '#袋（每袋2立方英尺）',
        coverage: isMetric ? '#平方米，#英寸深' : '#平方英尺，#英寸深'
      },
      es: {
        cy: '# yardas cúbicas',
        bags: '# bolsas (2 pies³ c/u)',
        coverage: isMetric ? '# m² con #" profundidad' : '# pies² con #" profundidad'
      },
      hi: {
        cy: '# घन गज',
        bags: '# बैग (2 घन फुट प्रति)',
        coverage: isMetric ? '# वर्ग मी, #" गहराई' : '# वर्ग फुट, #" गहराई'
      },
      ar: {
        cy: '# ياردة مكعبة',
        bags: '# كيس (2 قدم³ لكل)',
        coverage: isMetric ? '# م² بعمق #"' : '# قدم² بعمق #"'
      },
      pt: {
        cy: '# jardas cúbicas',
        bags: '# sacos (2 pés³ cada)',
        coverage: isMetric ? '# m² com #" profundidade' : '# pés² com #" profundidade'
      },
      fr: {
        cy: '# verges cubes',
        bags: '# sacs (2 pi³ chacun)',
        coverage: isMetric ? '# m² avec #" profondeur' : '# pi² avec #" profondeur'
      },
      ja: {
        cy: '#立方ヤード',
        bags: '#袋（1袋2立方フィート）',
        coverage: isMetric ? '#平方メートル、深さ#"' : '#平方フィート、深さ#"'
      }
    };
    return t[lang] || t.en;
  }

  var form = document.getElementById('mulch-form');
  if (!form) return;
  var results = document.getElementById('mulch-results');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    calculate();
  });

  form.querySelectorAll('input, select').forEach(function(el) {
    el.addEventListener('input', calculate);
  });

  function calculate() {
    var area = parseFloat(document.getElementById('mulch-area').value);
    var depth = parseFloat(document.getElementById('mulch-depth').value);

    if (!area || area <= 0 || !depth || depth <= 0) {
      results.classList.remove('visible');
      return;
    }

    var unitSystem = document.getElementById('mulch-unit').value;
    var isMetric = unitSystem === 'metric';
    var lang = document.documentElement.lang || 'en';
    var areaSqFt = isMetric ? area * 10.764 : area;

    var cubicYards = (areaSqFt * depth) / 324;
    var cubicFeet = cubicYards * 27;
    var bags = Math.ceil(cubicFeet / 2);

    var s = getStrings(lang, unitSystem);
    var areaDisplay = isMetric ? area.toLocaleString() : areaSqFt.toLocaleString();

    results.classList.add('visible');
    document.getElementById('mulch-cy').textContent = s.cy.replace('#', cubicYards.toFixed(1));
    document.getElementById('mulch-bags').textContent = s.bags.replace('#', bags);
    document.getElementById('mulch-sqft').textContent = s.coverage.replace('#', areaDisplay).replace('#', depth);
  }

  calculate();
})();