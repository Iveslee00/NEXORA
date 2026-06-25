import { readFileSync } from 'node:fs';

const formField = readFileSync('components/ui/FormField.tsx', 'utf8');
const moduleLibrary = readFileSync('components/editor/ModuleLibrary.tsx', 'utf8');
const colorStyles = readFileSync('lib/styles/colorStyles.ts', 'utf8');

const presetCount = (colorStyles.match(/value: 'linear-gradient/g) ?? []).length;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

assert(presetCount >= 12, `expected at least 12 gradient presets, found ${presetCount}`);
assert(formField.includes('GradientPickerPopover'), 'shared color field should use the compact gradient popover');
assert(moduleLibrary.includes('GradientPickerPopover'), 'global color picker should use the compact gradient popover');
assert(formField.includes('absolute right-0 top-9'), 'gradient choices should live inside a popover');
assert(!moduleLibrary.includes('GRADIENT_PRESETS.map'), 'global color picker should not render persistent gradient buttons');
assert(formField.includes('套用自訂漸層'), 'shared color field should provide custom gradient controls');
assert(colorStyles.includes('createLinearGradient'), 'custom gradient helper should exist');

console.log('gradient picker verified');
