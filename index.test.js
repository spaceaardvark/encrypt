import crypto from "crypto";

import { encrypt, decrypt, DEFAULT_SETTINGS, internals } from "./index";

test("generateSalt()", () => {
  let salt1, salt2;

  salt1 = internals.generateSalt();
  salt2 = internals.generateSalt();

  expect(salt1.length).toBe(DEFAULT_SETTINGS.saltLength * 2);
  expect(salt2.length).toBe(DEFAULT_SETTINGS.saltLength * 2);
  expect(salt1).not.toBe(salt2);
});

test("generateIV()", () => {
  let iv1, iv2;

  iv1 = internals.generateIV();
  iv2 = internals.generateIV();

  expect(iv1.length).toBe(DEFAULT_SETTINGS.ivLength * 2);
  expect(iv2.length).toBe(DEFAULT_SETTINGS.ivLength * 2);
  expect(iv1).not.toBe(iv2);
});

test("generateKey()", () => {
  let password, salt1, salt2, key1, key2;

  password = "Γαζέες καὶ μυρτιὲς δὲν θὰ βρῶ πιὰ στὸ χρυσαφὶ ξέφωτο";
  salt1 = internals.generateSalt();
  salt2 = internals.generateSalt();

  key1 = internals.generateKey(password, salt1);
  key2 = internals.generateKey(password, salt2);

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
    hashAlgorithm: "sha-512",
    encryptAlgorithm: "aes-128-cbc",
  };

  password = "Pchnąć w tę łódź jeża lub ośm skrzyń fig";
  text = crypto.randomBytes(1_000_000).toString();

  encrypted = encrypt(password, text, settings);
  decrypted = decrypt(password, encrypted);

  expect(decrypted).toBe(text);
});