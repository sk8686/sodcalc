/* Sod Calculator Logic */
(function() {
  'use strict';

  var form = document.getElementById('sod-form');
  var results = document.getElementById('sod-results');
  var rollsPerPallet = 50;
  var wastePercent = 5;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    calculate();
  });

  // Live calculation on input change
  form.querySelectorAll('input, select').forEach(function(el) {
    el.addEventListener('input', calculate);
    el.addEventListener('change', calculate);
  });

  // Custom roll size
  var customRoll = document.getElementById('custom-roll');
  if (customRoll) {
    customRoll.addEventListener('input', function() {
      calculate();
    });
  }

  function calculate() {
    var area = parseFloat(document.getElementById('sod-area').value);
    if (!area || area <= 0) {
      results.classList.remove('visible');
      return;
    }

    var unitSystem = document.getElementById('sod-unit').value;
    var areaSqFt = unitSystem === 'metric' ? area * 10.764 : area;

    // Determine roll size: 10 sq ft standard, 12 for St. Augustine (larger rolls)
    var grassType = document.getElementById('sod-type').value;
    var rollSize = grassType === 'St. Augustine' ? 12 : 10;
    // Override with custom if set
    if (customRoll && customRoll.value) {
      rollSize = parseFloat(customRoll.value) || rollSize;
    }

    var rolls = areaSqFt / rollSize;
    var pallets = rolls / rollsPerPallet;
    var rollsWithWaste = Math.ceil(rolls * (1 + wastePercent / 100));
    var palletsWithWaste = (rollsWithWaste / rollsPerPallet).toFixed(1);

    results.classList.add('visible');
    document.getElementById('sod-rolls').textContent = Math.ceil(rolls) + ' rolls (' + rollSize + ' sq ft each)';
    document.getElementById('sod-pallets').textContent = pallets.toFixed(1) + ' pallets';
    document.getElementById('sod-waste').textContent = rollsWithWaste + ' rolls with waste';
    document.getElementById('sod-sqft').textContent = areaSqFt.toLocaleString() + ' sq ft';
  }

  // Initial calculation if area pre-filled
  calculate();
})();