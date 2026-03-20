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

  // Test 4: French grammar enrichment
  try {
    console.log('Test 4: French grammar enrichment on /api/translate');
    const response = await axios.post(`${BASE_URL}/api/translate`, {
      word: 'book',
      targetLanguage: 'fr'
    });
    if (response.data.success && response.data.frenchGrammar && 'plural' in response.data.frenchGrammar) {
      console.log(`✅ PASSED - frenchGrammar returned: gender=${response.data.frenchGrammar.gender}, plural=${response.data.frenchGrammar.plural}\n`);
      passed++;
    } else {
      console.log('❌ FAILED - frenchGrammar missing in French translation response\n');
      failed++;
    }
  } catch (error) {
    console.log(`❌ FAILED - French grammar enrichment error: ${error.message}\n`);
    failed++;
  }

  // Test 5: French grammar — single plural when MT returns slash-separated glosses
  try {
    console.log('Test 5: French grammar for "air conditioner" (no multi-part plural string)');
    const response = await axios.post(`${BASE_URL}/api/translate`, {
      word: 'air conditioner',
      targetLanguage: 'fr'
    });
    const fg = response.data.frenchGrammar;
    const plural = fg && fg.plural ? String(fg.plural) : '';
    const bad = plural.includes('/') || plural.includes(';') || plural.includes('|');
    if (response.data.success && fg && plural && !bad && fg.lemma) {
      console.log(
        `✅ PASSED - lemma=${fg.lemma}, plural=${fg.plural}, disambiguated=${fg.disambiguated}\n`
      );
      passed++;
    } else {
      console.log(
        `❌ FAILED - expected single plural + lemma, got plural="${plural}" lemma=${fg && fg.lemma}\n`
      );
      failed++;
    }
  } catch (error) {
    console.log(`❌ FAILED - Air conditioner French grammar error: ${error.message}\n`);
    failed++;
  }

  // Test 6: Get Languages
  try {
    console.log('Test 6: Get Supported Languages');
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

  // Test 7: Missing Parameters
  try {
    console.log('Test 7: Missing Parameters (should fail gracefully)');
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
