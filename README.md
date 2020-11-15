# Encrypt

Encrypt and decrypt strings with a minimal interface.

```
  import { encrypt, decrypt } from "@spaceaardvark/encrypt";

  let password, text, encrypted;

  password = "Check under the couch cushion.";
  text = "I found my purpose.";

  encrypted = encrypt(password, text);
  decrypted = decrypt(password, encrypted);  // I found my purpose.
```

✅ Best practice usage of Node's `crypto` module.  
✅ Simple API.  
✅ Sensible defaults.  
✅ ES6 modules.  
✅ No dependencies.  
✅ Functional- and curry-friendly (data parameters last).  
✅ 100% unit test coverage.  
✅ Backwards-compatible encryption.  

## How it works

1. Generates a random salt value.
1. Derives a cryptographic key (sha256) from the password and the salt.
1. Generates a random initialization vector.
1. Encrypts the text (aes-256-cbc) using the key and the initialization vector.
1. Prefixes the algorithm names, salt, and initialization vector to the encrypted text so it can be decrypted with the same password.

You can override the default algorithms with `encryptWithSettings()`.

## Install

```bash
$ npm install --save @spaceaardvark/encrypt
```

```bash
$ yard add @spaceaardvark/encrypt
```

## API

## encrypt ⇒ <code>string</code>
Encrypt a string with a password.

**Kind**: global constant  
**Returns**: <code>string</code> - hashAlgo:encryptAlgo:salt:iv:payload  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>string</code> | plain text password |
| text | <code>string</code> | text to encrypt |

<a name="encryptWithSettings"></a>

## encryptWithSettings ⇒ <code>string</code>
Encrypt a string with a password using custom encryption settings.

**Kind**: global constant  
**Returns**: <code>string</code> - hashAlgo:encryptAlgo:salt:iv:payload  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>string</code> | plain text password |
| settings | [<code>EncryptionSettings</code>](#EncryptionSettings) | encryption settings |
| text | <code>string</code> | text to encrypt |

<a name="decrypt"></a>

## decrypt ⇒ <code>string</code>
Decrypt text encrypted with encrypt().

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>string</code> | password used to generate encryption key |
| encrypted- | <code>string</code> | string produced by encrypt() |

<a name="EncryptionSettings"></a>

## EncryptionSettings : <code>object</code>
Encryption settings. Will occasionally bump these to keep up with the times, but 
the library will always be backward-compatible because the information needed to
decrypt is included in the encrypted content.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| saltLength | <code>number</code> | length in bytes of salt |
| ivLength | <code>number</code> | length in bytes of initialization vector |
| hashAlgorithm | <code>string</code> | OpenSSL hash algorithm name |
| encryptAlgorithm | <code>string</code> | OpenSSL encryption algorithm name |
| manifestDelimiter | <code>string</code> | delimiter used in the encrypted manifest |



