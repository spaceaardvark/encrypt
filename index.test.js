import crypto from "crypto";

import {
  decrypt,
  DEFAULT_SETTINGS,
  encrypt,
  encryptWithSettings,
  internals
} from "./index";

test("readme example", () => {
  let password, text, encrypted, decrypted;

  password = "Check under the couch cushion.";
  text = "I found my purpose.";

  encrypted = encrypt(password, text);
  decrypted = decrypt(password, encrypted);  // I found my purpose.

  expect(decrypted).toBe(text);
});

test("generateSalt()", () => {
  let len1, len2, salt1, salt2;

  len1 = DEFAULT_SETTINGS.saltLength;
  len2 = 64;

  salt1 = internals.generateSalt(len1);
  salt2 = internals.generateSalt(len2);

  expect(salt1.length).toBe(len1 * 2);
  expect(salt2.length).toBe(len2 * 2);
  expect(salt1).not.toBe(salt2);
});

test("generateIV()", () => {
  let len1, len2, iv1, iv2;

  len1 = DEFAULT_SETTINGS.ivLength;
  len2 = 64;

  iv1 = internals.generateIV(len1);
  iv2 = internals.generateIV(len2);

  expect(iv1.length).toBe(len1 * 2);
  expect(iv2.length).toBe(len2 * 2);
  expect(iv1).not.toBe(iv2);
});

test("generateKey()", () => {
  let password, salt1, salt2, key1, key2;

  password = "Γαζέες καὶ μυρτιὲς δὲν θὰ βρῶ πιὰ στὸ χρυσαφὶ ξέφωτο";
  salt1 = internals.generateSalt(DEFAULT_SETTINGS.saltLength);
  salt2 = internals.generateSalt(DEFAULT_SETTINGS.saltLength);

  key1 = internals.generateKey(password, salt1, DEFAULT_SETTINGS.hashAlgorithm);
  key2 = internals.generateKey(password, salt2, DEFAULT_SETTINGS.hashAlgorithm);

  expect(key1.length).toBe(32);
  expect(key2.length).toBe(32);
  expect(key1).not.toBe(key2);
});

test("parseEncrypted()", () => {
  let hashAlgorithm, encryptAlgorithm, salt, iv, payload, encrypted, block;

  hashAlgorithm = "hash-algo";
  encryptAlgorithm = "encrypt-algo";
  salt = "salt-value";
  iv = "iv-value";
  payload = `payload with a ${DEFAULT_SETTINGS.manifestDelimiter} delimiter`;

  encrypted = [
    hashAlgorithm,
    encryptAlgorithm,
    salt,
    iv,
    payload
  ].join(DEFAULT_SETTINGS.manifestDelimiter);

  block = internals.parseEncrypted(encrypted);

  expect(block.hashAlgorithm).toBe(hashAlgorithm);
  expect(block.encryptAlgorithm).toBe(encryptAlgorithm);
  expect(block.salt).toBe(salt);
  expect(block.iv).toBe(iv);
  expect(block.payload).toBe(payload);
});

test("encrypt a simple string", () => {
  let password, text, encrypted, decrypted;

  password = "Le cœur déçu mais l'âme plutôt naïve";
  text = "Portez ce vieux whisky au juge blond qui fume sur son île intérieure";

  encrypted = encrypt(password, text);
  decrypted = decrypt(password, encrypted);

  expect(decrypted).toBe(text);
});

test("encrypt an XML document", () => {
  let password, text, encrypted, decrypted;

  password = "Pchnąć w tę łódź jeża lub ośm skrzyń fig";
  text = `
    <?xml version="1.0" encoding="UTF-8"?>
    <one>
      <two attr="2"/>
      <three>
        <![CDATA[
          All the statistical manipulation is performed. Example. '"&<> and submission
        ]]>
      </three>
    </one>`;

  encrypted = encrypt(password, text);
  decrypted = decrypt(password, encrypted);

  expect(decrypted).toBe(text);
});

test("encrypt a long string", () => {
  let password, text, encrypted, decrypted;

  password = "Pchnąć w tę łódź jeża lub ośm skrzyń fig";
  text = crypto.randomBytes(1_000_000).toString();

  encrypted = encrypt(password, text);
  decrypted = decrypt(password, encrypted);

  expect(decrypted).toBe(text);
});

test("decrypt with the wrong password", () => {
  let password, text, encrypted;

  password = "Le cœur déçu mais l'âme plutôt naïve";
  text = "Portez ce vieux whisky au juge blond qui fume sur son île intérieure";

  encrypted = encrypt(password, text);
  expect(() => decrypt("nope", encrypted)).toThrow();
});

test("decrypt with tampered encrypted text", () => {
  let password, text, encrypted, tampered;

  password = "Le cœur déçu mais l'âme plutôt naïve";
  text = "Portez ce vieux whisky au juge blond qui fume sur son île intérieure";

  encrypted = encrypt(password, text);
  tampered = [
    encrypted.slice(0, encrypted.length - 10),
    "0",
    encrypted.slice(encrypted.length - 11)
  ].join();

  expect(() => decrypt(password, tampered)).toThrow();
});

test("encrypt with alternative settings", () => {
  let settings, password, text, encrypted, decrypted;

  settings = {
    ...DEFAULT_SETTINGS,
    hashAlgorithm: "md5",
    encryptAlgorithm: "aria-128-cbc",
  };

  password = "Pchnąć w tę łódź jeża lub ośm skrzyń fig";
  text = crypto.randomBytes(1_000_000).toString();

  encrypted = encryptWithSettings(password, settings, text);
  decrypted = decrypt(password, encrypted);

  expect(decrypted).toBe(text);
});