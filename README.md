# Encrypt

Encrypt and decrypt strings with a minimal interface.

## Features

☑ Best practice usage of Node's `crypto` module.  
☑ Simple API.  
☑ Sensible defaults.  
☑ ES6 modules.  
☑ No dependencies.  
☑ Functional- and curry-friendly (data parameters last).  
☑ 100% unit test coverage.  
☑ Backwards-compatible encryption.  

## Install

```shellscript
$ npm install --save @spaceaardvark/encrypt
```

```shellscript
$ yard add @spaceaardvark/encrypt
```

This library requires Node.js 14+ for ES6 module support.

## Usage

```javascript
  import { encrypt, decrypt } from "@spaceaardvark/encrypt";

  let password, text, encrypted;

  password = "Check under the couch cushion.";
  text = "I found my purpose.";

  encrypted = encrypt(password, text);
  decrypted = decrypt(password, encrypted);  // I found my purpose.
```

## How it works

1. Generates a random salt value.
1. Derives a cryptographic key (sha256) from the password and the salt.
1. Generates a random initialization vector.
1. Encrypts the text (aes-256-cbc) using the key and the initialization vector.
1. Prefixes the algorithm names, salt, and initialization vector to the encrypted text so it can be decrypted with the same password.

You can override the default algorithms with `encryptWithSettings()`.

## API

### Functions

<dl>
<dt><a href="#encrypt">encrypt(password, text)</a> ⇒ <code>string</code></dt>
<dd><p>Encrypt a string with a password.</p>
</dd>
<dt><a href="#encryptWithSettings">encryptWithSettings(password, settings, text)</a> ⇒ <code>string</code></dt>
<dd><p>Encrypt a string with a password using custom encryption settings.</p>
</dd>
<dt><a href="#decrypt">decrypt(password, encrypted-)</a> ⇒ <code>string</code></dt>
<dd><p>Decrypt text encrypted with encrypt().</p>
</dd>
</dl>

### Types

<dl>
<dt><a href="#EncryptionSettings">EncryptionSettings</a> : <code>object</code></dt>
<dd><p>Encryption settings. Will occasionally bump these to keep up with the times, but 
the library will always be backward-compatible because the information needed to
decrypt is included in the encrypted content.</p>
</dd>
</dl>

<a name="encrypt"></a>

### encrypt(password, text) ⇒ <code>string</code>
Encrypt a string with a password.

**Returns**: <code>string</code> - hashAlgo:encryptAlgo:salt:iv:payload  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>string</code> | plain text password |
| text | <code>string</code> | text to encrypt |

<a name="encryptWithSettings"></a>

### encryptWithSettings(password, settings, text) ⇒ <code>string</code>
Encrypt a string with a password using custom encryption settings.

**Returns**: <code>string</code> - hashAlgo:encryptAlgo:salt:iv:payload  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>string</code> | plain text password |
| settings | [<code>EncryptionSettings</code>](#EncryptionSettings) | encryption settings |
| text | <code>string</code> | text to encrypt |

<a name="decrypt"></a>

### decrypt(password, encrypted-) ⇒ <code>string</code>
Decrypt text encrypted with encrypt().

| Param | Type | Description |
| --- | --- | --- |
| password | <code>string</code> | password used to generate encryption key |
| encrypted- | <code>string</code> | string produced by encrypt() |

<a name="EncryptionSettings"></a>

### EncryptionSettings : <code>object</code>
Encryption settings. Will occasionally bump these to keep up with the times, but 
the library will always be backward-compatible because the information needed to
decrypt is included in the encrypted content.

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| saltLength | <code>number</code> | length in bytes of salt |
| ivLength | <code>number</code> | length in bytes of initialization vector |
| hashAlgorithm | <code>string</code> | OpenSSL hash algorithm name |
| encryptAlgorithm | <code>string</code> | OpenSSL encryption algorithm name |
| manifestDelimiter | <code>string</code> | delimiter used in the encrypted manifest |

## Contributing

Be sure to create an issue before you submit a change request. Requests to expand the
minimal interface will be politely and graciously declined, but anything else is fair
game.

The library does not require a build step and is easy to test. See the `scripts` 
section in `package.json` for more information.