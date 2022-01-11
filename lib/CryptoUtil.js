const crypto = require('crypto');

const iv = 'ha.homeassistant'

/**
 * @util 加密、解密工具类
 */
class CryptoUtil {

    /**
     * 解密
     * @param dataStr {string}
     * @param key {string}
     * @param iv {string}
     * @return {string}
     */
    static decrypt(dataStr, key) {
        let cipherChunks = [];
        let decipher = crypto.createDecipheriv('aes-128-cbc', CryptoUtil.md5_16(key), iv);
        decipher.setAutoPadding(true);
        cipherChunks.push(decipher.update(dataStr, 'base64', 'utf8'));
        cipherChunks.push(decipher.final('utf8'));
        return cipherChunks.join('');
    }

    /**
     * 加密
     * @param dataStr {string}
     * @param key {string}
     * @param iv {string}
     * @return {string}
     */
    static encrypt(dataStr, key) {
        let cipherChunks = [];
        let cipher = crypto.createCipheriv('aes-128-cbc', CryptoUtil.md5_16(key), iv);
        cipher.setAutoPadding(true);
        cipherChunks.push(cipher.update(dataStr, 'utf8', 'base64'));
        cipherChunks.push(cipher.final('base64'));
        return cipherChunks.join('');
    }

    static md5_16(text) {
        return crypto.createHash('md5').update(text).digest("hex").substring(8, 24);
    }

    static md5(text) {
        return crypto.createHash('md5').update(text).digest("hex")
    }
}

module.exports = CryptoUtil;