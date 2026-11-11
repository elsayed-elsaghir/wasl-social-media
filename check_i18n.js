const fs = require('fs');
for (const lang of ['en', 'ar']) {
  const p = 'public/assets/i18n/' + lang + '.json';
  try {
    const obj = JSON.parse(fs.readFileSync(p, 'utf8'));
    console.log('=== ' + lang + '.json (VALID) ===');
    console.log('root keys:', Object.keys(obj));
    console.log('has root.sidebar:', 'sidebar' in obj);
    if (obj.postDetails) {
      console.log('postDetails keys:', Object.keys(obj.postDetails));
      console.log('postDetails.hasOwnProperty sidebar:', Object.prototype.hasOwnProperty.call(obj.postDetails, 'sidebar'));
    }
    if (obj.sidebar) console.log('sidebar keys:', Object.keys(obj.sidebar));
  } catch (e) {
    console.log('=== ' + lang + '.json INVALID JSON ===');
    console.log(e.message);
  }
}
