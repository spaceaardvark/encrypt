declare module "@spaceaardvark/encrypt" {
  /**
   * Encrypt a string with a password.
   * 
   * @param {string} password - plain text password
   * @param {string} text - text to encrypt
   * @returns {string}
   */
  export function encrypt(
    password: string,
    text: string,
  ): string;
  /**
   * Encrypt a string with a password and a custom number of KDF iterations.
   * 
   * @param {string} password - plain text password
   * @param {number} iterations - iterations used to generate key
   * @param {string} text - text to encrypt
   * @returns {string}
   */
  export function encryptIterations(
    password: string,
    iterations: number,
    text: string,
  ): string;
  /**
   * Decrypt a string encrypted with encrypt().
   * 
   * @param {string} password - password used to generate encryption key
   * @param {string} encrypted- string produced by encrypt()
   * @returns {string}
   */
  export function decrypt(
    password: string,
    encrypted: string,
  ): string;
}