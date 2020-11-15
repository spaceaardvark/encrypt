import { internals } from "./index";

test("generateSalt()", () => {
  let salt1, salt2;

  salt1 = internals.generateSalt();
  salt2 = internals.generateSalt();

  expect(salt1.length).toBe(internals.settings.saltLength * 2);
  expect(salt2.length).toBe(internals.settings.saltLength * 2);
  expect(salt1).not.toBe(salt2);
});

test("generateIV()", () => {
  let iv1, iv2;

  iv1 = internals.generateIV();
  iv2 = internals.generateIV();

  expect(iv1.length).toBe(internals.settings.ivLength * 2);
  expect(iv2.length).toBe(internals.settings.ivLength * 2);
  expect(iv1).not.toBe(iv2);
});

test("generateKey()", () => {
  let password, salt1, salt2, key1, key2;

  password = "Γαζέες καὶ μυρτιὲς δὲν θὰ βρῶ πιὰ στὸ χρυσαφὶ ξέφωτο";
  salt1 = internals.generateSalt();
  salt2 = internals.generateSalt();

  key1 = internals.generateKey(password, salt1);
  key2 = internals.generateKey(password, salt2);

  expect(key1.length).toBe(64);
  expect(key2.length).toBe(64);
  expect(key1).not.toBe(key2);
});

test("parseEncrypted()", () => {
  let hashAlgorithm, encryptAlgorithm, salt, iv, payload, encrypted, block;

  hashAlgorithm = "hash-algo";
  encryptAlgorithm = "encrypt-algo";
  salt = "salt-value";
  iv = "iv-value";
  payload = `payload with a ${internals.settings.manifestDelimiter} delimiter`;

  encrypted = [
    hashAlgorithm,
    encryptAlgorithm,
    salt,
    iv,
    payload
  ].join(internals.settings.manifestDelimiter);

  block = internals.parseEncrypted(encrypted);

  expect(block.hashAlgorithm).toBe(hashAlgorithm);
  expect(block.encryptAlgorithm).toBe(encryptAlgorithm);
  expect(block.salt).toBe(salt);
  expect(block.iv).toBe(iv);
  expect(block.payload).toBe(payload);
});