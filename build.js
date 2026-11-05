// Inlines the engine and data so the demo runs from one file. Usage: node build.js [artifact-output-path]
const fs = require('fs'), path = require('path');
const here = f => path.join(__dirname, f), d = f => fs.readFileSync(here('data/' + f), 'utf8');
const safe = s => s.replace(/<\/script/gi, '<\\/script');
const raw = { train: d('train.txt'), test: '', incidents: d('incidents.txt'), deployments: d('deployments.txt'), demo: d('demo.txt') };
const page = fs.readFileSync(here('app.template.html'), 'utf8')
  .replace('__ENGINE__', () => safe(fs.readFileSync(here('engine.js'), 'utf8')))
  .replace('__DATA__', () => safe(JSON.stringify(raw)))
  .replace('__EVAL__', () => safe(d('eval_results_holdout.json')))
  .replace('__CONFIG__', () => safe(d('control_config.json')))
  .replace('__RUNBOOKS__', () => safe(d('runbooks.json')))
  .replace('__PAPER__', () => safe(d('market_data_feed_delay.config.json')));
fs.writeFileSync(here('index.html'), '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0">' + page + '</body></html>');
if (process.argv[2]) fs.writeFileSync(process.argv[2], page);
console.log('built', page.length);
