const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test cases covering different scenarios
const testCases = [
  // Common nouns
  { word: 'apple', type: 'noun', description: 'Common noun' },
  { word: 'book', type: 'noun', description: 'Common noun' },
  { word: 'computer', type: 'noun', description: 'Common noun' },
  
  // Verbs
  { word: 'run', type: 'verb', description: 'Action verb' },
  { word: 'think', type: 'verb', description: 'Mental verb' },
  { word: 'create', type: 'verb', description: 'Verb ending in -ate' },
  { word: 'jumping', type: 'verb', description: 'Verb ending in -ing' },
  
  // Adjectives
  { word: 'beautiful', type: 'adjective', description: 'Adjective ending in -ful' },
  { word: 'happy', type: 'adjective', description: 'Common adjective' },
  { word: 'amazing', type: 'adjective', description: 'Adjective ending in -ing' },
  { word: 'colorful', type: 'adjective', description: 'Adjective ending in -ful' },
  
  // Multi-word phrases
  { word: 'sports car', type: 'phrase', description: 'Two-word phrase' },
  { word: 'coffee shop', type: 'phrase', description: 'Two-word phrase' },
  
  // Abstract concepts
  { word: 'freedom', type: 'noun', description: 'Abstract noun' },
  { word: 'happiness', type: 'noun', description: 'Abstract noun ending in -ness' },
  
  // Technical terms
  { word: 'algorithm', type: 'noun', description: 'Technical noun' },
  { word: 'database', type: 'noun', description: 'Compound noun' },
  
  // Words that might not be in dictionary (to test fallback)
  { word: 'xyztest123', type: 'unknown', description: 'Non-existent word (fallback test)' },
];

async function testExampleSentence(word, description) {
  try {
    const response = await axios.post(`${BASE_URL}/api/translate-with-example`, {
      word: word,
      targetLanguage: 'es'
    }, { timeout: 15000 });

    const example = response.data.exampleSentence;
    const source = example.source;
    const originalExample = example.original;
    const translatedExample = example.translated;
    
    // Analyze example quality
    const containsWord = originalExample.toLowerCase().includes(word.toLowerCase());
    const length = originalExample.length;
    const isShort = length < 100;
    const isReasonable = length >= 15 && length <= 150;
    
    return {
      word,
      description,
      success: true,
      example: originalExample,
      translated: translatedExample,
      source,
      quality: {
        containsWord,
        length,
        isShort,
        isReasonable
      }
    };
  } catch (error) {
    return {
      word,
      description,
      success: false,
      error: error.message
    };
  }
}

async function runAllTests() {
  console.log('🧪 Testing Example Sentence Quality Improvements\n');
  console.log('=' .repeat(80));
  console.log('');
  
  const results = [];
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`[${i + 1}/${testCases.length}] Testing: "${testCase.word}" (${testCase.description})`);
    
    const result = await testExampleSentence(testCase.word, testCase.description);
    results.push(result);
    
    if (result.success) {
      const quality = result.quality;
      const qualityScore = [
        quality.containsWord ? '✅' : '⚠️',
        quality.isReasonable ? '✅' : '⚠️',
        result.source === 'dictionary' ? '📚' : '🔧'
      ].join(' ');
      
      console.log(`   Example: "${result.example}"`);
      console.log(`   Translated: "${result.translated}"`);
      console.log(`   Source: ${result.source} ${qualityScore}`);
      console.log(`   Length: ${quality.length} chars | Contains word: ${quality.containsWord ? 'Yes' : 'No'}`);
    } else {
      console.log(`   ❌ Error: ${result.error}`);
    }
    
    console.log('');
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Summary
  console.log('=' .repeat(80));
  console.log('\n📊 SUMMARY\n');
  
  const successful = results.filter(r => r.success);
  const dictionaryExamples = successful.filter(r => r.source === 'dictionary');
  const generatedExamples = successful.filter(r => r.source === 'generated');
  const containsWord = successful.filter(r => r.quality.containsWord);
  const reasonableLength = successful.filter(r => r.quality.isReasonable);
  
  console.log(`Total tests: ${testCases.length}`);
  console.log(`✅ Successful: ${successful.length}`);
  console.log(`❌ Failed: ${results.length - successful.length}`);
  console.log('');
  console.log(`📚 Dictionary examples: ${dictionaryExamples.length} (${Math.round(dictionaryExamples.length / successful.length * 100)}%)`);
  console.log(`🔧 Generated examples: ${generatedExamples.length} (${Math.round(generatedExamples.length / successful.length * 100)}%)`);
  console.log('');
  console.log(`✅ Examples containing word: ${containsWord.length} (${Math.round(containsWord.length / successful.length * 100)}%)`);
  console.log(`✅ Reasonable length (15-150 chars): ${reasonableLength.length} (${Math.round(reasonableLength.length / successful.length * 100)}%)`);
  console.log('');
  
  // Quality breakdown by source
  if (dictionaryExamples.length > 0) {
    const dictContainsWord = dictionaryExamples.filter(r => r.quality.containsWord).length;
    const dictReasonable = dictionaryExamples.filter(r => r.quality.isReasonable).length;
    console.log('📚 Dictionary Examples Quality:');
    console.log(`   Contains word: ${dictContainsWord}/${dictionaryExamples.length} (${Math.round(dictContainsWord / dictionaryExamples.length * 100)}%)`);
    console.log(`   Reasonable length: ${dictReasonable}/${dictionaryExamples.length} (${Math.round(dictReasonable / dictionaryExamples.length * 100)}%)`);
    console.log('');
  }
  
  if (generatedExamples.length > 0) {
    const genContainsWord = generatedExamples.filter(r => r.quality.containsWord).length;
    const genReasonable = generatedExamples.filter(r => r.quality.isReasonable).length;
    console.log('🔧 Generated Examples Quality:');
    console.log(`   Contains word: ${genContainsWord}/${generatedExamples.length} (${Math.round(genContainsWord / generatedExamples.length * 100)}%)`);
    console.log(`   Reasonable length: ${genReasonable}/${generatedExamples.length} (${Math.round(genReasonable / generatedExamples.length * 100)}%)`);
    console.log('');
  }
  
  // Show best examples
  console.log('⭐ BEST EXAMPLES (Dictionary, Contains Word, Reasonable Length):');
  const bestExamples = successful
    .filter(r => r.source === 'dictionary' && r.quality.containsWord && r.quality.isReasonable)
    .slice(0, 5);
  
  bestExamples.forEach((r, i) => {
    console.log(`   ${i + 1}. "${r.word}" → "${r.example}" (${r.quality.length} chars)`);
  });
  
  console.log('');
}

// Run tests
runAllTests().catch(error => {
  console.error('❌ Test suite failed:', error.message);
  if (error.code === 'ECONNREFUSED') {
    console.error('   Server is not running! Start it with: npm start');
  }
  process.exit(1);
});
