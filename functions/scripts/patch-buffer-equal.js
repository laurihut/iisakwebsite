const fs = require('fs');
const path = require('path');

const PATCHED_SOURCE = `'use strict';

var Buffer = require('buffer').Buffer;
var SlowBuffer = require('buffer').SlowBuffer;

module.exports = bufferEq;

function bufferEq(a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  var c = 0;
  for (var i = 0; i < a.length; i++) {
    c |= a[i] ^ b[i];
  }
  return c === 0;
}

bufferEq.install = function() {
  Buffer.prototype.equal = function equal(that) {
    return bufferEq(this, that);
  };

  if (SlowBuffer && SlowBuffer.prototype) {
    SlowBuffer.prototype.equal = Buffer.prototype.equal;
  }
};

var origBufEqual = Buffer.prototype.equal;
var origSlowBufEqual = SlowBuffer && SlowBuffer.prototype ? SlowBuffer.prototype.equal : undefined;

bufferEq.restore = function() {
  Buffer.prototype.equal = origBufEqual;
  if (SlowBuffer && SlowBuffer.prototype) {
    SlowBuffer.prototype.equal = origSlowBufEqual;
  }
};
`;

const patchFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('SlowBuffer && SlowBuffer.prototype')) {
    return;
  }

  fs.writeFileSync(filePath, PATCHED_SOURCE);
};

const searchRoot = path.join(__dirname, '..', 'node_modules');
const queue = [searchRoot];

while (queue.length > 0) {
  const current = queue.pop();
  let entries;

  try {
    entries = fs.readdirSync(current, { withFileTypes: true });
  } catch {
    continue;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const fullPath = path.join(current, entry.name);

    if (entry.name === 'buffer-equal-constant-time') {
      patchFile(path.join(fullPath, 'index.js'));
      continue;
    }

    if (entry.name === 'node_modules' || !entry.name.startsWith('.')) {
      queue.push(fullPath);
    }
  }
}
