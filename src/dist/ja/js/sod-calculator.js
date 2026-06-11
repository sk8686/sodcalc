/* Sod Calculator Logic */
(function() {
  'use strict';

  function getStrings(lang, unit) {
    var isMetric = unit === 'metric';
    var t = {
      en: {
        rolls: isMetric ? '# rolls (# sq m each)' : '# rolls (# sq ft each)',
        pallets: '# pallets',
        waste: '# rolls with waste',
        area: isMetric ? '# sq m' : '# sq ft'
      },
      'zh-CN': {
        rolls: isMetric ? '#卷（每卷#平方米）' : '#卷（每卷#平方英尺）',
        pallets: '#托盘',
        waste: '#卷（含损耗）',
        area: isMetric ? '#平方米' : '#平方英尺'
      },
      es: {
        rolls: isMetric ? '# rollos (# m² c/u)' : '# rollos (# pies² c/u)',
        pallets: '# paletas',
        waste: '# rollos con desperdicio',
        area: isMetric ? '# m²' : '# pies²'
      },
      hi: {
        rolls: isMetric ? '# रोल (# वर्ग मी प्रति)' : '# रोल (# वर्ग फुट प्रति)',
        pallets: '# पैलेट',
        waste: '# रोल (वेस्ट सहित)',
        area: isMetric ? '# वर्ग मी' : '# वर्ग फुट'
      },
      ar: {
        rolls: isMetric ? '# لفة (# م² لكل)' : '# لفة (# قدم² لكل)',
        pallets: '# باليت',
        waste: '# لفة مع الهدر',
        area: isMetric ? '# م²' : '# قدم²'
      },
      pt: {
        rolls: isMetric ? '# rolos (# m² cada)' : '# rolos (# pés² cada)',
        pallets: '# paletes',
        waste: '# rolos com desperdício',
        area: isMetric ? '# m²' : '# pés²'
      },
      fr: {
        rolls: isMetric ? '# rouleaux (# m² chacun)' : '# rouleaux (# pi² chacun)',
        pallets: '# palettes',
        waste: '# rouleaux avec perte',
        area: isMetric ? '# m²' : '# pi²'
      },
      ja: {
        rolls: isMetric ? '#巻（1巻#平方メートル）' : '#巻（1巻#平方フィート）',
        pallets: '#パレット',
        waste: '#巻（ロス込み）',
        area: isMetric ? '#平方メートル' : '#平方フィート'
      }
    };
    return t[lang] || t.en;
  }

  var form = document.getElementById('sod-form');
  if (!form) return;
  var results = document.getElementById('sod-results');
  var wastePercent = 5;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    calculate();
  });

  form.querySelectorAll('input, select').forEach(function(el) {
    el.addEventListener('input', calculate);
  });

  function calculate() {
    var area = parseFloat(document.getElementById('sod-area').value);
    if (!area || area <= 0) {
      results.classList.remove('visible');
      return;
    }

    var unitSystem = document.getElementById('sod-unit').value;
    var isMetric = unitSystem === 'metric';
    var lang = document.documentElement.lang || 'en';
    var areaSqFt = isMetric ? area * 10.764 : area;

    var grassType = document.getElementById('sod-type').value;
    if (!grassType) {
      results.classList.remove('visible');
      return;
    }
    var rollSizeSqFt = grassType === 'St. Augustine' ? 12 : 10;
    var customRoll = document.getElementById('custom-roll');
    if (customRoll && customRoll.value) {
      rollSizeSqFt = Math.max(1, parseFloat(customRoll.value) || rollSizeSqFt);
    }

    var rolls = areaSqFt / rollSizeSqFt;
    var sqFtPerPallet = grassType === 'St. Augustine' ? 450 : 500;
    var pallets = areaSqFt / sqFtPerPallet;
    var rollsWithWaste = Math.ceil(rolls * (1 + wastePercent / 100));

    var s = getStrings(lang, unitSystem);
    var rollSizeDisplay = isMetric ? (rollSizeSqFt * 0.092903).toFixed(1) : rollSizeSqFt;
    var areaDisplay = isMetric ? area.toLocaleString() : areaSqFt.toLocaleString();

    results.classList.add('visible');
    document.getElementById('sod-rolls').textContent = s.rolls.replace('#', Math.ceil(rolls)).replace('#', rollSizeDisplay);
    document.getElementById('sod-pallets').textContent = s.pallets.replace('#', Math.ceil(pallets));
    document.getElementById('sod-waste').textContent = s.waste.replace('#', rollsWithWaste);
    document.getElementById('sod-sqft').textContent = s.area.replace('#', areaDisplay);
  }

  calculate();
})();