import crypto from "crypto";
import { promisify } from "util";

const CURRENT_VERSION = "1";
const ENCRYPTION_VERSION = {
  [CURRENT_VERSION]: {
    saltLength: 256,
    iterations: 5_000,
    keyLength: 32,
    digestAlgorithm: "sha256",
    ivLength: 16,
    cipherAlgorithm: "aes-256-cbc",
    decrypt: null,
  },
};

const pbkdf2 = promisify(crypto.pbkdf2);

/**
 * Encrypt a string with a password.
 * 
 * @param {string} password - plain text password
 * @param {string} text - text to encrypt
 * @returns {string}
 */
export const encrypt = async (password, text) =>
  encryptIterations(password, ENCRYPTION_VERSION[CURRENT_VERSION].iterations, text);

/**
 * Encrypt a string with a password and a custom number of KDF iterations.
 * 
 * @param {string} password - plain text password
 * @param {number} iterations - iterations used to generate key
 * @param {string} text - text to encrypt
 * @returns {string}
 */
export const encryptIterations = async (password, iterations, text) => {
  if (typeof password !== "string" || password.length == 0) 
    throw new TypeError(`Invalid password: ${password}`);
  if (typeof iterations !== "number" || iterations <= 0 ) 
    throw new TypeError(`Invalid number of iterations: ${iterations}`);
  if (typeof text !== "string" || text.length == 0) 
    throw new TypeError(`Invalid text to encrypt: ${text}`);

  let version, salt, key, iv, cipher, cipherText, payload;

  version = ENCRYPTION_VERSION[CURRENT_VERSION]; 
  salt = crypto.randomBytes(version.saltLength);
  key = await pbkdf2(
    password, 
    salt, 
    iterations, 
    version.keyLength, 
    version.digestAlgorithm
  );

  iv = crypto.randomBytes(version.ivLength);
  cipher = crypto.createCipheriv(version.cipherAlgorithm, key, iv);
  cipherText = cipher.update(text);
  payload = Buffer.concat([cipherText, cipher.final()]);

  return [
    CURRENT_VERSION,
    `${salt.toString("hex")},${iterations},${iv.toString("hex")}`,
    payload.toString("hex")
  ].join(":");
}

const decrypt1 = async (password, manifest, payload) => {
  let version, tokens, salt, iterations, iv, key, decipher, decipherText;

  version = ENCRYPTION_VERSION["1"];

  tokens = manifest.split(",");
  salt = Buffer.from(tokens[0], "hex");
  iterations = parseInt(tokens[1], 10);
  iv = Buffer.from(tokens[2], "hex");

  key = await pbkdf2(
    password,
    salt,
    iterations,
    version.keyLength,
    version.digestAlgorithm,
  );

  decipher = crypto.createDecipheriv(version.cipherAlgorithm, key, iv);
  decipherText = decipher.update(Buffer.from(payload, "hex"));

  return Buffer
    .concat([decipherText, decipher.final()])
    .toString();
};

ENCRYPTION_VERSION["1"].decrypt = decrypt1;

/**
 * Decrypt a string encrypted with encrypt().
 * 
 * @param {string} password - password used to generate encryption key
 * @param {string} encrypted- string produced by encrypt()
 * @returns {string}
 */
export const decrypt = async (password, encrypted) => {
  if (typeof password !== "string" || password.length == 0) 
    throw new TypeError(`Invalid password: ${password}`);
  if (typeof encrypted !== "string" || encrypted.length == 0) 
    throw new TypeError(`Invalid encrypted text: ${encrypted}`);

  let cursor, next, i, fragment, version;

  cursor = 0;
  fragment = [];
  for (i = 0; i < 2; i++) {
    next = encrypted.indexOf(":", cursor);
    fragment.push(encrypted.slice(cursor, next));
    cursor = next + 1;
  }
  fragment.push(encrypted.slice(cursor));

  version = ENCRYPTION_VERSION[fragment[0]];
  if (!version) {
    throw new Error("String was encrypted with a newer version of @spaceaardvark/encrypt. Upgrade to decrypt this string.");
  }

  return await version.decrypt(password, fragment[1], fragment[2]);
};