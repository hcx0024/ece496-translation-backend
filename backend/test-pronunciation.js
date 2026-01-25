const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testPronunciation() {
  console.log('🧪 Testing Pronunciation Endpoint\n');
  
  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.status);
    console.log('');
    
    // Test 2: Get pronunciation for Spanish word
    console.log('2️⃣ Testing pronunciation for "hola" in Spanish...');
    const pronunciationResponse = await axios.post(`${BASE_URL}/api/pronunciation`, {
      word: 'hola',
      language: 'es'
    });
    
    console.log('✅ Pronunciation response:');
    console.log('   Word:', pronunciationResponse.data.word);
    console.log('   Language:', pronunciationResponse.data.language);
    console.log('   Audio URL:', pronunciationResponse.data.audioUrl);
    console.log('   Format:', pronunciationResponse.data.format);
    console.log('');
    
    // Test 3: Get pronunciation for French word
    console.log('3️⃣ Testing pronunciation for "bonjour" in French...');
    const frenchResponse = await axios.post(`${BASE_URL}/api/pronunciation`, {
      word: 'bonjour',
      language: 'fr'
    });
    
    console.log('✅ French pronunciation:');
    console.log('   Audio URL:', frenchResponse.data.audioUrl);
    console.log('');
    
    // Test 4: Test error handling (missing fields)
    console.log('4️⃣ Testing error handling (missing word)...');
    try {
      await axios.post(`${BASE_URL}/api/pronunciation`, {
        language: 'es'
      });
      console.log('❌ Should have returned an error');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Error handling works correctly');
        console.log('   Error message:', error.response.data.message);
      } else {
        throw error;
      }
    }
    
    console.log('\n🎉 All pronunciation tests passed!');
    console.log('\n📝 To test the audio URL:');
    console.log('   Open this URL in your browser:');
    console.log(`   ${pronunciationResponse.data.audioUrl}`);
    console.log('\n   Or use this curl command:');
    console.log(`   curl "${pronunciationResponse.data.audioUrl}" --output test-pronunciation.mp3`);
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Server is not running!');
      console.error('   Please start the server first:');
      console.error('   cd backend && npm start');
    } else {
      console.error('❌ Test failed:', error.message);
      if (error.response) {
        console.error('   Status:', error.response.status);
        console.error('   Data:', error.response.data);
      }
    }
    process.exit(1);
  }
}

testPronunciation();
