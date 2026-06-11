/* Grass Seed Calculator Logic */
(function() {
  'use strict';

  var form = document.getElementById('seed-form');
  var results = document.getElementById('seed-results');

  // Grass seed coverage rates (lbs per 1000 sq ft)
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

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    calculate();
  });

  form.querySelectorAll('input, select').forEach(function(el) {
    el.addEventListener('input', calculate);
    el.addEventListener('change', calculate);
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
    var areaSqFt = unitSystem === 'metric' ? area * 10.764 : area;

    var rate = purpose === 'overseed' ? seedRates[grassType].overseed : seedRates[grassType].new;
    var totalLbs = (areaSqFt / 1000) * rate;
    var bags = Math.ceil(totalLbs / 5); // Standard 5lb bag

    results.classList.add('visible');
    document.getElementById('seed-total').textContent = totalLbs.toFixed(1) + ' lbs';
    document.getElementById('seed-bags').textContent = bags + ' bags (5 lb each)';
    document.getElementById('seed-rate').textContent = rate + ' lbs / 1,000 sq ft';
    document.getElementById('seed-sqft').textContent = areaSqFt.toLocaleString() + ' sq ft';
  }

  calculate();
})();