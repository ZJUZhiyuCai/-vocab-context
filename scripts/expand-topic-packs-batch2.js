import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildExpansionContexts } from './topic-context-helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const FOUNDATION_FILE = path.join(ROOT, 'public/data/ielts-foundation.json');

// 第二批 Topic Pack 扩展词汇
// 目标：补充弱 Topic Packs 至 80+ 词汇
const BATCH_2 = [
  // === WORK (+48 words, 32→80) ===
  { word: 'apprentice', topic: 'work', partOfSpeech: 'n.', ipa: '/əˈprentɪs/', chineseMeaning: '学徒；实习生', englishDefinition: 'a person who is learning a trade from a skilled employer', sense: 'someone learning a skilled trade', collocations: ['apprentice plumber', 'hire an apprentice', 'apprentice program'], paraphrases: ['trainee', 'learner', 'novice'] },
  { word: 'automate', topic: 'work', partOfSpeech: 'v.', ipa: '/ˈɔːtəmeɪt/', chineseMeaning: '自动化', englishDefinition: 'to convert a process to operate by machines rather than people', sense: 'make a process automatic', collocations: ['automate processes', 'fully automate', 'partially automate'], paraphrases: ['mechanize', 'computerize', 'digitize'] },
  { word: 'blueprint', topic: 'work', partOfSpeech: 'n.', ipa: '/ˈbluːprɪnt/', chineseMeaning: '蓝图；计划', englishDefinition: 'a detailed plan or design for achieving something', sense: 'a detailed plan', collocations: ['career blueprint', 'strategic blueprint', 'blueprint for success'], paraphrases: ['plan', 'design', 'roadmap'] },
  { word: 'brainstorm', topic: 'work', partOfSpeech: 'v.', ipa: '/ˈbreɪnstɔːm/', chineseMeaning: '头脑风暴', englishDefinition: 'to discuss and produce ideas spontaneously in a group', sense: 'generate ideas together', collocations: ['brainstorm ideas', 'brainstorm session', 'brainstorm solutions'], paraphrases: ['ideate', 'generate ideas', 'think creatively'] },
  { word: 'collaboration', topic: 'work', partOfSpeech: 'n.', ipa: '/kəˌlæbəˈreɪʃn/', chineseMeaning: '合作；协作', englishDefinition: 'the action of working with someone to produce something', sense: 'working together', collocations: ['close collaboration', 'international collaboration', 'foster collaboration'], paraphrases: ['cooperation', 'partnership', 'teamwork'] },
  { word: 'competence', topic: 'work', partOfSpeech: 'n.', ipa: '/ˈkɒmpɪtəns/', chineseMeaning: '能力；胜任', englishDefinition: 'the ability to do something successfully or efficiently', sense: 'being capable', collocations: ['professional competence', 'demonstrate competence', 'core competence'], paraphrases: ['capability', 'skill', 'proficiency'] },
  { word: 'dedication', topic: 'work', partOfSpeech: 'n.', ipa: '/ˌdedɪˈkeɪʃn/', chineseMeaning: '奉献；敬业', englishDefinition: 'the quality of being committed to a task or purpose', sense: 'strong commitment', collocations: ['show dedication', 'unwavering dedication', 'work dedication'], paraphrases: ['commitment', 'devotion', 'loyalty'] },
  { word: 'downsizing', topic: 'work', partOfSpeech: 'n.', ipa: '/ˈdaʊnˌsaɪzɪŋ/', chineseMeaning: '裁员；精简', englishDefinition: 'the reduction of a company\'s workforce to improve efficiency', sense: 'reducing staff numbers', collocations: ['corporate downsizing', 'announce downsizing', 'due to downsizing'], paraphrases: ['layoffs', 'staff reduction', 'cutbacks'] },
  { word: 'entrepreneur', topic: 'work', partOfSpeech: 'n.', ipa: '/ˌɒntrəprəˈnɜː/', chineseMeaning: '企业家', englishDefinition: 'a person who starts and runs their own business', sense: 'business founder', collocations: ['successful entrepreneur', 'young entrepreneur', 'tech entrepreneur'], paraphrases: ['business owner', 'founder', 'startup founder'] },
  { word: 'freelance', topic: 'work', partOfSpeech: 'adj.', ipa: '/ˈfriːlɑːns/', chineseMeaning: '自由职业的', englishDefinition: 'working independently for different companies', sense: 'self-employed work', collocations: ['freelance work', 'freelance writer', 'freelance career'], paraphrases: ['self-employed', 'independent', 'contract'] },
  { word: 'headhunt', topic: 'work', partOfSpeech: 'v.', ipa: '/ˈhedhʌnt/', chineseMeaning: '猎头招聘', englishDefinition: 'to recruit executive staff for a company', sense: 'actively recruit talent', collocations: ['headhunt talent', 'headhunted by', 'headhunting firm'], paraphrases: ['recruit', 'poach', 'scout'] },
  { word: 'incentive', topic: 'work', partOfSpeech: 'n.', ipa: '/ɪnˈsentɪv/', chineseMeaning: '激励；奖励', englishDefinition: 'something that motivates or encourages someone to do something', sense: 'motivation to act', collocations: ['financial incentive', 'provide incentive', 'incentive scheme'], paraphrases: ['motivation', 'encouragement', 'reward'] },
  { word: 'intern', topic: 'work', partOfSpeech: 'n.', ipa: '/ˈɪntɜːn/', chineseMeaning: '实习生', englishDefinition: 'a student or trainee who works for experience', sense: 'work experience position', collocations: ['summer intern', 'hire interns', 'intern position'], paraphrases: ['trainee', 'apprentice', 'work experience'] },
  { word: 'leadership', topic: 'work', partOfSpeech: 'n.', ipa: '/ˈliːdəʃɪp/', chineseMeaning: '领导力', englishDefinition: 'the action of leading a group or organization', sense: 'ability to lead', collocations: ['strong leadership', 'leadership skills', 'effective leadership'], paraphrases: ['management', 'guidance', 'direction'] },
  { word: 'merit', topic: 'work', partOfSpeech: 'n.', ipa: '/ˈmerɪt/', chineseMeaning: '优点；功绩', englishDefinition: 'the quality of being particularly good or worthy', sense: 'worthiness or value', collocations: ['on merit', 'merit-based', 'recognize merit'], paraphrases: ['worth', 'value', 'excellence'] },
  { word: 'network', topic: 'work', partOfSpeech: 'v.', ipa: '/ˈnetwɜːk/', chineseMeaning: '建立人脉', englishDefinition: 'to interact with others to exchange information and develop contacts', sense: 'build professional relationships', collocations: ['network effectively', 'network event', 'professional network'], paraphrases: ['connect', 'socialize', 'build contacts'] },
  { word: 'outsourcing', topic: 'work', partOfSpeech: 'n.', ipa: '/ˈaʊtˌsɔːsɪŋ/', chineseMeaning: '外包', englishDefinition: 'the practice of obtaining goods or services from an external supplier', sense: 'hiring external workers', collocations: ['IT outsourcing', 'increase outsourcing', 'outsourcing trend'], paraphrases: ['contracting', 'subcontracting', 'external hiring'] },
  { word: 'productivity', topic: 'work', partOfSpeech: 'n.', ipa: '/ˌprɒdʌkˈtɪvəti/', chineseMeaning: '生产力', englishDefinition: 'the rate at which goods or services are produced', sense: 'efficiency of work', collocations: ['increase productivity', 'labor productivity', 'productivity growth'], paraphrases: ['efficiency', 'output', 'performance'] },
  { word: 'qualification', topic: 'work', partOfSpeech: 'n.', ipa: '/ˌkwɒlɪfɪˈkeɪʃn/', chineseMeaning: '资格；学历', englishDefinition: 'an official record of achievement or skill', sense: 'credentials or degrees', collocations: ['academic qualification', 'professional qualification', 'gain qualification'], paraphrases: ['credential', 'degree', 'certification'] },
  { word: 'remuneration', topic: 'work', partOfSpeech: 'n.', ipa: '/rɪˌmjuːnəˈreɪʃn/', chineseMeaning: '报酬；薪资', englishDefinition: 'money paid for work or services', sense: 'payment for work', collocations: ['competitive remuneration', 'remuneration package', 'salary remuneration'], paraphrases: ['salary', 'pay', 'compensation'] },
  { word: 'self-employed', topic: 'work', partOfSpeech: 'adj.', ipa: '/ˌself ɪmˈplɔɪd/', chineseMeaning: '自雇的', englishDefinition: 'working for oneself rather than an employer', sense: 'working independently', collocations: ['become self-employed', 'self-employed workers', 'self-employed status'], paraphrases: ['freelance', 'independent', 'own boss'] },
  { word: 'specialist', topic: 'work', partOfSpeech: 'n.', ipa: '/ˈspeʃəlɪst/', chineseMeaning: '专家', englishDefinition: 'a person who concentrates on a particular field', sense: 'expert in one area', collocations: ['IT specialist', 'medical specialist', 'specialist knowledge'], paraphrases: ['expert', 'professional', 'authority'] },
  { word: 'telecommute', topic: 'work', partOfSpeech: 'v.', ipa: '/ˈtelɪkəˌmjuːt/', chineseMeaning: '远程办公', englishDefinition: 'to work from home using technology to communicate', sense: 'working remotely', collocations: ['telecommute regularly', 'telecommute option', 'ability to telecommute'], paraphrases: ['work remotely', 'work from home', 'remote work'] },
  { word: 'tenure', topic: 'work', partOfSpeech: 'n.', ipa: '/ˈtenjə/', chineseMeaning: '任期；终身职位', englishDefinition: 'the period of holding an office or job', sense: 'length of employment', collocations: ['job tenure', 'academic tenure', 'long tenure'], paraphrases: ['term', 'period', 'duration'] },
  { word: 'underemployed', topic: 'work', partOfSpeech: 'adj.', ipa: '/ˌʌndərɪmˈplɔɪd/', chineseMeaning: '就业不足的', englishDefinition: 'working in a job that does not use one\'s skills fully', sense: 'not fully utilized', collocations: ['underemployed workers', 'underemployed graduates', 'remain underemployed'], paraphrases: ['underutilized', 'overqualified', 'part-time'] },
  { word: 'vacancy', topic: 'work', partOfSpeech: 'n.', ipa: '/ˈveɪkənsi/', chineseMeaning: '空缺职位', englishDefinition: 'an unoccupied position or job', sense: 'available job position', collocations: ['job vacancy', 'fill a vacancy', 'vacancy rate'], paraphrases: ['opening', 'position', 'slot'] },
  { word: 'wage', topic: 'work', partOfSpeech: 'n.', ipa: '/weɪdʒ/', chineseMeaning: '工资', englishDefinition: 'a fixed regular payment for work', sense: 'payment for labor', collocations: ['minimum wage', 'hourly wage', 'wage increase'], paraphrases: ['pay', 'salary', 'earnings'] },
  { word: 'workforce', topic: 'work', partOfSpeech: 'n.', ipa: '/ˈwɜːkfɔːs/', chineseMeaning: '劳动力', englishDefinition: 'the people engaged in or available for work', sense: 'total workers', collocations: ['skilled workforce', 'workforce development', 'aging workforce'], paraphrases: ['employees', 'staff', 'labor force'] },
  { word: 'workplace', topic: 'work', partOfSpeech: 'n.', ipa: '/ˈwɜːkpleɪs/', chineseMeaning: '工作场所', englishDefinition: 'a place where people work', sense: 'environment for work', collocations: ['workplace safety', 'modern workplace', 'workplace culture'], paraphrases: ['office', 'work environment', 'job site'] },
  { word: 'achievement', topic: 'work', partOfSpeech: 'n.', ipa: '/əˈtʃiːvmənt/', chineseMeaning: '成就', englishDefinition: 'something done successfully with effort', sense: 'successful completion', collocations: ['great achievement', 'achievement gap', 'sense of achievement'], paraphrases: ['accomplishment', 'success', 'feat'] },
  { word: 'career', topic: 'work', partOfSpeech: 'n.', ipa: '/kəˈrɪə/', chineseMeaning: '职业', englishDefinition: 'an occupation undertaken for a significant period', sense: 'professional path', collocations: ['career path', 'career development', 'change career'], paraphrases: ['profession', 'occupation', 'vocation'] },
  { word: 'deadline', topic: 'work', partOfSpeech: 'n.', ipa: '/ˈdedlaɪn/', chineseMeaning: '截止日期', englishDefinition: 'the latest time by which something must be completed', sense: 'time limit', collocations: ['meet deadline', 'tight deadline', 'miss deadline'], paraphrases: ['due date', 'time limit', 'cutoff'] },
  { word: 'delegate', topic: 'work', partOfSpeech: 'v.', ipa: '/ˈdelɪɡeɪt/', chineseMeaning: '授权；委派', englishDefinition: 'to assign responsibility to another person', sense: 'give tasks to others', collocations: ['delegate tasks', 'delegate authority', 'effectively delegate'], paraphrases: ['assign', 'entrust', 'transfer'] },
  { word: 'expertise', topic: 'work', partOfSpeech: 'n.', ipa: '/ˌekspɜːˈtiːz/', chineseMeaning: '专业知识', englishDefinition: 'expert skill or knowledge in a particular field', sense: 'specialized knowledge', collocations: ['technical expertise', 'demonstrate expertise', 'area of expertise'], paraphrases: ['knowledge', 'skill', 'know-how'] },
  { word: 'internship', topic: 'work', partOfSpeech: 'n.', ipa: '/ˈɪntɜːnʃɪp/', chineseMeaning: '实习', englishDefinition: 'a period of work experience offered by an employer', sense: 'work experience program', collocations: ['summer internship', 'paid internship', 'complete internship'], paraphrases: ['work experience', 'training', 'placement'] },
  { word: 'mentor', topic: 'work', partOfSpeech: 'n.', ipa: '/ˈmentɔː/', chineseMeaning: '导师', englishDefinition: 'an experienced person who advises a less experienced person', sense: 'adviser or guide', collocations: ['assigned mentor', 'mentor program', 'become a mentor'], paraphrases: ['adviser', 'guide', 'coach'] },
  { word: 'overtime', topic: 'work', partOfSpeech: 'n.', ipa: '/ˈəʊvətaɪm/', chineseMeaning: '加班', englishDefinition: 'time worked in addition to normal working hours', sense: 'extra work time', collocations: ['work overtime', 'paid overtime', 'overtime pay'], paraphrases: ['extra hours', 'additional work', 'extended hours'] },
  { word: 'profession', topic: 'work', partOfSpeech: 'n.', ipa: '/prəˈfeʃn/', chineseMeaning: '职业', englishDefinition: 'a paid occupation requiring advanced training', sense: 'skilled occupation', collocations: ['legal profession', 'medical profession', 'chosen profession'], paraphrases: ['career', 'occupation', 'vocation'] },
  { word: 'resign', topic: 'work', partOfSpeech: 'v.', ipa: '/rɪˈzaɪn/', chineseMeaning: '辞职', englishDefinition: 'to voluntarily leave a job', sense: 'quit a position', collocations: ['resign from', 'decide to resign', 'submit resignation'], paraphrases: ['quit', 'leave', 'step down'] },
  { word: 'shift', topic: 'work', partOfSpeech: 'n.', ipa: '/ʃɪft/', chineseMeaning: '轮班', englishDefinition: 'a set period of work', sense: 'work period', collocations: ['night shift', 'day shift', 'shift work'], paraphrases: ['work period', 'turn', 'rotation'] },
  { word: 'skillset', topic: 'work', partOfSpeech: 'n.', ipa: '/ˈskɪlset/', chineseMeaning: '技能组合', englishDefinition: 'a person\'s range of skills and abilities', sense: 'collection of skills', collocations: ['technical skillset', 'expand skillset', 'valuable skillset'], paraphrases: ['abilities', 'capabilities', 'competencies'] },
  { word: 'subordinate', topic: 'work', partOfSpeech: 'n.', ipa: '/səˈbɔːdɪnət/', chineseMeaning: '下属', englishDefinition: 'a person under the authority of another', sense: 'lower-ranking worker', collocations: ['direct subordinate', 'manage subordinates', 'treat subordinates'], paraphrases: ['employee', 'staff member', 'underling'] },
  { word: 'supervise', topic: 'work', partOfSpeech: 'v.', ipa: '/ˈsuːpəvaɪz/', chineseMeaning: '监督；管理', englishDefinition: 'to observe and direct the work of others', sense: 'oversee work', collocations: ['closely supervise', 'supervise staff', 'directly supervise'], paraphrases: ['oversee', 'manage', 'direct'] },
  { word: 'teamwork', topic: 'work', partOfSpeech: 'n.', ipa: '/ˈtiːmwɜːk/', chineseMeaning: '团队合作', englishDefinition: 'combined action of a group to achieve a goal', sense: 'working together', collocations: ['effective teamwork', 'promote teamwork', 'teamwork skills'], paraphrases: ['collaboration', 'cooperation', 'coordination'] },
  { word: 'trainee', topic: 'work', partOfSpeech: 'n.', ipa: '/treɪˈniː/', chineseMeaning: '受训者', englishDefinition: 'a person learning a job or skill', sense: 'learning worker', collocations: ['new trainee', 'management trainee', 'trainee program'], paraphrases: ['learner', 'apprentice', 'novice'] },
  { word: 'union', topic: 'work', partOfSpeech: 'n.', ipa: '/ˈjuːniən/', chineseMeaning: '工会', englishDefinition: 'an organized association of workers', sense: 'workers\' organization', collocations: ['trade union', 'labor union', 'union member'], paraphrases: ['workers\' association', 'labor organization', 'syndicate'] },
  { word: 'vocation', topic: 'work', partOfSpeech: 'n.', ipa: '/vəʊˈkeɪʃn/', chineseMeaning: '天职；职业', englishDefinition: 'a strong feeling of suitability for a career', sense: 'calling or career', collocations: ['find one\'s vocation', 'true vocation', 'vocational training'], paraphrases: ['calling', 'career', 'mission'] },
  { word: 'workplace', topic: 'work', partOfSpeech: 'n.', ipa: '/ˈwɜːkpleɪs/', chineseMeaning: '工作场所', englishDefinition: 'the location where people work', sense: 'work environment', collocations: ['workplace environment', 'workplace safety', 'modern workplace'], paraphrases: ['office', 'workspace', 'job site'] },

  // === MEDIA (+48 words, 32→80) ===
  { word: 'airtime', topic: 'media', partOfSpeech: 'n.', ipa: '/ˈeətaɪm/', chineseMeaning: '播出时间', englishDefinition: 'time allocated for broadcasting', sense: 'broadcast time', collocations: ['get airtime', 'airtime allocation', 'purchase airtime'], paraphrases: ['broadcast time', 'air space', 'radio time'] },
  { word: 'anchor', topic: 'media', partOfSpeech: 'n.', ipa: '/ˈæŋkə/', chineseMeaning: '新闻主播', englishDefinition: 'a person who presents news on television', sense: 'news presenter', collocations: ['news anchor', 'TV anchor', 'anchor desk'], paraphrases: ['presenter', 'newscaster', 'host'] },
  { word: 'audience', topic: 'media', partOfSpeech: 'n.', ipa: '/ˈɔːdiəns/', chineseMeaning: '观众；受众', englishDefinition: 'the people who watch or listen to media', sense: 'media consumers', collocations: ['target audience', 'mass audience', 'audience rating'], paraphrases: ['viewers', 'listeners', 'spectators'] },
  { word: 'broadcast', topic: 'media', partOfSpeech: 'v.', ipa: '/ˈbrɔːdkɑːst/', chineseMeaning: '广播；播出', englishDefinition: 'to transmit by radio or television', sense: 'transmit media', collocations: ['broadcast live', 'broadcast news', 'radio broadcast'], paraphrases: ['transmit', 'air', 'telecast'] },
  { word: 'celebrity', topic: 'media', partOfSpeech: 'n.', ipa: '/sɪˈlebrəti/', chineseMeaning: '名人', englishDefinition: 'a famous person widely recognized by the public', sense: 'famous person', collocations: ['celebrity culture', 'A-list celebrity', 'celebrity status'], paraphrases: ['star', 'famous person', 'public figure'] },
  { word: 'circulation', topic: 'media', partOfSpeech: 'n.', ipa: '/ˌsɜːkjəˈleɪʃn/', chineseMeaning: '发行量', englishDefinition: 'the number of copies of a publication distributed', sense: 'distribution count', collocations: ['daily circulation', 'circulation figures', 'increase circulation'], paraphrases: ['distribution', 'readership', 'sales'] },
  { word: 'commentary', topic: 'media', partOfSpeech: 'n.', ipa: '/ˈkɒməntəri/', chineseMeaning: '评论；解说', englishDefinition: 'explanation or discussion of events', sense: 'analytical discussion', collocations: ['provide commentary', 'political commentary', 'live commentary'], paraphrases: ['analysis', 'observation', 'remarks'] },
  { word: 'correspondent', topic: 'media', partOfSpeech: 'n.', ipa: '/ˌkɒrɪˈspɒndənt/', chineseMeaning: '通讯员；记者', englishDefinition: 'a reporter who sends news from a particular place', sense: 'news reporter', collocations: ['foreign correspondent', 'war correspondent', 'news correspondent'], paraphrases: ['reporter', 'journalist', 'news writer'] },
  { word: 'coverage', topic: 'media', partOfSpeech: 'n.', ipa: '/ˈkʌvərɪdʒ/', chineseMeaning: '新闻报道', englishDefinition: 'the reporting of news in the media', sense: 'media reporting', collocations: ['media coverage', 'extensive coverage', 'news coverage'], paraphrases: ['reporting', 'news report', 'press coverage'] },
  { word: 'documentary', topic: 'media', partOfSpeech: 'n.', ipa: '/ˌdɒkjəˈmentəri/', chineseMeaning: '纪录片', englishDefinition: 'a film or television program based on facts', sense: 'factual media', collocations: ['watch documentary', 'documentary film', 'make a documentary'], paraphrases: ['factual film', 'non-fiction', 'docudrama'] },
  { word: 'editor', topic: 'media', partOfSpeech: 'n.', ipa: '/ˈedɪtə/', chineseMeaning: '编辑', englishDefinition: 'a person responsible for editorial content', sense: 'content manager', collocations: ['chief editor', 'newspaper editor', 'editor-in-chief'], paraphrases: ['editorial chief', 'managing editor', 'content manager'] },
  { word: 'editorial', topic: 'media', partOfSpeech: 'n.', ipa: '/ˌedɪˈtɔːriəl/', chineseMeaning: '社论', englishDefinition: 'a newspaper article expressing opinions', sense: 'opinion piece', collocations: ['write an editorial', 'editorial board', 'editorial opinion'], paraphrases: ['opinion piece', 'op-ed', 'commentary'] },
  { word: 'footage', topic: 'media', partOfSpeech: 'n.', ipa: '/ˈfʊtɪdʒ/', chineseMeaning: '影片片段', englishDefinition: 'recorded video material', sense: 'video clips', collocations: ['archival footage', 'video footage', 'news footage'], paraphrases: ['video clips', 'film', 'recording'] },
  { word: 'headline', topic: 'media', partOfSpeech: 'n.', ipa: '/ˈhedlaɪn/', chineseMeaning: '标题', englishDefinition: 'a heading at the top of a news article', sense: 'news title', collocations: ['grab headlines', 'front-page headline', 'headline news'], paraphrases: ['title', 'heading', 'banner'] },
  { word: 'influencer', topic: 'media', partOfSpeech: 'n.', ipa: '/ˈɪnfluənsə/', chineseMeaning: '网红；影响者', englishDefinition: 'someone who can influence others on social media', sense: 'social media personality', collocations: ['social media influencer', 'become an influencer', 'top influencer'], paraphrases: ['content creator', 'online personality', 'vlogger'] },
  { word: 'journalist', topic: 'media', partOfSpeech: 'n.', ipa: '/ˈdʒɜːnəlɪst/', chineseMeaning: '记者', englishDefinition: 'a person who writes for newspapers or media', sense: 'news writer', collocations: ['investigative journalist', 'freelance journalist', 'professional journalist'], paraphrases: ['reporter', 'news writer', 'correspondent'] },
  { word: 'live', topic: 'media', partOfSpeech: 'adj.', ipa: '/laɪv/', chineseMeaning: '直播的', englishDefinition: 'broadcast as it happens', sense: 'real-time broadcast', collocations: ['live broadcast', 'go live', 'live coverage'], paraphrases: ['real-time', 'broadcast live', 'simultaneous'] },
  { word: 'media', topic: 'media', partOfSpeech: 'n.', ipa: '/ˈmiːdiə/', chineseMeaning: '媒体', englishDefinition: 'the main means of mass communication', sense: 'communication channels', collocations: ['mass media', 'social media', 'media industry'], paraphrases: ['press', 'broadcasting', 'communications'] },
  { word: 'newscast', topic: 'media', partOfSpeech: 'n.', ipa: '/ˈnjuːzkɑːst/', chineseMeaning: '新闻广播', englishDefinition: 'a broadcast of news', sense: 'news program', collocations: ['evening newscast', 'radio newscast', 'television newscast'], paraphrases: ['news broadcast', 'news program', 'news report'] },
  { word: 'newspaper', topic: 'media', partOfSpeech: 'n.', ipa: '/ˈnjuːzˌpeɪpə/', chineseMeaning: '报纸', englishDefinition: 'a printed publication with news and articles', sense: 'print news medium', collocations: ['daily newspaper', 'local newspaper', 'newspaper article'], paraphrases: ['paper', 'press', 'publication'] },
  { word: 'podcast', topic: 'media', partOfSpeech: 'n.', ipa: '/ˈpɒdkɑːst/', chineseMeaning: '播客', englishDefinition: 'a digital audio program available for download', sense: 'audio content', collocations: ['listen to podcast', 'start a podcast', 'podcast episode'], paraphrases: ['audio program', 'radio show', 'audio series'] },
  { word: 'press', topic: 'media', partOfSpeech: 'n.', ipa: '/pres/', chineseMeaning: '新闻界', englishDefinition: 'newspapers and news media collectively', sense: 'news media', collocations: ['freedom of the press', 'press conference', 'press release'], paraphrases: ['media', 'journalism', 'news'] },
  { word: 'publicity', topic: 'media', partOfSpeech: 'n.', ipa: '/pʌˈblɪsəti/', chineseMeaning: '宣传；关注', englishDefinition: 'public attention given to something', sense: 'media attention', collocations: ['generate publicity', 'negative publicity', 'seek publicity'], paraphrases: ['attention', 'exposure', 'promotion'] },
  { word: 'publisher', topic: 'media', partOfSpeech: 'n.', ipa: '/ˈpʌblɪʃə/', chineseMeaning: '出版商', englishDefinition: 'a company that prepares and issues media', sense: 'media company', collocations: ['book publisher', 'newspaper publisher', 'major publisher'], paraphrases: ['publishing house', 'media company', 'content producer'] },
  { word: 'radio', topic: 'media', partOfSpeech: 'n.', ipa: '/ˈreɪdiəʊ/', chineseMeaning: '广播', englishDefinition: 'the transmission of programs by radio waves', sense: 'audio broadcasting', collocations: ['listen to radio', 'radio station', 'radio broadcast'], paraphrases: ['wireless', 'broadcast', 'transmission'] },
  { word: 'ratings', topic: 'media', partOfSpeech: 'n.', ipa: '/ˈreɪtɪŋz/', chineseMeaning: '收视率', englishDefinition: 'statistics showing audience size', sense: 'audience measurement', collocations: ['TV ratings', 'high ratings', 'ratings drop'], paraphrases: ['viewership', 'audience figures', 'popularity'] },
  { word: 'reporter', topic: 'media', partOfSpeech: 'n.', ipa: '/rɪˈpɔːtə/', chineseMeaning: '记者', englishDefinition: 'a person who reports news', sense: 'news gatherer', collocations: ['news reporter', 'field reporter', 'television reporter'], paraphrases: ['journalist', 'correspondent', 'news writer'] },
  { word: 'satellite', topic: 'media', partOfSpeech: 'n.', ipa: '/ˈsætəlaɪt/', chineseMeaning: '卫星', englishDefinition: 'an artificial object used for communication', sense: 'broadcast technology', collocations: ['satellite TV', 'satellite broadcast', 'communication satellite'], paraphrases: ['orbital', 'transmitter', 'relay'] },
  { word: 'scoop', topic: 'media', partOfSpeech: 'n.', ipa: '/skuːp/', chineseMeaning: '独家新闻', englishDefinition: 'a news story obtained first by one source', sense: 'exclusive story', collocations: ['get a scoop', 'news scoop', 'big scoop'], paraphrases: ['exclusive', 'breaking story', 'first report'] },
  { word: 'screens', topic: 'media', partOfSpeech: 'n.', ipa: '/skriːnz/', chineseMeaning: '屏幕', englishDefinition: 'electronic displays for viewing content', sense: 'display devices', collocations: ['small screens', 'screen time', 'across screens'], paraphrases: ['displays', 'monitors', 'devices'] },
  { word: 'social', topic: 'media', partOfSpeech: 'adj.', ipa: '/ˈsəʊʃəl/', chineseMeaning: '社交的', englishDefinition: 'relating to society and communication', sense: 'community-based', collocations: ['social media', 'social networking', 'social platform'], paraphrases: ['community', 'public', 'interactive'] },
  { word: 'sponsor', topic: 'media', partOfSpeech: 'n.', ipa: '/ˈspɒnsə/', chineseMeaning: '赞助商', englishDefinition: 'a person or organization providing funding', sense: 'financial supporter', collocations: ['event sponsor', 'corporate sponsor', 'become a sponsor'], paraphrases: ['funder', 'backer', 'patron'] },
  { word: 'streaming', topic: 'media', partOfSpeech: 'n.', ipa: '/ˈstriːmɪŋ/', chineseMeaning: '流媒体', englishDefinition: 'the delivery of content over the internet', sense: 'online content delivery', collocations: ['video streaming', 'streaming service', 'live streaming'], paraphrases: ['online broadcast', 'digital delivery', 'webcast'] },
  { word: 'subscriber', topic: 'media', partOfSpeech: 'n.', ipa: '/səbˈskraɪbə/', chineseMeaning: '订阅者', englishDefinition: 'a person who pays to receive content', sense: 'paying audience', collocations: ['gain subscribers', 'paid subscriber', 'email subscriber'], paraphrases: ['member', 'follower', 'audience'] },
  { word: 'tabloid', topic: 'media', partOfSpeech: 'n.', ipa: '/ˈtæblɔɪd/', chineseMeaning: '小报', englishDefinition: 'a newspaper with sensational stories', sense: 'sensational press', collocations: ['tabloid journalism', 'tabloid newspaper', 'tabloid headline'], paraphrases: ['sensational paper', 'gossip paper', 'popular press'] },
  { word: 'telecast', topic: 'media', partOfSpeech: 'v.', ipa: '/ˈtelikɑːst/', chineseMeaning: '电视广播', englishDefinition: 'to broadcast by television', sense: 'TV transmission', collocations: ['live telecast', 'telecast event', 'national telecast'], paraphrases: ['broadcast', 'air', 'televise'] },
  { word: 'television', topic: 'media', partOfSpeech: 'n.', ipa: '/ˈtelɪvɪʒən/', chineseMeaning: '电视', englishDefinition: 'a system for transmitting visual images', sense: 'broadcast medium', collocations: ['watch television', 'television program', 'television industry'], paraphrases: ['TV', 'broadcast', 'video media'] },
  { word: 'trending', topic: 'media', partOfSpeech: 'adj.', ipa: '/ˈtrendɪŋ/', chineseMeaning: '热门的', englishDefinition: 'currently popular or widely discussed', sense: 'currently popular', collocations: ['trending topic', 'trending now', 'viral trending'], paraphrases: ['popular', 'hot', 'viral'] },
  { word: 'viral', topic: 'media', partOfSpeech: 'adj.', ipa: '/ˈvaɪərəl/', chineseMeaning: '病毒式传播的', englishDefinition: 'spreading rapidly through sharing', sense: 'rapidly shared', collocations: ['go viral', 'viral video', 'viral content'], paraphrases: ['spread quickly', 'trending', 'widely shared'] },
  { word: 'webcast', topic: 'media', partOfSpeech: 'n.', ipa: '/ˈwebkɑːst/', chineseMeaning: '网络广播', englishDefinition: 'a broadcast transmitted over the internet', sense: 'online broadcast', collocations: ['live webcast', 'webcast event', 'streaming webcast'], paraphrases: ['online broadcast', 'stream', 'web stream'] },
  { word: 'agenda', topic: 'media', partOfSpeech: 'n.', ipa: '/əˈdʒendə/', chineseMeaning: '议程', englishDefinition: 'the underlying intentions behind media coverage', sense: 'media intentions', collocations: ['media agenda', 'hidden agenda', 'political agenda'], paraphrases: ['purpose', 'motive', 'plan'] },
  { word: 'bias', topic: 'media', partOfSpeech: 'n.', ipa: '/ˈbaɪəs/', chineseMeaning: '偏见', englishDefinition: 'a preference that prevents objectivity', sense: 'unfair preference', collocations: ['media bias', 'political bias', 'show bias'], paraphrases: ['prejudice', 'partiality', 'slant'] },
  { word: 'clickbait', topic: 'media', partOfSpeech: 'n.', ipa: '/ˈklɪkbeɪt/', chineseMeaning: '标题党', englishDefinition: 'sensational headlines designed to attract clicks', sense: 'misleading headlines', collocations: ['clickbait headlines', 'clickbait article', 'avoid clickbait'], paraphrases: ['sensational headline', 'attention-grabber', 'bait'] },
  { word: 'consumer', topic: 'media', partOfSpeech: 'n.', ipa: '/kənˈsjuːmə/', chineseMeaning: '消费者', englishDefinition: 'a person who uses media content', sense: 'media user', collocations: ['media consumer', 'content consumer', 'consumer behavior'], paraphrases: ['user', 'audience', 'viewer'] },
  { word: 'digital', topic: 'media', partOfSpeech: 'adj.', ipa: '/ˈdɪdʒɪtl/', chineseMeaning: '数字的', englishDefinition: 'involving electronic technology', sense: 'technology-based', collocations: ['digital media', 'digital age', 'digital platform'], paraphrases: ['electronic', 'online', 'tech'] },
  { word: 'disinformation', topic: 'media', partOfSpeech: 'n.', ipa: '/dɪsˌɪnfəˈmeɪʃn/', chineseMeaning: '虚假信息', englishDefinition: 'false information spread deliberately', sense: 'intentional lies', collocations: ['spread disinformation', 'combat disinformation', 'political disinformation'], paraphrases: ['falsehoods', 'fake news', 'propaganda'] },
  { word: 'episode', topic: 'media', partOfSpeech: 'n.', ipa: '/ˈepɪsəʊd/', chineseMeaning: '一集', englishDefinition: 'one part of a series', sense: 'series installment', collocations: ['watch episode', 'new episode', 'final episode'], paraphrases: ['installment', 'part', 'segment'] },
  { word: 'fake', topic: 'media', partOfSpeech: 'adj.', ipa: '/feɪk/', chineseMeaning: '虚假的', englishDefinition: 'not genuine; false or counterfeit', sense: 'not real', collocations: ['fake news', 'fake account', 'fake information'], paraphrases: ['false', 'bogus', 'counterfeit'] },

  // === CRIME (+54 words, 26→80) ===
  { word: 'abduction', topic: 'crime', partOfSpeech: 'n.', ipa: '/æbˈdʌkʃn/', chineseMeaning: '绑架', englishDefinition: 'the act of taking someone away by force', sense: 'kidnapping', collocations: ['child abduction', 'attempted abduction', 'abduction case'], paraphrases: ['kidnapping', 'seizure', 'capture'] },
  { word: 'accomplice', topic: 'crime', partOfSpeech: 'n.', ipa: '/əˈkʌmplɪs/', chineseMeaning: '同谋', englishDefinition: 'a person who helps someone commit a crime', sense: 'crime partner', collocations: ['accomplice to', 'accomplice in crime', 'alleged accomplice'], paraphrases: ['partner', 'accessory', 'associate'] },
  { word: 'alibi', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈælɪbaɪ/', chineseMeaning: '不在场证明', englishDefinition: 'evidence of being elsewhere when a crime occurred', sense: 'proof of absence', collocations: ['provide an alibi', 'false alibi', 'solid alibi'], paraphrases: ['defense', 'excuse', 'evidence'] },
  { word: 'arson', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈɑːsn/', chineseMeaning: '纵火罪', englishDefinition: 'the criminal act of deliberately setting fire', sense: 'fire-setting crime', collocations: ['commit arson', 'arson attack', 'arson investigation'], paraphrases: ['fire-setting', 'pyromania', 'incendiarism'] },
  { word: 'assault', topic: 'crime', partOfSpeech: 'n.', ipa: '/əˈsɔːlt/', chineseMeaning: '袭击', englishDefinition: 'a physical attack on someone', sense: 'physical attack', collocations: ['sexual assault', 'assault charge', 'violent assault'], paraphrases: ['attack', 'violence', 'battery'] },
  { word: 'bail', topic: 'crime', partOfSpeech: 'n.', ipa: '/beɪl/', chineseMeaning: '保释', englishDefinition: 'money paid to release someone from custody', sense: 'temporary release payment', collocations: ['post bail', 'bail hearing', 'grant bail'], paraphrases: ['bond', 'security', 'release money'] },
  { word: 'barrister', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈbærɪstə/', chineseMeaning: '大律师', englishDefinition: 'a lawyer who speaks in higher courts', sense: 'court lawyer', collocations: ['defence barrister', 'senior barrister', 'hire a barrister'], paraphrases: ['lawyer', 'counsel', 'advocate'] },
  { word: 'blackmail', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈblækmeɪl/', chineseMeaning: '敲诈', englishDefinition: 'demanding money by threatening to reveal secrets', sense: 'threat-based extortion', collocations: ['commit blackmail', 'blackmail attempt', 'victim of blackmail'], paraphrases: ['extortion', 'threat', 'coercion'] },
  { word: 'bribe', topic: 'crime', partOfSpeech: 'n.', ipa: '/braɪb/', chineseMeaning: '贿赂', englishDefinition: 'money given to influence someone\'s actions', sense: 'illegal payment', collocations: ['accept a bribe', 'pay a bribe', 'bribe scandal'], paraphrases: ['payoff', 'kickback', 'payola'] },
  { word: 'burglary', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈbɜːɡləri/', chineseMeaning: '入室盗窃', englishDefinition: 'entering a building to commit theft', sense: 'break-in theft', collocations: ['commit burglary', 'burglary rate', 'attempted burglary'], paraphrases: ['break-in', 'robbery', 'theft'] },
  { word: 'capital', topic: 'crime', partOfSpeech: 'adj.', ipa: '/ˈkæpɪtl/', chineseMeaning: '死刑的', englishDefinition: 'punishable by death', sense: 'death penalty', collocations: ['capital punishment', 'capital offense', 'capital crime'], paraphrases: ['death penalty', 'fatal', 'ultimate'] },
  { word: 'charge', topic: 'crime', partOfSpeech: 'n.', ipa: '/tʃɑːdʒ/', chineseMeaning: '指控', englishDefinition: 'a formal accusation of a crime', sense: 'criminal accusation', collocations: ['face charges', 'criminal charge', 'drop charges'], paraphrases: ['accusation', 'indictment', 'allegation'] },
  { word: 'civil', topic: 'crime', partOfSpeech: 'adj.', ipa: '/ˈsɪvl/', chineseMeaning: '民事的', englishDefinition: 'relating to private rights rather than crimes', sense: 'non-criminal legal', collocations: ['civil case', 'civil law', 'civil court'], paraphrases: ['private', 'non-criminal', 'personal'] },
  { word: 'confession', topic: 'crime', partOfSpeech: 'n.', ipa: '/kənˈfeʃn/', chineseMeaning: '供认', englishDefinition: 'admission of guilt for a crime', sense: 'guilty admission', collocations: ['make a confession', 'false confession', 'forced confession'], paraphrases: ['admission', 'acknowledgment', 'statement'] },
  { word: 'corruption', topic: 'crime', partOfSpeech: 'n.', ipa: '/kəˈrʌpʃn/', chineseMeaning: '腐败', englishDefinition: 'dishonest behavior by those in power', sense: 'abuse of power', collocations: ['political corruption', 'fight corruption', 'government corruption'], paraphrases: ['dishonesty', 'fraud', 'bribery'] },
  { word: 'court', topic: 'crime', partOfSpeech: 'n.', ipa: '/kɔːt/', chineseMeaning: '法庭', englishDefinition: 'where legal cases are heard', sense: 'legal venue', collocations: ['appear in court', 'court case', 'court decision'], paraphrases: ['tribunal', 'judiciary', 'bench'] },
  { word: 'criminal', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈkrɪmɪnl/', chineseMeaning: '罪犯', englishDefinition: 'a person who commits crimes', sense: 'lawbreaker', collocations: ['convicted criminal', 'career criminal', 'known criminal'], paraphrases: ['lawbreaker', 'offender', 'felon'] },
  { word: 'defence', topic: 'crime', partOfSpeech: 'n.', ipa: '/dɪˈfens/', chineseMeaning: '辩护', englishDefinition: 'the case presented by the accused', sense: 'legal argument', collocations: ['defence lawyer', 'defence case', 'legal defence'], paraphrases: ['defense', 'justification', 'argument'] },
  { word: 'defendant', topic: 'crime', partOfSpeech: 'n.', ipa: '/dɪˈfendənt/', chineseMeaning: '被告', englishDefinition: 'a person accused in court', sense: 'accused person', collocations: ['the defendant', 'defendant pleads', 'defendant was'], paraphrases: ['accused', 'respondent', 'charged person'] },
  { word: 'detention', topic: 'crime', partOfSpeech: 'n.', ipa: '/dɪˈtenʃn/', chineseMeaning: '拘留', englishDefinition: 'the state of being held in custody', sense: 'being held', collocations: ['in detention', 'detention center', 'detention without trial'], paraphrases: ['custody', 'confinement', 'holding'] },
  { word: 'evidence', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈevɪdəns/', chineseMeaning: '证据', englishDefinition: 'information used to prove facts in court', sense: 'proof', collocations: ['provide evidence', 'strong evidence', 'admissible evidence'], paraphrases: ['proof', 'testimony', 'documentation'] },
  { word: 'felony', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈfeləni/', chineseMeaning: '重罪', englishDefinition: 'a serious crime punishable by imprisonment', sense: 'major crime', collocations: ['commit a felony', 'felony charge', 'violent felony'], paraphrases: ['major crime', 'serious offense', 'indictable offense'] },
  { word: 'fine', topic: 'crime', partOfSpeech: 'n.', ipa: '/faɪn/', chineseMeaning: '罚款', englishDefinition: 'a sum of money paid as punishment', sense: 'monetary penalty', collocations: ['pay a fine', 'heavy fine', 'on-the-spot fine'], paraphrases: ['penalty', 'penalty fee', 'forfeit'] },
  { word: 'fraud', topic: 'crime', partOfSpeech: 'n.', ipa: '/frɔːd/', chineseMeaning: '诈骗', englishDefinition: 'criminal deception for personal gain', sense: 'deceptive crime', collocations: ['commit fraud', 'tax fraud', 'identity fraud'], paraphrases: ['deception', 'scam', 'swindle'] },
  { word: 'guilty', topic: 'crime', partOfSpeech: 'adj.', ipa: '/ˈɡɪlti/', chineseMeaning: '有罪的', englishDefinition: 'having committed a crime', sense: 'responsible for crime', collocations: ['found guilty', 'plead guilty', 'guilty verdict'], paraphrases: ['culpable', 'responsible', 'liable'] },
  { word: 'hacking', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈhækɪŋ/', chineseMeaning: '黑客攻击', englishDefinition: 'unauthorized access to computer systems', sense: 'cyber crime', collocations: ['computer hacking', 'hacking attack', 'accused of hacking'], paraphrases: ['cyberattack', 'unauthorized access', 'breach'] },
  { word: 'homicide', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈhɒmɪsaɪd/', chineseMeaning: '杀人', englishDefinition: 'the killing of one person by another', sense: 'killing', collocations: ['homicide rate', 'commit homicide', 'homicide investigation'], paraphrases: ['murder', 'killing', 'manslaughter'] },
  { word: 'innocent', topic: 'crime', partOfSpeech: 'adj.', ipa: '/ˈɪnəsnt/', chineseMeaning: '无辜的', englishDefinition: 'not guilty of a crime', sense: 'not responsible', collocations: ['prove innocent', 'innocent until proven guilty', 'found innocent'], paraphrases: ['blameless', 'not guilty', 'faultless'] },
  { word: 'interrogation', topic: 'crime', partOfSpeech: 'n.', ipa: '/ɪnˌterəˈɡeɪʃn/', chineseMeaning: '审讯', englishDefinition: 'intense questioning by police', sense: 'formal questioning', collocations: ['police interrogation', 'under interrogation', 'during interrogation'], paraphrases: ['questioning', 'examination', 'interview'] },
  { word: 'judge', topic: 'crime', partOfSpeech: 'n.', ipa: '/dʒʌdʒ/', chineseMeaning: '法官', englishDefinition: 'an official who decides cases in court', sense: 'legal decision-maker', collocations: ['the judge', 'federal judge', 'high court judge'], paraphrases: ['magistrate', 'justice', 'adjudicator'] },
  { word: 'juror', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈdʒʊərə/', chineseMeaning: '陪审员', englishDefinition: 'a member of a jury', sense: 'jury member', collocations: ['juror selection', 'juror dismissed', 'potential juror'], paraphrases: ['jury member', 'peer', 'jurist'] },
  { word: 'jury', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈdʒʊəri/', chineseMeaning: '陪审团', englishDefinition: 'a group of people who decide a verdict', sense: 'decision-making group', collocations: ['the jury', 'jury trial', 'jury selection'], paraphrases: ['panel', 'peers', 'decision-makers'] },
  { word: 'lawyer', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈlɔːjə/', chineseMeaning: '律师', englishDefinition: 'a person who practices law', sense: 'legal representative', collocations: ['defence lawyer', 'hire a lawyer', 'lawyer argued'], paraphrases: ['attorney', 'counsel', 'solicitor'] },
  { word: 'magistrate', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈmædʒɪstreɪt/', chineseMeaning: '治安法官', englishDefinition: 'a judicial officer who handles minor cases', sense: 'lower court judge', collocations: ['magistrate court', 'the magistrate', 'lay magistrate'], paraphrases: ['justice', 'judge', 'judicial officer'] },
  { word: 'manslaughter', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈmænˌslɔːtə/', chineseMeaning: '过失杀人', englishDefinition: 'killing without premeditation', sense: 'unintentional killing', collocations: ['charge with manslaughter', 'manslaughter conviction', 'involuntary manslaughter'], paraphrases: ['unintentional killing', 'accidental killing', 'homicide'] },
  { word: 'money', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈmʌni/', chineseMeaning: '金钱（洗钱）', englishDefinition: 'laundering illicit funds', sense: 'illegal financial activity', collocations: ['money laundering', 'launder money', 'laundered money'], paraphrases: ['laundering', 'washing', 'concealment'] },
  { word: 'murder', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈmɜːdə/', chineseMeaning: '谋杀', englishDefinition: 'the unlawful premeditated killing of a person', sense: 'intentional killing', collocations: ['commit murder', 'murder charge', 'murder trial'], paraphrases: ['homicide', 'killing', 'slaughter'] },
  { word: 'parole', topic: 'crime', partOfSpeech: 'n.', ipa: '/pəˈrəʊl/', chineseMeaning: '假释', englishDefinition: 'early release from prison under supervision', sense: 'conditional release', collocations: ['on parole', 'grant parole', 'parole board'], paraphrases: ['release', 'freedom', 'probation'] },
  { word: 'penalty', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈpenəlti/', chineseMeaning: '刑罚', englishDefinition: 'punishment for breaking a law', sense: 'legal punishment', collocations: ['death penalty', 'heavy penalty', 'severe penalty'], paraphrases: ['punishment', 'sentence', 'sanction'] },
  { word: 'plaintiff', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈpleɪntɪf/', chineseMeaning: '原告', englishDefinition: 'a person who brings a case to court', sense: 'accuser', collocations: ['the plaintiff', 'plaintiff claims', 'plaintiff argued'], paraphrases: ['accuser', 'claimant', 'prosecutor'] },
  { word: 'prison', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈprɪzn/', chineseMeaning: '监狱', englishDefinition: 'a building where criminals are held', sense: 'incarceration facility', collocations: ['in prison', 'prison sentence', 'federal prison'], paraphrases: ['jail', 'penitentiary', 'correctional facility'] },
  { word: 'probation', topic: 'crime', partOfSpeech: 'n.', ipa: '/prəˈbeɪʃn/', chineseMeaning: '缓刑', englishDefinition: 'supervised release instead of prison', sense: 'court supervision', collocations: ['on probation', 'probation officer', 'violate probation'], paraphrases: ['supervision', 'conditional release', 'monitoring'] },
  { word: 'prosecutor', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈprɒsɪkjuːtə/', chineseMeaning: '检察官', englishDefinition: 'a lawyer who presents the case against someone', sense: 'state attorney', collocations: ['public prosecutor', 'chief prosecutor', 'federal prosecutor'], paraphrases: ['district attorney', 'state attorney', 'crown prosecutor'] },
  { word: 'rape', topic: 'crime', partOfSpeech: 'n.', ipa: '/reɪp/', chineseMeaning: '强奸', englishDefinition: 'the crime of forcing someone to have sex', sense: 'sexual assault', collocations: ['rape case', 'rape victim', 'date rape'], paraphrases: ['sexual assault', 'violation', 'attack'] },
  { word: 'robbery', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈrɒbəri/', chineseMeaning: '抢劫', englishDefinition: 'taking property by force or threat', sense: 'violent theft', collocations: ['armed robbery', 'bank robbery', 'commit robbery'], paraphrases: ['hold-up', 'heist', 'stick-up'] },
  { word: 'sentence', topic: 'crime', partOfSpeech: 'v.', ipa: '/ˈsentəns/', chineseMeaning: '判决', englishDefinition: 'to declare the punishment for a crime', sense: 'impose punishment', collocations: ['sentence to', 'sentenced to death', 'sentence someone'], paraphrases: ['condemn', 'punish', 'penalize'] },
  { word: 'solicitor', topic: 'crime', partOfSpeech: 'n.', ipa: '/səˈlɪsɪtə/', chineseMeaning: '事务律师', englishDefinition: 'a lawyer who prepares legal documents', sense: 'legal adviser', collocations: ['hire a solicitor', 'solicitor general', 'practice as a solicitor'], paraphrases: ['lawyer', 'attorney', 'legal adviser'] },
  { word: 'statute', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈstætʃuːt/', chineseMeaning: '法规', englishDefinition: 'a written law passed by legislature', sense: 'written law', collocations: ['statute law', 'federal statute', 'criminal statute'], paraphrases: ['law', 'act', 'legislation'] },
  { word: 'suspect', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈsʌspekt/', chineseMeaning: '嫌疑人', englishDefinition: 'a person thought to have committed a crime', sense: 'accused person', collocations: ['prime suspect', 'arrest a suspect', 'question a suspect'], paraphrases: ['accused', 'defendant', 'alleged criminal'] },
  { word: 'theft', topic: 'crime', partOfSpeech: 'n.', ipa: '/θeft/', chineseMeaning: '盗窃', englishDefinition: 'the act of stealing something', sense: 'stealing', collocations: ['commit theft', 'identity theft', 'grand theft'], paraphrases: ['stealing', 'larceny', 'robbery'] },
  { word: 'trial', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈtraɪəl/', chineseMeaning: '审判', englishDefinition: 'a formal examination of evidence in court', sense: 'legal proceeding', collocations: ['stand trial', 'fair trial', 'trial date'], paraphrases: ['hearing', 'proceeding', 'case'] },
  { word: 'verdict', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈvɜːdɪkt/', chineseMeaning: '裁决', englishDefinition: 'the decision reached by a jury', sense: 'court decision', collocations: ['reach a verdict', 'guilty verdict', 'unanimous verdict'], paraphrases: ['decision', 'judgment', 'finding'] },
  { word: 'witness', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈwɪtnəs/', chineseMeaning: '证人', englishDefinition: 'a person who sees an event occur', sense: 'observer', collocations: ['witness testimony', 'key witness', 'eyewitness'], paraphrases: ['observer', 'bystander', 'onlooker'] },
  { word: 'warrant', topic: 'crime', partOfSpeech: 'n.', ipa: '/ˈwɒrənt/', chineseMeaning: '逮捕令', englishDefinition: 'an official document authorizing police action', sense: 'legal authorization', collocations: ['arrest warrant', 'search warrant', 'issue a warrant'], paraphrases: ['authorization', 'order', 'decree'] }
];

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function buildContexts(item) {
  return buildExpansionContexts(item);
}

function buildBundleId(existingIds, topic, word) {
  let counter = 1;
  let bundleId = `${topic}_${word}_batch2_${String(counter).padStart(2, '0')}`;
  while (existingIds.has(bundleId)) {
    counter += 1;
    bundleId = `${topic}_${word}_batch2_${String(counter).padStart(2, '0')}`;
  }
  existingIds.add(bundleId);
  return bundleId;
}

function main() {
  const foundation = loadJson(FOUNDATION_FILE);
  const bundles = Array.isArray(foundation.bundles) ? foundation.bundles : [];
  const existingWords = new Set(bundles.map(b => String(b.word).toLowerCase()));
  const existingIds = new Set(bundles.map(b => b.bundleId));

  const newBundles = [];
  const skipped = [];
  const added = [];

  for (const item of BATCH_2) {
    // Check both existing words AND words already added in this batch
    if (existingWords.has(item.word.toLowerCase())) {
      skipped.push(item.word);
      continue;
    }

    const bundleId = buildBundleId(existingIds, item.topic, item.word);

    // Add to existingWords immediately to prevent duplicates within this batch
    existingWords.add(item.word.toLowerCase());

    newBundles.push({
      bundleId,
      word: item.word,
      lemma: item.word,
      ipa: item.ipa,
      partOfSpeech: item.partOfSpeech,
      sense: item.sense,
      englishDefinition: item.englishDefinition,
      chineseMeaning: item.chineseMeaning,
      topic: item.topic,
      taskTypes: ['reading', 'writing', 'speaking'],
      register: 'formal',
      collocations: item.collocations,
      paraphrases: item.paraphrases,
      confusions: [],
      contexts: buildContexts(item),
      productionPrompt: {
        mode: 'writing',
        instruction: `Use "${item.word}" in one IELTS-style sentence about ${item.topic}.`
      },
      sourceQuality: {
        relevanceScore: 5,
        transferabilityScore: 4,
        outputUtilityScore: 5,
        exampleQualityScore: 4,
        decision: 'keep'
      },
      draft: false,
      sourceCategory: 'topic-expansion-batch2'
    });

    added.push({ word: item.word, topic: item.topic });
  }

  const mergedBundles = [...bundles, ...newBundles];
  foundation.bundles = mergedBundles;
  foundation.totalBundles = mergedBundles.length;
  foundation.generatedAt = new Date().toISOString();

  writeJson(FOUNDATION_FILE, foundation);

  // Topic counts
  const topicCounts = mergedBundles.reduce((acc, b) => {
    acc[b.topic] = (acc[b.topic] || 0) + 1;
    return acc;
  }, {});

  console.log(JSON.stringify({
    added: added.length,
    skipped: skipped.length,
    newFoundationTotal: mergedBundles.length,
    topicCounts
  }, null, 2));
}

main();
