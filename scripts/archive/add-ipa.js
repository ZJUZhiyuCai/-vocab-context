/**
 * 补充缺失的 IPA 音标
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { readJson, writeJson } from './ielts-rebuild-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REVIEWED_FILE = path.join(__dirname, '../data/ielts-core-500-reviewed.json');

// IPA 映射
const ipaMap = {
  // Verbs
  advocate: '/ˈædvəkeɪt/',
  acknowledge: '/əkˈnɒlɪdʒ/',
  elaborate: '/ɪˈlæbəreɪt/',
  fluctuate: '/ˈflʌktʃueɪt/',
  stabilize: '/ˈsteɪbəlaɪz/',
  escalate: '/ˈeskəleɪt/',
  diminish: '/dɪˈmɪnɪʃ/',
  prevail: '/prɪˈveɪl/',
  outweigh: '/aʊtˈweɪ/',
  expand: '/ɪkˈspænd/',
  amplify: '/ˈæmplɪfaɪ/',

  // Nouns
  legislation: '/ˌledʒɪsˈleɪʃn/',
  accountability: '/əˌkaʊntəˈbɪləti/',
  implication: '/ˌɪmplɪˈkeɪʃn/',
  deterrent: '/dɪˈterənt/',
  incentive: '/ɪnˈsentɪv/',
  precedent: '/ˈpresɪdənt/',
  disparity: '/dɪˈspærəti/',
  consensus: '/kənˈsensəs/',
  controversy: '/ˈkɒntrəvɜːsi/',
  stance: '/stæns/',
  discrepancy: '/dɪsˈkrepənsi/',
  enforcement: '/ɪnˈfɔːsmənt/',
  bureaucracy: '/bjʊˈrɒkrəsi/',
  democracy: '/dɪˈmɒkrəsi/',
  transparency: '/trænsˈpærənsi/',
  corruption: '/kəˈrʌpʃn/',
  intervention: '/ˌɪntəˈvenʃn/',
  subsidy: '/ˈsʌbsɪdi/',
  mortality: '/mɔːˈtæləti/',
  prevalence: '/ˈprevələns/',
  pandemic: '/pænˈdemɪk/',
  epidemic: '/ˌepɪˈdemɪk/',
  vaccination: '/ˌvæksɪˈneɪʃn/',
  immunity: '/ɪˈmjuːnəti/',

  // Adjectives
  negligible: '/ˈneɡlɪdʒəbl/',
  substantial: '/səbˈstænʃl/',
  insufficient: '/ˌɪnsəˈfɪʃnt/',
  contentious: '/kənˈtenʃəs/',
  divergent: '/daɪˈvɜːdʒənt/',
  sustainable: '/səˈsteɪnəbl/',
  favorable: '/ˈfeɪvərəbl/',
  constructive: '/kənˈstrʌktɪv/',
  productive: '/prəˈdʌktɪv/',
  fruitful: '/ˈfruːtfl/',
  counterproductive: '/ˌkaʊntəprəˈdʌktɪv/',
  undesirable: '/ˌʌndɪˈzaɪərəbl/',
  decisive: '/dɪˈsaɪsɪv/',
  influential: '/ˌɪnfluˈenʃl/',
  prominent: '/ˈprɒmɪnənt/',
  excessive: '/ɪkˈsesɪv/',
  moderate: '/ˈmɒdərət/',
  declining: '/dɪˈklaɪnɪŋ/',
  adverse: '/ˈædvɜːs/',
  compulsory: '/kəmˈpʌlsəri/',
  vocational: '/vəʊˈkeɪʃənl/',
  standardized: '/ˈstændədaɪzd/',
  renewable: '/rɪˈnjuːəbl/',
  biodegradable: '/ˌbaɪəʊdɪˈɡreɪdəbl/',
  comparable: '/ˈkɒmpərəbl/',
  imperative: '/ɪmˈperətɪv/',
  indispensable: '/ˌɪndɪˈspensəbl/',

  // Others
  surge: '/sɜːdʒ/',
  soar: '/sɔːr/',
  mounting: '/ˈmaʊntɪŋ/',
  subside: '/səbˈsaɪd/',
  waning: '/ˈweɪnɪŋ/',
  shrinking: '/ˈʃrɪŋkɪŋ/'
};

function addIpa() {
  const data = readJson(REVIEWED_FILE);
  let addedCount = 0;
  const added = [];

  data.candidates.forEach(entry => {
    if (!entry.approved) return;

    const ipa = ipaMap[entry.key];
    if (ipa && !entry.ipa) {
      entry.ipa = ipa;
      addedCount++;
      added.push(entry.key);
    }
  });

  writeJson(REVIEWED_FILE, data);

  console.log('\n=== IPA Addition ===\n');
  console.log(`Total entries updated: ${addedCount}`);
  console.log('\nAdded IPA for:');
  added.forEach(word => console.log(`  - ${word}: ${ipaMap[word]}`));

  return { addedCount, added };
}

addIpa();