[![Build Status](https://travis-ci.com/spaceaardvark/encrypt.svg?branch=main)](https://travis-ci.com/spaceaardvark/encrypt)

# Encrypt

Encrypt and decrypt strings with a minimal interface. Designed for encrypting sensitive
strings and files with cryptographic best practices. 

<p style="font-size: 80%">&gt; NOT designed for storing passwords. See 
https://crackstation.net/hashing-security.htm.</p>

## Features

:heavy_check_mark: Best practice cryptography.  
:heavy_check_mark: Simple API.  
:heavy_check_mark: ES6 modules.  
:heavy_check_mark: No dependencies.  
:heavy_check_mark: Functional- and curry-friendly (data parameters last).  
:heavy_check_mark: 100% unit test coverage.  
:heavy_check_mark: Backward-compatible encryption.  

## Install

Requires Node.js v14 or higher.

```shell
$ npm install --save @spaceaardvark/encrypt
```

```shell
$ yarn add @spaceaardvark/encrypt
```

## Usage

```javascript
import { encrypt, decrypt } from "@spaceaardvark/encrypt";

let password, text, encrypted;

password = "Check under the couch cushion.";
text = "I found my purpose.";

encrypted = await encrypt(password, text);
decrypted = await decrypt(password, encrypted);  // I found my purpose.
```

## Cryptography

* Key derivation function (KDF): PBKDF2, SHA256, `crypto.pbkdf2()`
* Salt: random, `crypto.randomBytes()`
* Iterations: customizable, default is 5,000 (see next section)
* Cipher algorithm: AES-256-CBC, `crypto.createCipheriv()`
* Initialization vector: random, `crypto.randomBytes()`
* Encrypted format: `kdf(params):cipher(params):payload`

The password is combined with a random salt to produce a key. The key is combined with 
a random initialization vector to produce the encrypted text. The final, encrypted 
text is prefixed with the algorithm parameters for reliable, backward-compatible 
decryption. (The parameters included in the encrypted format are "public" and do not 
compromise the strength of the encryption.)

## Iterations

The strength of the encryption is largely determined by the number of iterations used
to transform the password into a cryptographic key. Generating the key over and over 
is called key stretching and is discussed at length 
[here](https://crackstation.net/hashing-security.htm).

The `encrypt()` function uses 5,000 iterations. You can adjust this number by calling
`encryptIterations()` instead.

| Iterations | Encryption speed | Dictionary and brute-force attacks |
| ---------- | ---------------- | --------------------------------------------------- |
| :arrow_up: higher | :snail: slower | :lock: decreases vulnerability |
| :arrow_down: lower | :zap: faster | :warning: increases vulnerability |

**How many iterations should you use**? As many as you can without creating (1) a 
negative user experience and/or (2) unacceptable strain on your hardware. Run tests on 
your *production* hardware to find the right threshold.

## API

---

### async encrypt(password, text)

Encrypts a string with a password.

**password**: string - plain text password

**text**: string - plain text to encrypt

**returns**: string - encryption paramters prefixed to encrypted text

---

### async encryptIterations(password, iterations, text)

Encrypts a string with a password using n iterations to generate the key.

**password**: string - plain text password

**iterations**: number - number of iterations to generate the key

**text**: string - plain text to encrypt

**returns**: string - encryption paramters prefixed to encrypted text

---

### async decrypt(password, encrypted)

Decrypts an encrypted string produced by `encrypt()`.

**password**: string - plain text password

**encrypted**: string - string produced by `encrypt()`

**returns**: string - original plain text

---

## Contributing

Be sure to create an issue before you submit a change request. Requests to expand the
minimal interface will be politely and graciously declined, but anything else is fair
game.

The library does not require a build step and is easy to test. See the `scripts` 
section in `package.json` for more information.