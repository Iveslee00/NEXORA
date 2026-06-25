import { readFileSync } from 'node:fs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const formField = readFileSync('components/ui/FormField.tsx', 'utf8');

assert(formField.includes('defaultPreviewColor'), 'Color fields should expose a default preview color');
assert(!formField.includes("const displayColor = isHex ? value : '#ffffff';"), 'Empty color fields should not preview as white by default');
assert(formField.includes('placeholder={placeholder}'), 'Color fields should keep explanatory placeholders');
assert(formField.includes('const canUseNativePicker = !isGradient;'), 'Color swatches should open the picker even when the field is using its default color');
assert(!formField.includes('const canUseNativePicker = !isGradient && isHex;'), 'Default color swatches should not disable the native picker');
assert(formField.includes("className=\"block h-32 w-full object-contain p-2\""), 'Uploaded image previews should use bounded contain preview');
assert(!formField.includes('max-h-32 w-full object-cover'), 'Uploaded image previews should not crop or visually expand with cover');
assert(formField.includes('const inputRef = useRef<HTMLInputElement>(null);'), 'Image uploads should use a stable hidden input ref');
assert(formField.includes('inputRef.current?.click()'), 'Image uploads should be triggered from a normal button');
assert(formField.includes('type="button"'), 'Upload trigger should be a button so it cannot affect form layout');
assert(formField.includes('className="hidden"'), 'File input should be fully hidden from layout');
assert(!formField.includes('className="sr-only"'), 'File input should not use sr-only because it can still affect focus/layout when the picker opens');
assert(!formField.includes('<label className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded-md px-3 py-2'), 'Upload trigger should not be a label wrapping the file input');

console.log('color and upload UI verified');
