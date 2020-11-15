## Constants

<dl>
<dt><a href="#encrypt">encrypt</a> ⇒ <code>string</code></dt>
<dd><p>Encrypt a string with a password.</p>
</dd>
<dt><a href="#encryptWithSettings">encryptWithSettings</a> ⇒ <code>string</code></dt>
<dd><p>Encrypt a string with a password using custom encryption settings.</p>
</dd>
<dt><a href="#decrypt">decrypt</a> ⇒ <code>string</code></dt>
<dd><p>Decrypt text encrypted with encrypt().</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#EncryptionSettings">EncryptionSettings</a> : <code>object</code></dt>
<dd><p>Encryption settings. Will occasionally bump these to keep up with the times, but 
the library will always be backward-compatible because the information needed to
decrypt is included in the encrypted content.</p>
</dd>
</dl>

<a name="encrypt"></a>

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

