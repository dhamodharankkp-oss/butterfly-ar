import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Butterfly AR Verification Test...\n');

let pass = 0;
let fail = 0;

function assert(cond, msg) {
  if (cond) {
    console.log(`  ✅ PASS: ${msg}`);
    pass++;
  } else {
    console.error(`  ❌ FAIL: ${msg}`);
    fail++;
  }
}

// 1. Core Files
const files = ['index.html', 'styles.css', 'app.js', 'server.js', 'package.json', 'README.md', 'test.mjs'];
files.forEach(f => {
  assert(fs.existsSync(path.join(__dirname, f)), `${f} exists`);
});

// 2. Bundled JS Assets
assert(fs.existsSync(path.join(__dirname, 'assets/js/model-viewer.min.js')), 'model-viewer.min.js is offline bundled');
assert(fs.existsSync(path.join(__dirname, 'assets/js/qrcode.min.js')), 'qrcode.min.js is offline bundled');

// 3. 3D Model Integrity
const glbPath = path.join(__dirname, 'assets/models/butterfly.glb');
assert(fs.existsSync(glbPath), 'assets/models/butterfly.glb exists');

if (fs.existsSync(glbPath)) {
  const buf = fs.readFileSync(glbPath);
  assert(buf.readUInt32LE(0) === 0x46546C67, 'butterfly.glb has valid glTF 2.0 magic header');
  assert(buf.length > 4 * 1024 * 1024, `butterfly.glb is high-detail (${(buf.length / 1024 / 1024).toFixed(2)} MB)`);

  const jsonLen = buf.readUInt32LE(12);
  const gltf = JSON.parse(buf.slice(20, 20 + jsonLen).toString('utf8'));

  const extensions = gltf.extensionsRequired || [];
  assert(!extensions.includes('KHR_draco_mesh_compression'), 'butterfly.glb is Draco-free for native Scene Viewer compatibility');

  const animNames = (gltf.animations || []).map(a => a.name);
  assert(animNames.includes('Garden Flight (A → B)'), 'Contains "Garden Flight (A → B)" trajectory');
  assert(animNames.includes('Perched Close-Up'), 'Contains "Perched Close-Up" in-place wingbeat');

  const rootNode = gltf.nodes[gltf.scenes[0].nodes[0]];
  assert(rootNode && rootNode.name === 'ButterflyFlightRoot', 'Has ButterflyFlightRoot as root scene node');
  assert(rootNode.scale && rootNode.scale[0] === 0.09, 'Root scale is properly set to 0.09 (~21 cm AR wingspan)');
}

console.log(`\n======================================================`);
console.log(`Results: ${pass} Passed, ${fail} Failed`);
console.log(`======================================================`);

if (fail > 0) process.exit(1);
