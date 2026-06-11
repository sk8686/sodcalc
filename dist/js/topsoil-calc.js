/* Topsoil Calculator Logic */
(function() {
  'use strict';

  var form = document.getElementById('topsoil-form');
  var results = document.getElementById('topsoil-results');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    calculate();
  });

  form.querySelectorAll('input, select').forEach(function(el) {
    el.addEventListener('input', calculate);
    el.addEventListener('change', calculate);
  });

  function calculate() {
    var area = parseFloat(document.getElementById('topsoil-area').value);
    var depth = parseFloat(document.getElementById('topsoil-depth').value);

    if (!area || area <= 0 || !depth || depth <= 0) {
      results.classList.remove('visible');
      return;
    }

    var unitSystem = document.getElementById('topsoil-unit').value;
    var areaSqFt = unitSystem === 'metric' ? area * 10.764 : area;

    // Cubic yards = (area in sq ft * depth in inches) / 324
    var cubicYards = (areaSqFt * depth) / 324;
    var cubicFeet = cubicYards * 27;
    var bags = Math.ceil(cubicFeet / 0.75); // Standard bag = 0.75 cu ft

    results.classList.add('visible');
    document.getElementById('topsoil-cy').textContent = cubicYards.toFixed(1) + ' cubic yards';
    document.getElementById('topsoil-cf').textContent = cubicFeet.toFixed(1) + ' cubic feet';
    document.getElementById('topsoil-bags').textContent = bags + ' bags (0.75 cu ft each)';
    document.getElementById('topsoil-sqft').textContent = areaSqFt.toLocaleString() + ' sq ft at ' + depth + '" depth';
  }

  calculate();
})();