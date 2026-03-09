// College general information — used as RAG knowledge base source
// Sources: Wikipedia, campus.pk, eduvision.edu.pk, seccap.com.pk, grokipedia.com

export const collegeIdentityData = {
  fullName: 'D.J. Sindh Government Science College',
  commonName: 'DJ Science College',
  urduName: 'ڈی جے سندھ گورنمنٹ سائنس کالج',
  foundedYear: 1887,
  foundedDate: 'January 17, 1887',
  founder: 'Diwan Dayaram Jethmal',
  originalName: 'Sindh Arts College',
  type: 'Public Government College',
  gender: 'Co-educational',
  campusSize: '16,485 square yards',
  location: 'Dr. Ziauddin Ahmed Road, Pakistan Chowk, Saddar Town, Karachi, Sindh, Pakistan',
  nearbyLandmark: 'Near Burns Road, Karachi',
  website: 'www.djedu.pk',
  affiliationIntermediate: 'Board of Intermediate Education Karachi (BIEK)',
  affiliationUndergraduate: 'University of Karachi',
  heritageStatus: 'Protected heritage site',
  architecture: 'Neoclassical / Gothic Revival (designed by architect James Strachan, completed 1892)',
  currentPrincipal:"Professor Mohsin Shaikh"
};

export const contactData = {
  address: 'Dr. Ziauddin Ahmed Road, Pakistan Chowk, Saddar Town, Karachi, Sindh, Pakistan',
  phones: ['021-32622070', '99211517', '0300-8885650'],
  website: 'https://www.djedu.pk',
  admissionsPortal: 'https://seccap.dgcs.gos.pk',
  facebook: 'https://www.facebook.com/djcollegeofficial/',
  officeHours: 'Monday to Saturday, 8:00 AM to 2:00 PM (during academic session)',
  note: 'For fee structure and specific admission queries, contact the admissions office directly or visit the official website.',
};

export const historyData = [
  {
    year: '1887',
    event: 'Founded on January 17, 1887 by philanthropist Diwan Dayaram Jethmal as "Sindh Arts College" on Bunder Road, starting with 28 students and 5 faculty members.',
  },
  {
    year: '1891',
    event: 'Renamed in honor of its founder Dayaram Jethmal (D.J.).',
  },
  {
    year: '1892',
    event: 'Permanent neoclassical building designed by architect James Strachan completed at a cost of Rs. 186,514. The building features a 431-foot facade and remains a landmark of Karachi.',
  },
  {
    year: '1947-1948',
    event: 'After partition, the college was transferred to the Government of Sindh on June 20, 1948. The arts faculty was closed and the institution refocused entirely on scientific education.',
  },
  {
    year: '1951',
    event: 'Affiliated with the University of Karachi for undergraduate degree programs.',
  },
  {
    year: '1951',
    event: 'The engineering section of the college was relocated and formed the foundation of NED University of Engineering & Technology.',
  },
  {
    year: '2006',
    event: 'M.Sc. block completed, adding advanced facilities for higher science education.',
  },
  {
    year: '2017',
    event: 'Pedestrian bridge inaugurated on campus.',
  },
];

export const programsData = {
  intermediate: [
    {
      name: 'FSc Pre-Engineering',
      duration: '2 years',
      subjects: {
        compulsory: ['English', 'Urdu', 'Islamic Studies / Pakistan Studies'],
        core: ['Physics', 'Chemistry', 'Mathematics'],
      },
      description: 'Prepares students for engineering universities. Core subjects are Physics, Chemistry, and Mathematics. Affiliated with Board of Intermediate Education Karachi (BIEK).',
    },
    {
      name: 'FSc Pre-Medical',
      duration: '2 years',
      subjects: {
        compulsory: ['English', 'Urdu', 'Islamic Studies / Pakistan Studies'],
        core: ['Physics', 'Chemistry', 'Biology'],
      },
      description: 'Prepares students for medical and biological sciences universities. Core subjects are Physics, Chemistry, and Biology. Affiliated with BIEK.',
    },
    {
      name: 'ICS (Intermediate Computer Science)',
      duration: '2 years',
      description: 'Focuses on computer science fundamentals alongside mathematics and physics. Suitable for students aiming for computer science and IT fields.',
    },
    {
      name: 'ICom (Intermediate Commerce)',
      duration: '2 years',
      description: 'Covers commerce, accounting, business, and economics. Prepares students for business administration and finance programs.',
    },
    {
      name: 'FA (Intermediate Arts)',
      duration: '2 years',
      description: 'Covers humanities, languages, and social sciences. Suitable for students interested in arts, literature, and social sciences.',
    },
  ],
  undergraduate: [
    {
      name: 'BS Computer Science',
      duration: '4 years (8 semesters)',
      affiliation: 'University of Karachi',
      description: 'A four-year degree program in computer science covering programming, data structures, software engineering, and computational problem-solving. The college has offered this program since 1951.',
    },
    {
      name: 'BS Chemistry',
      duration: '4 years (8 semesters)',
      affiliation: 'University of Karachi',
      description: 'A four-year degree covering organic, inorganic, and physical chemistry with laboratory-intensive coursework.',
    },
    {
      name: 'BS Physics',
      duration: '4 years (8 semesters)',
      affiliation: 'University of Karachi',
      description: 'A four-year degree in physics covering mechanics, electromagnetism, optics, and modern physics.',
    },
    {
      name: 'BSc (Traditional)',
      duration: '2 years (pass program)',
      affiliation: 'University of Karachi',
      description: 'Students choose any combination of three subjects from: Mathematics, Physics, Chemistry, Geology, Statistics, Microbiology, Biochemistry, Botany, and Zoology.',
    },
  ],
};

export const admissionData = {
  intermediate: {
    portal: 'SECCAP (Sindh Electronic Centralized College Admission Program)',
    portalUrl: 'https://seccap.dgcs.gos.pk',
    policy: 'Centralized Admission Policy (CAP) — Government of Sindh, College Education Department',
    eligibility: 'Successfully passed Class IX (Matric / SSC Part I)',
    timeline: {
      applicationOpens: 'June 15',
      applicationCloses: 'July 15',
      meritListAnnouncement: 'Late July',
      classesBegin: 'Early August',
    },
    requiredDocuments: [
      'Matric (Class IX) marksheet / result card',
      'Father or Guardian CNIC or B-Form',
      "Father's domicile certificate",
      'Recent passport-size photograph',
    ],
    selectionCriteria: 'Merit-based selection using SSC marks through the centralized SECCAP system.',
    note: 'Students apply online via the SECCAP portal. No direct applications to the college for intermediate admission.',
  },
  undergraduate: {
    eligibility: 'Passed FSc / Intermediate with relevant subjects',
    applicationDeadline: 'Contact college admissions office or visit www.djedu.pk for current dates',
    selectionCriteria: 'Merit-based, as per University of Karachi guidelines',
    note: 'For BS programs, apply directly to the college. Contact the admissions office for current merit thresholds and deadlines.',
  },
};

export const feeStructureData = {
  type: 'Public (Government-subsidized)',
  note: 'D.J. College is a public sector institution with significantly subsidized fees compared to private colleges. Exact fee amounts vary per session and are announced at the time of admission.',
  approximate: {
    applicationFee: 'PKR 500 – 1,000 (Intermediate)',
    processingFee: 'PKR 1,000 (Undergraduate)',
    tuition: 'Subsidized — exact amounts confirmed at admission time',
  },
  scholarships: [
    'Merit-based scholarships for top-performing students',
    'Need-based financial assistance for deserving students',
    'University of Karachi Alumni Association (UKAA) scholarships for science, engineering, pharmacy, and medical programs',
    'Government of Sindh scholarship schemes',
  ],
  contactForFees: 'Call 021-32622070 or 0300-8885650, or visit www.djedu.pk for current fee details.',
};

export const generalFAQs = [
  {
    question: 'What is DJ College?',
    answer: 'D.J. Sindh Government Science College (DJ Science College) is one of the oldest and most prestigious public colleges in Karachi, Pakistan. Founded in 1887, it is affiliated with the Board of Intermediate Education Karachi (BIEK) for intermediate programs and the University of Karachi for undergraduate degrees.',
  },
  {
    question: 'Where is DJ College located?',
    answer: 'The college is located at Dr. Ziauddin Ahmed Road, Pakistan Chowk, Saddar Town, Karachi, Sindh, Pakistan — near Burns Road.',
  },
  {
    question: 'How do I apply for admission?',
    answer: 'For intermediate programs (FSc, ICS, ICom, FA), apply online through the SECCAP portal at seccap.dgcs.gos.pk. The application window typically opens June 15 and closes July 15. For undergraduate (BS) programs, contact the admissions office directly or visit www.djedu.pk.',
  },
  {
    question: 'What programs does DJ College offer?',
    answer: 'At the intermediate level: FSc Pre-Engineering, FSc Pre-Medical, ICS, ICom, and FA. At the undergraduate level: BS Computer Science, BS Chemistry, BS Physics, and BSc combinations from Mathematics, Geology, Statistics, Microbiology, Biochemistry, Botany, and Zoology.',
  },
  {
    question: 'What is the fee at DJ College?',
    answer: 'DJ College is a government institution with heavily subsidized fees. Exact amounts are announced at the time of admission. For current fee details, call 021-32622070 or visit www.djedu.pk.',
  },
  {
    question: 'Is DJ College co-educational?',
    answer: 'Yes, D.J. Sindh Government Science College is a co-educational institution.',
  },
  {
    question: 'What board is DJ College affiliated with?',
    answer: 'For intermediate programs, the college is affiliated with the Board of Intermediate Education Karachi (BIEK). For undergraduate programs, it is affiliated with the University of Karachi.',
  },
  {
    question: 'Does DJ College offer scholarships?',
    answer: 'Yes. The college offers merit-based and need-based scholarships, including scholarships from the University of Karachi Alumni Association (UKAA) and Government of Sindh schemes.',
  },
  {
    question: 'What are the contact details for DJ College?',
    answer: 'Phone: 021-32622070 or 0300-8885650. Website: www.djedu.pk. Address: Dr. Ziauddin Ahmed Road, Pakistan Chowk, Saddar Town, Karachi.',
  },
  {
    question: 'When was DJ College established?',
    answer: 'DJ College was founded on January 17, 1887 by philanthropist Diwan Dayaram Jethmal as "Sindh Arts College". It is one of the oldest educational institutions in Sindh.',
  },
];
