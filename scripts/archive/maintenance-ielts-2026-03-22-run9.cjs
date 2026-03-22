const fs = require('fs');
const path = require('path');

const reviewedPath = path.join(__dirname, '..', 'data', 'ielts-core-500-reviewed.json');
const reviewed = JSON.parse(fs.readFileSync(reviewedPath, 'utf8'));

const updates = {
  essential: {
    editorContexts: [
      { kind: 'reading', text: 'Regular feedback is essential if students are expected to improve steadily over time.', translation: '', purpose: 'core' },
      { kind: 'writing', text: 'It is essential for education systems to provide equal access to qualified teachers and learning materials.', translation: '', purpose: 'near-transfer' },
      { kind: 'speaking', text: 'I think time-management skills are essential for university students because the workload is often heavy.', translation: '', purpose: 'far-transfer' }
    ],
    editorProductionPrompt: 'Use "essential" in one IELTS-style sentence about a skill, service, or condition that is necessary for success.'
  },
  integrated: {
    editorContexts: [
      { kind: 'reading', text: 'The city introduced an integrated transport system that connects buses, trains, and bike-sharing services.', translation: '', purpose: 'core' },
      { kind: 'writing', text: 'An integrated approach to urban planning can reduce congestion while improving access to public services.', translation: '', purpose: 'near-transfer' },
      { kind: 'speaking', text: 'I prefer integrated apps because they allow people to study, communicate, and organise tasks in one place.', translation: '', purpose: 'far-transfer' }
    ],
    editorProductionPrompt: 'Use "integrated" in one IELTS-style sentence about systems, services, or planning that work together effectively.'
  },
  adventurous: {
    editorContexts: [
      { kind: 'reading', text: 'Younger travellers are often more adventurous when choosing destinations or trying unfamiliar food.', translation: '', purpose: 'core' },
      { kind: 'writing', text: 'Tourism campaigns can attract adventurous visitors by promoting less conventional cultural experiences.', translation: '', purpose: 'near-transfer' },
      { kind: 'speaking', text: 'I would describe myself as fairly adventurous because I enjoy trying new activities when I travel.', translation: '', purpose: 'far-transfer' }
    ],
    editorProductionPrompt: 'Use "adventurous" in one IELTS-style sentence about travel, lifestyle, or trying new experiences.'
  },
  alienated: {
    editorContexts: [
      { kind: 'reading', text: 'Some employees feel alienated when their work is repetitive and they have little control over decisions.', translation: '', purpose: 'core' },
      { kind: 'writing', text: 'Employers should improve communication so that remote staff do not become alienated from the rest of the team.', translation: '', purpose: 'near-transfer' },
      { kind: 'speaking', text: 'People can feel alienated in large cities if they do not have a strong social network.', translation: '', purpose: 'far-transfer' }
    ],
    editorProductionPrompt: 'Use "alienated" in one IELTS-style sentence about feeling isolated at work or in society.'
  },
  experienced: {
    editorContexts: [
      { kind: 'reading', text: 'Hospitals in rural areas often struggle to attract experienced doctors and nurses.', translation: '', purpose: 'core' },
      { kind: 'writing', text: 'Schools should do more to retain experienced teachers instead of relying heavily on short-term staff.', translation: '', purpose: 'near-transfer' },
      { kind: 'speaking', text: 'I would trust an experienced tour guide more than an app when travelling somewhere unfamiliar.', translation: '', purpose: 'far-transfer' }
    ],
    editorProductionPrompt: 'Use "experienced" in one IELTS-style sentence about skilled workers, teachers, or professionals.'
  },
  insufficient: {
    editorContexts: [
      { kind: 'reading', text: 'Researchers concluded that the available evidence was insufficient to support a firm conclusion.', translation: '', purpose: 'core' },
      { kind: 'writing', text: 'Insufficient funding can prevent public hospitals from hiring staff and upgrading equipment.', translation: '', purpose: 'near-transfer' },
      { kind: 'speaking', text: 'In my view, one short lesson a week is insufficient if students need real progress in a foreign language.', translation: '', purpose: 'far-transfer' }
    ],
    editorProductionPrompt: 'Use "insufficient" in one IELTS-style sentence about a lack of funding, evidence, time, or support.'
  },
  undesirable: {
    editorContexts: [
      { kind: 'reading', text: 'The report warned that rapid urban expansion could have undesirable effects on air quality and green space.', translation: '', purpose: 'core' },
      { kind: 'writing', text: 'Governments should assess whether a policy may create undesirable consequences for low-income households.', translation: '', purpose: 'near-transfer' },
      { kind: 'speaking', text: 'I think excessive advertising has become an undesirable feature of daily life in many cities.', translation: '', purpose: 'far-transfer' }
    ],
    editorProductionPrompt: 'Use "undesirable" in one IELTS-style sentence about an unwanted effect, outcome, or social trend.'
  },
  influential: {
    editorContexts: [
      { kind: 'reading', text: 'Social media personalities have become highly influential in shaping young consumers’ habits.', translation: '', purpose: 'core' },
      { kind: 'writing', text: 'Teachers can be influential role models because students often copy both their attitudes and behaviour.', translation: '', purpose: 'near-transfer' },
      { kind: 'speaking', text: 'In my life, my grandfather was the most influential person because he encouraged me to read widely.', translation: '', purpose: 'far-transfer' }
    ],
    editorProductionPrompt: 'Use "influential" in one IELTS-style sentence about a person, group, or force that shapes opinions or behaviour.'
  },
  excessive: {
    editorContexts: [
      { kind: 'reading', text: 'Doctors warn that excessive sugar consumption increases the risk of obesity and diabetes.', translation: '', purpose: 'core' },
      { kind: 'writing', text: 'Excessive screen time can affect children’s sleep patterns and concentration in class.', translation: '', purpose: 'near-transfer' },
      { kind: 'speaking', text: 'I think excessive packaging is wasteful because most of it is thrown away immediately.', translation: '', purpose: 'far-transfer' }
    ],
    editorProductionPrompt: 'Use "excessive" in one IELTS-style sentence about overconsumption, waste, or behaviour that goes beyond what is reasonable.'
  },
  moderate: {
    editorContexts: [
      { kind: 'reading', text: 'Moderate exercise on most days can improve cardiovascular health and reduce stress.', translation: '', purpose: 'core' },
      { kind: 'writing', text: 'Public health campaigns should encourage moderate eating habits instead of extreme dieting.', translation: '', purpose: 'near-transfer' },
      { kind: 'speaking', text: 'I prefer a moderate climate because very hot or very cold weather affects my daily routine.', translation: '', purpose: 'far-transfer' }
    ],
    editorProductionPrompt: 'Use "moderate" in one IELTS-style sentence about a reasonable level of exercise, spending, weather, or behaviour.'
  },
  declining: {
    editorContexts: [
      { kind: 'reading', text: 'Several rural towns are facing declining populations as younger residents move to major cities.', translation: '', purpose: 'core' },
      { kind: 'writing', text: 'Governments should respond quickly to declining birth rates if they want to avoid long-term labour shortages.', translation: '', purpose: 'near-transfer' },
      { kind: 'speaking', text: 'I am concerned about declining reading habits among teenagers because phones take up so much of their attention.', translation: '', purpose: 'far-transfer' }
    ],
    editorProductionPrompt: 'Use "declining" in one IELTS-style sentence about falling numbers, standards, or levels over time.'
  },
  adverse: {
    editorContexts: [
      { kind: 'reading', text: 'The study found that long commutes can have adverse effects on mental health and family life.', translation: '', purpose: 'core' },
      { kind: 'writing', text: 'Policy makers should consider the adverse impact of rising rents on low-income residents.', translation: '', purpose: 'near-transfer' },
      { kind: 'speaking', text: 'In my view, excessive pressure at school can have adverse consequences for students’ confidence.', translation: '', purpose: 'far-transfer' }
    ],
    editorProductionPrompt: 'Use "adverse" in one IELTS-style sentence about a harmful effect, impact, or consequence.'
  }
};

let touched = 0;

for (const entry of reviewed.candidates) {
  if (entry.reviewStatus !== 'approved' || entry.approved !== true) continue;
  if (!updates[entry.key]) continue;

  Object.assign(entry, updates[entry.key]);
  touched += 1;
}

fs.writeFileSync(reviewedPath, JSON.stringify(reviewed, null, 2) + '\n');
console.log(`Updated ${touched} approved entries in ${reviewedPath}`);
