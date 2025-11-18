// Simple test script to verify the API works
const axios = require('axios');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

console.log('🧪 Testing Translation API...\n');
console.log(`Base URL: ${BASE_URL}\n`);

async function runTests() {
  let passed = 0;
  let failed = 0;

  // Test 1: Health Check
  try {
    console.log('Test 1: Health Check');
    const response = await axios.get(`${BASE_URL}/health`);
    if (response.data.status === 'healthy') {
      console.log('✅ PASSED - Health check returned healthy status\n');
      passed++;
    } else {
      console.log('❌ FAILED - Health check did not return healthy status\n');
      failed++;
    }
  } catch (error) {
    console.log(`❌ FAILED - Health check error: ${error.message}\n`);
    failed++;
  }

  // Test 2: Translation (Spanish)
  try {
    console.log('Test 2: Translate "hello" to Spanish');
    const response = await axios.post(`${BASE_URL}/api/translate`, {
      word: 'hello',
      targetLanguage: 'es'
    });
    if (response.data.success && response.data.translated) {
      console.log(`✅ PASSED - Translation: "${response.data.original}" → "${response.data.translated}"\n`);
      passed++;
    } else {
      console.log('❌ FAILED - Translation did not return expected format\n');
      failed++;
    }
  } catch (error) {
    console.log(`❌ FAILED - Translation error: ${error.message}\n`);
    failed++;
  }

  // Test 3: Translation (French)
  try {
    console.log('Test 3: Translate "goodbye" to French');
    const response = await axios.post(`${BASE_URL}/api/translate`, {
      word: 'goodbye',
      targetLanguage: 'fr'
    });
    if (response.data.success && response.data.translated) {
      console.log(`✅ PASSED - Translation: "${response.data.original}" → "${response.data.translated}"\n`);
      passed++;
    } else {
      console.log('❌ FAILED - Translation did not return expected format\n');
      failed++;
    }
  } catch (error) {
    console.log(`❌ FAILED - Translation error: ${error.message}\n`);
    failed++;
  }

  // Test 4: Get Languages
  try {
    console.log('Test 4: Get Supported Languages');
    const response = await axios.get(`${BASE_URL}/api/languages`);
    if (response.data.success && Array.isArray(response.data.languages)) {
      console.log(`✅ PASSED - Found ${response.data.languages.length} supported languages\n`);
      passed++;
    } else {
      console.log('❌ FAILED - Languages endpoint did not return expected format\n');
      failed++;
    }
  } catch (error) {
    console.log(`❌ FAILED - Languages error: ${error.message}\n`);
    failed++;
  }

  // Test 5: Missing Parameters
  try {
    console.log('Test 5: Missing Parameters (should fail gracefully)');
    const response = await axios.post(`${BASE_URL}/api/translate`, {
      word: 'hello'
      // Missing targetLanguage
    });
    console.log('❌ FAILED - Should have returned 400 error\n');
    failed++;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ PASSED - Correctly returned 400 error for missing parameters\n');
      passed++;
    } else {
      console.log(`❌ FAILED - Wrong error response: ${error.message}\n`);
      failed++;
    }
  }

  // Summary
  console.log('='.repeat(50));
  console.log('📊 Test Summary');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total: ${passed + failed}`);
  console.log('='.repeat(50));

  if (failed === 0) {
    console.log('\n🎉 All tests passed! Your API is working correctly.\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.\n');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error running tests:', error.message);
  process.exit(1);
});
