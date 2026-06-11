/* Mulch Calculator Logic */
(function() {
  'use strict';

  var form = document.getElementById('mulch-form');
  var results = document.getElementById('mulch-results');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    calculate();
  });

  form.querySelectorAll('input, select').forEach(function(el) {
    el.addEventListener('input', calculate);
    el.addEventListener('change', calculate);
  });

  function calculate() {
    var area = parseFloat(document.getElementById('mulch-area').value);
    var depth = parseFloat(document.getElementById('mulch-depth').value);

    if (!area || area <= 0 || !depth || depth <= 0) {
      results.classList.remove('visible');
      return;
    }

    var unitSystem = document.getElementById('mulch-unit').value;
    var areaSqFt = unitSystem === 'metric' ? area * 10.764 : area;

    // Cubic yards = (area in sq ft * depth in inches) / 324
    var cubicYards = (areaSqFt * depth) / 324;
    var cubicFeet = cubicYards * 27;
    var bags = Math.ceil(cubicFeet / 2); // Standard mulch bag = 2 cu ft

    results.classList.add('visible');
    document.getElementById('mulch-cy').textContent = cubicYards.toFixed(1) + ' cubic yards';
    document.getElementById('mulch-bags').textContent = bags + ' bags (2 cu ft each)';
    document.getElementById('mulch-sqft').textContent = areaSqFt.toLocaleString() + ' sq ft at ' + depth + '" depth';
  }

  calculate();
})();