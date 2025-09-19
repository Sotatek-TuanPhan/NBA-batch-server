const https = require('https');
const http = require('http');

/**
 * API Utilities for handling base64-encoded JSON responses
 */
class KyodoApiFetcher {
  /**
   * Decode base64 content and parse as JSON
   * @param {string} base64Content - Base64 encoded string
   * @returns {Object} Parsed JSON object
   */
  static decodeBase64Json(base64Content) {
    try {
      const decodedContent = Buffer.from(base64Content, 'base64').toString('utf-8');
      return JSON.parse(decodedContent);
    } catch (error) {
      console.error('Error decoding base64 JSON content:', error);
      throw new Error('Failed to decode base64 JSON content');
    }
  }

  /**
   * Make HTTP request using Node's built-in modules
   * @param {string} url - Request URL
   * @returns {Promise<Object>} Response data
   */
  static async makeHttpRequest(url) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const client = urlObj.protocol === 'https:' ? https : http;

      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
      };

      const req = client.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            reject(new Error(`Failed to parse JSON response: ${error.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.setTimeout(30000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  /**
   * Fetch data from URL and return decoded JSON
   * @param {string} url - API endpoint URL
   * @returns {Promise<Object>} Decoded JSON data
   */
  static async fetchData(url, maxRetries = 3) {
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const schema = url.split('/').pop().split('.').shift();

      console.log(`Starting fetch ${schema} schema attempt ${attempt}/${maxRetries}`);

      try {
        console.log(`Fetching data: ${url}`);

        const responseData = await this.makeHttpRequest(url);

        // Validate response structure
        if (!responseData || typeof responseData.content !== 'string') {
          throw new Error('Invalid response structure: missing or invalid content field');
        }

        // Decode base64 content and return directly
        const decodedData = this.decodeBase64Json(responseData.content);

        console.log(`Data fetched successfully from ${url}`);
        return {data: decodedData, attempt: attempt};
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempt} failed:`, error.message);

        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // 指数バックオフ
          console.log(`Retrying in ${delay}ms...`);
          await sleep(delay);
        }
      }
    }
    console.error('All retry attempts failed:', lastError.message);
  }
}

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @return {Promise} - Promise that resolves after the specified time
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = KyodoApiFetcher;
