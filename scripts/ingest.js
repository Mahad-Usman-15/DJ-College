'use strict';

/**
 * RAG Knowledge Base Ingestion Script
 * Run: node scripts/ingest.js
 *
 * Reads all data files from app/data/, serializes each entry to plain text,
 * embeds with Google text-embedding-004, and upserts into Upstash Vector.
 * Produces ~71 knowledge chunks across 6 data sources.
 */

const fs = require('fs');
const path = require('path');
// ── Load .env.local ────────────────────────────────────────────────────────
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf-8')
    .split('\n')
    .forEach(line => {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.+)$/);
      if (m) {
        let val = m[2].trim();
        // Strip surrounding quotes (single or double)
        if ((val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[m[1].trim()] = val;
      }
    });
} else {
  console.warn('Warning: .env.local not found. Ensure env vars are set.');
}

// ── Alumni text data (inline — image imports excluded) ─────────────────────
const alumniItems = [
  { id: 'alumni-abdul-qadeer', name: 'Abdul Qadeer Khan', title: 'Nuclear Scientist & Head of Pakistan Nuclear Weapons Program', description: "A pioneering nuclear scientist whose groundbreaking work revolutionized Pakistan's scientific capabilities. Dr. Khan's visionary leadership and technical expertise established critical foundations in nuclear science, earning international recognition and shaping the nation's strategic development." },
  { id: 'alumni-ziaur-rahman', name: 'Ziaur Rahman', title: 'Former President of Bangladesh', description: "A visionary statesman who guided Bangladesh through pivotal moments in the nation's history. His leadership transformed institutional frameworks and fostered national development, leaving an enduring legacy of governance excellence and patriotic service." },
  { id: 'alumni-ashraf-habibullah', name: 'Ashraf Habibullah', title: 'President and CEO of Computers and Structures, Inc.', description: "A technology innovator who established and led one of the world's premier software engineering firms. Through strategic vision and technical excellence, he built a global enterprise that revolutionized structural analysis and design technology worldwide." },
  { id: 'alumni-pirzada-qasim', name: 'Pirzada Qasim', title: 'Ex Vice-Chancellor, University of Karachi & Ziauddin University', description: "An eminent academic leader whose contributions shaped higher education in Pakistan. As Vice-Chancellor of two prestigious institutions, Dr. Qasim elevated academic standards, advanced research initiatives, and established the foundation for institutional excellence." },
  { id: 'alumni-adeebul-hasan', name: 'Adeebul Hasan Rizvi', title: 'Founder of Sindh Institute of Urology & Transplantation (SIUT)', description: "A humanitarian medical pioneer who established SIUT, transforming healthcare delivery across South Asia. Dr. Rizvi's commitment to advancing transplantation medicine and providing world-class treatment to underserved communities exemplifies profound humanitarian impact." },
  { id: 'alumni-shahid-masood', name: 'Shahid Masood', title: 'Journalist and TV Anchor Person', description: "A distinguished media personality whose investigative journalism and dynamic anchoring shaped public discourse. Through incisive reporting and fearless questioning, Shahid Masood established himself as a voice for accountability and truth in journalism." },
  { id: 'alumni-kamran-ashraf', name: 'Kamran Ashraf', title: 'National Hockey Player', description: "An accomplished athlete who represented Pakistan with distinction on the international hockey stage. Kamran's dedication to athletic excellence and sportsmanship elevated the nation's sporting legacy and inspired generations of aspiring athletes." },
  { id: 'alumni-shahid-ali', name: 'Shahid Ali Khan', title: 'National Hockey Player', description: "A celebrated hockey champion whose exceptional skill and competitive spirit defined an era of Pakistani sports excellence. Shahid Ali Khan's contributions to national athletics strengthened Pakistan's position in international sporting competitions." },
  { id: 'alumni-sohail-rana', name: 'Sohail Rana', title: 'Film and Television Music Composer', description: "A visionary composer whose music became the heartbeat of Pakistani cinema and television. Sohail Rana's innovative compositions and artistic genius created timeless soundtracks that transcended generations and defined cultural moments in entertainment history." },
  { id: 'alumni-syed-murad', name: 'Syed Murad Ali Shah', title: 'Chief Minister of Sindh, Pakistan', description: "A respected political leader whose administrative vision and progressive policies transformed provincial governance. As Chief Minister, Syed Murad Ali Shah championed development initiatives, economic growth, and institutional reforms that advanced provincial prosperity." },
  { id: 'alumni-ghulam-hussain', name: 'Ghulam Hussain Hidayatullah', title: 'Former Chief Minister of Sindh', description: "A pioneering administrator whose leadership during formative years established foundational governance structures. Ghulam Hussain Hidayatullah's administrative acumen and vision for provincial development left an indelible mark on Sindh's political history." },
  { id: 'alumni-km-kundnani', name: 'K. M. Kundnani', title: 'Principal, D.G. National College (1947) & Founder, R.D. National College, Mumbai', description: "An educational visionary who transformed academic institutions into centers of excellence. K. M. Kundnani's foundational contributions to education shaped entire generations of scholars and established institutional legacies that endure across South Asia." },
  { id: 'alumni-dolarrai-mankad', name: 'Dolarrai Mankad', title: 'Renowned Sanskrit Scholar & First Vice-Chancellor of Saurashtra University', description: "A legendary Sanskrit scholar whose intellectual contributions elevated classical studies in academia. As the first Vice-Chancellor of Saurashtra University, Dolarrai Mankad established scholarly standards and fostered an environment of intellectual excellence and cultural preservation." },
  { id: 'alumni-moiz-ullah', name: 'Moiz Ullah Baig', title: 'International Scrabble Player, Pakistan Scrabble Champion & World Junior Champion (2018)', description: "A world-class intellect whose strategic mastery of language games brought international recognition to Pakistan. Moiz Ullah Baig's championship wins and competitive excellence demonstrated the nation's mental prowess on the global stage." },
  { id: 'alumni-jamshed-mehta', name: 'Jamshed Nusserwanjee Mehta', title: 'First Mayor of Karachi', description: "A founding civic leader whose administrative vision shaped Karachi's governance. As the city's first mayor, Jamshed Nusserwanjee Mehta established municipal institutions and urban development frameworks that transformed the metropolis into a thriving center of commerce and culture." },
];

// ── Events text data (inline — image imports excluded) ─────────────────────
const eventsItems = [
  { id: 'event-ptm', title: 'Parent Teacher Meeting', description: 'The Parent–Teacher Meeting provides an opportunity for meaningful dialogue between parents and faculty regarding student progress and development. It strengthens collaboration to ensure academic excellence and personal growth. The session fosters transparency, guidance, and a shared commitment to student success.' },
  { id: 'event-national-games', title: 'National Games', description: "The National Games celebrate athletic talent, teamwork, and sportsmanship among students from diverse institutions. Participants compete in various sporting events that promote discipline, resilience, and unity. The event reflects the college's dedication to physical education and competitive excellence." },
  { id: 'event-fire-drill', title: 'Fire Drill / Safety Event', description: "The Fire Safety Event focuses on educating students and staff about emergency preparedness and response procedures. Through practical demonstrations and guided drills, participants learn essential safety protocols. The initiative reinforces the college's commitment to maintaining a secure and responsible campus environment." },
];

// ── Serialization helpers ──────────────────────────────────────────────────

function serializeIdentity(d) {
  return `College: ${d.fullName} (also known as ${d.commonName}). Founded: ${d.foundedDate} by ${d.founder}. Original name: ${d.originalName}. Type: ${d.type}, ${d.gender}. Location: ${d.location}. Campus size: ${d.campusSize}. Website: ${d.website}. Affiliation: ${d.affiliationIntermediate} (intermediate), ${d.affiliationUndergraduate} (undergraduate). Architecture: ${d.architecture}. Heritage: ${d.heritageStatus}.`;
}

function serializeContact(d) {
  return `Contact DJ College. Address: ${d.address}. Phone numbers: ${d.phones.join(', ')}. Website: ${d.website}. Admissions portal: ${d.admissionsPortal}. Facebook: ${d.facebook}. Office hours: ${d.officeHours}.`;
}

function serializeHistory(items) {
  return 'DJ College History:\n' + items.map(h => `${h.year}: ${h.event}`).join('\n');
}

function serializeIntermediateProgram(p) {
  const core = p.subjects?.core?.join(', ') || '';
  const compulsory = p.subjects?.compulsory?.join(', ') || '';
  return `Intermediate Program: ${p.name}. Duration: ${p.duration}. ${p.description}${core ? ` Core subjects: ${core}.` : ''}${compulsory ? ` Compulsory subjects: ${compulsory}.` : ''}`;
}

function serializeUndergraduateProgram(p) {
  return `Undergraduate Program: ${p.name}. Duration: ${p.duration}. Affiliation: ${p.affiliation}. ${p.description}`;
}

function serializeAdmissionIntermediate(d) {
  const timeline = d.timeline;
  const docs = d.requiredDocuments.join('; ');
  return `Intermediate Admission at DJ College. Portal: ${d.portal} (${d.portalUrl}). Eligibility: ${d.eligibility}. Application window: ${timeline.applicationOpens} to ${timeline.applicationCloses}. Merit list: ${timeline.meritListAnnouncement}. Classes begin: ${timeline.classesBegin}. Required documents: ${docs}. Selection: ${d.selectionCriteria}. Note: ${d.note}`;
}

function serializeAdmissionUndergraduate(d) {
  return `Undergraduate Admission at DJ College. Eligibility: ${d.eligibility}. Deadline: ${d.applicationDeadline}. Selection: ${d.selectionCriteria}. Note: ${d.note}`;
}

function serializeFees(d) {
  const scholarships = d.scholarships.join('; ');
  return `DJ College Fee Structure. Type: ${d.type}. ${d.note} Application fee: ${d.approximate.applicationFee}. Processing fee: ${d.approximate.processingFee}. Tuition: ${d.approximate.tuition}. Scholarships available: ${scholarships}. Contact for fees: ${d.contactForFees}`;
}

function serializeFAQ(faq) {
  return `FAQ — Q: ${faq.question} A: ${faq.answer}`;
}

function serializeDepartment(dept) {
  return `Department at DJ College: ${dept.name}. ${dept.description}`;
}

function serializeFacility(f) {
  return `Facility at DJ College: ${f.name}. ${f.description}`;
}

function serializeBuildings(buildings) {
  return 'Campus Buildings & Areas:\n' + buildings.map(b => `${b.title}: ${b.text}`).join('\n');
}

function serializeAcademicPrograms(programs) {
  return `BSc Subject Options at DJ College: Students in the BSc (Traditional) pass program may choose any 3 subjects from: ${programs.join(', ')}.`;
}

function serializeAims(aims) {
  return 'DJ College Aims & Mission:\n' + aims.map(a => `${a.title}: ${a.text}`).join('\n');
}

function serializeAlumni(a) {
  return `Distinguished Alumni: ${a.name} — ${a.title}. ${a.description}`;
}

function serializeEvent(e) {
  return `College Event: ${e.title}. ${e.description}`;
}

// ── Main ingestion logic ───────────────────────────────────────────────────

async function main() {
  // Validate env vars
  const required = ['GOOGLE_GENERATIVE_AI_API_KEY', 'UPSTASH_VECTOR_REST_URL', 'UPSTASH_VECTOR_REST_TOKEN'];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length > 0) {
    console.error('Missing environment variables:', missing.join(', '));
    process.exit(1);
  }

  // Dynamic imports (ESM packages + ESM data files)
  console.log('Loading packages and data files...');
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const { Index } = await import('@upstash/vector');

  const {
    collegeIdentityData,
    contactData,
    historyData,
    programsData,
    admissionData,
    feeStructureData,
    generalFAQs,
  } = await import('../app/data/college-info.js');

  const { departmentsData } = await import('../app/data/admission.js');
  const { facilitiesInfoData } = await import('../app/data/facilities.js');
  const { facilitiesData: buildingsData, academicProgramsData, aimsData } = await import('../app/data/home.js');

  // Setup clients
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
  const index = new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN,
  });

  // Embed a single text chunk with RETRIEVAL_DOCUMENT task type
  async function embedChunk(text) {
    const result = await embeddingModel.embedContent({
      content: { parts: [{ text }] },
      taskType: 'RETRIEVAL_DOCUMENT',
      outputDimensionality: 786,
    });
    return result.embedding.values;
  }

  // Build all chunks
  const chunks = [];

  // college-info.js
  chunks.push({ id: 'info-identity', text: serializeIdentity(collegeIdentityData), category: 'identity', source: 'college-info.js' });
  chunks.push({ id: 'info-contact', text: serializeContact(contactData), category: 'contact', source: 'college-info.js' });
  chunks.push({ id: 'info-history', text: serializeHistory(historyData), category: 'history', source: 'college-info.js' });

  programsData.intermediate.forEach((p, i) => {
    chunks.push({ id: `prog-intermediate-${i}`, text: serializeIntermediateProgram(p), category: 'programs', source: 'college-info.js' });
  });
  programsData.undergraduate.forEach((p, i) => {
    chunks.push({ id: `prog-undergraduate-${i}`, text: serializeUndergraduateProgram(p), category: 'programs', source: 'college-info.js' });
  });

  chunks.push({ id: 'admission-intermediate', text: serializeAdmissionIntermediate(admissionData.intermediate), category: 'admissions', source: 'college-info.js' });
  chunks.push({ id: 'admission-undergraduate', text: serializeAdmissionUndergraduate(admissionData.undergraduate), category: 'admissions', source: 'college-info.js' });
  chunks.push({ id: 'info-fees', text: serializeFees(feeStructureData), category: 'fees', source: 'college-info.js' });

  generalFAQs.forEach((faq, i) => {
    chunks.push({ id: `faq-${i}`, text: serializeFAQ(faq), category: 'faq', source: 'college-info.js' });
  });

  // admission.js — departments
  departmentsData.forEach((dept, i) => {
    chunks.push({ id: `dept-${i}`, text: serializeDepartment(dept), category: 'departments', source: 'admission.js' });
  });

  // facilities.js
  facilitiesInfoData.forEach((f, i) => {
    chunks.push({ id: `facility-${i}`, text: serializeFacility(f), category: 'facilities', source: 'facilities.js' });
  });

  // home.js
  chunks.push({ id: 'home-buildings', text: serializeBuildings(buildingsData), category: 'campus', source: 'home.js' });
  chunks.push({ id: 'home-programs', text: serializeAcademicPrograms(academicProgramsData), category: 'programs', source: 'home.js' });
  chunks.push({ id: 'home-aims', text: serializeAims(aimsData), category: 'about', source: 'home.js' });

  // alumni (inline)
  alumniItems.forEach(a => {
    chunks.push({ id: a.id, text: serializeAlumni(a), category: 'alumni', source: 'alumni.js' });
  });

  // events (inline)
  eventsItems.forEach(e => {
    chunks.push({ id: e.id, text: serializeEvent(e), category: 'events', source: 'events.js' });
  });

  console.log(`Prepared ${chunks.length} chunks. Starting ingestion...\n`);

  let ingested = 0;
  let failed = 0;

  for (const chunk of chunks) {
    try {
      const vector = await embedChunk(chunk.text);
      await index.upsert([{
        id: chunk.id,
        vector,
        metadata: {
          text: chunk.text,
          category: chunk.category,
          source: chunk.source,
        },
      }]);
      ingested++;
      process.stdout.write(`  [${ingested}/${chunks.length}] ${chunk.id}\n`);
    } catch (err) {
      failed++;
      console.error(`  FAILED: ${chunk.id} — ${err.message}`);
    }
  }

  console.log(`\nDone. Total: ${ingested} chunks ingested, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
