import crypto from "crypto";

import {
  decrypt,
  encrypt,
  encryptIterations,
} from "./index";

test("encryption manifest", async () => {
  let password, text, encrypted, tokens;

  password = "Check under the couch cushion.";
  text = "I found my purpose.";

  encrypted = await encrypt(password, text);
  tokens = encrypted.split(":");

  expect(encrypted).toBeTruthy();
  expect(tokens[0]).toBe("1");  // version 1
  expect(tokens[1].split(",").length).toBe(3);  // 3 parameters
  expect(tokens[2]).toBeTruthy();  // with payload
});

test("readme example", async () => {
  let password, text, encrypted, decrypted;

  password = "Check under the couch cushion.";
  text = "I found my purpose.";

  encrypted = await encrypt(password, text);
  decrypted = await decrypt(password, encrypted);  // I found my purpose.

  expect(decrypted).toBe(text);
});

test("encrypt a simple string", async () => {
  let password, text, encrypted, decrypted;

  password = "Le cœur déçu mais l'âme plutôt naïve";
  text = "Portez ce vieux whisky au juge blond qui fume sur son île intérieure";

  encrypted = await encrypt(password, text);
  decrypted = await decrypt(password, encrypted);

  expect(decrypted).toBe(text);
});

test("encrypt an XML document", async () => {
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

  encrypted = await encrypt(password, text);
  decrypted = await decrypt(password, encrypted);

  expect(decrypted).toBe(text);
});

test("encrypt a long string", async () => {
  let password, text, encrypted, decrypted;

  password = "Pchnąć w tę łódź jeża lub ośm skrzyń fig";
  text = crypto.randomBytes(1_000_000).toString();

  encrypted = await encrypt(password, text);
  decrypted = await decrypt(password, encrypted);

  expect(decrypted).toBe(text);
});

test("decrypt with the wrong password", async () => {
  let password, text, encrypted;

  password = "Le cœur déçu mais l'âme plutôt naïve";
  text = "Portez ce vieux whisky au juge blond qui fume sur son île intérieure";

  encrypted = await encrypt(password, text);
  await expect(() => decrypt("nope", encrypted)).rejects.toThrow();
});

test("decrypt with tampered encrypted text", async () => {
  let password, text, encrypted, tampered;

  password = "Le cœur déçu mais l'âme plutôt naïve";
  text = "Portez ce vieux whisky au juge blond qui fume sur son île intérieure";

  encrypted = await encrypt(password, text);
  tampered = [
    encrypted.slice(0, encrypted.length - 10),
    "0",
    encrypted.slice(encrypted.length - 11)
  ].join();

  await expect(() => decrypt(password, tampered)).rejects.toThrow();
});

test("uniqueness", async () => {
  let password, text, encrypted1, encrypted2, payload1, payload2;

  password = "Le cœur déçu mais l'âme plutôt naïve";
  text = "Portez ce vieux whisky au juge blond qui fume sur son île intérieure";

  encrypted1 = await encrypt(password, text);
  encrypted2 = await encrypt(password, text);

  payload1 = encrypted1.slice(encrypted1.lastIndexOf(":"));
  payload2 = encrypted2.slice(encrypted2.lastIndexOf(":"));

  expect(payload1).not.toBe(payload2);
});

test("decrypt with an unsupported version", async () => {
  let password, text, encrypted;

  password = "Le cœur déçu mais l'âme plutôt naïve";
  text = "Portez ce vieux whisky au juge blond qui fume sur son île intérieure";

  encrypted = await encrypt(password, text);
  encrypted = [
    "99",
    encrypted.slice(encrypted.indexOf(":")),
  ].join();

  await expect(() => decrypt(password, encrypted)).rejects.toThrow();
});

test("encrypt with fewer iterations", async () => {
  let password, text, encrypted, decrypted;

  password = "Le cœur déçu mais l'âme plutôt naïve";
  text = "Portez ce vieux whisky au juge blond qui fume sur son île intérieure";

  encrypted = await encryptIterations(password, 1, text);
  decrypted = await decrypt(password, encrypted);

  expect(decrypted).toBe(text);
});

test("encrypt with more iterations", async () => {
  let password, text, encrypted, decrypted;

  password = "Le cœur déçu mais l'âme plutôt naïve";
  text = "Portez ce vieux whisky au juge blond qui fume sur son île intérieure";

  encrypted = await encryptIterations(password, 100_000, text);
  decrypted = await decrypt(password, encrypted);

  expect(decrypted).toBe(text);
});

test("encrypt with invalid passwords", async () => {
  let password1, password2, text;

  password1 = null;
  password2 = "";
  text = "Portez ce vieux whisky au juge blond qui fume sur son île intérieure";

  await expect(() => encrypt(password1, text)).rejects.toThrow(TypeError);
  await expect(() => encrypt(password2, text)).rejects.toThrow(TypeError);
});

test("encrypt with invalid iterations", async () => {
  let password, iterations1, iterations2, text;

  password = "Le cœur déçu mais l'âme plutôt naïve";
  iterations1 = null;
  iterations2 = 0;
  text = "Portez ce vieux whisky au juge blond qui fume sur son île intérieure";

  await expect(() => encryptIterations(password, iterations1, text)).rejects.toThrow(TypeError);
  await expect(() => encryptIterations(password, iterations2, text)).rejects.toThrow(TypeError);
});

test("encrypt with invalid texts", async () => {
  let password, text1, text2;

  password = "Le cœur déçu mais l'âme plutôt naïve";
  text1 = null;
  text2 = "";

  await expect(() => encrypt(password, text1)).rejects.toThrow(TypeError);
  await expect(() => encrypt(password, text2)).rejects.toThrow(TypeError);
});

test("decrypt with invalid passwords", async () => {
  let password1, password2, encrypted;

  password1 = null;
  password2 = "";
  encrypted = "1234567890";

  await expect(() => decrypt(password1, encrypted)).rejects.toThrow(TypeError);
  await expect(() => encrypt(password2, encrypted)).rejects.toThrow(TypeError);
});

test("decrypt with invalid encrypted text", async () => {
  let password, encrypted1, encrypted2;

  password = "Le cœur déçu mais l'âme plutôt naïve";
  encrypted1 = null;
  encrypted2 = "";

  await expect(() => decrypt(password, encrypted1)).rejects.toThrow(TypeError);
  await expect(() => encrypt(password, encrypted2)).rejects.toThrow(TypeError);
});