import crypto from "crypto";

/**
 * Encryption settings. Will occasionally bump these to keep up with the times, but 
 * the library will always be backward-compatible because the information needed to
 * decrypt is included in the encrypted content.
 * 
 * @typedef EncryptionSettings
 * @type {object}
 * @property {number} saltLength - length in bytes of salt
 * @property {number} ivLength - length in bytes of initialization vector
 * @property {string} hashAlgorithm - OpenSSL hash algorithm name
 * @property {string} encryptAlgorithm - OpenSSL encryption algorithm name
 * @property {string} manifestDelimiter - delimiter used in the encrypted manifest
 */
export const DEFAULT_SETTINGS = {
  saltLength: 8,
  ivLength: 16,
  hashAlgorithm: "sha256",
  encryptAlgorithm: "aes-256-cbc",
  manifestDelimiter: ":",
};

/**
 * Format of encrypted text produced by encrypt().
 * 
 * @typedef emptyEncryptionBlock
 * @type {object}
 * @property {string} hashAlgorithm - OpenSSL hash algorithm name
 * @property {string} encryptAlgorithm - OpenSSL encryption algorithm name
 * @property {string} salt - value used to create key
 * @property {string} iv - initialization vector used to create cipher
 * @property {string} payload - encrypted text
 */
const emptyEncryptionBlock = {
  hashAlgorithm: null,
  encryptAlgorithm: null,
  salt: null,
  iv: null,
  payload: null,
};

/**
 * Generate a random salt value.
 * 
 * @returns {string}
 */
const generateSalt = () =>
  crypto
    .randomBytes(DEFAULT_SETTINGS.saltLength)
    .toString("hex");

/**
 * Generate a random initialization vector.
 * 
 * @returns {string}
 */
const generateIV = () =>
  crypto
    .randomBytes(DEFAULT_SETTINGS.ivLength)
    .toString("hex");

/**
 * Generate a key using a passwora and a salt value.
 * 
 * @param {string} password - plain text password
 * @param {strint} salt - random salt value
 * @returns {Buffer}
 */
const generateKey = (password, salt) =>
  crypto
    .createHmac(DEFAULT_SETTINGS.hashAlgorithm, salt)
    .update(password)
    .digest();

/**
 * Parse the encryption block produced by encrypt().
 * 
 * @param {string} encrypted - string produced by encrypt()
 * @returns {EncryptionBlock}
 */
const parseEncrypted = (encrypted) => {
  let cursor, tokens, nextDelimiter;

  cursor = 0;
  tokens = []

  for (let i = 0; i < 4; i++) {
    nextDelimiter = encrypted.indexOf(DEFAULT_SETTINGS.manifestDelimiter, cursor);
    tokens.push(encrypted.slice(cursor, nextDelimiter));
    cursor = nextDelimiter + 1;
  }

  return {
    hashAlgorithm: tokens[0],
    encryptAlgorithm: tokens[1],
    salt: tokens[2],
    iv: tokens[3],
    payload: encrypted.slice(cursor),
  }
}

/**
 * Encrypt a string with a password.
 * 
 * @param {string} password - plain text password
 * @param {string} text - text to encrypt
 * @param {EncryptionSettings} [settings] - if you insist on overriding the defaults
 * @returns {EncryptionBlock}
 */
export const encrypt = (password, text) => {
  let block, key, cipher, cipherText;

  block = {
    ...emptyEncryptionBlock,
    hashAlgorithm: DEFAULT_SETTINGS.hashAlgorithm,
    encryptAlgorithm: DEFAULT_SETTINGS.encryptAlgorithm,
    salt: generateSalt(),
    iv: generateIV(),
  };

  key = generateKey(password, block.salt);

  cipher = crypto.createCipheriv(
    block.encryptAlgorithm, 
    key, 
    Buffer.from(block.iv, "hex"));
  cipherText = cipher.update(text);

  block.payload = Buffer
    .concat([cipherText, cipher.final()])
    .toString("hex");

  return [
    block.hashAlgorithm,
    block.encryptAlgorithm,
    block.salt,
    block.iv,
    block.payload,
  ].join(DEFAULT_SETTINGS.manifestDelimiter);
}

/**
 * Decrypt text encrypted with encrypt().
 * 
 * @param {string} password - password used to generate encryption key
 * @param {string} encrypted- string produced by encrypt()
 * @returns {string}
 */
export const decrypt = (password, encrypted) => {
  let block, key, decipher, decipherText;

  block = parseEncrypted(encrypted);
  key = generateKey(password, block.salt);

  decipher = crypto.createDecipheriv(
    block.encryptAlgorithm, 
    key, 
    Buffer.from(block.iv, "hex"));
  decipherText = decipher.update(Buffer.from(block.payload, "hex"));

  return Buffer
    .concat([decipherText, decipher.final()])
    .toString();
};

export const internals = {
  generateSalt,
  generateIV,
  generateKey,
  parseEncrypted,
};