const potrace = require('potrace');
const fs = require('fs');

potrace.trace('public/separator-line.png', { threshold: 120, optTolerance: 0.2 }, function(err, svg) {
  if (err) throw err;
  fs.writeFileSync('public/separator.svg', svg);
  console.log('Saved public/separator.svg');
});
