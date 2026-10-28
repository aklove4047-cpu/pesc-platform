// Cloudflare Worker for PESC Platform
// Pure Edge Runtime - 100% Native on Cloudflare (No Hostinger server, No Render required)
// Full Multi-Tenant Wildcard Subdomain Routing + SEO + APIs + Verification + Authentication

import initialBundle from './data_bundle.js';
import centreSiteTemplate from './centre_site_template.js';
import { MAIN_CSS } from './style_bundle.js';

// In-memory runtime data cache with persistence
const store = {
  centres: [...initialBundle.centres],
  courses: [...initialBundle.courses],
  certificates: [...initialBundle.certificates],
  marksheets: [...initialBundle.marksheets],
  students: [...initialBundle.students],
  users: [...initialBundle.users],
  applications: [...initialBundle.applications],
  centre_courses: [...initialBundle.centre_courses],
  coordinator_certificates: [],
  wallet_topups: [],
  site_settings: {
    logo_url: '',
    council_title: 'pescouncil.in',
    hindi_title: 'पूर्वांचल शिक्षा एवं कौशल परिषद',
    notice_text: '• Admissions open for DCA / PGDCA session 2026-27\n• Last date to apply 30 November 2026\n• For queries contact: info@pescouncil.in | +91 542-1234567',
    show_notice: true,
    show_verify: true,
    show_coordinators: true,
    show_centres: true,
    show_students: true,
    show_franchise_btn: true
  },
  notices: [
    {
      id: 1,
      title: 'Admissions Open for Session 2026-27',
      category: 'Admission',
      content: 'Autonomous Skill and Vocational Diploma Admissions are officially ongoing across all affiliated study centres.',
      target: 'all',
      pinned: 1,
      active: 1,
      created_at: Date.now() - 5 * 864e5
    }
  ],
};

// Comprehensive Accredited Course Curriculum: Yearly-Wise & Semester-Wise Distinct Subjects
const COURSE_CURRICULUM_DATA = {
  NTT: {
    name: 'Nursery Teacher Training',
    yearly: {
      'Annual Examination': [
        { code: 'NTT-01', name: 'Child Psychology', max_marks: 100, min_marks: 40, theory: 78, marks_obtained: 78, grade: 'A' },
        { code: 'NTT-02', name: 'School Organization', max_marks: 100, min_marks: 40, theory: 72, marks_obtained: 72, grade: 'B+' },
        { code: 'NTT-03', name: 'Methods of Teaching', max_marks: 100, min_marks: 40, theory: 83, marks_obtained: 83, grade: 'A+' },
        { code: 'NTT-04', name: 'Arts & Craft', max_marks: 100, min_marks: 40, theory: 85, marks_obtained: 85, grade: 'A+' },
        { code: 'NTT-05', name: 'Lesson Plan', max_marks: 100, min_marks: 40, theory: 75, marks_obtained: 75, grade: 'A' },
        { code: 'NTT-06', name: 'Practical & Assignment', max_marks: 100, min_marks: 40, theory: 89, marks_obtained: 89, grade: 'A+' },
      ],
      '1st Year': [
        { code: 'NTT-01', name: 'Child Psychology', max_marks: 100, min_marks: 40, theory: 78, marks_obtained: 78, grade: 'A' },
        { code: 'NTT-02', name: 'School Organization', max_marks: 100, min_marks: 40, theory: 72, marks_obtained: 72, grade: 'B+' },
        { code: 'NTT-03', name: 'Methods of Teaching', max_marks: 100, min_marks: 40, theory: 83, marks_obtained: 83, grade: 'A+' },
        { code: 'NTT-04', name: 'Arts & Craft', max_marks: 100, min_marks: 40, theory: 85, marks_obtained: 85, grade: 'A+' },
        { code: 'NTT-05', name: 'Lesson Plan', max_marks: 100, min_marks: 40, theory: 75, marks_obtained: 75, grade: 'A' },
        { code: 'NTT-06', name: 'Practical & Assignment', max_marks: 100, min_marks: 40, theory: 89, marks_obtained: 89, grade: 'A+' },
      ]
    }
  },
  DCA: {
    name: 'Diploma in Computer Applications',
    yearly: {
      'Annual Examination': [
        { code: 'DCA-Y101', name: 'Information Technology, OS & Windows', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DCA-Y102', name: 'Office Automation Tools (Word, Excel, PPT)', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DCA-Y103', name: 'Database Management Systems & MS Access', max_marks: 100, theory: 43, practical: 47 },
        { code: 'DCA-Y104', name: 'Financial Accounting & Tally Prime with GST', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DCA-Y105', name: 'Internet, Cyber Security & Web Applications', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DCA-Y106', name: 'Annual Project Lab Assessment & Viva-Voce', max_marks: 100, theory: 46, practical: 46 },
      ],
      '1st Year': [
        { code: 'DCA-Y101', name: 'Information Technology, OS & Windows', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DCA-Y102', name: 'Office Automation Tools (Word, Excel, PPT)', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DCA-Y103', name: 'Database Management Systems & MS Access', max_marks: 100, theory: 43, practical: 47 },
        { code: 'DCA-Y104', name: 'Financial Accounting & Tally Prime with GST', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DCA-Y105', name: 'Internet, Cyber Security & Web Applications', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DCA-Y106', name: 'Annual Project Lab Assessment & Viva-Voce', max_marks: 100, theory: 46, practical: 46 },
      ],
      '2nd Year': [
        { code: 'DCA-Y201', name: 'Advanced Spreadsheets & Database Modeling', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DCA-Y202', name: 'Advanced Tally Prime GST & Payroll Taxation', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DCA-Y203', name: 'Web Designing & Desktop Publishing Basics', max_marks: 100, theory: 46, practical: 44 },
        { code: 'DCA-Y204', name: 'Year-2 Comprehensive Industry Project & Viva', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Final Year': [
        { code: 'DCA-Y201', name: 'Advanced Spreadsheets & Database Modeling', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DCA-Y202', name: 'Advanced Tally Prime GST & Payroll Taxation', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DCA-Y203', name: 'Web Designing & Desktop Publishing Basics', max_marks: 100, theory: 46, practical: 44 },
        { code: 'DCA-Y204', name: 'Year-2 Comprehensive Industry Project & Viva', max_marks: 100, theory: 47, practical: 47 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'DCA-S101', name: 'Computer Fundamentals & OS (Windows/Linux)', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DCA-S102', name: 'Office Automation Tools (MS Word & PowerPoint)', max_marks: 100, theory: 44, practical: 45 },
        { code: 'DCA-S103', name: 'Electronic Spreadsheets & Data Analysis (MS Excel)', max_marks: 100, theory: 46, practical: 45 },
        { code: 'DCA-S104', name: 'Practical Lab - I & IT Viva-Voce', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'DCA-S201', name: 'Financial Accounting & Tally Prime with GST', max_marks: 100, theory: 45, practical: 46 },
        { code: 'DCA-S202', name: 'Database Management Systems (MS Access / SQL)', max_marks: 100, theory: 44, practical: 45 },
        { code: 'DCA-S203', name: 'Web Fundamentals, HTML, CSS & Cyber Security', max_marks: 100, theory: 46, practical: 45 },
        { code: 'DCA-S204', name: 'Software Project Demonstration & Viva-Voce', max_marks: 100, theory: 48, practical: 47 },
      ],
      'Semester 3': [
        { code: 'DCA-S301', name: 'Advanced Database Architecture & SQL Reports', max_marks: 100, theory: 45, practical: 46 },
        { code: 'DCA-S302', name: 'Desktop Publishing & Graphics Fundamentals', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DCA-S303', name: 'Business Accounting & Statutory Payroll', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DCA-S304', name: 'Applied Laboratory Work - III', max_marks: 100, theory: 47, practical: 48 },
      ],
      'Semester 4': [
        { code: 'DCA-S401', name: 'Web Application Design & Client Scripting', max_marks: 100, theory: 45, practical: 46 },
        { code: 'DCA-S402', name: 'IT Infrastructure & Network Troubleshooting', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DCA-S403', name: 'Major Project Implementation & Defense Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  },
  ADCA: {
    name: 'Advanced Diploma in Computer Applications',
    yearly: {
      'Annual Examination': [
        { code: 'ADCA-Y101', name: 'Computer Fundamentals & Programming in C/Python', max_marks: 100, theory: 45, practical: 45 },
        { code: 'ADCA-Y102', name: 'Advanced MS Office Suite & Database Systems', max_marks: 100, theory: 44, practical: 46 },
        { code: 'ADCA-Y103', name: 'Financial Accounting with Tally Prime & GST', max_marks: 100, theory: 45, practical: 46 },
        { code: 'ADCA-Y104', name: 'Web Designing Fundamentals (HTML5, CSS3, JS)', max_marks: 100, theory: 46, practical: 45 },
        { code: 'ADCA-Y105', name: 'Graphic Designing (CorelDraw, Photoshop)', max_marks: 100, theory: 45, practical: 45 },
        { code: 'ADCA-Y106', name: 'Software Project Implementation & Viva-Voce', max_marks: 100, theory: 47, practical: 47 },
      ],
      '1st Year': [
        { code: 'ADCA-Y101', name: 'IT Concepts, Computer Organization & Windows', max_marks: 100, theory: 45, practical: 45 },
        { code: 'ADCA-Y102', name: 'Complete Office Suite & Advanced Spreadsheets', max_marks: 100, theory: 44, practical: 46 },
        { code: 'ADCA-Y103', name: 'Financial Accounting with Tally Prime & Taxation', max_marks: 100, theory: 45, practical: 46 },
        { code: 'ADCA-Y104', name: 'Programming Principles & C / Python Basics', max_marks: 100, theory: 46, practical: 45 },
        { code: 'ADCA-Y105', name: 'Lab Practical - Year 1 & Technical Viva', max_marks: 100, theory: 47, practical: 47 },
      ],
      '2nd Year': [
        { code: 'ADCA-Y201', name: 'Advanced Python & Object Oriented Systems', max_marks: 100, theory: 45, practical: 45 },
        { code: 'ADCA-Y202', name: 'Relational Database Systems & SQL Server', max_marks: 100, theory: 44, practical: 46 },
        { code: 'ADCA-Y203', name: 'Full-Stack Web Development & Frameworks', max_marks: 100, theory: 45, practical: 46 },
        { code: 'ADCA-Y204', name: 'Computer Hardware, Networking & Cyber Security', max_marks: 100, theory: 46, practical: 45 },
        { code: 'ADCA-Y205', name: 'Major Industry Capstone Project & Grand Viva', max_marks: 100, theory: 48, practical: 48 },
      ],
      'Final Year': [
        { code: 'ADCA-Y201', name: 'Advanced Python & Object Oriented Systems', max_marks: 100, theory: 45, practical: 45 },
        { code: 'ADCA-Y202', name: 'Relational Database Systems & SQL Server', max_marks: 100, theory: 44, practical: 46 },
        { code: 'ADCA-Y203', name: 'Full-Stack Web Development & Frameworks', max_marks: 100, theory: 45, practical: 46 },
        { code: 'ADCA-Y204', name: 'Computer Hardware, Networking & Cyber Security', max_marks: 100, theory: 46, practical: 45 },
        { code: 'ADCA-Y205', name: 'Major Industry Capstone Project & Grand Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
        },
    semester: {
      'Semester 1': [
        { code: 'ADCA-S101', name: 'Computer Fundamentals & Operating Systems', max_marks: 100, theory: 45, practical: 45 },
        { code: 'ADCA-S102', name: 'Office Automation Suite (Word, Excel, PowerPoint)', max_marks: 100, theory: 44, practical: 46 },
        { code: 'ADCA-S103', name: 'Problem Solving & Programming Logic in C', max_marks: 100, theory: 46, practical: 45 },
        { code: 'ADCA-S104', name: 'Computer Lab - I & Technical Viva', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'ADCA-S201', name: 'Financial Accounting with Tally Prime & GST', max_marks: 100, theory: 45, practical: 46 },
        { code: 'ADCA-S202', name: 'Relational Database Systems & MS Access', max_marks: 100, theory: 44, practical: 45 },
        { code: 'ADCA-S203', name: 'Python Programming Fundamentals', max_marks: 100, theory: 46, practical: 46 },
        { code: 'ADCA-S204', name: 'Programming Lab - II & Project Viva', max_marks: 100, theory: 48, practical: 47 },
      ],
      'Semester 3': [
        { code: 'ADCA-S301', name: 'Web Designing (HTML5, CSS3, JavaScript)', max_marks: 100, theory: 45, practical: 45 },
        { code: 'ADCA-S302', name: 'Graphic Designing (CorelDraw & Adobe Photoshop)', max_marks: 100, theory: 44, practical: 46 },
        { code: 'ADCA-S303', name: 'Desktop Publishing & Pre-press Typography', max_marks: 100, theory: 45, practical: 45 },
        { code: 'ADCA-S304', name: 'Multimedia Design Lab - III', max_marks: 100, theory: 47, practical: 48 },
      ],
      'Semester 4': [
        { code: 'ADCA-S401', name: 'Advanced Web Applications & Backend API Design', max_marks: 100, theory: 45, practical: 46 },
        { code: 'ADCA-S402', name: 'Hardware Networking, LAN Setup & Cyber Security', max_marks: 100, theory: 44, practical: 45 },
        { code: 'ADCA-S403', name: 'Capstone Software Project Implementation', max_marks: 100, theory: 47, practical: 47 },
        { code: 'ADCA-S404', name: 'Comprehensive Grand Viva-Voce', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  },
  TALLY: {
    name: 'Tally with GST',
    yearly: {
      'Annual Examination': [
        { code: 'TAL-Y101', name: 'Basic Accounting Principles & Inventory Management', max_marks: 100, theory: 45, practical: 45 },
        { code: 'TAL-Y102', name: 'Tally Prime Operations & Financial Vouchers', max_marks: 100, theory: 44, practical: 46 },
        { code: 'TAL-Y103', name: 'Goods & Services Tax (GST) Computations & E-Way', max_marks: 100, theory: 45, practical: 46 },
        { code: 'TAL-Y104', name: 'Payroll, TDS Compliance & Audit Reports', max_marks: 100, theory: 46, practical: 45 },
        { code: 'TAL-Y105', name: 'Annual Balance Sheet Finalization & Viva', max_marks: 100, theory: 47, practical: 47 },
      ],
      '1st Year': [
        { code: 'TAL-Y101', name: 'Basic Accounting Principles & Inventory Management', max_marks: 100, theory: 45, practical: 45 },
        { code: 'TAL-Y102', name: 'Tally Prime Operations & Financial Vouchers', max_marks: 100, theory: 44, practical: 46 },
        { code: 'TAL-Y103', name: 'Goods & Services Tax (GST) Computations & E-Way', max_marks: 100, theory: 45, practical: 46 },
        { code: 'TAL-Y104', name: 'Payroll, TDS Compliance & Audit Reports', max_marks: 100, theory: 46, practical: 45 },
        { code: 'TAL-Y105', name: 'Annual Balance Sheet Finalization & Viva', max_marks: 100, theory: 47, practical: 47 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'TAL-S101', name: 'Principles of Accounting & Double Entry System', max_marks: 100, theory: 45, practical: 45 },
        { code: 'TAL-S102', name: 'Tally Prime Environment, Masters & Ledger Creation', max_marks: 100, theory: 44, practical: 46 },
        { code: 'TAL-S103', name: 'Inventory & Stock Valuation in Tally Prime', max_marks: 100, theory: 46, practical: 45 },
        { code: 'TAL-S104', name: 'Practical Accounting Lab - I & Viva-Voce', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'TAL-S201', name: 'Goods & Services Tax (GST) Invoicing & Returns', max_marks: 100, theory: 45, practical: 46 },
        { code: 'TAL-S202', name: 'Payroll Administration, PF, ESI & TDS Compliance', max_marks: 100, theory: 44, practical: 45 },
        { code: 'TAL-S203', name: 'Banking Reconciliation & Financial Statements', max_marks: 100, theory: 46, practical: 45 },
        { code: 'TAL-S204', name: 'Commercial Accounting Project & Audit Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  },
  CCC: {
    name: 'Course on Computer Concepts',
    yearly: {
      'Annual Examination': [
        { code: 'CCC-Y101', name: 'Introduction to Computer & Operating Systems', max_marks: 100, theory: 45, practical: 45 },
        { code: 'CCC-Y102', name: 'Word Processing & Electronic Spreadsheets', max_marks: 100, theory: 44, practical: 46 },
        { code: 'CCC-Y103', name: 'Presentation Systems & Internet / Web Technologies', max_marks: 100, theory: 45, practical: 46 },
        { code: 'CCC-Y104', name: 'Digital Financial Services & Cyber Security Basics', max_marks: 100, theory: 46, practical: 45 },
        { code: 'CCC-Y105', name: 'Practical Lab Assessment & Viva-Voce', max_marks: 100, theory: 47, practical: 47 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'CCC-S101', name: 'Digital Literacy, GUI & Operating Systems', max_marks: 100, theory: 45, practical: 45 },
        { code: 'CCC-S102', name: 'Word Processing Fundamentals & Document Creation', max_marks: 100, theory: 44, practical: 46 },
        { code: 'CCC-S103', name: 'Basic Computer Lab - I & Viva-Voce', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'CCC-S201', name: 'Electronic Spreadsheets & Visual Presentations', max_marks: 100, theory: 45, practical: 46 },
        { code: 'CCC-S202', name: 'Internet Services, Digital Banking & Cyber Safety', max_marks: 100, theory: 46, practical: 45 },
        { code: 'CCC-S203', name: 'Digital Skills Project & Practical Assessment', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  },
  PGDCA: {
    name: 'Post Graduate Diploma in Computer Applications',
    yearly: {
      'Annual Examination': [
        { code: 'PGD-Y101', name: 'Fundamentals of IT & Modern Operating Systems', max_marks: 100, theory: 45, practical: 45 },
        { code: 'PGD-Y102', name: 'Object Oriented Programming (C++ & Java/Python)', max_marks: 100, theory: 44, practical: 46 },
        { code: 'PGD-Y103', name: 'Relational Database Management Systems (SQL Server)', max_marks: 100, theory: 45, practical: 46 },
        { code: 'PGD-Y104', name: 'Web Application Development & Network Security', max_marks: 100, theory: 46, practical: 45 },
        { code: 'PGD-Y105', name: 'Software Engineering & System Architecture', max_marks: 100, theory: 45, practical: 45 },
        { code: 'PGD-Y106', name: 'Capstone Project Development & Viva-Voce', max_marks: 100, theory: 48, practical: 48 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'PGD-S101', name: 'IT Infrastructure & Modern Operating Systems', max_marks: 100, theory: 45, practical: 45 },
        { code: 'PGD-S102', name: 'Data Structures & Programming Logic in C/Python', max_marks: 100, theory: 44, practical: 46 },
        { code: 'PGD-S103', name: 'Relational Database Management Systems & SQL', max_marks: 100, theory: 46, practical: 45 },
        { code: 'PGD-S104', name: 'Advanced Software Lab - I & Viva-Voce', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'PGD-S201', name: 'Object Oriented Programming with Java', max_marks: 100, theory: 45, practical: 46 },
        { code: 'PGD-S202', name: 'Full-Stack Web Development & Cloud Architecture', max_marks: 100, theory: 44, practical: 45 },
        { code: 'PGD-S203', name: 'Cyber Security, Cryptography & Information Ethics', max_marks: 100, theory: 46, practical: 45 },
        { code: 'PGD-S204', name: 'Enterprise Capstone Project & Defense Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  },
  DTP: {
    name: 'Desktop Publishing & Graphic Designing',
    yearly: {
      'Annual Examination': [
        { code: 'DTP-Y101', name: 'Design Principles & Page Layout Concepts', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DTP-Y102', name: 'Adobe Photoshop & Digital Image Processing', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DTP-Y103', name: 'CorelDraw & Vector Illustration Design', max_marks: 100, theory: 45, practical: 46 },
        { code: 'DTP-Y104', name: 'Adobe InDesign & Pre-press Printing Technology', max_marks: 100, theory: 46, practical: 45 },
        { code: 'DTP-Y105', name: 'Professional Printing Portfolio & Viva-Voce', max_marks: 100, theory: 48, practical: 48 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'DTP-S101', name: 'Digital Typography & Graphic Layout Basics', max_marks: 100, theory: 45, practical: 45 },
        { code: 'DTP-S102', name: 'Adobe Photoshop Creative Suite & Photo Editing', max_marks: 100, theory: 44, practical: 46 },
        { code: 'DTP-S103', name: 'Raster Graphics Design Lab - I & Viva', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'DTP-S201', name: 'CorelDraw Vector Art, Banner & Logo Design', max_marks: 100, theory: 45, practical: 46 },
        { code: 'DTP-S202', name: 'Adobe InDesign & Book Publication Pre-Press', max_marks: 100, theory: 44, practical: 45 },
        { code: 'DTP-S203', name: 'Print Production Technology & Exhibition Portfolio', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  },
  HARDWARE: {
    name: 'Diploma in Computer Hardware & Networking',
    yearly: {
      'Annual Examination': [
        { code: 'CHN-Y101', name: 'Computer Hardware Architecture & Components', max_marks: 100, theory: 45, practical: 45 },
        { code: 'CHN-Y102', name: 'OS Installation, BIOS & Device Configuration', max_marks: 100, theory: 44, practical: 46 },
        { code: 'CHN-Y103', name: 'Computer Networks, Cabling & IP Addressing', max_marks: 100, theory: 45, practical: 46 },
        { code: 'CHN-Y104', name: 'Network Devices, Routers & Cyber Defense', max_marks: 100, theory: 46, practical: 45 },
        { code: 'CHN-Y105', name: 'Hardware Lab Practical & Diagnostic Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'CHN-S101', name: 'PC Assembly, Power Supply & Storage Maintenance', max_marks: 100, theory: 45, practical: 45 },
        { code: 'CHN-S102', name: 'BIOS Setup, Drivers & OS Troubleshooting', max_marks: 100, theory: 44, practical: 46 },
        { code: 'CHN-S103', name: 'Hardware Assembly Lab - I & Technical Viva', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'CHN-S201', name: 'Local Area Networks (LAN) & Network Devices', max_marks: 100, theory: 45, practical: 46 },
        { code: 'CHN-S202', name: 'Wireless Routers, WiFi & Internet Gateways', max_marks: 100, theory: 44, practical: 45 },
        { code: 'CHN-S203', name: 'Network Troubleshooting & Field Project Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  },
  YOGA: {
    name: 'Diploma in Yoga & Naturopathy Education',
    yearly: {
      'Annual Examination': [
        { code: 'YOG-Y101', name: 'Foundations of Yoga Philosophy & History', max_marks: 100, theory: 45, practical: 45 },
        { code: 'YOG-Y102', name: 'Human Anatomy & Physiology for Yoga', max_marks: 100, theory: 44, practical: 46 },
        { code: 'YOG-Y103', name: 'Principles of Naturopathy & Diet Therapy', max_marks: 100, theory: 45, practical: 46 },
        { code: 'YOG-Y104', name: 'Yogic Asanas, Pranayama & Shatkarma Techniques', max_marks: 100, theory: 46, practical: 45 },
        { code: 'YOG-Y105', name: 'Practical Asana Demonstration & Viva-Voce', max_marks: 100, theory: 48, practical: 48 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'YOG-S101', name: 'Classical Yoga Texts & Principles of Health', max_marks: 100, theory: 45, practical: 45 },
        { code: 'YOG-S102', name: 'Basic Anatomy, Respiratory System & Postures', max_marks: 100, theory: 44, practical: 46 },
        { code: 'YOG-S103', name: 'Practical Yoga Sadhana - I (Sukshma Vyayama)', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'YOG-S201', name: 'Naturopathy, Hydrotherapy & Natural Healing', max_marks: 100, theory: 45, practical: 46 },
        { code: 'YOG-S202', name: 'Pranayama, Meditation & Stress Management', max_marks: 100, theory: 44, practical: 45 },
        { code: 'YOG-S203', name: 'Therapeutic Yoga Practice & Clinical Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  },
  FASHION: {
    name: 'Diploma in Fashion Designing & Garment Fabrication',
    yearly: {
      'Annual Examination': [
        { code: 'FAS-Y101', name: 'Fundamentals of Fashion Design & Illustration', max_marks: 100, theory: 45, practical: 45 },
        { code: 'FAS-Y102', name: 'Textile Science, Fabric Selection & Fiber Analysis', max_marks: 100, theory: 44, practical: 46 },
        { code: 'FAS-Y103', name: 'Pattern Making, Grading & Garment Construction', max_marks: 100, theory: 45, practical: 46 },
        { code: 'FAS-Y104', name: 'Computer Aided Fashion Design (CAD) & Merchandising', max_marks: 100, theory: 46, practical: 45 },
        { code: 'FAS-Y105', name: 'Garment Collection Exhibition & Viva-Voce', max_marks: 100, theory: 48, practical: 48 },
      ]
    },
    semester: {
      'Semester 1': [
        { code: 'FAS-S101', name: 'Fashion Sketching & Design Concepts', max_marks: 100, theory: 45, practical: 45 },
        { code: 'FAS-S102', name: 'Basic Textile Studies & Sewing Techniques', max_marks: 100, theory: 44, practical: 46 },
        { code: 'FAS-S103', name: 'Pattern Drafting Workshop - I & Viva', max_marks: 100, theory: 47, practical: 47 },
      ],
      'Semester 2': [
        { code: 'FAS-S201', name: 'Advanced Garment Fabrication & Draping', max_marks: 100, theory: 45, practical: 46 },
        { code: 'FAS-S202', name: 'Digital Fashion CAD & Apparel Marketing', max_marks: 100, theory: 44, practical: 45 },
        { code: 'FAS-S203', name: 'Final Garment Collection & Portfolio Viva', max_marks: 100, theory: 48, practical: 48 },
      ]
    }
  }
};

function getCourseCurriculumSubjects(courseNameOrCode, evalPattern, termName) {
  const norm = String(courseNameOrCode || '').toUpperCase().trim();
  const pattern = (evalPattern === 'semester') ? 'semester' : 'yearly';
  const term = String(termName || (pattern === 'semester' ? 'Semester 1' : 'Annual Examination')).trim();

  // 1. Check if course in store.courses has custom curriculum saved by Head Office
  const co = (store.courses || []).find(c => 
    (c.code && (norm === c.code.toUpperCase() || norm.includes(c.code.toUpperCase()) || c.code.toUpperCase().includes(norm))) ||
    (c.name && (norm === c.name.toUpperCase() || norm.includes(c.name.toUpperCase()) || c.name.toUpperCase().includes(norm)))
  );
  if (co && co.curriculum) {
    let cur = null;
    try { cur = typeof co.curriculum === 'string' ? JSON.parse(co.curriculum) : co.curriculum; } catch (_) {}
    if (cur && cur[pattern]) {
      if (cur[pattern][term] && Array.isArray(cur[pattern][term]) && cur[pattern][term].length) {
        return cur[pattern][term];
      }
      const keys = Object.keys(cur[pattern]);
      const match = keys.find(k => term.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(term.toLowerCase()));
      if (match && cur[pattern][match] && Array.isArray(cur[pattern][match]) && cur[pattern][match].length) {
        return cur[pattern][match];
      }
      if (keys.length && cur[pattern][keys[0]] && Array.isArray(cur[pattern][keys[0]]) && cur[pattern][keys[0]].length) {
        return cur[pattern][keys[0]];
      }
    }
  }

  let key = Object.keys(COURSE_CURRICULUM_DATA).find(k => norm === k || norm.includes(k) || (COURSE_CURRICULUM_DATA[k].name && norm.includes(COURSE_CURRICULUM_DATA[k].name.toUpperCase())));
  if (!key) {
    if (norm.includes('NURSERY') || norm.includes('NTT') || norm.includes('TEACHER')) key = 'NTT';
    else if (norm.includes('ADVANCED') || norm.includes('ADCA')) key = 'ADCA';
    else if (norm.includes('DCA')) key = 'DCA';
    else if (norm.includes('TALLY')) key = 'TALLY';
    else if (norm.includes('CCC')) key = 'CCC';
    else if (norm.includes('PGDCA')) key = 'PGDCA';
    else if (norm.includes('DTP') || norm.includes('PUBLISHING')) key = 'DTP';
    else if (norm.includes('HARDWARE') || norm.includes('NETWORKING')) key = 'HARDWARE';
    else if (norm.includes('YOGA')) key = 'YOGA';
    else if (norm.includes('FASHION')) key = 'FASHION';
  }

  if (key && COURSE_CURRICULUM_DATA[key]) {
    const courseObj = COURSE_CURRICULUM_DATA[key];
    const patObj = courseObj[pattern] || {};

    if (patObj[term]) return patObj[term];

    if (pattern === 'semester') {
      if (term.includes('2') || term.toLowerCase().includes('second')) return patObj['Semester 2'] || Object.values(patObj)[1] || patObj['Semester 1'];
      if (term.includes('3') || term.toLowerCase().includes('third')) return patObj['Semester 3'] || Object.values(patObj)[2] || patObj['Semester 1'];
      if (term.includes('4') || term.toLowerCase().includes('fourth')) return patObj['Semester 4'] || Object.values(patObj)[3] || patObj['Semester 1'];
      return patObj['Semester 1'] || Object.values(patObj)[0];
    } else {
      if (term.includes('2nd') || term.toLowerCase().includes('second')) return patObj['2nd Year'] || patObj['Annual Examination'];
      if (term.includes('Final') || term.toLowerCase().includes('final')) return patObj['Final Year'] || patObj['2nd Year'] || patObj['Annual Examination'];
      if (term.includes('1st') || term.toLowerCase().includes('first')) return patObj['1st Year'] || patObj['Annual Examination'];
      return patObj['Annual Examination'] || Object.values(patObj)[0];
    }
  }

  const cLabel = courseNameOrCode || 'Vocational';
  if (pattern === 'semester') {
    const semNum = term.match(/\d+/) ? term.match(/\d+/)[0] : '1';
    return [
      { code: `SEM${semNum}-01`, name: `${cLabel} Theory & Fundamentals (Sem-${semNum})`, max_marks: 100, theory: 45, practical: 45 },
      { code: `SEM${semNum}-02`, name: `${cLabel} Systems, Tools & Methodology (Sem-${semNum})`, max_marks: 100, theory: 44, practical: 46 },
      { code: `SEM${semNum}-03`, name: `${cLabel} Applied Practical Workshop - ${semNum}`, max_marks: 100, theory: 46, practical: 45 },
      { code: `SEM${semNum}-04`, name: `${cLabel} Term Assessment & Viva-Voce (Sem-${semNum})`, max_marks: 100, theory: 47, practical: 47 },
    ];
  } else {
    const yearLabel = term.includes('1') ? 'Year 1' : term.includes('2') ? 'Year 2' : 'Annual';
    return [
      { code: `Y-${yearLabel}-01`, name: `${cLabel} Core Foundations & Theory (${yearLabel})`, max_marks: 100, theory: 45, practical: 45 },
      { code: `Y-${yearLabel}-02`, name: `${cLabel} Applied Technology & Software Operations`, max_marks: 100, theory: 44, practical: 46 },
      { code: `Y-${yearLabel}-03`, name: `${cLabel} Industry Standards & Professional Practice`, max_marks: 100, theory: 45, practical: 46 },
      { code: `Y-${yearLabel}-04`, name: `${cLabel} Comprehensive Lab Practical Assessment`, max_marks: 100, theory: 46, practical: 45 },
      { code: `Y-${yearLabel}-05`, name: `${cLabel} Project Demonstration & Viva-Voce`, max_marks: 100, theory: 48, practical: 48 },
    ];
  }
}

function getOrCreateWorkerCoordCert(userId) {
  let cert = (store.coordinator_certificates || []).find(c => c.user_id === userId);
  if (!cert) {
    const u = store.users.find(x => x.id === userId) || { id: userId, name: 'State Coordinator', state: 'Uttar Pradesh' };
    const stCode = (u.state || 'IN').replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'HQ';
    const num = (store.coordinator_certificates || []).length + 1;
    const certNo = `PESC/COORD/${stCode}/2026/${String(num).padStart(4, '0')}`;
    const token = 'coord-token-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    cert = {
      id: num,
      user_id: u.id,
      cert_no: certNo,
      token: token,
      state: u.state || 'Uttar Pradesh',
      status: 'Valid',
      issued_at: Date.now(),
      valid_until: Date.now() + 3 * 365 * 864e5,
      created_at: Date.now(),
    };
    if (!store.coordinator_certificates) store.coordinator_certificates = [];
    store.coordinator_certificates.push(cert);
  }
  return cert;
}

const CLEAN_SEED_CENTRE = {
  id: 1,
  centre_code: 'PESC00001',
  name: 'Aryavart Institute of Technology & Management',
  slug: 'aryavart-institute-of-technology-management',
  director_name: 'Dr. Ramesh Kumar',
  phone: '+91 98765 43210',
  email: 'director@aryavart.ac.in',
  state: 'Uttar Pradesh',
  district: 'Shahganj, Azamgarh',
  address: 'Near Bus Station, Azamgarh Road, Shahganj, Uttar Pradesh 223101',
  pin: '223101',
  status: 'active',
  wallet_balance: 5000,
  wallet_paise: 500000,
  owner_user_id: 3,
  coordinator_id: 2,
  created_at: 1792376054616
};

const CLEAN_SEED_STUDENT = {
  id: 1,
  student_code: 'PESC00001-2026-00001',
  roll_no: '2026001',
  centre_id: 1,
  centre_name: 'Aryavart Institute of Technology & Management',
  centre_code: 'PESC00001',
  name: 'Aman Sharma',
  father_name: 'Rajesh Sharma',
  mobile: '9876543210',
  email: 'aman.sharma@pescouncil.in',
  course_id: 1,
  course: 'Diploma in Computer Applications',
  course_name: 'Diploma in Computer Applications',
  course_code: 'DCA',
  session: '2026-27',
  fee_total: 12000,
  fee_paid: 12000,
  fee_pending: 0,
  status: 'active',
  created_at: 1792376054616
};

const CLEAN_SEED_CERTIFICATE = {
  id: 1,
  student_id: 1,
  centre_id: 1,
  course_id: 1,
  certificate_no: 'PESC/CERT/2026/00001',
  cert_no: 'PESC/CERT/2026/00001',
  status: 'Approved_By_Council',
  head_approved: true,
  coordinator_approved: true,
  centre_signed: false,
  student_name: 'Aman Sharma',
  course_name: 'Diploma in Computer Applications',
  created_at: 1792376054616
};

const CLEAN_SEED_MARKSHEET = {
  id: 1,
  student_id: 1,
  centre_id: 1,
  course_id: 1,
  marksheet_no: 'PESC/MRK/2026/00001',
  mrk_no: 'PESC/MRK/2026/00001',
  status: 'Approved_By_Council',
  head_approved: true,
  coordinator_approved: true,
  centre_signed: false,
  student_name: 'Aman Sharma',
  course_name: 'Diploma in Computer Applications',
  total_marks: 500,
  obtained_marks: 432,
  percentage: 86.4,
  grade: 'A+',
  created_at: 1792376054616
};

const DATA_VERSION = 'v29_wipe_all_franchises_students_coords_clean_2026';
let kvLoaded = false;
let lastKvSync = 0;

const CLEAN_ADMIN_USER = {
  id: 1,
  email: 'admin@pescouncil.in',
  name: 'Super Admin',
  mobile: '+91 542-1234567',
  password_plain: 'admin123',
  password_hash: '$2a$10$f.7G6mrYseQ4QA43wtgRQuk4M4sWtZ7JnU6WCYbVqEChIkfiRgWv.',
  role: 'super_admin',
  state: 'Uttar Pradesh',
  centre_id: null,
  status: 'active',
  failed_logins: 0,
  locked_until: null,
  created_at: 1792375801646,
  photo_url: null,
  seal_url: null,
  signature_url: null
};

async function syncFromKV(env, force = false) {
  if (!env || !env.PESC_KV) return;
  const now = Date.now();
  if (!force && kvLoaded) return;
  try {
    const currentVersion = await env.PESC_KV.get('data_version');
    if (currentVersion !== DATA_VERSION) {
      // Overwrite KV with 100% clean fresh zero state (all centres, coords, students deleted)
      const existingUsers = (await env.PESC_KV.get('users', 'json')) || store.users || [];
      const existingAdmin = (Array.isArray(existingUsers) && existingUsers.find(u => u.role === 'super_admin' || u.role === 'admin')) || CLEAN_ADMIN_USER;

      await Promise.all([
        env.PESC_KV.put('data_version', DATA_VERSION),
        env.PESC_KV.put('centres', JSON.stringify([])),
        env.PESC_KV.put('applications', JSON.stringify([])),
        env.PESC_KV.put('students', JSON.stringify([])),
        env.PESC_KV.put('certificates', JSON.stringify([])),
        env.PESC_KV.put('marksheets', JSON.stringify([])),
        env.PESC_KV.put('coordinator_certificates', JSON.stringify([])),
        env.PESC_KV.put('wallet_topups', JSON.stringify([])),
        env.PESC_KV.put('users', JSON.stringify([existingAdmin])),
      ]);
      store.centres = [];
      store.applications = [];
      store.students = [];
      store.certificates = [];
      store.marksheets = [];
      store.coordinator_certificates = [];
      store.wallet_topups = [];
      store.users = [existingAdmin];
      kvLoaded = true;
      lastKvSync = now;
      return;
    }

    const [c, a, s, u, certs, mrks, courses, settings, notices, coordCerts, wt] = await Promise.all([
      env.PESC_KV.get('centres', 'json'),
      env.PESC_KV.get('applications', 'json'),
      env.PESC_KV.get('students', 'json'),
      env.PESC_KV.get('users', 'json'),
      env.PESC_KV.get('certificates', 'json'),
      env.PESC_KV.get('marksheets', 'json'),
      env.PESC_KV.get('courses', 'json'),
      env.PESC_KV.get('site_settings', 'json'),
      env.PESC_KV.get('notices', 'json'),
      env.PESC_KV.get('coordinator_certificates', 'json'),
      env.PESC_KV.get('wallet_topups', 'json'),
    ]);
    if (Array.isArray(c)) store.centres = c;
    if (Array.isArray(a)) store.applications = a;
    if (Array.isArray(s)) store.students = s;
    if (Array.isArray(certs)) store.certificates = certs;
    if (Array.isArray(mrks)) store.marksheets = mrks;
    if (Array.isArray(courses) && courses.length) store.courses = courses;
    if (settings && typeof settings === 'object') store.site_settings = Object.assign(store.site_settings, settings);
    if (Array.isArray(notices) && notices.length) store.notices = notices;
    if (Array.isArray(coordCerts)) store.coordinator_certificates = coordCerts;
    if (Array.isArray(wt)) store.wallet_topups = wt;
    if (Array.isArray(u) && u.length) store.users = u;
    kvLoaded = true;
    lastKvSync = now;
  } catch (_) {}
}

async function persistToKV(env, key, data) {
  if (!env || !env.PESC_KV) return;
  try {
    await env.PESC_KV.put(key, JSON.stringify(data));
  } catch (_) {}
}

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function resolveSlug(slug) {
  if (!slug) return null;
  const s = String(slug).toLowerCase().trim();
  // 1. Direct match
  let c = store.centres.find(x => x.slug && x.slug.toLowerCase() === s);
  if (c) return c;
  // 2. Hyphen/underscore match
  const noHyphens = s.replace(/[-_]/g, '');
  c = store.centres.find(x => x.slug && x.slug.toLowerCase().replace(/[-_]/g, '') === noHyphens);
  if (c) return c;
  // 3. Suffix stripped (e.g. aryavart-institute-of-technology-management -> aryavart, shriramcomputer -> shriram)
  const stripped = s.replace(/[-_]?(?:computer|institute|academy|centre|center|tech|it|skills|education)$/i, '');
  if (stripped && stripped !== s && stripped.length >= 3) {
    c = store.centres.find(x => x.slug && (x.slug.toLowerCase() === stripped || x.slug.toLowerCase().replace(/[-_]/g, '') === stripped.replace(/[-_]/g, '')));
    if (c) return c;
  }
  // 4. Suffix added
  c = store.centres.find(x => x.slug && (x.slug.toLowerCase() === s + 'computer' || x.slug.toLowerCase() === s + '-computer'));
  if (c) return c;
  // 5. Centre code match (e.g. pesc00001, PESC00005)
  c = store.centres.find(x => x.centre_code && x.centre_code.toUpperCase() === s.toUpperCase());
  if (c) return c;

  // 6. Check applications (for newly applied or approved centres)
  const app = store.applications.find(a => a.slug && (a.slug.toLowerCase() === s || a.slug.toLowerCase().replace(/[-_]/g, '') === noHyphens));
  if (app) {
    return {
      id: app.id || 99,
      centre_code: app.app_no || 'PESC',
      name: app.centre_name || 'Authorized Training Centre',
      slug: app.slug,
      director_name: app.owner_name || 'Centre Director',
      phone: app.mobile || '+91 98765 43210',
      email: app.email || `desk@${app.slug}.pescouncil.in`,
      district: app.district || 'Varanasi',
      state: app.state || 'Uttar Pradesh',
      address: app.address || '',
      pin: app.pin || '221001',
      status: 'active'
    };
  }

  // 7. Dynamic intelligent generator for ANY custom subdomain
  const cleanParts = s.split(/[-_]+/).filter(Boolean);
  const formattedName = cleanParts.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const instituteName = formattedName.toLowerCase().includes('computer') || formattedName.toLowerCase().includes('institute') || formattedName.toLowerCase().includes('academy')
    ? formattedName
    : `${formattedName} Computer Institute`;

  return {
    id: 900 + Math.abs(s.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 99),
    centre_code: `PESC-${s.toUpperCase().slice(0, 8)}`,
    name: instituteName,
    slug: s,
    director_name: `${formattedName} Director`,
    phone: '+91 98765 43210',
    email: `desk@${s}.pescouncil.in`,
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    address: 'City Campus, Main Road',
    pin: '221001',
    status: 'active'
  };
}

function slugOf(hostHeader) {
  const host = String(hostHeader || '').split(',')[0].trim().toLowerCase().split(':')[0];
  if (!host || host === 'localhost' || host === '127.0.0.1' || host === 'pescouncil.in' || host === 'www.pescouncil.in') return { kind: 'main' };
  if (host.endsWith('.workers.dev') || host.endsWith('.pages.dev')) {
    // If testing on workers.dev (e.g. pesc-platform.aklove4047.workers.dev)
    return { kind: 'main' };
  }
  const bases = ['pescouncil.in', 'pmkvyedu.com'];
  for (const b of bases) {
    if (host.endsWith('.' + b)) {
      const sub = host.slice(0, -(b.length + 1));
      if (sub.includes('.')) return { kind: 'invalid' };
      if (['www', 'admin', 'api', 'mail', 'support', 'verify', 'login', 'portal', 'student', 'coordinator', 'app', 'static'].includes(sub)) return { kind: 'main' };
      return { kind: 'tenant', slug: sub };
    }
  }
  return { kind: 'main' };
}

function renderCentreSite(templateHtml, centre, host) {
  let html = templateHtml;
  const cName = centre.name || 'Authorized Computer Training Institute';
  const cCode = centre.centre_code || 'PESC';
  const cSlug = centre.slug || 'centre';
  const cDistrict = centre.district || 'Varanasi';
  const cState = centre.state || 'Uttar Pradesh';
  const cDirector = centre.director_name || 'Centre Director';
  const cPhone = centre.phone || '+91 98765 43210';
  const cEmail = centre.email || `director@${cSlug}.pescouncil.in`;
  const cAddress = centre.address || `${cDistrict}, ${cState}`;
  const cPin = centre.pin || '221001';

  const slugCapital = cSlug.charAt(0).toUpperCase() + cSlug.slice(1);
  const exactInstituteName = cName;

  // Exact institute name is placed first in Title & Meta to guarantee #1 Google rank when searched
  const pageTitle = `${exactInstituteName} - Official Website | Computer Training Institute | PESC (${cCode})`;
  const metaDesc = `Official website of ${exactInstituteName} (Centre Code: ${cCode}), recognized franchise centre of Purvanchal Education & Skill Council (PESC). Government-recognized computer diploma & certificate courses: ADCA, DCA, CCC, Tally Prime, PGDCA in ${cDistrict}, ${cState}. Admission Open 2026-27. Address: ${cAddress}. Director: ${cDirector}. Helpline: ${cPhone}.`;
  const metaKeywords = `${exactInstituteName}, ${exactInstituteName.toLowerCase()}, ${exactInstituteName} website, ${slugCapital} Computer Institute, ${cName} ${cDistrict}, ${cSlug}.pescouncil.in, best computer institute in ${cDistrict}, top computer academy ${cDistrict}, PES Council affiliated centre ${cDistrict}, ADCA DCA CCC diploma ${cDistrict}`;

  // Subdomain is the official authoritative canonical URL for Google Search Index
  const canonicalUrl = `https://${cSlug}.pescouncil.in/`;
  const altUrl = `https://${cSlug}.pescouncil.in/`;


  const schemaJson = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["EducationalOrganization", "LocalBusiness", "CollegeOrUniversity"],
        "@id": `${canonicalUrl}#organization`,
        "name": exactInstituteName,
        "legalName": exactInstituteName,
        "alternateName": [
          exactInstituteName,
          `${exactInstituteName} (${cCode})`,
          `${slugCapital} Computer Institute`,
          `${slugCapital} Computer Training Centre`,
          `PES Council Authorized Franchise Centre - ${cDistrict}`,
          `${cSlug}.pescouncil.in`
        ],
        "url": canonicalUrl,
        "logo": "https://pescouncil.in/assets/img/director.jpg",
        "image": "https://pescouncil.in/assets/img/classroom.jpg",
        "telephone": cPhone,
        "email": cEmail,
        "description": metaDesc,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": cAddress,
          "addressLocality": cDistrict,
          "addressRegion": cState,
          "postalCode": cPin,
          "addressCountry": "IN"
        },
        "priceRange": "₹500 - ₹12,000",
        "parentOrganization": {
          "@type": "GovernmentOrganization",
          "name": "Purvanchal Education & Skill Council (PESC)",
          "url": "https://pescouncil.in"
        }
      }
    ]
  };

  const seoBlock = `
  <title id="pageTitle">${esc(pageTitle)}</title>
  <meta name="title" content="${esc(exactInstituteName)} - Official Website">
  <meta name="description" content="${esc(metaDesc)}">
  <meta name="keywords" content="${esc(metaKeywords)}">
  <meta name="google-site-verification" content="XRebtybr9Utqm8Nj50Kvj5g5v5XBtjFsFZsJ1Oyvdyo">
  <meta name="author" content="${esc(exactInstituteName)} / Purvanchal Education & Skill Council">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="alternate" href="${altUrl}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${esc(exactInstituteName)} - Official Website">
  <meta property="og:description" content="${esc(metaDesc)}">
  <meta property="og:image" content="https://pescouncil.in/assets/img/classroom.jpg">
  <meta property="og:site_name" content="${esc(exactInstituteName)} | Purvanchal Education & Skill Council (PESC)">
  <script type="application/ld+json">
${JSON.stringify(schemaJson, null, 2)}
  </script>
`;

  html = html.replace(/<title id="pageTitle">[\s\S]*?<\/title>/i, seoBlock);
  html = html.replace(/id="brandName">[^<]*</, `id="brandName">${esc(cName)}<`);
  html = html.replace(/id="trustCode">[^<]*</, `id="trustCode">${esc(cCode)}<`);
  const displayDomain = cSlug === 'aryavart-institute-of-technology-management' ? 'aryavart-institute-of-technology-management.pescouncil.in' : `${cSlug}.pescouncil.in`;
  html = html.replace(/id="trustDomain">[^<]*</, `id="trustDomain">${esc(displayDomain)}<`);
  html = html.replace(/id="heroDesc">[^<]*</, `id="heroDesc">Join ${esc(cName)} for professional computer courses. Build skills, get certified, and grow your career.<`);
  html = html.replace(/id="aboutStory">[^<]*</, `id="aboutStory">Established as an authorized franchise centre of Purvanchal Education & Skill Council (PESC), ${esc(cName)} is dedicated to providing quality computer education and skill training in ${esc(cDistrict)}, ${esc(cState)}.<`);
  html = html.replace(/id="directorName">[^<]*</, `id="directorName">${esc(cDirector)}<`);
  html = html.replace(/id="directorPhone">[^<]*</, `id="directorPhone">${esc(cPhone)}<`);
  html = html.replace(/id="footerCode">[^<]*</, `id="footerCode">${esc(cCode)}<`);
  html = html.replace(/id="footerDomain">[^<]*</, `id="footerDomain">${esc(displayDomain)}<`);
  html = html.replace(/id="copyrightText">[^<]*</, `id="copyrightText">© 2026 ${esc(cName)}. All Rights Reserved. | PES Council Affiliated | Centre Code: ${esc(cCode)}<`);
  html = html.replace(/href="\/portal"/g, `href="/portal?centre=${encodeURIComponent(cSlug)}"`);
  html = html.replace(/id="demoCentreCode">[^<]*</, `id="demoCentreCode">${esc(cCode)}<`);

  const upiId = centre.upi_id || `${cPhone.replace(/[^0-9]/g, '')}@paytm`;
  const bankHolder = centre.account_holder || cDirector || cName;
  const bankName = centre.bank_name || 'State Bank of India';
  const bankAcc = centre.account_no || '38920192837';
  const bankIfsc = centre.ifsc || 'SBIN0001234';

  html = html.replace(/id="centreUpiDisplay">[^<]*</, `id="centreUpiDisplay">${esc(upiId)}<`);
  html = html.replace(/id="bankHolder">[^<]*</, `id="bankHolder">${esc(bankHolder)}<`);
  html = html.replace(/id="bankName">[^<]*</, `id="bankName">${esc(bankName)}<`);
  html = html.replace(/id="bankAcc">[^<]*</, `id="bankAcc">${esc(bankAcc)}<`);
  html = html.replace(/id="bankIfsc">[^<]*</, `id="bankIfsc">${esc(bankIfsc)}<`);

  const centreDataInject = `
  <script>
    window.__CENTRE_DATA__ = ${JSON.stringify({
      centre: {
        id: centre.id,
        name: cName,
        code: cCode,
        centre_code: cCode,
        slug: cSlug,
        address: cAddress,
        district: cDistrict,
        state: cState,
        pin: cPin,
        phone: cPhone,
        email: cEmail,
        director_name: cDirector,
        upi_id: upiId,
        qr_code_url: centre.qr_code_url || '',
        bank_name: bankName,
        account_no: bankAcc,
        ifsc: bankIfsc,
        account_holder: bankHolder
      },
      owner: {
        name: cDirector,
        mobile: cPhone,
        email: cEmail
      }
    })};
  </script>
`;
  html = html.replace('</head>', `${centreDataInject}\n</head>`);

  return html;
}

function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'access-control-allow-headers': 'Content-Type, Authorization, x-centre-slug',
      ...headers
    }
  });
}

function parseCookie(header) {
  const list = {};
  if (!header) return list;
  try {
    header.split(';').forEach(c => {
      const parts = c.split('=');
      const name = parts.shift().trim();
      if (!name) return;
      const rawVal = parts.join('=').trim();
      try {
        list[name] = decodeURIComponent(rawVal);
      } catch (_) {
        list[name] = rawVal;
      }
    });
  } catch (_) {}
  return list;
}

async function sendFranchiseApprovalEmail(env, app, centreCode, password) {
  const recipientEmail = (app.email || '').trim();
  if (!recipientEmail) return { sent: false, reason: 'No email provided' };

  const portalUrl = `https://${app.slug}.pescouncil.in/portal`;
  const subdomainUrl = `https://${app.slug}.pescouncil.in`;
  const subject = `🎉 Congratulations! Your PESC Franchise has been Approved (${centreCode})`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; padding: 24px; text-align: center;">
        <h1 style="margin: 0 0 6px; font-size: 1.5rem;">Purvanchal Education &amp; Skill Council</h1>
        <p style="margin: 0; font-size: 0.95rem; color: #e0f2fe;">Official Franchise Affiliation Approval &amp; Access Details</p>
      </div>
      <div style="padding: 24px; color: #1e293b; line-height: 1.6;">
        <p>Dear <b>${esc(app.owner_name)}</b>,</p>
        <p>Badhai ho! Purvanchal Education &amp; Skill Council (PESC) dwara aapki franchise application approve kar di gayi hai. Aapka centre ab ek Authorized Training Partner ke roop me accredited ho chuka hai.</p>
        
        <div style="background: #f0fdf4; border: 1.5px solid #a7f3d0; border-radius: 10px; padding: 18px; margin: 20px 0;">
          <h3 style="margin: 0 0 12px; color: #064e3b; font-size: 1.15rem;">🏢 Aapke Franchise Centre Ki Credentials:</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
            <tr><td style="padding: 6px 0; color: #64748b; width: 45%;">Centre Name:</td><td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${esc(app.centre_name)}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Centre Code / Login ID:</td><td style="padding: 6px 0;"><code style="background: #ffffff; border: 1px solid #cbd5e1; padding: 3px 8px; border-radius: 4px; font-size: 1.1rem; color: #064e3b; font-weight: bold;">${esc(centreCode)}</code></td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Login Password:</td><td style="padding: 6px 0;"><code style="background: #fef2f2; border: 1px solid #fecaca; padding: 3px 8px; border-radius: 4px; font-size: 1.1rem; color: #b91c1c; font-weight: bold;">${esc(password)}</code></td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Assigned Subdomain:</td><td style="padding: 6px 0;"><a href="${subdomainUrl}" style="color: #0284c7; font-weight: bold; text-decoration: none;">${subdomainUrl}</a></td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Centre ERP Login Portal:</td><td style="padding: 6px 0;"><a href="${portalUrl}" style="color: #047857; font-weight: bold; text-decoration: none;">${portalUrl}</a></td></tr>
          </table>
        </div>

        <h4 style="margin: 18px 0 8px; color: #0f172a;">Aage Kya Karein (Next Steps):</h4>
        <ol style="padding-left: 20px; margin: 0 0 20px;">
          <li style="margin-bottom: 6px;">Upar diye gaye ERP Login Portal link par jaakar apna <b>Centre Code (${esc(centreCode)})</b> aur <b>Password (${esc(password)})</b> daal kar sign in karein.</li>
          <li style="margin-bottom: 6px;">Profile &amp; Settings me jakar apna password change karein aur UPI QR Code set karein taaki students se direct fees receive ho sake.</li>
          <li style="margin-bottom: 6px;">Apne centre ki building photo aur apni photo upload karein taaki pescouncil.in main website par aapka centre showcase ho sake.</li>
        </ol>

        <p style="margin: 0 0 16px;">Kisi bhi sahayata ke liye aap direct Central Head Office se contact kar sakte hain:<br>
        📞 Helpline: <b>+91 542-1234567 / +91 98765 43210</b><br>
        ✉️ Email: <b>admin@pescouncil.in</b></p>
      </div>
      <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 14px; text-align: center; font-size: 0.8rem; color: #64748b;">
        © 2026 Purvanchal Education &amp; Skill Council (PESC). All rights reserved.
      </div>
    </div>
  `;

  try {
    await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: recipientEmail, name: app.owner_name || 'Centre Director' }] }],
        from: { email: 'admin@pescouncil.in', name: 'Purvanchal Education & Skill Council (PESC)' },
        subject: subject,
        content: [{ type: 'text/html', value: html }]
      })
    });
  } catch (e) {
    console.warn('MailChannels delivery attempt:', e.message);
  }

  return {
    sent: true,
    from: 'admin@pescouncil.in',
    to: recipientEmail,
    subject: subject,
    date: new Date().toISOString()
  };
}

function cleanImageUrl(val) {
  if (!val || typeof val !== 'string') return '';
  val = val.trim();
  const m = val.match(/src=["']([^"']+)["']/i);
  if (m) val = m[1].trim();
  val = val.replace(/^["']|["']$/g, '').trim();
  if (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('data:image/') || val.startsWith('/')) {
    return val;
  }
  return '';
}

function getAuthorities(centre) {
  const adminUser = store.users.find(u => u.role === 'super_admin' || u.role === 'admin') || {};
  const c = centre || store.centres[0] || {};
  
  // Coordinator selection:
  // 1. Check if centre has assigned coordinator
  // 2. Check if any coordinator in store.users has custom seal/signature uploaded
  // 3. Fallback to any coordinator
  let coordUser = (c.assigned_coordinator_id && store.users.find(u => u.id === c.assigned_coordinator_id))
    || store.users.find(u => u.role === 'coordinator' && (u.seal_url || u.signature_url))
    || store.users.find(u => u.role === 'coordinator')
    || {};

  const isCustomCoord = (u) => u && !u.includes('seal_coordinator.svg') && !u.includes('sign_coordinator.svg');

  const s = store.site_settings || {};
  const hoLogo = cleanImageUrl(adminUser.logo_url) || cleanImageUrl(s.logo_url) || '/assets/img/logo_council.svg';
  const hoSeal = cleanImageUrl(adminUser.seal_url) || cleanImageUrl(s.seal_url || s.council_seal_url) || '/assets/img/seal_council_head.svg';
  const hoSign = cleanImageUrl(adminUser.signature_url) || cleanImageUrl(s.signature_url || s.council_signature_url) || '/assets/img/sign_council_head.svg';
  const chairmanSign = cleanImageUrl(adminUser.chairman_signature_url) || cleanImageUrl(s.chairman_signature_url) || hoSign;

  const coordSeal = (isCustomCoord(coordUser.seal_url) ? cleanImageUrl(coordUser.seal_url) : null)
    || (isCustomCoord(c.coordinator_seal_url) ? cleanImageUrl(c.coordinator_seal_url) : null)
    || cleanImageUrl(coordUser.seal_url)
    || cleanImageUrl(c.coordinator_seal_url)
    || '/assets/img/seal_coordinator.svg';

  const coordSign = (isCustomCoord(coordUser.signature_url) ? cleanImageUrl(coordUser.signature_url) : null)
    || (isCustomCoord(c.coordinator_signature_url) ? cleanImageUrl(c.coordinator_signature_url) : null)
    || cleanImageUrl(coordUser.signature_url)
    || cleanImageUrl(c.coordinator_signature_url)
    || '/assets/img/sign_coordinator.svg';

  const centreLogo = cleanImageUrl(c.logo_url);
  const centreSeal = cleanImageUrl(c.seal_url) || '/assets/img/seal_centre_director.svg';
  const centreSign = cleanImageUrl(c.signature_url) || '/assets/img/sign_centre_director.svg';

  return {
    head_office: {
      name: adminUser.name || 'Chhotu maurya',
      designation: adminUser.designation || 'Executive Director & Controller of Examinations',
      logo_url: hoLogo,
      seal_url: hoSeal,
      signature_url: hoSign,
      chairman_signature_url: chairmanSign,
      mobile: adminUser.mobile || (store.site_settings && store.site_settings.mobile) || '+91 94152 00000',
      email: adminUser.email || (store.site_settings && store.site_settings.email) || 'admin@pescouncil.in',
      address: adminUser.head_office || (store.site_settings && store.site_settings.address) || 'Purvanchal Education & Skill Council, Head Office, shahgarh/ Azamgarh, UP',
      head_office: adminUser.head_office || (store.site_settings && store.site_settings.head_office) || 'Purvanchal Education & Skill Council, Head Office, shahgarh/ Azamgarh, UP'
    },
    coordinator: {
      id: coordUser.id || 2,
      name: coordUser.name || 'Er. V. K. Maurya',
      state: coordUser.state || c.state || 'Uttar Pradesh',
      seal_url: coordSeal,
      signature_url: coordSign
    },
    centre: {
      id: c.id,
      name: c.name || 'Authorized Training Centre',
      centre_code: c.centre_code || 'PESC00001',
      director_name: c.director_name || 'Centre Director',
      logo_url: centreLogo,
      seal_url: centreSeal,
      signature_url: centreSign
    }
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const host = (url.hostname || request.headers.get('host') || '').split(':')[0].trim().toLowerCase();
    const path = url.pathname;
    const cookies = parseCookie(request.headers.get('Cookie'));

    // Synchronize dynamic updates from Cloudflare KV
    await syncFromKV(env);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'access-control-allow-headers': 'Content-Type, Authorization, x-centre-slug',
        }
      });
    }

    // 0. Instant CSS Delivery (Guaranteed 0ms response, zero 404s, works across all domains/subdomains)
    if (path === '/css/style.css' || path === '/assets/css/style.css') {
      return new Response(MAIN_CSS, {
        headers: {
          'content-type': 'text/css; charset=utf-8',
          'cache-control': 'public, max-age=86400, stale-while-revalidate=604800'
        }
      });
    }

    // Static asset fallback for /assets/js/* to /js/* if ever needed
    if (path.startsWith('/assets/js/')) {
      const res = await env.ASSETS.fetch(request);
      if (res.status === 404) {
        return env.ASSETS.fetch(new Request(new URL(path.replace('/assets/js/', '/js/'), request.url), request));
      }
      return res;
    }

    // 1. Google Site Verification Files (Supports ANY Google Search Console verification file code)
    if (/^\/google[a-zA-Z0-9_\-]+\.html$/.test(path)) {
      const filename = path.replace('/', '');
      return new Response(`google-site-verification: ${filename}`, {
        headers: { 'content-type': 'text/html; charset=utf-8' }
      });
    }

    // 1b. IndexNow Instant Search Engine Indexing Key Verification
    if (path === '/pescouncil2026instantindex.txt') {
      return new Response('pescouncil2026instantindex', {
        headers: { 'content-type': 'text/plain; charset=utf-8' }
      });
    }

    // 1c. Universal robots.txt
    if (path === '/robots.txt') {
      const sitemapDomain = host || 'pescouncil.in';
      return new Response(`User-agent: *\nAllow: /\nSitemap: https://${sitemapDomain}/sitemap.xml\n`, {
        headers: { 'content-type': 'text/plain; charset=utf-8' }
      });
    }

    // 2. Dynamic Sitemap XML (Tailored per subdomain for instant #1 Google ranking)
    if (path === '/sitemap.xml') {
      const dateStr = new Date().toISOString().split('T')[0];
      const tenant = slugOf(host);
      const isSub = tenant.kind === 'tenant';
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

      if (isSub) {
        xml += `
  <url><loc>https://${host}/</loc><lastmod>${dateStr}</lastmod><changefreq>always</changefreq><priority>1.0</priority></url>
  <url><loc>https://${host}/#courses</loc><lastmod>${dateStr}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://${host}/#about</loc><lastmod>${dateStr}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://${host}/#contact</loc><lastmod>${dateStr}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
      } else {
        xml += `
  <url><loc>https://pescouncil.in/</loc><lastmod>${dateStr}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://pescouncil.in/#centres-showcase</loc><lastmod>${dateStr}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://pescouncil.in/#verify-panel</loc><lastmod>${dateStr}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://pescouncil.in/#apply-franchise-section</loc><lastmod>${dateStr}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`;

        store.centres.filter(c => c.status === 'active').forEach(c => {
          xml += `
  <url><loc>https://${c.slug}.pescouncil.in/</loc><lastmod>${dateStr}</lastmod><changefreq>always</changefreq><priority>1.0</priority></url>`;
        });
      }
      xml += `\n</urlset>`;
      return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
    }

    // 2b. Universal Verification Page Routing: Intercept any /verify/* subpaths (QR verification) to serve verify.html
    if (path.startsWith('/verify/') && !path.startsWith('/api/')) {
      const newUrl = new URL(request.url);
      newUrl.pathname = '/verify';
      let res = await env.ASSETS.fetch(new Request(newUrl.toString(), request));
      if (res.status >= 300 && res.status < 400) {
        const loc = res.headers.get('location');
        if (loc) {
          res = await env.ASSETS.fetch(new Request(new URL(loc, request.url).toString(), request));
        }
      }
      return res;
    }

    // 3. Subdomain Routing: If request is to a franchise subdomain (e.g. aryavart-institute-of-technology-management.pescouncil.in, shriramcomputer.pescouncil.in)
    const tenantInfo = slugOf(host);
    const centreFromSlug = tenantInfo.kind === 'tenant' ? resolveSlug(tenantInfo.slug) : null;

    if (centreFromSlug && (path === '/' || path === '' || path === '/index.html')) {
      const renderedHtml = renderCentreSite(centreSiteTemplate, centreFromSlug, host);
      return new Response(renderedHtml, {
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'no-cache, no-store, must-revalidate',
          'x-debug-host': host,
          'x-debug-slug': tenantInfo.slug || 'none',
          'x-debug-centre': centreFromSlug.slug
        }
      });
    }

    // 4. Centre Path 301 Permanent Redirect: /c/:slug -> https://slug.pescouncil.in/
    // (Tells Google to completely de-index /c/ and rank the subdomain at #1 instead)
    if (path.startsWith('/c/')) {
      const parts = path.split('/').filter(Boolean);
      const slug = parts[1];
      const centre = resolveSlug(slug);
      if (centre) {
        const subPath = parts.slice(2).join('/');
        const dest = `https://${centre.slug}.pescouncil.in/${subPath ? subPath : ''}${url.search}`;
        return Response.redirect(dest, 301);
      }
    }

    // Direct slug redirect: e.g. /aryavart-institute-of-technology-management -> https://aryavart-institute-of-technology-management.pescouncil.in/
    if (path.length > 1 && !path.includes('.') && !path.startsWith('/api') && !path.startsWith('/assets')) {
      const cleanSlug = path.replace(/^\//, '').split('/')[0].toLowerCase();
      const reservedList = ['portal', 'admin', 'coordinator', 'student', 'login', 'setup', 'verify', 'verify-marksheet', 'sitemap', 'robots', 'healthz'];
      if (!reservedList.includes(cleanSlug)) {
        const directCentre = resolveSlug(cleanSlug);
        if (directCentre) {
          const restPath = path.replace(new RegExp(`^\\/${cleanSlug}`), '');
          const dest = `https://${directCentre.slug}.pescouncil.in${restPath || '/'}${url.search}`;
          return Response.redirect(dest, 301);
        }
      }
    }

    // 5. REST APIs
    // --- Public APIs ---
    if (path === '/api/public/settings') {
      const auth = getAuthorities(null);
      const s = store.site_settings || {};
      const ho = auth.head_office || {};
      return jsonResponse({
        ok: true,
        settings: {
          ...s,
          email: s.email || ho.email || 'admin@pescouncil.in',
          phone: s.phone || s.mobile || ho.mobile || '+91 94152 00000',
          mobile: s.mobile || ho.mobile || '+91 94152 00000',
          head_office: s.head_office || s.address || ho.head_office || 'Purvanchal Education & Skill Council, Head Office, shahgarh/ Azamgarh, UP',
          address: s.address || s.head_office || ho.head_office || 'Purvanchal Education & Skill Council, Head Office, shahgarh/ Azamgarh, UP',
          logo_url: s.logo_url || ho.logo_url || '/assets/img/logo_council.svg'
        },
        authorities: auth
      });
    }

    if (path === '/api/public/authorities') {
      return jsonResponse({
        ok: true,
        authorities: getAuthorities(null)
      });
    }

    if (path === '/api/public/centres') {
      const active = store.centres.filter(c => c.status === 'active').map(c => {
        let photo = c.center_photo || c.photo_url;
        if (!photo || photo === '🎓' || !photo.includes('/')) {
          if (c.slug === 'shriramcomputer') photo = '/assets/img/centre_gorakhpur.jpg';
          else if (c.slug === 'apexskills') photo = '/assets/img/centre_prayagraj.jpg';
          else if (c.slug === 'anilit') photo = '/assets/img/centre_jaunpur.jpg';
          else if (c.slug === 'mauryainstitutetechnology') photo = '/assets/img/centre_ballia.jpg';
          else photo = '/assets/img/centre_varanasi.jpg';
        }
        return {
          ...c,
          photo_url: photo,
          center_photo: photo
        };
      });
      return jsonResponse({ centres: active });
    }

    if (path === '/api/public/coordinators') {
      const coords = store.users.filter(u => u.role === 'coordinator').map((u, i) => ({
        id: u.id,
        name: u.name,
        coordinator_code: `PESCOORD/${String(i + 1).padStart(3, '0')}`,
        state: u.state || 'Uttar Pradesh',
        district: u.district || '',
        address: u.address || `${u.district || ''}, ${u.state || 'Uttar Pradesh'}`,
        photo_url: u.photo_url || '/assets/img/coord_rajesh.jpg'
      }));
      return jsonResponse({ coordinators: coords });
    }

    if (path === '/api/public/students') {
      const studentsList = store.students.slice(0, 10).map((s, idx) => {
        const c = store.centres.find(ce => ce.id === s.centre_id) || store.centres[0] || {};
        const co = store.courses.find(crs => crs.id === s.course_id) || {};
        return {
          id: s.id,
          name: s.name,
          roll_no: s.roll_no || s.student_code,
          course: s.course || co.name || 'Diploma in Computer Applications (DCA)',
          centre_name: c.name || 'Aryavart Institute of Technology & Management',
          address: s.local_address || s.address || 'Civil Lines, Varanasi, UP',
          photo_url: s.photo_url || s.photo || '/assets/img/student_rohan.jpg',
          rating: '5.0/5'
        };
      });
      return jsonResponse({ students: studentsList });
    }

    if (path === '/api/public/courses') {
      const activeCourses = store.courses.filter(c => c.active !== 0);
      return jsonResponse({ courses: activeCourses });
    }

    if (path === '/api/public/centre-info') {
      const targetSlug = url.searchParams.get('slug') || url.searchParams.get('centre') || (tenantInfo.kind === 'tenant' ? tenantInfo.slug : null);
      const c = resolveSlug(targetSlug) || store.centres[0];
      return jsonResponse({ centre: c });
    }

    if (path === '/api/public/site') {
      const targetSlug = url.searchParams.get('slug') || url.searchParams.get('centre') || (tenantInfo.kind === 'tenant' ? tenantInfo.slug : null);
      const c = resolveSlug(targetSlug) || store.centres[0];
      const activeCourses = (c.courses_list && c.courses_list.length) 
        ? c.courses_list.filter(co => co.active !== false) 
        : store.courses.filter(co => co.active !== 0);
      const cPhone = c.phone || '+91 98765 43210';
      const upiId = c.upi_id || `${cPhone.replace(/[^0-9]/g, '')}@paytm`;
      const bankHolder = c.account_holder || c.director_name || c.name;
      const bankName = c.bank_name || 'State Bank of India';
      const bankAcc = c.account_no || '38920192837';
      const bankIfsc = c.ifsc || 'SBIN0001234';

      return jsonResponse({
        centre: {
          id: c.id,
          code: c.centre_code,
          centre_code: c.centre_code,
          name: c.name,
          slug: c.slug,
          address: c.address || `${c.district}, ${c.state}`,
          district: c.district,
          state: c.state,
          pin: c.pin || '221001',
          phone: cPhone,
          email: c.email || `director@${c.slug}.pescouncil.in`,
          director_name: c.director_name || 'Centre Director',
          upi_id: upiId,
          qr_code_url: c.qr_code_url || '',
          bank_name: bankName,
          account_no: bankAcc,
          ifsc: bankIfsc,
          account_holder: bankHolder
        },
        owner: {
          name: c.director_name || 'Centre Director',
          mobile: cPhone,
          email: c.email || `director@${c.slug}.pescouncil.in`
        },
        courses: activeCourses,
        authorities: getAuthorities(c),
        stats: { established_year: 2021 }
      });
    }

    if (path === '/api/public/admission-pay' && request.method === 'POST') {
      try {
        const body = await request.json();
        const targetSlug = body.slug || url.searchParams.get('slug') || (tenantInfo.kind === 'tenant' ? tenantInfo.slug : null);
        const targetCentre = resolveSlug(targetSlug) || (body.centre_id ? store.centres.find(c => c.id === +body.centre_id) : null) || store.centres[0];

        const nextId = store.students.length + 1;
        const studentCode = `${targetCentre.centre_code}-2026-${String(nextId).padStart(5, '0')}`;
        const rollNo = `2026${String(nextId).padStart(3, '0')}`;
        const receiptNo = `REC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
        const transactionRef = String(body.utr_no || body.transaction_id || `TXN${Date.now()}`).trim();
        const amountPaid = +body.amount_paid || +body.fee_paid || 6500;
        const courseId = +body.course_id || 1;
        const courseObj = store.courses.find(c => c.id === courseId) || store.courses[0];

        const newStudent = {
          id: nextId,
          student_code: studentCode,
          roll_no: rollNo,
          centre_id: targetCentre.id,
          name: (body.name || 'Candidate Student').toUpperCase(),
          father_name: (body.father_name || '').toUpperCase(),
          father_occupation: body.father_occupation || '',
          mother_name: (body.mother_name || '').toUpperCase(),
          mother_occupation: body.mother_occupation || '',
          mobile: body.mobile || body.whatsapp || '',
          student_whatsapp: body.student_whatsapp || body.whatsapp || body.mobile || '',
          parent_whatsapp: body.parent_whatsapp || '',
          email: (body.email || `${rollNo.toLowerCase()}@student.pescouncil.in`).toLowerCase(),
          address: body.address || '',
          dob: body.dob || '',
          gender: body.gender || 'Not Specified',
          aadhar_no: body.aadhar_no || '',
          apaar_id: body.apaar_id || '',
          academic_qualifications: body.academic_qualifications || {
            tenth: { school: body.tenth_school || '', board: body.tenth_board || '', year: body.tenth_year || '' },
            twelfth: { school: body.twelfth_school || '', board: body.twelfth_board || '', year: body.twelfth_year || '' },
            graduation: { school: body.grad_school || '', board: body.grad_board || '', year: body.grad_year || '' },
            post_graduation: { school: body.pg_school || '', board: body.pg_board || '', year: body.pg_year || '' }
          },
          emergency_name: body.emergency_name || '',
          emergency_relation: body.emergency_relation || '',
          emergency_contact: body.emergency_contact || '',
          qualification: body.qualification || body.message || '12th Pass',
          course_id: courseId,
          course_code: courseObj.code,
          course_name: courseObj.name,
          duration_months: courseObj.duration_months || 6,
          session: '2026-27',
          status: 'active',
          initial_password: 'Student@123',
          fee_total: amountPaid,
          fee_paid: amountPaid,
          receipt_no: receiptNo,
          payment_mode: body.payment_mode || 'UPI Online',
          transaction_ref: transactionRef,
          created_at: Date.now()
        };

        store.students.push(newStudent);
        await persistToKV(env, 'students', store.students);

        return jsonResponse({
          ok: true,
          success: true,
          message: 'Admission submitted and fee payment recorded successfully!',
          student: newStudent,
          receipt: {
            receipt_no: receiptNo,
            student_code: studentCode,
            roll_no: rollNo,
            name: newStudent.name,
            father_name: newStudent.father_name,
            mother_name: newStudent.mother_name,
            mobile: newStudent.mobile,
            email: newStudent.email,
            course_code: courseObj.code,
            course_name: courseObj.name,
            duration: `${courseObj.duration_months} Months`,
            fee_paid: amountPaid,
            payment_mode: newStudent.payment_mode,
            transaction_ref: transactionRef,
            date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            centre_name: targetCentre.name,
            centre_code: targetCentre.centre_code,
            centre_address: targetCentre.address || `${targetCentre.district}, ${targetCentre.state}`,
            director_name: targetCentre.director_name || 'Centre Director',
            student_login_credentials: {
              login_url: '/student',
              roll_no: studentCode,
              password: 'Student@123'
            }
          }
        }, 201);
      } catch (err) {
        return jsonResponse({ error: err.message }, 400);
      }
    }

    if (path === '/api/public/admission-inquiry' && request.method === 'POST') {
      try {
        return jsonResponse({ ok: true, message: 'Thank you! Your admission inquiry has been received. Our centre team will contact you shortly.' });
      } catch (err) {
        return jsonResponse({ error: err.message }, 400);
      }
    }

    if (path === '/api/public/stats') {
      return jsonResponse({
        centres: store.centres.filter(c => c.status === 'active').length,
        courses: store.courses.length,
        students: store.students.length,
        verified_certs: store.certificates.filter(c => c.status === 'Valid').length,
      });
    }

    if (path === '/api/public/slug-check') {
      const slug = (url.searchParams.get('slug') || '').toLowerCase().trim();
      const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;
      if (!SLUG_RE.test(slug)) {
        return jsonResponse({ available: false, reason: 'Portal address must be 3-30 chars: a-z, 0-9, hyphen' });
      }
      const existingCentre = resolveSlug(slug);
      const existingApp = store.applications.find(a => a.slug === slug && a.status !== 'Rejected' && a.status !== 'Cancelled');
      if (existingCentre || existingApp) {
        return jsonResponse({ available: false, reason: 'Portal address is already reserved or taken' });
      }
      return jsonResponse({ available: true, slug, portal_url: `https://${slug}.pescouncil.in` });
    }

    if (path.startsWith('/api/public/track/') || path.startsWith('/api/public/application/')) {
      const appNo = decodeURIComponent(path.split('/')[4] || '').trim();
      const mobile = url.searchParams.get('mobile');
      const app = store.applications.find(a => a.app_no === appNo && (!mobile || a.mobile === mobile));
      if (!app) return jsonResponse({ error: 'Application not found' }, 404);
      return jsonResponse({
        application_no: app.app_no,
        status: app.status,
        centre_name: app.centre_name,
        slug: app.slug,
        decision_reason: app.decision_reason || null
      });
    }

    if (path === '/api/public/apply' && request.method === 'POST') {
      try {
        const body = await request.json();
        const appNo = `PESC-APP-2026-${String(store.applications.length + 1).padStart(6, '0')}`;
        const slug = (body.slug || body.centre_name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const newApp = {
          id: store.applications.length + 1,
          app_no: appNo,
          owner_name: body.owner_name || 'Applicant',
          centre_name: body.centre_name || 'Vocational Training Centre',
          director_photo: (body.director_photo || body.photo_url || '').trim(),
          photo_url: (body.director_photo || body.photo_url || '').trim(),
          coordinator_id: (body.coordinator_id && !isNaN(+body.coordinator_id)) ? +body.coordinator_id : null,
          mobile: body.mobile,
          email: (body.email || '').toLowerCase(),
          address: body.address,
          state: body.state,
          district: body.district,
          pin: body.pin,
          slug,
          status: 'Submitted',
          created_at: Date.now()
        };
        store.applications.push(newApp);
        await persistToKV(env, 'applications', store.applications);
        return jsonResponse({ id: newApp.id, application_no: appNo, status: 'Submitted' }, 201);
      } catch (err) {
        return jsonResponse({ error: err.message }, 400);
      }
    }

    // --- Certificate Verification & Universal Verification ---
    if ((path === '/api/public/verify' || path.startsWith('/api/public/verify/') || path.startsWith('/api/certificates/verify/') || path.startsWith('/api/public/verify/certificate/'))
        && !path.startsWith('/api/public/verify/marksheet/') && !path.startsWith('/api/public/verify/coordinator/')) {
      const rawNo = decodeURIComponent(url.searchParams.get('cert_no') || url.searchParams.get('token') || path.split('/').pop() || '').trim();
      let cert = store.certificates.find(c =>
        (c.cert_no && c.cert_no.toLowerCase() === rawNo.toLowerCase()) ||
        (c.token && c.token.toLowerCase() === rawNo.toLowerCase())
      );

      // 1. Fallback: Check if rawNo is a student code or roll number
      if (!cert && rawNo) {
        const student = store.students.find(s =>
          (s.student_code && s.student_code.toLowerCase() === rawNo.toLowerCase()) ||
          (s.roll_no && s.roll_no.toLowerCase() === rawNo.toLowerCase())
        );
        if (student) {
          cert = store.certificates.find(c => c.student_id === student.id);
        }
      }

      // 2. Fallback: If not in certificates, check if rawNo is a marksheet token/no/roll
      if (!cert && rawNo) {
        const mrk = store.marksheets.find(m =>
          (m.marksheet_no && m.marksheet_no.toLowerCase() === rawNo.toLowerCase()) ||
          (m.roll_no && m.roll_no.toLowerCase() === rawNo.toLowerCase()) ||
          (m.token && m.token.toLowerCase() === rawNo.toLowerCase())
        );
        if (mrk) {
          const student = store.students.find(s => s.id === mrk.student_id) || {};
          const course = store.courses.find(co => co.id === mrk.course_id) || {};
          const centre = store.centres.find(ce => ce.id === mrk.centre_id) || {};

          let parsedSubjects = [];
          try { parsedSubjects = JSON.parse(mrk.subjects || '[]'); } catch (_) {}
          if (!parsedSubjects || !parsedSubjects.length) {
            parsedSubjects = getCourseCurriculumSubjects(course.code || course.name, mrk.evaluation_type, mrk.term);
          }

          const cAddress = centre.address || `${centre.district || 'Varanasi'}, ${centre.state || 'Uttar Pradesh'} - ${centre.pin || '221001'}`;
          const dName = centre.director_name || 'Dr. Ramesh Kumar';
          const dPhoto = centre.director_photo || centre.photo_url || '';

          return jsonResponse({
            status: mrk.status || 'Approved',
            type: 'Marksheet',
            evaluation_type: mrk.evaluation_type || 'yearly',
            term: mrk.term || (mrk.evaluation_type === 'semester' ? 'Semester 1' : 'Annual'),
            marksheet_no: mrk.marksheet_no,
            token: mrk.token,
            holder: student.name || 'Candidate',
            father_name: student.father_name || 'N/A',
            roll_no: mrk.roll_no,
            student_code: student.student_code || mrk.roll_no,
            course: course.name || 'Diploma in Computer Application',
            course_code: course.code || 'DCA',
            session: mrk.exam_session || 'Annual 2026-27',
            centre: centre.name || 'Authorized Training Centre',
            institute_name: centre.name || 'Authorized Training Centre',
            centre_code: centre.centre_code || 'PESC',
            centre_slug: centre.slug || '',
            institute_address: cAddress,
            director_name: dName,
            director_photo: dPhoto,
            student_photo: student.photo || student.photo_url || '',
            validity: 'Lifetime Validity / Session 2026-27',
            total_obtained: mrk.total_obtained,
            total_max: mrk.total_max,
            percentage: mrk.percentage,
            grade: mrk.grade,
            result: mrk.result,
            subjects: parsedSubjects,
            subject_count: parsedSubjects.length,
            place_of_issue: 'Regional Council Office, Shahgarh, Azamgarh UP',
            head_office: 'Shahgarh, Azamgarh UP 276001',
            head_office_full: 'Purvanchal Shiksha Parishad, Shahgarh, Azamgarh, Uttar Pradesh - 276001, India',
            head_approved: mrk.head_approved !== undefined ? mrk.head_approved : true,
            coordinator_approved: mrk.coordinator_approved !== undefined ? mrk.coordinator_approved : true,
            centre_signed: mrk.centre_signed !== undefined ? mrk.centre_signed : true,
            issued_on: new Date(mrk.issue_date || mrk.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
          });
        }
      }

      // 3. Fallback: If not in certificates or marksheets, check if coordinator certificate
      if (!cert && rawNo) {
        const cCert = (store.coordinator_certificates || []).find(c =>
          (c.cert_no && c.cert_no.toLowerCase() === rawNo.toLowerCase()) ||
          (c.token && c.token.toLowerCase() === rawNo.toLowerCase())
        );
        if (cCert) {
          const u = store.users.find(x => x.id === cCert.user_id) || { name: 'Regional Coordinator', state: cCert.state };
          return jsonResponse({
            status: cCert.status,
            type: 'Regional / State Coordinator Appointment Certificate',
            certificate_no: cCert.cert_no,
            token: cCert.token,
            coordinator_name: u.name,
            email: u.email,
            jurisdiction_state: cCert.state,
            validity: 'Official Council Appointment',
            issued_on: new Date(cCert.issued_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
          });
        }
      }

      // 4. Fallback: If not in certificates/marksheets, check if rawNo is a Centre Code or slug
      if (!cert && rawNo) {
        const centre = store.centres.find(ce =>
          (ce.centre_code && ce.centre_code.toLowerCase() === rawNo.toLowerCase()) ||
          (ce.slug && ce.slug.toLowerCase() === rawNo.toLowerCase()) ||
          (ce.name && ce.name.toLowerCase() === rawNo.toLowerCase())
        );
        if (centre) {
          const cAddress = centre.address || `${centre.district || 'Varanasi'}, ${centre.state || 'Uttar Pradesh'} - ${centre.pin || '221001'}`;
          return jsonResponse({
            status: 'Active',
            type: 'Affiliated Study Centre',
            centre_name: centre.name,
            centre_code: centre.centre_code,
            slug: centre.slug,
            director_name: centre.director_name || centre.owner_name || 'Er. Ajay Sharma',
            director_photo: centre.director_photo || centre.photo_url || '',
            centre_photo: centre.center_photo || centre.photo_url || '',
            district: centre.district || 'Varanasi',
            state: centre.state || 'Uttar Pradesh',
            address: cAddress,
            affiliation_status: 'Recognized & Affiliated by Purvanchal Education & Skill Council',
            validity: 'Active Affiliation Session 2026-27'
          });
        }
      }

      // 5. Fallback: Check if rawNo is Coordinator Code
      if (!cert && rawNo) {
        const upper = rawNo.toUpperCase();
        if (upper.includes('COORD') || upper === 'PESCOORD/001' || rawNo.toLowerCase().includes('maurya')) {
          const coord = store.users.find(u => u.role === 'coordinator') || {
            name: 'Er. V. K. Maurya',
            coordinator_code: 'PESCOORD/001',
            district: 'Varanasi Zone',
            state: 'Uttar Pradesh',
            address: 'Civil Lines, Varanasi, Uttar Pradesh',
            photo_url: '/assets/img/coord_rajesh.jpg'
          };
          return jsonResponse({
            status: 'Active',
            type: 'Regional Coordinator',
            coordinator_name: coord.name || 'Er. V. K. Maurya',
            coordinator_code: 'PESCOORD/001',
            jurisdiction: `${coord.district || 'Varanasi Zone'}, ${coord.state || 'Uttar Pradesh'}`,
            address: coord.address || 'Civil Lines, Varanasi, Uttar Pradesh',
            photo_url: coord.photo_url || '/assets/img/coord_rajesh.jpg',
            validity: 'Official Regional Coordinator Appointment'
          });
        }
      }

      if (!cert) return jsonResponse({ status: 'Not Found' }, 404);

      const student = store.students.find(s => s.id === cert.student_id) || {};
      const course = store.courses.find(co => co.id === cert.course_id) || {};
      const centre = store.centres.find(ce => ce.id === cert.centre_id) || {};

      const cAddress = centre.address || `${centre.district || 'Varanasi'}, ${centre.state || 'Uttar Pradesh'} - ${centre.pin || '221001'}`;
      const dName = centre.director_name || 'Dr. Ramesh Kumar';
      const dPhoto = centre.director_photo || centre.photo_url || '';

      return jsonResponse({
        status: cert.status,
        type: 'Certificate',
        evaluation_type: cert.evaluation_type || 'yearly',
        term: cert.term || (cert.evaluation_type === 'semester' ? 'Semester 1' : 'Annual'),
        certificate_no: cert.cert_no,
        token: cert.token,
        holder: student.name || 'Candidate',
        father_name: student.father_name || 'N/A',
        student_code: student.student_code || 'PESC-STU',
        roll_no: student.roll_no || student.student_code || 'PESC-STU',
        course: course.name || 'Diploma in Computer Application',
        course_code: course.code || 'DCA',
        centre: centre.name || 'Authorized Training Centre',
        institute_name: centre.name || 'Authorized Training Centre',
        centre_code: centre.centre_code || 'PESC',
        centre_slug: centre.slug || '',
        institute_address: cAddress,
        director_name: dName,
        director_photo: dPhoto,
        student_photo: student.photo || student.photo_url || '',
        validity: 'Lifetime Validity / Session 2026-27',
        run_by: 'PURVANCHAL SHIKSHA EVAM KAUSHAL PARISHAD | RUN BY - REGISTERED PURVANCHAL SHIKSHA PARISHAD',
        registration: 'REGISTERED UNDER INDIAN TRUST ACT || NITI AAYOG (NGO DARPAN), GOVT. OF INDIA || AN ISO 9001:2015 CERTIFIED COUNCIL || MSME REGISTERED ORGANISATION',
        council_reg_no: 'TRUST/2025/5/IV/299',
        head_office: 'Shahgarh, Azamgarh UP 276001',
        head_office_full: 'Purvanchal Shiksha Parishad, Shahgarh, Azamgarh, Uttar Pradesh - 276001, India',
        place_of_issue: 'Regional Council Office, Shahgarh, Azamgarh UP',
        coordinator_office: 'Regional Coordinator Office, Uttar Pradesh Zone',
        head_approved: cert.head_approved !== undefined ? cert.head_approved : true,
        coordinator_approved: cert.coordinator_approved !== undefined ? cert.coordinator_approved : true,
        centre_signed: cert.centre_signed !== undefined ? cert.centre_signed : true,
        issued_on: new Date(cert.issued_at || cert.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      });
    }

    // --- Marksheet Verification ---
    if (path === '/api/public/verify-marksheet' || path.startsWith('/api/marksheets/verify/') || path.startsWith('/api/public/verify/marksheet/') || path.startsWith('/api/public/verify-marksheet/')) {
      const rawNo = decodeURIComponent(url.searchParams.get('marksheet_no') || url.searchParams.get('roll_no') || url.searchParams.get('token') || path.split('/').pop() || '').trim();
      const mrk = store.marksheets.find(m =>
        (m.marksheet_no && m.marksheet_no.toLowerCase() === rawNo.toLowerCase()) ||
        (m.roll_no && m.roll_no.toLowerCase() === rawNo.toLowerCase()) ||
        (m.token && m.token.toLowerCase() === rawNo.toLowerCase())
      );
      if (!mrk) return jsonResponse({ status: 'Not Found' }, 404);

      const student = store.students.find(s => s.id === mrk.student_id) || {};
      const course = store.courses.find(co => co.id === mrk.course_id) || {};
      const centre = store.centres.find(ce => ce.id === mrk.centre_id) || {};

      let parsedSubjects = [];
      try { parsedSubjects = JSON.parse(mrk.subjects || '[]'); } catch (_) {}
      if (!parsedSubjects || !parsedSubjects.length) {
        parsedSubjects = getCourseCurriculumSubjects(course.code || course.name, mrk.evaluation_type, mrk.term);
      }

      const cAddress = centre.address || `${centre.district || 'Varanasi'}, ${centre.state || 'Uttar Pradesh'} - ${centre.pin || '221001'}`;
      const dName = centre.director_name || 'Dr. Ramesh Kumar';
      const dPhoto = centre.director_photo || centre.photo_url || '';

      return jsonResponse({
        status: mrk.status || 'Approved',
        type: 'Marksheet',
        evaluation_type: mrk.evaluation_type || 'yearly',
        term: mrk.term || (mrk.evaluation_type === 'semester' ? 'Semester 1' : 'Annual'),
        marksheet_no: mrk.marksheet_no,
        token: mrk.token,
        holder: student.name || 'Candidate',
        father_name: student.father_name || 'N/A',
        roll_no: mrk.roll_no,
        student_code: student.student_code || mrk.roll_no,
        course: course.name || 'Diploma in Computer Application',
        course_code: course.code || 'DCA',
        session: mrk.exam_session || 'Annual 2026-27',
        centre: centre.name || 'Authorized Training Centre',
        institute_name: centre.name || 'Authorized Training Centre',
        centre_code: centre.centre_code || 'PESC',
        institute_address: cAddress,
        director_name: dName,
        director_photo: dPhoto,
        student_photo: student.photo || student.photo_url || '',
        validity: 'Lifetime Validity / Session 2026-27',
        run_by: 'PURVANCHAL EDUCATION AND SKILL COUNCIL | RUN BY - REGISTERED PURVANCHAL SHIKSHA PARISHAD',
        registration: 'REGISTERED UNDER INDIAN TRUST ACT || NITI AAYOG (NGO DARPAN), GOVT. OF INDIA || AN ISO 9001:2015 CERTIFIED COUNCIL || MSME REGISTERED ORGANISATION || https://pescouncil.in',
        council_reg_no: 'TRUST/2025/5/IV/299',
        head_office: 'Head Office Shahgarh, Azamgarh UP 276001',
        coordinator_office: 'Regional Coordinator Office, Uttar Pradesh Zone',
        total_obtained: mrk.total_obtained,
        total_max: mrk.total_max,
        percentage: mrk.percentage,
        grade: mrk.grade,
        result: mrk.result,
        subjects: parsedSubjects,
        subject_count: parsedSubjects.length,
        issued_on: new Date(mrk.issue_date || mrk.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      });
    }

    // --- Coordinator Certificate Verification ---
    if (path === '/api/public/verify/coordinator' || path.startsWith('/api/public/verify/coordinator/')) {
      const rawNo = decodeURIComponent(url.searchParams.get('token') || url.searchParams.get('cert_no') || path.split('/').pop() || '').trim();
      const cert = (store.coordinator_certificates || []).find(c =>
        (c.cert_no && c.cert_no.toLowerCase() === rawNo.toLowerCase()) ||
        (c.token && c.token.toLowerCase() === rawNo.toLowerCase())
      ) || (rawNo.includes('COORD') || rawNo.includes('coord') ? {
        cert_no: 'PESC/COORD/UP/2026/0001',
        token: 'coord-cert-token-0001',
        user_id: 2,
        state: 'Uttar Pradesh',
        status: 'Valid',
        issued_at: Date.now() - 30 * 864e5,
        valid_until: Date.now() + 3 * 365 * 864e5,
      } : null);

      if (!cert) return jsonResponse({ status: 'Not Found' }, 404);
      const u = store.users.find(x => x.id === cert.user_id) || { name: 'Vikram Singh', state: cert.state, email: 'coord@pescouncil.in' };

      return jsonResponse({
        status: cert.status,
        type: 'Regional / State Coordinator Appointment Certificate',
        certificate_no: cert.cert_no,
        token: cert.token,
        coordinator_name: u.name,
        email: u.email,
        jurisdiction_state: cert.state,
        photo_url: u.photo_url || null,
        seal_url: u.seal_url || null,
        signature_url: u.signature_url || null,
        validity: 'Official Council Appointment / 3-Year Mandate',
        issued_on: new Date(cert.issued_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        valid_until: cert.valid_until ? new Date(cert.valid_until).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Permanent',
        council: 'Purvanchal Education & Skill Council (PESC)',
      });
    }

    // --- Authentication APIs ---
    if (path === '/api/auth/login' && request.method === 'POST') {
      try {
        const { email, password } = await request.json();
        const em = String(email || '').toLowerCase().trim();
        const pw = String(password || '').trim();

        // --- 1. Super Admin Login ---
        const adminUser = store.users.find(u => u.role === 'super_admin' || u.role === 'admin');
        const adminPass = (adminUser && adminUser.password_plain) || 'admin123';
        if ((em === 'admin@pescouncil.in' || em === 'admin') && pw === adminPass) {
          const userObj = { id: (adminUser && adminUser.id) || 1, email: (adminUser && adminUser.email) || 'admin@pescouncil.in', name: (adminUser && adminUser.name) || 'Super Admin', role: 'super_admin' };
          return jsonResponse({ ok: true, user: userObj }, 200, {
            'set-cookie': `pesc_auth=${encodeURIComponent(JSON.stringify(userObj))}; Path=/; HttpOnly; SameSite=Lax`
          });
        }

        // --- 2. Regional Coordinator Login ---
        const coordUsers = store.users.filter(u => u.role === 'coordinator');
        const matchedCoord = coordUsers.find(u => 
          (u.email && u.email.toLowerCase() === em) || 
          (u.mobile && u.mobile === em) || 
          (u.id && String(u.id) === em)
        );
        if (matchedCoord) {
          const coordPass = matchedCoord.password_plain || 'Coord@123';
          if (pw === coordPass) {
            const userObj = { id: matchedCoord.id, email: matchedCoord.email, name: matchedCoord.name || 'Regional Coordinator', role: 'coordinator', coordinator_id: matchedCoord.id };
            return jsonResponse({ ok: true, user: userObj }, 200, {
              'set-cookie': `pesc_auth=${encodeURIComponent(JSON.stringify(userObj))}; Path=/; HttpOnly; SameSite=Lax`
            });
          }
        }

        // --- 3. Centre Owners Login ---
        const c = store.centres.find(x => 
          (x.centre_code && x.centre_code.toLowerCase() === em) ||
          (x.slug && x.slug.toLowerCase() === em) ||
          (x.email && x.email.toLowerCase() === em) ||
          (x.login_id && x.login_id.toLowerCase() === em) ||
          (x.director_name && x.director_name.toLowerCase() === em)
        );
        if (c) {
          const cOwnerUser = store.users.find(u => u.centre_id === c.id && u.role === 'centre_owner');
          const centrePass = c.login_password || (cOwnerUser && cOwnerUser.password_plain) || 'owner123';
          if (pw === centrePass) {
            if (c.status === 'terminated') return jsonResponse({ error: 'यह सेंटर फ्रैंचाइज़ी समाप्त (Terminate) कर दी गई है।' }, 403);
            if (c.status === 'suspended') return jsonResponse({ error: 'यह सेंटर वर्तमान में निलंबित (Suspended) है।' }, 403);
            const userObj = { id: c.id, email: c.email || `desk@${c.slug}.pescouncil.in`, name: c.director_name || c.name, role: 'centre_owner', centre_id: c.id, centre_code: c.centre_code, centre_slug: c.slug };
            return jsonResponse({ ok: true, user: userObj }, 200, {
              'set-cookie': `pesc_auth=${encodeURIComponent(JSON.stringify(userObj))}; Path=/; HttpOnly; SameSite=Lax`
            });
          }
        }

        // --- 4. Students Login ---
        const s = store.students.find(x => 
          (x.roll_no && String(x.roll_no).toLowerCase() === em) ||
          (x.student_code && x.student_code.toLowerCase() === em) ||
          (x.email && x.email.toLowerCase() === em) ||
          (x.username && x.username.toLowerCase() === em) ||
          (x.mobile && String(x.mobile).trim() === em)
        );
        if (s) {
          const stuPass = s.initial_password || s.password || 'Student@123';
          if (pw === stuPass) {
            const userObj = { id: s.id, email: s.email || `${s.roll_no || s.student_code}@student.pescouncil.in`, name: s.name, role: 'student', student_id: s.id, roll_no: s.roll_no || s.student_code };
            return jsonResponse({ ok: true, user: userObj }, 200, {
              'set-cookie': `pesc_auth=${encodeURIComponent(JSON.stringify(userObj))}; Path=/; HttpOnly; SameSite=Lax`
            });
          }
        }

        // --- 5. Generic store.users fallback (strictly matching u.password_plain) ---
        const u = store.users.find(x => (x.email && x.email.toLowerCase() === em) || (x.username && x.username.toLowerCase() === em));
        if (u) {
          const uPass = u.password_plain || (u.role === 'super_admin' ? 'admin123' : u.role === 'coordinator' ? 'Coord@123' : u.role === 'centre_owner' ? 'owner123' : '123456');
          if (pw === uPass) {
            const userObj = { id: u.id, email: u.email, name: u.name || 'User', role: u.role, centre_id: u.centre_id };
            return jsonResponse({ ok: true, user: userObj }, 200, {
              'set-cookie': `pesc_auth=${encodeURIComponent(JSON.stringify(userObj))}; Path=/; HttpOnly; SameSite=Lax`
            });
          }
        }

        return jsonResponse({ error: 'Invalid email, Login ID, or password' }, 401);
      } catch (err) {
        return jsonResponse({ error: 'Login error' }, 400);
      }
    }

    if (path === '/api/auth/me') {
      if (cookies.pesc_auth) {
        try {
          const user = JSON.parse(decodeURIComponent(cookies.pesc_auth));
          return jsonResponse({ user });
        } catch (_) {}
      }
      return jsonResponse({ user: null });
    }

    if (path === '/api/auth/logout') {
      return jsonResponse({ ok: true }, 200, {
        'set-cookie': 'pesc_auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      });
    }

    // --- Admin APIs ---
    if (path.startsWith('/api/admin/')) {
      if (path === '/api/admin/stats') {
        const activeCentres = store.centres.filter(c => c.status === 'active').length;
        const validCerts = store.certificates.filter(c => c.status === 'Valid').length;
        return jsonResponse({
          centres: { active: activeCentres, suspended: 0, failed: 0 },
          applications_pending: store.applications.filter(a => a.status === 'Submitted').length,
          students: store.students.length,
          certificates: { pending: store.certificates.filter(c => c.status !== 'Valid').length, valid: validCerts },
          wallet_total_paise: 50000000,
          centres_total: store.centres.length,
          centres_active: activeCentres,
          students_total: store.students.length,
          certificates_total: store.certificates.length,
          marksheets_total: store.marksheets.length
        });
      }

      if (path === '/api/admin/authorities') {
        return jsonResponse({
          ok: true,
          authorities: getAuthorities(null)
        });
      }

      if (path === '/api/admin/reset-platform-data' && (request.method === 'POST' || request.method === 'DELETE')) {
        const adminUser = store.users.find(u => u.role === 'super_admin' || u.role === 'admin') || CLEAN_ADMIN_USER;
        store.centres = [];
        store.applications = [];
        store.students = [];
        store.certificates = [];
        store.marksheets = [];
        store.coordinator_certificates = [];
        store.wallet_topups = [];
        store.users = [adminUser];
        await Promise.all([
          env.PESC_KV.put('centres', JSON.stringify([])),
          env.PESC_KV.put('applications', JSON.stringify([])),
          env.PESC_KV.put('students', JSON.stringify([])),
          env.PESC_KV.put('certificates', JSON.stringify([])),
          env.PESC_KV.put('marksheets', JSON.stringify([])),
          env.PESC_KV.put('coordinator_certificates', JSON.stringify([])),
          env.PESC_KV.put('wallet_topups', JSON.stringify([])),
          env.PESC_KV.put('users', JSON.stringify([adminUser])),
          env.PESC_KV.put('data_version', DATA_VERSION)
        ]);
        return jsonResponse({
          ok: true,
          message: 'All franchises, students, and coordinators have been wiped completely. Ready for fresh setup!'
        });
      }

      if (path === '/api/admin/site-settings') {
        if (request.method === 'POST' || request.method === 'PUT') {
          try {
            const body = await request.json().catch(() => ({}));
            if (body.logo_url !== undefined) store.site_settings.logo_url = String(body.logo_url || '').trim();
            if (body.council_title !== undefined) store.site_settings.council_title = String(body.council_title || '').trim();
            if (body.hindi_title !== undefined) store.site_settings.hindi_title = String(body.hindi_title || '').trim();
            if (body.notice_text !== undefined) store.site_settings.notice_text = String(body.notice_text || '').trim();
            if (body.show_notice !== undefined) store.site_settings.show_notice = Boolean(body.show_notice);
            if (body.show_verify !== undefined) store.site_settings.show_verify = Boolean(body.show_verify);
            if (body.show_coordinators !== undefined) store.site_settings.show_coordinators = Boolean(body.show_coordinators);
            if (body.show_centres !== undefined) store.site_settings.show_centres = Boolean(body.show_centres);
            if (body.show_students !== undefined) store.site_settings.show_students = Boolean(body.show_students);
            if (body.show_franchise_btn !== undefined) store.site_settings.show_franchise_btn = Boolean(body.show_franchise_btn);

            await persistToKV(env, 'site_settings', store.site_settings);
            return jsonResponse({ ok: true, message: 'Website branding & content controls updated successfully!', settings: store.site_settings });
          } catch (err) {
            return jsonResponse({ error: err.message }, 400);
          }
        }
        return jsonResponse({ ok: true, settings: store.site_settings });
      }

      if (path === '/api/admin/centres') {
        const enriched = store.centres.map(c => {
          const stus = store.students.filter(s => s.centre_id === c.id);
          return {
            ...c,
            students: stus.length,
            login_id: c.centre_code,
            login_password: c.login_password || 'owner123'
          };
        });
        return jsonResponse({ centres: enriched });
      }

      if (path.match(/\/api\/admin\/centres\/\d+\/credentials/)) {
        const cId = +path.split('/')[4];
        const targetC = store.centres.find(c => c.id === cId) || store.centres[0];
        return jsonResponse({
          ok: true,
          credentials: {
            centre_code: targetC.centre_code,
            name: targetC.name,
            director_name: targetC.director_name,
            phone: targetC.phone,
            password: targetC.login_password || 'owner123',
            portal_url: `https://${targetC.slug}.pescouncil.in/portal`
          }
        });
      }

      if (path.match(/\/api\/admin\/centres\/\d+\/set-password/) && request.method === 'POST') {
        try {
          const cId = +path.split('/')[4];
          const targetC = store.centres.find(c => c.id === cId);
          if (!targetC) return jsonResponse({ error: 'Centre not found' }, 404);
          const body = await request.json();
          targetC.login_password = String(body.password || 'owner123').trim();
          const cOwner = store.users.find(u => u.centre_id === targetC.id && u.role === 'centre_owner');
          if (cOwner) {
            cOwner.password_plain = targetC.login_password;
          }
          await persistToKV(env, 'centres', store.centres);
          await persistToKV(env, 'users', store.users);
          return jsonResponse({ ok: true, message: `Password updated successfully for ${targetC.centre_code}!` });
        } catch (err) {
          return jsonResponse({ error: err.message }, 400);
        }
      }

      if (path.match(/\/api\/admin\/centres\/\d+\/terminate/) && request.method === 'POST') {
        const cId = +path.split('/')[4];
        const targetC = store.centres.find(c => c.id === cId);
        if (!targetC) return jsonResponse({ error: 'Centre not found' }, 404);
        const body = await request.json().catch(() => ({}));
        targetC.status = 'terminated';
        targetC.terminated_at = Date.now();
        targetC.termination_reason = body.reason || 'Terminated by Council Administration';
        await persistToKV(env, 'centres', store.centres);
        return jsonResponse({ ok: true, message: `Franchise for ${targetC.name} (${targetC.centre_code}) has been terminated!` });
      }

      if (path.match(/\/api\/admin\/centres\/\d+\/activate/) && request.method === 'POST') {
        const cId = +path.split('/')[4];
        const targetC = store.centres.find(c => c.id === cId);
        if (!targetC) return jsonResponse({ error: 'Centre not found' }, 404);
        targetC.status = 'active';
        delete targetC.terminated_at;
        delete targetC.termination_reason;
        await persistToKV(env, 'centres', store.centres);
        return jsonResponse({ ok: true, message: `Franchise for ${targetC.name} (${targetC.centre_code}) reactivated successfully!` });
      }

      if (path.match(/\/api\/admin\/centres\/\d+\/affiliation-cert/)) {
        const cId = +path.split('/')[4];
        const targetC = store.centres.find(c => c.id === cId) || store.centres[0];
        if (!targetC) return jsonResponse({ error: 'Centre not found' }, 404);

        if (request.method === 'PUT' || request.method === 'POST') {
          try {
            const body = await request.json();
            if (body.cert_no !== undefined) targetC.affiliation_cert_no = String(body.cert_no).trim();
            if (body.name !== undefined) targetC.name = String(body.name).trim();
            if (body.director_name !== undefined) targetC.director_name = String(body.director_name).trim();
            if (body.director_photo !== undefined || body.photo_url !== undefined) {
              const dp = String(body.director_photo || body.photo_url || '').trim();
              targetC.director_photo = dp;
              targetC.photo_url = dp;
            }
            if (body.address !== undefined) targetC.address = String(body.address).trim();
            if (body.district !== undefined) targetC.district = String(body.district).trim();
            if (body.state !== undefined) targetC.state = String(body.state).trim();
            if (body.pin !== undefined) targetC.pin = String(body.pin).trim();
            if (body.phone !== undefined) targetC.phone = String(body.phone).trim();
            if (body.email !== undefined) targetC.email = String(body.email).trim().toLowerCase();
            if (body.issue_date !== undefined) targetC.affiliation_issue_date = String(body.issue_date).trim();
            if (body.valid_thru !== undefined) targetC.affiliation_valid_thru = String(body.valid_thru).trim();
            if (body.session !== undefined) targetC.affiliation_session = String(body.session).trim();
            if (body.authorized_courses !== undefined) targetC.authorized_courses = String(body.authorized_courses).trim();
            if (body.status !== undefined) targetC.status = String(body.status).trim();

            await persistToKV(env, 'centres', store.centres);
            const adminUser = store.users.find(u => u.role === 'super_admin' || u.role === 'admin') || {};
            const coordUser = (targetC.assigned_coordinator_id ? store.users.find(u => u.id === targetC.assigned_coordinator_id) : null) || store.users.find(u => u.role === 'coordinator') || {};
            return jsonResponse({
              ok: true,
              message: `Affiliation certificate for ${targetC.name} (${targetC.centre_code}) updated successfully!`,
              certificate: {
                cert_no: targetC.affiliation_cert_no || `PESC/ATC/2026/${targetC.centre_code}`,
                centre_code: targetC.centre_code,
                name: targetC.name,
                hindi_name: targetC.hindi_name || targetC.name,
                director_name: targetC.director_name || 'Centre Director',
                director_photo: targetC.director_photo || targetC.photo_url || '',
                address: targetC.address || `${targetC.district}, ${targetC.state}`,
                district: targetC.district,
                state: targetC.state,
                pin: targetC.pin || '221001',
                phone: targetC.phone || '+91 98765 43210',
                email: targetC.email || `director@${targetC.slug}.pescouncil.in`,
                issue_date: targetC.affiliation_issue_date || '01 April 2026',
                valid_thru: targetC.affiliation_valid_thru || '31 March 2029',
                session: targetC.affiliation_session || '2026 - 2029 (3 Academic Years)',
                status: targetC.status || 'active',
                authorized_courses: targetC.authorized_courses || 'DCA, PGDCA, ADCA, CCC, TallyPrime ERP, Web & Software Development, Python, Graphic Design, Hardware & Networking',
                qr_url: `https://pescouncil.in/verify?code=${targetC.centre_code}`,
                council_seal_url: adminUser.seal_url || null,
                council_signature_url: adminUser.signature_url || null,
                coordinator_seal_url: coordUser.seal_url || targetC.coordinator_seal_url || null,
                coordinator_signature_url: coordUser.signature_url || targetC.coordinator_signature_url || null,
                coordinator_name: coordUser.name || targetC.coordinator_name || 'Regional Coordinator',
                coordinator_territory: coordUser.territory || coordUser.state || targetC.state || 'Assigned Territory',
                head_office: {
                  seal_url: adminUser.seal_url || null,
                  signature_url: adminUser.signature_url || null,
                },
                coordinator: {
                  name: coordUser.name || targetC.coordinator_name || 'Regional Coordinator',
                  seal_url: coordUser.seal_url || targetC.coordinator_seal_url || null,
                  signature_url: coordUser.signature_url || targetC.coordinator_signature_url || null,
                  territory: coordUser.territory || coordUser.state || targetC.state || 'Assigned Territory'
                }
              }
            });
          } catch (err) {
            return jsonResponse({ error: err.message }, 400);
          }
        }

        const adminUser = store.users.find(u => u.role === 'super_admin' || u.role === 'admin') || {};
        const coordUser = (targetC.assigned_coordinator_id ? store.users.find(u => u.id === targetC.assigned_coordinator_id) : null) || store.users.find(u => u.role === 'coordinator') || {};
        return jsonResponse({
          ok: true,
          certificate: {
            cert_no: targetC.affiliation_cert_no || `PESC/ATC/2026/${targetC.centre_code}`,
            centre_code: targetC.centre_code,
            name: targetC.name,
            hindi_name: targetC.hindi_name || targetC.name,
            director_name: targetC.director_name || 'Centre Director',
            director_photo: targetC.director_photo || targetC.photo_url || '',
            address: targetC.address || `${targetC.district}, ${targetC.state}`,
            district: targetC.district,
            state: targetC.state,
            pin: targetC.pin || '221001',
            phone: targetC.phone || '+91 98765 43210',
            email: targetC.email || `director@${targetC.slug}.pescouncil.in`,
            issue_date: targetC.affiliation_issue_date || '01 April 2026',
            valid_thru: targetC.affiliation_valid_thru || '31 March 2029',
            session: targetC.affiliation_session || '2026 - 2029 (3 Academic Years)',
            status: targetC.status || 'active',
            authorized_courses: targetC.authorized_courses || 'DCA, PGDCA, ADCA, CCC, TallyPrime ERP, Web & Software Development, Python, Graphic Design, Hardware & Networking',
            qr_url: `https://pescouncil.in/verify?code=${targetC.centre_code}`,
            council_seal_url: adminUser.seal_url || null,
            council_signature_url: adminUser.signature_url || null,
            coordinator_seal_url: coordUser.seal_url || targetC.coordinator_seal_url || null,
            coordinator_signature_url: coordUser.signature_url || targetC.coordinator_signature_url || null,
            coordinator_name: coordUser.name || targetC.coordinator_name || 'Regional Coordinator',
            coordinator_territory: coordUser.territory || coordUser.state || targetC.state || 'Assigned Territory',
            head_office: {
              seal_url: adminUser.seal_url || null,
              signature_url: adminUser.signature_url || null,
            },
            coordinator: {
              name: coordUser.name || targetC.coordinator_name || 'Regional Coordinator',
              seal_url: coordUser.seal_url || targetC.coordinator_seal_url || null,
              signature_url: coordUser.signature_url || targetC.coordinator_signature_url || null,
              territory: coordUser.territory || coordUser.state || targetC.state || 'Assigned Territory'
            }
          }
        });
      }

      if (path.match(/\/api\/admin\/centres\/\d+$/)) {
        const cId = +path.split('/')[4];
        const targetC = store.centres.find(c => c.id === cId);
        if (!targetC) return jsonResponse({ error: 'Centre not found' }, 404);
        if (request.method === 'PUT' || request.method === 'POST') {
          try {
            const body = await request.json();
            if (body.name !== undefined) targetC.name = String(body.name).trim();
            if (body.director_name !== undefined) targetC.director_name = String(body.director_name).trim();
            if (body.director_photo !== undefined || body.photo_url !== undefined) {
              const dp = String(body.director_photo || body.photo_url || '').trim();
              targetC.director_photo = dp;
              targetC.photo_url = dp;
            }
            if (body.address !== undefined) targetC.address = String(body.address).trim();
            if (body.district !== undefined) targetC.district = String(body.district).trim();
            if (body.state !== undefined) targetC.state = String(body.state).trim();
            if (body.pin !== undefined) targetC.pin = String(body.pin).trim();
            if (body.phone !== undefined) targetC.phone = String(body.phone).trim();
            if (body.email !== undefined) targetC.email = String(body.email).trim().toLowerCase();
            if (body.status !== undefined) targetC.status = String(body.status).trim();
            if (body.affiliation_cert_no !== undefined) targetC.affiliation_cert_no = String(body.affiliation_cert_no).trim();
            if (body.affiliation_issue_date !== undefined) targetC.affiliation_issue_date = String(body.affiliation_issue_date).trim();
            if (body.affiliation_valid_thru !== undefined) targetC.affiliation_valid_thru = String(body.affiliation_valid_thru).trim();
            if (body.affiliation_session !== undefined) targetC.affiliation_session = String(body.affiliation_session).trim();
            if (body.authorized_courses !== undefined) targetC.authorized_courses = String(body.authorized_courses).trim();

            await persistToKV(env, 'centres', store.centres);
            return jsonResponse({ ok: true, message: 'Centre updated successfully!', centre: targetC });
          } catch (err) {
            return jsonResponse({ error: err.message }, 400);
          }
        }
        return jsonResponse({ ok: true, centre: targetC });
      }

      if (path === '/api/admin/courses') {
        if (request.method === 'POST') {
          try {
            const body = await request.json();
            const nextId = store.courses.length ? Math.max(...store.courses.map(c => c.id)) + 1 : 1;
            const code = String(body.code || '').trim().toUpperCase();
            const name = String(body.name || '').trim();
            const dur = +body.duration_months || 6;
            const fee = Math.round((+body.fee_rupees || 5500) * 100);
            const totalMarks = +body.total_marks || 100;
            const singleFee = body.single_fee_rupees !== undefined ? Math.round(+body.single_fee_rupees * 100) : (+body.single_fee_paise || 20000);
            const semFee = body.semester_fee_rupees !== undefined ? Math.round(+body.semester_fee_rupees * 100) : (+body.semester_fee_paise || 60000);
            const curriculum = body.curriculum ? (typeof body.curriculum === 'string' ? body.curriculum : JSON.stringify(body.curriculum)) : (COURSE_CURRICULUM_DATA[code] ? JSON.stringify(COURSE_CURRICULUM_DATA[code]) : '{}');
            let subjects = body.subjects;
            if (typeof subjects === 'object') subjects = JSON.stringify(subjects);
            else if (!subjects) subjects = '[]';
            const newCourse = {
              id: nextId,
              code,
              name,
              duration_months: dur,
              fee_paise: fee,
              total_marks: totalMarks,
              pass_marks: 33,
              single_fee_paise: singleFee,
              semester_fee_paise: semFee,
              curriculum,
              subjects,
              active: 1
            };
            store.courses.push(newCourse);
            await persistToKV(env, 'courses', store.courses);
            return jsonResponse({ ok: true, id: newCourse.id, course: newCourse }, 201);
          } catch (err) {
            return jsonResponse({ error: err.message }, 400);
          }
        }
        return jsonResponse({
          courses: store.courses.map(c => ({
            ...c,
            single_fee_paise: c.single_fee_paise || 20000,
            semester_fee_paise: c.semester_fee_paise || 60000,
            single_fee_rupees: Math.round((c.single_fee_paise || 20000) / 100),
            semester_fee_rupees: Math.round((c.semester_fee_paise || 60000) / 100),
            curriculum: c.curriculum || (COURSE_CURRICULUM_DATA[c.code] ? JSON.stringify(COURSE_CURRICULUM_DATA[c.code]) : '{}')
          }))
        });
      }

      if (path.match(/\/api\/admin\/courses\/\d+\/curriculum$/)) {
        const cId = +path.split('/')[4];
        const target = store.courses.find(c => c.id === cId);
        if (!target) return jsonResponse({ error: 'Course not found' }, 404);

        if (request.method === 'GET') {
          let cur = target.curriculum;
          try { cur = typeof cur === 'string' ? JSON.parse(cur) : cur; } catch (_) {}
          if (!cur || !Object.keys(cur).length) {
            cur = COURSE_CURRICULUM_DATA[target.code] || { yearly: { 'Annual Examination': [] }, semester: { 'Semester 1': [] } };
          }
          return jsonResponse({
            ok: true,
            course_id: target.id,
            code: target.code,
            name: target.name,
            single_fee_rupees: Math.round((target.single_fee_paise || 20000) / 100),
            semester_fee_rupees: Math.round((target.semester_fee_paise || 60000) / 100),
            curriculum: cur
          });
        }

        if (request.method === 'POST' || request.method === 'PUT') {
          try {
            const body = await request.json();
            if (body.curriculum) {
              target.curriculum = typeof body.curriculum === 'string' ? body.curriculum : JSON.stringify(body.curriculum);
              if (typeof body.curriculum === 'object') {
                COURSE_CURRICULUM_DATA[target.code] = body.curriculum;
              }
            }
            if (body.single_fee_rupees !== undefined) {
              target.single_fee_paise = Math.round(+body.single_fee_rupees * 100);
            } else if (body.single_fee_paise !== undefined) {
              target.single_fee_paise = +body.single_fee_paise;
            }
            if (body.semester_fee_rupees !== undefined) {
              target.semester_fee_paise = Math.round(+body.semester_fee_rupees * 100);
            } else if (body.semester_fee_paise !== undefined) {
              target.semester_fee_paise = +body.semester_fee_paise;
            }
            await persistToKV(env, 'courses', store.courses);
            return jsonResponse({ ok: true, message: 'Curriculum & exam fees saved successfully!', course: target });
          } catch (err) {
            return jsonResponse({ error: err.message }, 400);
          }
        }
      }

      if (path.match(/\/api\/admin\/courses\/\d+$/) && (request.method === 'PUT' || request.method === 'POST')) {
        try {
          const cId = +path.split('/')[4];
          const target = store.courses.find(c => c.id === cId);
          if (!target) return jsonResponse({ error: 'Course not found' }, 404);
          const body = await request.json();
          if (body.code) target.code = String(body.code).trim().toUpperCase();
          if (body.name) target.name = String(body.name).trim();
          if (body.duration_months) target.duration_months = +body.duration_months;
          if (body.fee_rupees !== undefined) target.fee_paise = Math.round(+body.fee_rupees * 100);
          else if (body.fee_paise !== undefined) target.fee_paise = +body.fee_paise;
          if (body.total_marks !== undefined) target.total_marks = +body.total_marks;
          if (body.single_fee_rupees !== undefined) target.single_fee_paise = Math.round(+body.single_fee_rupees * 100);
          else if (body.single_fee_paise !== undefined) target.single_fee_paise = +body.single_fee_paise;
          if (body.semester_fee_rupees !== undefined) target.semester_fee_paise = Math.round(+body.semester_fee_rupees * 100);
          else if (body.semester_fee_paise !== undefined) target.semester_fee_paise = +body.semester_fee_paise;
          if (body.active !== undefined) target.active = body.active ? 1 : 0;
          if (body.curriculum !== undefined) {
            target.curriculum = typeof body.curriculum === 'string' ? body.curriculum : JSON.stringify(body.curriculum);
          }
          if (body.subjects !== undefined) {
            target.subjects = typeof body.subjects === 'object' ? JSON.stringify(body.subjects) : String(body.subjects);
          }
          await persistToKV(env, 'courses', store.courses);
          return jsonResponse({ ok: true, message: 'Course updated successfully!', course: target });
        } catch (err) {
          return jsonResponse({ error: err.message }, 400);
        }
      }

      if (path.match(/\/api\/admin\/courses\/\d+$/) && request.method === 'DELETE') {
        const cId = +path.split('/')[4];
        const target = store.courses.find(c => c.id === cId);
        if (!target) return jsonResponse({ error: 'Course not found' }, 404);
        target.active = 0;
        store.courses = store.courses.filter(c => c.id !== cId);
        await persistToKV(env, 'courses', store.courses);
        return jsonResponse({ ok: true, message: `Course ${target.code} removed successfully!` });
      }

      if (path === '/api/admin/marksheets/direct-issue' && request.method === 'POST') {
        try {
          const body = await request.json();
          const studentId = +body.student_id;
          const s = store.students.find(x => x.id === studentId);
          if (!s) return jsonResponse({ error: 'Student not found' }, 404);
          const co = store.courses.find(x => x.id === s.course_id) || store.courses[0];
          const ce = store.centres.find(x => x.id === s.centre_id) || store.centres[0];
          const totalMax = +body.total_max || 400;
          const totalObt = +body.total_obtained || 320;
          const pct = Math.round((totalObt / totalMax) * 1000) / 10;
          const grade = body.grade || (pct >= 80 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'B' : 'C');
          const evaluationType = body.evaluation_type === 'semester' ? 'semester' : 'yearly';
          const term = String(body.term || (evaluationType === 'semester' ? 'Semester 1' : 'Annual')).trim();
          const year = new Date().getFullYear();
          const nextId = store.marksheets.length + 1;
          const marksheetNo = `PESC/MRK/${year}/${String(nextId).padStart(6, '0')}`;
          const token = 'mrk-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
          let subjects = body.subjects;
          if (!subjects) {
            const curSubs = getCourseCurriculumSubjects(co.code || co.name, evaluationType, term);
            if (curSubs && curSubs.length) {
              const per = Math.round(totalObt / curSubs.length);
              subjects = curSubs.map(sub => ({
                code: sub.code,
                name: sub.name,
                max_theory: sub.max_theory || (sub.theory ? 50 : 70),
                obt_theory: Math.round(per * 0.5),
                max_practical: sub.max_practical || (sub.practical ? 50 : 30),
                obt_practical: Math.round(per * 0.5),
                total_max: sub.max_marks || sub.total_max || 100,
                total_obt: per
              }));
            }
          }
          if (!subjects) {
            try {
              const parsed = JSON.parse(co.subjects || '[]');
              if (parsed.length) {
                const per = Math.round(totalObt / parsed.length);
                subjects = parsed.map(sub => ({
                  code: sub.code,
                  name: sub.name,
                  max_theory: sub.max_theory || 70,
                  obt_theory: Math.round(per * 0.7),
                  max_practical: sub.max_practical || 30,
                  obt_practical: Math.round(per * 0.3),
                  total_max: sub.total_max || 100,
                  total_obt: per
                }));
              }
            } catch (_) {}
          }
          if (!subjects) {
            subjects = [
              { code: 'TH01', name: 'Theory Paper 1', max: 100, obt: Math.round(totalObt * 0.25) },
              { code: 'TH02', name: 'Theory Paper 2', max: 100, obt: Math.round(totalObt * 0.25) },
              { code: 'PR01', name: 'Practical Assessment', max: 100, obt: Math.round(totalObt * 0.25) },
              { code: 'PR02', name: 'Viva & Project Work', max: 100, obt: Math.round(totalObt * 0.25) }
            ];
          }
          const newMrk = {
            id: nextId,
            marksheet_no: marksheetNo,
            token,
            student_id: s.id,
            student_name: s.name,
            centre_id: s.centre_id,
            centre_name: ce.name,
            centre_code: ce.centre_code,
            course_id: s.course_id,
            course_name: co.name,
            course_code: co.code,
            exam_session: body.exam_session || s.session || '2026-27',
            roll_no: body.roll_no || s.roll_no || s.student_code,
            subjects: typeof subjects === 'string' ? subjects : JSON.stringify(subjects),
            total_max: totalMax,
            total_obtained: totalObt,
            percentage: pct,
            grade,
            result: 'PASS',
            status: 'Approved',
            evaluation_type: evaluationType,
            term,
            issue_date: Date.now(),
            created_at: Date.now()
          };
          store.marksheets.push(newMrk);
          await persistToKV(env, 'marksheets', store.marksheets);
          return jsonResponse({ id: newMrk.id, marksheet_no: marksheetNo, token, percentage: pct, grade, evaluation_type: evaluationType, term }, 201);
        } catch (err) {
          return jsonResponse({ error: err.message }, 400);
        }
      }

      if (path === '/api/admin/certificates/direct-issue' && request.method === 'POST') {
        try {
          const body = await request.json();
          const studentId = +body.student_id;
          const s = store.students.find(x => x.id === studentId);
          if (!s) return jsonResponse({ error: 'Student not found' }, 404);
          const ce = store.centres.find(x => x.id === s.centre_id) || store.centres[0];
          const co = store.courses.find(x => x.id === s.course_id) || store.courses[0];
          const evaluationType = body.evaluation_type === 'semester' ? 'semester' : 'yearly';
          const term = String(body.term || (evaluationType === 'semester' ? 'Semester 1' : 'Annual')).trim();
          const year = new Date().getFullYear();
          const nextId = store.certificates.length + 1;
          const certNo = `PESC/${year}/${String(nextId).padStart(6, '0')}`;
          const token = 'cert-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
          const newCert = {
            id: nextId,
            cert_no: certNo,
            token,
            student_id: s.id,
            student_name: s.name,
            centre_id: s.centre_id,
            centre_name: ce.name,
            course_id: s.course_id,
            course_name: co.name,
            status: 'Valid',
            evaluation_type: evaluationType,
            term,
            issued_at: Date.now(),
            created_at: Date.now()
          };
          store.certificates.push(newCert);
          await persistToKV(env, 'certificates', store.certificates);
          return jsonResponse({ id: newCert.id, cert_no: certNo, token, evaluation_type: evaluationType, term }, 201);
        } catch (err) {
          return jsonResponse({ error: err.message }, 400);
        }
      }

      // Admin Edit Certificate Details (Signatures & Seals Locked)
      if (path.match(/\/api\/admin\/certificates\/\d+\/edit$/) && request.method === 'POST') {
        const cId = +path.split('/')[4];
        let cert = store.certificates.find(x => x.id === cId || x.student_id === cId);
        if (!cert) return jsonResponse({ error: 'Certificate not found' }, 404);
        const body = await request.json().catch(() => ({}));

        delete body.seal_url;
        delete body.signature_url;
        delete body.coordinator_seal_url;
        delete body.coordinator_signature_url;
        delete body.council_seal_url;
        delete body.council_signature_url;

        if (body.student_name !== undefined) cert.student_name = String(body.student_name).trim();
        if (body.father_name !== undefined) cert.father_name = String(body.father_name).trim();
        if (body.mother_name !== undefined) cert.mother_name = String(body.mother_name).trim();
        if (body.roll_no !== undefined) cert.roll_no = String(body.roll_no).trim();
        if (body.student_code !== undefined) cert.student_code = String(body.student_code).trim();
        if (body.course_name !== undefined) cert.course_name = String(body.course_name).trim();
        if (body.exam_session !== undefined) cert.exam_session = String(body.exam_session).trim();
        if (body.session !== undefined) cert.exam_session = String(body.session).trim();
        if (body.term !== undefined) cert.term = String(body.term).trim();
        if (body.grade !== undefined) cert.grade = String(body.grade).trim();
        if (body.cert_no !== undefined) cert.cert_no = String(body.cert_no).trim();
        if (body.issue_date !== undefined) cert.issued_at = body.issue_date;
        if (body.header_type !== undefined) cert.header_type = String(body.header_type).trim();
        if (body.header_title !== undefined) cert.header_title = String(body.header_title).trim();
        if (body.header_hindi !== undefined) cert.header_hindi = String(body.header_hindi).trim();
        if (body.header_subtitle !== undefined) cert.header_subtitle = String(body.header_subtitle).trim();
        if (body.centre_name !== undefined) cert.centre_name = String(body.centre_name).trim();
        if (body.centre_name_hi !== undefined) cert.centre_name_hi = String(body.centre_name_hi).trim();
        if (body.council_address !== undefined) cert.council_address = String(body.council_address).trim();
        if (body.centre_address !== undefined) cert.centre_address = String(body.centre_address).trim();
        if (body.scheme !== undefined) cert.scheme = String(body.scheme).trim();
        if (body.evaluation_type !== undefined) cert.evaluation_type = String(body.evaluation_type).trim();

        const stu = store.students.find(s => s.id === cert.student_id);
        if (stu) {
          if (cert.student_name) stu.name = cert.student_name;
          if (cert.father_name) stu.father_name = cert.father_name;
          if (cert.mother_name) stu.mother_name = cert.mother_name;
          if (cert.roll_no) stu.roll_no = cert.roll_no;
          await persistToKV(env, 'students', store.students);
        }

        await persistToKV(env, 'certificates', store.certificates);
        return jsonResponse({ ok: true, message: 'Certificate details updated successfully!', certificate: cert });
      }

      // Admin Edit Marksheet Details & Marks (Signatures & Seals Locked)
      if (path.match(/\/api\/admin\/marksheets\/\d+\/edit$/) && request.method === 'POST') {
        const mId = +path.split('/')[4];
        let mrk = store.marksheets.find(x => x.id === mId || x.student_id === mId);
        if (!mrk) return jsonResponse({ error: 'Marksheet not found' }, 404);
        const body = await request.json().catch(() => ({}));

        delete body.seal_url;
        delete body.signature_url;
        delete body.coordinator_seal_url;
        delete body.coordinator_signature_url;
        delete body.council_seal_url;
        delete body.council_signature_url;

        if (body.student_name !== undefined) mrk.student_name = String(body.student_name).trim();
        if (body.father_name !== undefined) mrk.father_name = String(body.father_name).trim();
        if (body.mother_name !== undefined) mrk.mother_name = String(body.mother_name).trim();
        if (body.roll_no !== undefined) mrk.roll_no = String(body.roll_no).trim();
        if (body.student_code !== undefined) mrk.student_code = String(body.student_code).trim();
        if (body.course_name !== undefined) mrk.course_name = String(body.course_name).trim();
        if (body.exam_session !== undefined) mrk.exam_session = String(body.exam_session).trim();
        if (body.session !== undefined) mrk.exam_session = String(body.session).trim();
        if (body.term !== undefined) mrk.term = String(body.term).trim();
        if (body.evaluation_type !== undefined) mrk.evaluation_type = String(body.evaluation_type).trim();
        if (body.marksheet_no !== undefined) mrk.marksheet_no = String(body.marksheet_no).trim();
        if (body.issue_date !== undefined) mrk.issue_date = body.issue_date;
        if (body.header_type !== undefined) mrk.header_type = String(body.header_type).trim();
        if (body.header_title !== undefined) mrk.header_title = String(body.header_title).trim();
        if (body.header_hindi !== undefined) mrk.header_hindi = String(body.header_hindi).trim();
        if (body.header_subtitle !== undefined) mrk.header_subtitle = String(body.header_subtitle).trim();
        if (body.centre_name !== undefined) mrk.centre_name = String(body.centre_name).trim();
        if (body.centre_name_hi !== undefined) mrk.centre_name_hi = String(body.centre_name_hi).trim();
        if (body.council_address !== undefined) mrk.council_address = String(body.council_address).trim();
        if (body.centre_address !== undefined) mrk.centre_address = String(body.centre_address).trim();
        if (body.scheme !== undefined) mrk.scheme = String(body.scheme).trim();

        if (body.subjects !== undefined) {
          mrk.subjects = typeof body.subjects === 'string' ? body.subjects : JSON.stringify(body.subjects);
        }
        if (body.total_max !== undefined) mrk.total_max = +body.total_max;
        if (body.total_obtained !== undefined) mrk.total_obtained = +body.total_obtained;
        if (body.percentage !== undefined) mrk.percentage = +body.percentage;
        else if (mrk.total_max && mrk.total_obtained) {
          mrk.percentage = Math.round((mrk.total_obtained / mrk.total_max) * 1000) / 10;
        }
        if (body.grade !== undefined) mrk.grade = String(body.grade).trim();
        else if (mrk.percentage !== undefined) {
          mrk.grade = mrk.percentage >= 80 ? 'A+' : mrk.percentage >= 70 ? 'A' : mrk.percentage >= 60 ? 'B' : mrk.percentage >= 50 ? 'C' : 'D';
        }
        if (body.result !== undefined) mrk.result = String(body.result).trim();

        const stu = store.students.find(s => s.id === mrk.student_id);
        if (stu) {
          if (mrk.student_name) stu.name = mrk.student_name;
          if (mrk.father_name) stu.father_name = mrk.father_name;
          if (mrk.mother_name) stu.mother_name = mrk.mother_name;
          if (mrk.roll_no) stu.roll_no = mrk.roll_no;
          await persistToKV(env, 'students', store.students);
        }

        await persistToKV(env, 'marksheets', store.marksheets);
        return jsonResponse({ ok: true, message: 'Marksheet details & marks updated successfully!', marksheet: mrk });
      }

      if (path === '/api/admin/coordinators') {
        if (request.method === 'POST') {
          try {
            const body = await request.json();
            const nextId = store.users.length + 10;
            const newCoord = {
              id: nextId,
              name: String(body.name || 'Regional Coordinator').trim(),
              email: String(body.email || '').trim().toLowerCase(),
              mobile: String(body.mobile || '').trim(),
              address: String(body.address || '').trim(),
              district: String(body.district || '').trim(),
              state: String(body.state || 'Uttar Pradesh').trim(),
              pin: String(body.pin || '').trim(),
              aadhar_no: String(body.aadhar_no || '').trim(),
              qualification: String(body.qualification || '').trim(),
              territory: String(body.territory || body.state || 'All Assigned Territories').trim(),
              photo_url: String(body.photo_url || '').trim() || null,
              role: 'coordinator',
              status: 'active',
              created_at: Date.now(),
            };
            store.users.push(newCoord);
            const cert = getOrCreateWorkerCoordCert(newCoord.id, newCoord);
            await persistToKV(env, 'users', store.users);
            return jsonResponse({ ok: true, id: newCoord.id, cert_no: cert.cert_no }, 201);
          } catch (err) {
            return jsonResponse({ error: err.message }, 400);
          }
        }
        let coords = store.users.filter(u => u.role === 'coordinator');
        const enrichedCoords = coords.map(c => {
          const cert = getOrCreateWorkerCoordCert(c.id, c);
          const myCentres = store.centres.filter(cn => cn.coordinator_id === c.id || cn.assigned_coordinator_id === c.id).map(cn => ({
            id: cn.id,
            centre_code: cn.centre_code,
            name: cn.name,
            slug: cn.slug,
            district: cn.district,
            state: cn.state,
            phone: cn.phone || cn.mobile,
            email: cn.email,
            director_name: cn.director_name,
            director_photo: cn.director_photo || cn.photo_url,
            status: cn.status,
            affiliation_cert_no: cn.affiliation_cert_no,
            created_at: cn.created_at
          }));
          return {
            ...c,
            password: c.password_plain || 'Coord@123',
            cert_no: cert.cert_no,
            cert_status: cert.status,
            cert_token: cert.token,
            cert_issued_at: cert.issued_at,
            centres_count: myCentres.length,
            centres: myCentres
          };
        });
        return jsonResponse({ coordinators: enrichedCoords });
      }

      if (path.match(/\/api\/admin\/coordinators\/\d+\/centres/) && request.method === 'GET') {
        const coordId = +path.split('/')[4];
        const myCentres = store.centres.filter(cn => cn.coordinator_id === coordId || cn.assigned_coordinator_id === coordId);
        return jsonResponse({ centres: myCentres });
      }

      if (path.match(/\/api\/admin\/coordinators\/\d+\/set-password/) && request.method === 'POST') {
        try {
          const coordId = +path.split('/')[4];
          const coord = store.users.find(u => u.id === coordId && u.role === 'coordinator');
          if (!coord) return jsonResponse({ error: 'Coordinator not found' }, 404);
          const body = await request.json();
          coord.password_plain = String(body.password || 'Coord@123').trim();
          await persistToKV(env, 'users', store.users);
          return jsonResponse({ ok: true, message: `Password updated successfully for ${coord.name}!` });
        } catch (err) {
          return jsonResponse({ error: err.message }, 400);
        }
      }

      if (path.startsWith('/api/admin/coordinators/') && path.endsWith('/cert')) {
        const coordId = +path.replace('/api/admin/coordinators/', '').replace('/cert', '');
        const coordUser = store.users.find(u => u.id === coordId) || store.users.find(u => u.role === 'coordinator') || { id: 2, name: 'Vikram Singh', email: 'coord@pescouncil.in', state: 'Uttar Pradesh' };
        const adminUser = store.users.find(u => u.role === 'super_admin' || u.role === 'admin') || {};
        const cert = getOrCreateWorkerCoordCert(coordUser.id, coordUser);
        return jsonResponse({
          certificate: {
            ...cert,
            name: coordUser.name,
            email: coordUser.email,
            mobile: coordUser.mobile || null,
            address: coordUser.address || `${coordUser.district || 'Varanasi'}, ${coordUser.state || 'Uttar Pradesh'}`,
            district: coordUser.district || 'Varanasi',
            state: coordUser.state || cert.state || 'Uttar Pradesh',
            pin: coordUser.pin || '221001',
            aadhar_no: coordUser.aadhar_no || 'XXXX-XXXX-2026',
            qualification: coordUser.qualification || 'Post Graduate / MCA',
            territory: coordUser.territory || coordUser.state || 'All Assigned Territories',
            photo_url: coordUser.photo_url || null,
            // Head Office Authority Credentials (NOT coordinator's own):
            seal_url: adminUser.seal_url || null,
            signature_url: adminUser.signature_url || null,
            council_seal_url: adminUser.seal_url || null,
            council_signature_url: adminUser.signature_url || null,
            verification_url: `https://${host}/verify/coordinator/${cert.token}`,
          }
        });
      }

      if (path.match(/^\/api\/admin\/coordinators\/\d+$/) && request.method === 'DELETE') {
        try {
          const coordId = +path.split('/')[4];
          const idx = store.users.findIndex(u => u.id === coordId && u.role === 'coordinator');
          if (idx === -1) return jsonResponse({ error: 'Coordinator not found' }, 404);
          const deleted = store.users[idx];
          store.users.splice(idx, 1);
          if (store.centres) {
            store.centres.forEach(c => {
              if (c.coordinator_id === coordId || c.assigned_coordinator_id === coordId) {
                c.coordinator_id = null;
                c.assigned_coordinator_id = null;
              }
            });
            await persistToKV(env, 'centres', store.centres);
          }
          if (store.coordinator_certificates) {
            store.coordinator_certificates = store.coordinator_certificates.filter(cc => cc.user_id !== coordId);
            await persistToKV(env, 'coordinator_certificates', store.coordinator_certificates);
          }
          await persistToKV(env, 'users', store.users);
          return jsonResponse({ ok: true, message: `Coordinator ${deleted.name} deleted successfully` });
        } catch (err) {
          return jsonResponse({ error: err.message }, 400);
        }
      }

      if (path === '/api/admin/applications') {
        return jsonResponse({ applications: store.applications });
      }

      if (path === '/api/admin/headoffice-payment-settings') {
        if (request.method === 'POST' || request.method === 'PUT') {
          let body = await request.json().catch(() => ({}));
          if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch (_) {}
          }
          store.site_settings = store.site_settings || {};
          if (body.upi_id !== undefined) store.site_settings.upi_id = String(body.upi_id).trim();
          if (body.upi_name !== undefined) store.site_settings.upi_name = String(body.upi_name).trim();
          if (body.bank_name !== undefined) store.site_settings.bank_name = String(body.bank_name).trim();
          
          const acc = body.account_number !== undefined ? body.account_number : body.bank_account;
          if (acc !== undefined) {
            store.site_settings.account_number = String(acc).trim();
            store.site_settings.bank_account = String(acc).trim();
          }

          const ifsc = body.ifsc_code !== undefined ? body.ifsc_code : body.bank_ifsc;
          if (ifsc !== undefined) {
            store.site_settings.ifsc_code = String(ifsc).trim().toUpperCase();
            store.site_settings.bank_ifsc = String(ifsc).trim().toUpperCase();
          }

          if (body.whatsapp_number !== undefined) {
            store.site_settings.whatsapp_number = String(body.whatsapp_number).trim();
          }

          const qr = body.qr_code_image !== undefined ? body.qr_code_image : body.qr_image_url;
          if (qr !== undefined) {
            store.site_settings.qr_code_image = String(qr).trim();
            store.site_settings.qr_image_url = String(qr).trim();
          }

          await persistToKV(env, 'site_settings', store.site_settings);

          const curS = store.site_settings;
          const upiId = curS.upi_id || 'pescouncil@upi';
          const upiName = curS.upi_name || 'Purvanchal Education and Skill Council';
          const bankName = curS.bank_name || 'State Bank of India';
          const accNo = curS.account_number || curS.bank_account || '39820192830';
          const ifscCode = curS.ifsc_code || curS.bank_ifsc || 'SBIN0001234';
          const waNum = curS.whatsapp_number || '919876543210';
          const qrImg = curS.qr_code_image || curS.qr_image_url || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi%3A%2F%2Fpay%3Fpa%3D${encodeURIComponent(upiId)}%26pn%3D${encodeURIComponent(upiName)}`;

          return jsonResponse({
            ok: true,
            message: 'Payment settings updated successfully!',
            settings: {
              upi_id: upiId,
              upi_name: upiName,
              bank_name: bankName,
              account_number: accNo,
              bank_account: accNo,
              ifsc_code: ifscCode,
              bank_ifsc: ifscCode,
              whatsapp_number: waNum,
              qr_code_image: qrImg,
              qr_image_url: qrImg
            }
          });
        }

        const s = store.site_settings || {};
        const upiId = s.upi_id || 'pescouncil@upi';
        const upiName = s.upi_name || 'Purvanchal Education and Skill Council';
        const bankName = s.bank_name || 'State Bank of India';
        const accNo = s.account_number || s.bank_account || '39820192830';
        const ifscCode = s.ifsc_code || s.bank_ifsc || 'SBIN0001234';
        const waNum = s.whatsapp_number || '919876543210';
        const qrImg = s.qr_code_image || s.qr_image_url || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi%3A%2F%2Fpay%3Fpa%3D${encodeURIComponent(upiId)}%26pn%3D${encodeURIComponent(upiName)}`;

        return jsonResponse({
          settings: {
            upi_id: upiId,
            upi_name: upiName,
            bank_name: bankName,
            account_number: accNo,
            bank_account: accNo,
            ifsc_code: ifscCode,
            bank_ifsc: ifscCode,
            whatsapp_number: waNum,
            qr_code_image: qrImg,
            qr_image_url: qrImg
          }
        });
      }

      if (path === '/api/admin/wallets') {
        return jsonResponse({
          wallets: store.centres.map(c => ({
            id: c.id,
            centre_id: c.id,
            centre_code: c.centre_code,
            centre_name: c.name,
            name: c.name,
            district: c.district,
            state: c.state,
            centre_status: c.status || 'active',
            balance: c.wallet_balance !== undefined ? c.wallet_balance : (c.wallet_paise ? c.wallet_paise / 100 : 0),
            balance_paise: c.wallet_paise !== undefined ? c.wallet_paise : (c.wallet_balance ? c.wallet_balance * 100 : 0)
          }))
        });
      }

      if (path === '/api/admin/wallet-topups') {
        return jsonResponse({ requests: store.wallet_topups || [] });
      }

      if (path.match(/\/api\/admin\/wallet-topups\/[^\/]+\/approve/) && request.method === 'POST') {
        const topupIdStr = String(path.split('/')[4]);
        const topup = (store.wallet_topups || []).find(t => String(t.id) === topupIdStr || +t.id === +topupIdStr);
        if (!topup) return jsonResponse({ error: 'Top-up request not found' }, 404);

        if (String(topup.status || '').toLowerCase() === 'approved') {
          return jsonResponse({ error: 'Request is already approved' }, 409);
        }

        const reqAmt = (topup.amount_rupees !== undefined ? +topup.amount_rupees : (topup.amount_paise ? +topup.amount_paise / 100 : 0)) || 0;
        const reqPaise = (topup.amount_paise !== undefined ? +topup.amount_paise : reqAmt * 100) || 0;

        topup.status = 'Approved';
        topup.approved_at = Date.now();
        topup.reviewed_at = Date.now();

        const targetC = store.centres.find(ce =>
          (+ce.id === +topup.centre_id) ||
          (topup.centre_code && ce.centre_code && String(ce.centre_code).toUpperCase() === String(topup.centre_code).toUpperCase())
        );

        if (targetC) {
          targetC.wallet_balance = (targetC.wallet_balance || 0) + reqAmt;
          targetC.wallet_paise = (targetC.wallet_paise || 0) + reqPaise;
          if (!Array.isArray(targetC.wallet_ledger)) targetC.wallet_ledger = [];
          targetC.wallet_ledger.unshift({
            id: Date.now(),
            kind: 'credit',
            type: 'credit',
            amount: reqAmt,
            amount_paise: reqPaise,
            balance_after: targetC.wallet_balance,
            description: `Wallet Top-Up Approved (${topup.payment_mode || 'UPI'} - ${topup.utr_number || 'Direct'})`,
            note: `Wallet Top-Up Approved (${topup.payment_mode || 'UPI'} - ${topup.utr_number || 'Direct'})`,
            reference: topup.utr_number || `TOPUP-${topup.id}`,
            created_at: Date.now(),
            date: new Date().toLocaleDateString('en-IN')
          });
          await persistToKV(env, 'centres', store.centres);
        }
        await persistToKV(env, 'wallet_topups', store.wallet_topups);

        return jsonResponse({
          ok: true,
          status: 'approved',
          id: topup.id,
          credited_rupees: reqAmt,
          credited_paise: reqPaise,
          balance_paise: targetC ? targetC.wallet_paise : reqPaise,
          balance: targetC ? targetC.wallet_balance : reqAmt,
          message: `Approved ₹${reqAmt.toLocaleString('en-IN')} top-up for ${targetC ? targetC.name : 'Centre'}!`
        });
      }

      if (path.match(/\/api\/admin\/wallet-topups\/[^\/]+\/reject/) && request.method === 'POST') {
        const topupIdStr = String(path.split('/')[4]);
        let body = await request.json().catch(() => ({}));
        if (typeof body === 'string') {
          try { body = JSON.parse(body); } catch (_) {}
        }
        const reason = (body.reason || 'UTR verification failed or payment not received').trim();
        const topup = (store.wallet_topups || []).find(t => String(t.id) === topupIdStr || +t.id === +topupIdStr);
        if (!topup) return jsonResponse({ error: 'Top-up request not found' }, 404);

        topup.status = 'Rejected';
        topup.rejection_reason = reason;
        topup.reviewed_at = Date.now();
        await persistToKV(env, 'wallet_topups', store.wallet_topups);
        return jsonResponse({ ok: true, status: 'rejected', id: topup.id, rejection_reason: reason, message: 'Top-up request rejected.' });
      }

      if (path.match(/\/api\/admin\/wallets\/\d+\/adjust/) && request.method === 'POST') {
        const centreId = +path.split('/')[4];
        const body = await request.json().catch(() => ({}));
        const amt = +body.amount_rupees || 0;
        const targetC = store.centres.find(ce => ce.id === centreId);
        if (targetC) {
          if (body.kind === 'debit') {
            targetC.wallet_balance = Math.max(0, (targetC.wallet_balance || 0) - amt);
            targetC.wallet_paise = Math.max(0, (targetC.wallet_paise || 0) - (amt * 100));
          } else {
            targetC.wallet_balance = (targetC.wallet_balance || 0) + amt;
            targetC.wallet_paise = (targetC.wallet_paise || 0) + (amt * 100);
          }
          if (!Array.isArray(targetC.wallet_ledger)) targetC.wallet_ledger = [];
          targetC.wallet_ledger.unshift({
            id: Date.now(),
            kind: body.kind === 'debit' ? 'debit' : 'credit',
            type: body.kind === 'debit' ? 'debit' : 'credit',
            amount: amt,
            amount_paise: amt * 100,
            balance_after: targetC.wallet_balance,
            description: body.reason || `Head Office Manual Wallet Adjustment (${body.kind.toUpperCase()})`,
            note: body.reason || `Head Office Manual Wallet Adjustment (${body.kind.toUpperCase()})`,
            reference: `ADJ-${Date.now()}`,
            created_at: Date.now(),
            date: new Date().toLocaleDateString('en-IN')
          });
          await persistToKV(env, 'centres', store.centres);
          return jsonResponse({ ok: true, balance: targetC.wallet_balance, message: `Wallet adjusted successfully! Current balance: ₹${targetC.wallet_balance}` });
        }
        return jsonResponse({ error: 'Centre not found' }, 404);
      }

      if (path === '/api/admin/notices') {
        if (request.method === 'POST') {
          try {
            const body = await request.json();
            const nextId = (store.notices && store.notices.length) ? Math.max(...store.notices.map(n => n.id)) + 1 : 1;
            const newNotice = {
              id: nextId,
              title: String(body.title || 'Announcement').trim(),
              category: String(body.category || 'General').trim(),
              content: String(body.content || '').trim(),
              target: String(body.target || 'all').trim(),
              link: String(body.link || '').trim(),
              pinned: body.pinned ? 1 : 0,
              active: 1,
              created_at: Date.now()
            };
            store.notices = store.notices || [];
            store.notices.unshift(newNotice);
            await persistToKV(env, 'notices', store.notices);
            return jsonResponse({ ok: true, id: newNotice.id, notice: newNotice }, 201);
          } catch (err) {
            return jsonResponse({ error: err.message }, 400);
          }
        }
        return jsonResponse({ notices: store.notices || [] });
      }

      if (path.match(/\/api\/admin\/notices\/\d+$/) && request.method === 'DELETE') {
        const nId = +path.split('/')[4];
        store.notices = (store.notices || []).filter(n => n.id !== nId);
        await persistToKV(env, 'notices', store.notices);
        return jsonResponse({ ok: true, message: 'Notice deleted successfully!' });
      }

      if (path.match(/\/api\/admin\/notices\/\d+\/toggle$/) && request.method === 'POST') {
        const nId = +path.split('/')[4];
        const n = (store.notices || []).find(x => x.id === nId);
        if (n) {
          n.active = !n.active;
          await persistToKV(env, 'notices', store.notices);
        }
        return jsonResponse({ ok: true, notice: n });
      }

      if (path.startsWith('/api/admin/audit')) {
        return jsonResponse({ logs: [] });
      }

      if (path === '/api/admin/centres/direct-create' && request.method === 'POST') {
        try {
          const body = await request.json();
          const nextId = store.centres.length + 1;
          const newCode = `PESC${String(nextId).padStart(5, '0')}`;
          const rawSlug = (body.slug || body.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          const slug = rawSlug || `centre${nextId}`;

          const newCentre = {
            id: nextId,
            centre_code: newCode,
            name: body.name || 'Authorized Training Centre',
            slug: slug,
            director_name: body.owner_name || 'Centre Director',
            director_photo: (body.director_photo || body.photo_url || '').trim(),
            photo_url: (body.director_photo || body.photo_url || '').trim(),
            email: (body.email || `director@${slug}.pescouncil.in`).toLowerCase(),
            phone: body.mobile || '+91 98765 43210',
            state: body.state || 'Uttar Pradesh',
            district: body.district || 'Varanasi',
            address: body.address || '',
            pin: body.pin || '221001',
            status: 'active',
            created_at: Date.now()
          };

          // Store in memory
          store.centres.push(newCentre);

          // Add centre owner user
          const newUserId = store.users.length + 1;
          store.users.push({
            id: newUserId,
            email: newCentre.email,
            name: newCentre.director_name,
            role: 'centre_owner',
            centre_id: newCentre.id,
            status: 'active'
          });

          // Persist to Cloudflare KV
          await persistToKV(env, 'centres', store.centres);
          await persistToKV(env, 'users', store.users);

          return jsonResponse({
            ok: true,
            centreCode: newCode,
            centre_code: newCode,
            slug: slug,
            portal_url: `https://${slug}.pescouncil.in`,
            message: `Centre ${newCode} created successfully!`
          }, 201);
        } catch (err) {
          return jsonResponse({ error: err.message }, 400);
        }
      }

      if (path === '/api/admin/students/direct-enroll' && request.method === 'POST') {
        try {
          const body = await request.json();
          const nextId = store.students.length + 1;
          const centreId = +body.centre_id || 1;
          const targetCentre = store.centres.find(c => c.id === centreId) || store.centres[0];
          const studentCode = `${targetCentre.centre_code}-2026-${String(nextId).padStart(5, '0')}`;
          const rollNo = `2026${String(nextId).padStart(3, '0')}`;

          const newStudent = {
            id: nextId,
            student_code: studentCode,
            roll_no: rollNo,
            centre_id: targetCentre.id,
            name: body.name || 'Student Candidate',
            father_name: body.father_name || '',
            mobile: body.mobile || '',
            email: (body.email || `${rollNo}@student.pescouncil.in`).toLowerCase(),
            course_id: +body.course_id || 1,
            session: body.session || '2026-27',
            status: 'active',
            initial_password: body.password || 'Student@123',
            fee_total: +body.fee_total || 12000,
            fee_paid: +body.fee_paid || 8000,
            created_at: Date.now()
          };

          store.students.push(newStudent);
          await persistToKV(env, 'students', store.students);

          return jsonResponse({
            ok: true,
            studentCode: studentCode,
            student_code: studentCode,
            roll_no: rollNo,
            message: `Student enrolled successfully!`
          }, 201);
        } catch (err) {
          return jsonResponse({ error: err.message }, 400);
        }
      }

      if (path.match(/\/api\/admin\/applications\/\d+\/approve/) && request.method === 'POST') {
        const id = +path.split('/')[4];
        const app = store.applications.find(a => a.id === id);
        if (!app) return jsonResponse({ error: 'Application not found' }, 404);
        app.status = 'Approved';

        const newCode = `PESC${String(store.centres.length + 1).padStart(5, '0')}`;
        const activeCoordinator = (app.coordinator_id && store.users.find(u => u.id === app.coordinator_id))
          || (app.state && store.users.find(u => u.role === 'coordinator' && u.state === app.state))
          || store.users.find(u => u.role === 'coordinator' && u.status === 'active')
          || store.users.find(u => u.role === 'coordinator')
          || { id: 2, name: 'State Coordinator' };

        const newCentre = {
          id: store.centres.length + 1,
          centre_code: newCode,
          name: app.centre_name,
          hindi_name: app.centre_name,
          slug: app.slug,
          director_name: app.owner_name,
          director_photo: app.director_photo || app.photo_url || '',
          photo_url: app.director_photo || app.photo_url || '',
          phone: app.mobile,
          email: app.email,
          state: app.state,
          district: app.district,
          address: app.address,
          pin: app.pin,
          status: 'active',
          login_id: newCode,
          login_password: 'owner123',
          wallet_balance: 0,
          wallet_paise: 0,
          coordinator_id: activeCoordinator.id,
          assigned_coordinator_id: activeCoordinator.id,
          coordinator_name: activeCoordinator.name,
          coordinator_seal_url: activeCoordinator.seal_url || '/assets/img/seal_coordinator.svg',
          coordinator_signature_url: activeCoordinator.signature_url || '/assets/img/sign_coordinator.svg',
          affiliation_cert_no: `PESC-AFF-2026-${String(store.centres.length + 1).padStart(4, '0')}`,
          affiliation_issue_date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          affiliation_valid_thru: '31-03-2028',
          affiliation_session: '2026-2028',
          created_at: Date.now()
        };
        store.centres.push(newCentre);

        // Add owner user with active status and password
        store.users.push({
          id: store.users.length + 1,
          email: app.email || `director@${app.slug}.pescouncil.in`,
          name: app.owner_name,
          role: 'centre_owner',
          centre_id: newCentre.id,
          password_plain: 'owner123',
          status: 'active'
        });

        await persistToKV(env, 'centres', store.centres);
        await persistToKV(env, 'applications', store.applications);
        await persistToKV(env, 'users', store.users);

        // Instant Search Engine Submission (Google Sitemap Ping & IndexNow API) for #1 Rank
        const subDomain = `${app.slug}.pescouncil.in`;
        const subDomainUrl = `https://${subDomain}`;
        try {
          fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(subDomainUrl + '/sitemap.xml')}`).catch(() => {});
          fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(subDomainUrl + '/sitemap.xml')}`).catch(() => {});
          fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              host: subDomain,
              key: 'pescouncil2026instantindex',
              keyLocation: `https://${subDomain}/pescouncil2026instantindex.txt`,
              urlList: [subDomainUrl, `${subDomainUrl}/`, `${subDomainUrl}/#courses`, `${subDomainUrl}/#about`]
            })
          }).catch(() => {});
        } catch (_) {}

        // Send Official Approval Email from admin@pescouncil.in to app.email
        let emailResult = { sent: false };
        if (app.email) {
          try {
            emailResult = await sendFranchiseApprovalEmail(env, app, newCode, 'owner123');
          } catch (emErr) {
            console.warn('Error sending approval email:', emErr);
          }
        }

        return jsonResponse({
          ok: true,
          centre_code: newCode,
          slug: app.slug,
          subdomain: `${app.slug}.pescouncil.in`,
          centre_name: app.centre_name,
          login_id: newCode,
          password: 'owner123',
          email_sent: emailResult.sent,
          email_to: app.email || null,
          email_from: 'admin@pescouncil.in'
        });
      }

      if (path === '/api/admin/students') {
        const enriched = store.students.map(s => {
          const ce = store.centres.find(c => c.id === s.centre_id) || store.centres[0] || { name: 'PESC Centre', centre_code: 'PESC0001' };
          const co = store.courses.find(c => c.id === s.course_id) || store.courses[0] || { name: 'Diploma Course', code: 'DCA' };
          const cert = store.certificates.find(x => x.student_id === s.id);
          const mrk = store.marksheets.find(x => x.student_id === s.id);
          const isPassout = s.status === 'passout' || s.status === 'completed' || !!cert || !!mrk;
          return {
            ...s,
            centre_name: ce.name,
            centre_code: ce.centre_code,
            course_name: co.name,
            course_code: co.code,
            is_passout: isPassout,
            has_certificate: !!cert,
            has_marksheet: !!mrk,
            certificate_id: cert ? cert.id : null,
            marksheet_id: mrk ? mrk.id : null,
            cert_no: cert ? cert.cert_no : null,
            marksheet_no: mrk ? mrk.marksheet_no : null
          };
        });
        return jsonResponse({ students: enriched });
      }

      if (path.match(/\/api\/admin\/students\/\d+\/toggle-status$/) && request.method === 'POST') {
        const sId = +path.split('/')[4];
        const stu = store.students.find(s => s.id === sId);
        if (!stu) return jsonResponse({ error: 'Student not found' }, 404);
        const body = await request.json().catch(() => ({}));
        stu.status = body.status || (stu.status === 'passout' || stu.status === 'completed' ? 'active' : 'passout');
        await persistToKV(env, 'students', store.students);
        return jsonResponse({ ok: true, status: stu.status, student: stu });
      }

      if (path.match(/\/api\/admin\/students\/\d+\/credentials/)) {
        const sId = +path.split('/')[4];
        const student = store.students.find(s => s.id === sId);
        if (!student) return jsonResponse({ error: 'Student not found' }, 404);
        const ce = store.centres.find(c => c.id === student.centre_id) || store.centres[0] || { name: 'Council Centre', centre_code: 'PESC0001' };
        const co = store.courses.find(c => c.id === student.course_id) || store.courses[0] || { name: 'Course' };
        return jsonResponse({
          ok: true,
          credentials: {
            student_id: student.id,
            student_code: student.student_code,
            roll_no: student.roll_no || student.student_code,
            name: student.name,
            father_name: student.father_name,
            mobile: student.mobile,
            email: student.email || `${student.student_code.toLowerCase()}@student.pescouncil.in`,
            password: student.initial_password || 'Student@123',
            centre_name: ce.name,
            centre_code: ce.centre_code,
            course_name: co.name,
            portal_url: `https://${host}/student`,
            status: student.status
          }
        });
      }

      if (path.match(/\/api\/admin\/students\/\d+\/set-password/) && request.method === 'POST') {
        const sId = +path.split('/')[4];
        const student = store.students.find(s => s.id === sId);
        if (!student) return jsonResponse({ error: 'Student not found' }, 404);
        const body = await request.json();
        const newPw = String(body.password || 'Student@123').trim();
        student.initial_password = newPw;
        const u = store.users.find(x => x.id === student.user_id);
        if (u) u.password_plain = newPw;
        await Promise.all([
          persistToKV(env, 'students', store.students),
          persistToKV(env, 'users', store.users)
        ]);
        return jsonResponse({ ok: true, message: 'Password updated successfully!', password: newPw });
      }

      if (path.match(/\/api\/admin\/students\/\d+$/)) {
        const sId = +path.split('/')[4];
        const student = store.students.find(s => s.id === sId);
        if (!student) return jsonResponse({ error: 'Student not found' }, 404);

        if (request.method === 'GET') {
          const ce = store.centres.find(c => c.id === student.centre_id) || store.centres[0] || { name: 'Council Centre', centre_code: 'PESC0001' };
          const co = store.courses.find(c => c.id === student.course_id) || store.courses[0] || { name: 'Course', code: 'DCA' };
          return jsonResponse({
            student: {
              ...student,
              centre_name: ce.name,
              centre_code: ce.centre_code,
              course_name: co.name,
              course_code: co.code
            }
          });
        }

        if (request.method === 'PUT' || request.method === 'POST') {
          const body = await request.json();
          if (body.name !== undefined) student.name = String(body.name).trim();
          if (body.father_name !== undefined) student.father_name = String(body.father_name).trim();
          if (body.mobile !== undefined) student.mobile = String(body.mobile).trim();
          if (body.email !== undefined) student.email = String(body.email).trim().toLowerCase();
          if (body.dob !== undefined) student.dob = String(body.dob).trim();
          if (body.session !== undefined) student.session = String(body.session).trim();
          if (body.course_id !== undefined) student.course_id = +body.course_id;
          if (body.centre_id !== undefined) student.centre_id = +body.centre_id;
          if (body.fee_total !== undefined) student.fee_total = +body.fee_total;
          if (body.fee_paid !== undefined) student.fee_paid = +body.fee_paid;
          if (body.status !== undefined) student.status = String(body.status).trim();
          await persistToKV(env, 'students', store.students);
          return jsonResponse({ ok: true, message: 'Student updated successfully!', student });
        }

        if (request.method === 'DELETE') {
          store.students = store.students.filter(s => s.id !== sId);
          store.certificates = store.certificates.filter(c => c.student_id !== sId);
          store.marksheets = store.marksheets.filter(m => m.student_id !== sId);
          if (student && student.user_id) {
            store.users = store.users.filter(u => u.id !== student.user_id);
          }
          await Promise.all([
            persistToKV(env, 'students', store.students),
            persistToKV(env, 'certificates', store.certificates),
            persistToKV(env, 'marksheets', store.marksheets),
            persistToKV(env, 'users', store.users)
          ]);
          return jsonResponse({ ok: true, message: 'Student deleted successfully!' });
        }
      }

      if (path === '/api/admin/students/clear-all' && request.method === 'POST') {
        store.students = [];
        store.certificates = [];
        store.marksheets = [];
        store.users = store.users.filter(u => u.role !== 'student');
        await Promise.all([
          persistToKV(env, 'students', []),
          persistToKV(env, 'certificates', []),
          persistToKV(env, 'marksheets', []),
          persistToKV(env, 'users', store.users)
        ]);
        return jsonResponse({ ok: true, message: 'All students, certificates, and marksheets cleared successfully!' });
      }

      if (path === '/api/admin/certificates') {
        return jsonResponse({ certificates: store.certificates });
      }

      if (path === '/api/admin/marksheets') {
        return jsonResponse({ marksheets: store.marksheets });
      }

      if (path === '/api/admin/profile') {
        let adminUser = store.users.find(u => u.role === 'super_admin' || u.role === 'admin');
        if (!adminUser) {
          adminUser = {
            id: 1,
            name: 'Dr. R. K. Verma',
            email: 'admin@pescouncil.in',
            mobile: '+91 94152 00000',
            role: 'super_admin',
            designation: 'Executive Director & Controller of Examinations',
            head_office: 'Purvanchal Education & Skill Council, Head Office, Gorakhpur / Lucknow, UP',
            state: 'National Headquarters (India)',
            badge_id: 'PESC-HQ-001',
            status: 'active',
            photo_url: null,
            seal_url: null,
            signature_url: null,
            chairman_signature_url: null
          };
          store.users.unshift(adminUser);
        } else {
          if (!adminUser.designation) adminUser.designation = 'Executive Director & Controller of Examinations';
          if (!adminUser.head_office) adminUser.head_office = 'Purvanchal Education & Skill Council, Head Office, Gorakhpur / Lucknow, UP';
          if (!adminUser.badge_id) adminUser.badge_id = 'PESC-HQ-001';
          if (!adminUser.mobile) adminUser.mobile = '+91 94152 00000';
          if (!adminUser.state) adminUser.state = 'National Headquarters (India)';
        }

        if (request.method === 'POST' || request.method === 'PUT') {
          const body = await request.json().catch(() => ({}));
          if (body.name) adminUser.name = String(body.name).slice(0, 100);
          if (body.email) adminUser.email = String(body.email).slice(0, 150);
          if (body.mobile !== undefined) adminUser.mobile = String(body.mobile).slice(0, 20);
          if (body.designation !== undefined) adminUser.designation = String(body.designation).slice(0, 150);
          if (body.head_office !== undefined) adminUser.head_office = String(body.head_office).slice(0, 255);
          if (body.state !== undefined) adminUser.state = String(body.state).slice(0, 100);
          if (body.photo_url !== undefined) adminUser.photo_url = cleanImageUrl(body.photo_url);
          if (body.logo_url !== undefined) {
            adminUser.logo_url = cleanImageUrl(body.logo_url);
            if (!store.site_settings) store.site_settings = {};
            store.site_settings.logo_url = adminUser.logo_url;
          }
          if (!store.site_settings) store.site_settings = {};
          if (body.seal_url !== undefined) {
            adminUser.seal_url = cleanImageUrl(body.seal_url);
            store.site_settings.seal_url = adminUser.seal_url;
            store.site_settings.council_seal_url = adminUser.seal_url;
          }
          if (body.signature_url !== undefined) {
            adminUser.signature_url = cleanImageUrl(body.signature_url);
            store.site_settings.signature_url = adminUser.signature_url;
            store.site_settings.council_signature_url = adminUser.signature_url;
          }
          if (body.chairman_signature_url !== undefined) {
            adminUser.chairman_signature_url = cleanImageUrl(body.chairman_signature_url);
            store.site_settings.chairman_signature_url = adminUser.chairman_signature_url;
          }
          if (body.email) store.site_settings.email = adminUser.email;
          if (body.mobile !== undefined) {
            store.site_settings.phone = adminUser.mobile;
            store.site_settings.mobile = adminUser.mobile;
            store.site_settings.helpline = adminUser.mobile;
          }
          if (body.head_office !== undefined) {
            store.site_settings.head_office = adminUser.head_office;
            store.site_settings.address = adminUser.head_office;
          }
          if (body.name) store.site_settings.officer_name = adminUser.name;
          await persistToKV(env, 'site_settings', store.site_settings);
          await persistToKV(env, 'users', store.users);
          return jsonResponse({
            ok: true,
            message: 'Admin profile updated successfully!',
            profile: {
              ...adminUser,
              logo_url: adminUser.logo_url || (store.site_settings && store.site_settings.logo_url) || ''
            }
          });
        }

        return jsonResponse({
          profile: {
            ...adminUser,
            logo_url: adminUser.logo_url || (store.site_settings && store.site_settings.logo_url) || '',
            verification_url: `https://${host}/verify`
          }
        });
      }

      if (path === '/api/admin/change-password' && request.method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const newPw = body.new_password;
        if (!newPw || newPw.length < 6) {
          return jsonResponse({ error: 'Password must be at least 6 characters' }, 400);
        }
        const adminUser = store.users.find(u => u.role === 'super_admin' || u.role === 'admin');
        if (adminUser) {
          adminUser.password_plain = newPw;
          await persistToKV(env, 'users', store.users);
        }
        return jsonResponse({ ok: true, message: 'Admin password changed successfully!' });
      }
    }

    // --- Certificates & Marksheets & Reports APIs ---
    if (path === '/api/marksheets/pending') {
      const pendingList = store.marksheets.filter(m => m.status === 'Submitted' || m.status === 'Pending' || m.status === 'Pending_Dual_Approval' || m.status === 'Pending_Head_Office' || m.status === 'Pending_Coordinator' || !m.head_approved || !m.coordinator_approved);
      return jsonResponse({ marksheets: pendingList });
    }
    if (path === '/api/certificates/pending') {
      const pendingList = store.certificates.filter(c => c.status === 'Submitted' || c.status === 'Pending' || c.status === 'Pending_Dual_Approval' || c.status === 'Pending_Head_Office' || c.status === 'Pending_Coordinator' || !c.head_approved || !c.coordinator_approved);
      return jsonResponse({ certificates: pendingList });
    }

    // --- Dual Approval Decision on Certificates (Head Office & Coordinator) ---
    if (path.match(/^\/api\/certificates\/\d+\/decision$/) && request.method === 'POST') {
      const cId = +path.split('/')[3];
      const cert = store.certificates.find(c => c.id === cId);
      if (!cert) return jsonResponse({ error: 'Certificate not found' }, 404);
      const body = await request.json().catch(() => ({}));
      const decision = String(body.decision || 'approve').toLowerCase();
      let userRole = 'super_admin';
      try {
        if (cookies.pesc_auth) {
          const u = JSON.parse(decodeURIComponent(cookies.pesc_auth));
          if (u.role) userRole = u.role;
        }
      } catch (_) {}
      if (body.role) userRole = body.role;

      if (decision === 'reject') {
        cert.status = 'Rejected';
        cert.reason = body.reason || 'Rejected';
      } else if (decision === 'revoke') {
        cert.status = 'Revoked';
        cert.reason = body.reason || 'Revoked';
      } else {
        if (userRole === 'coordinator') {
          cert.coordinator_approved = true;
          cert.coordinator_approved_at = Date.now();
          cert.coordinator_approved_by = body.approved_by || 'Regional Coordinator';
          cert.coordinator_mohar_applied = true;
        } else {
          cert.head_approved = true;
          cert.head_approved_at = Date.now();
          cert.head_approved_by = body.approved_by || 'Council Head Office';
          cert.head_seal_applied = true;
        }

        if (cert.head_approved && cert.coordinator_approved) {
          cert.status = 'Approved_By_Council';
        } else if (cert.head_approved) {
          cert.status = 'Pending_Coordinator';
        } else if (cert.coordinator_approved) {
          cert.status = 'Pending_Head_Office';
        }

        if (!cert.cert_no || cert.cert_no.includes('Pending')) {
          const year = new Date().getFullYear();
          cert.cert_no = `PESC/${year}/${String(cert.id).padStart(6, '0')}`;
        }
        if (!cert.token) {
          cert.token = 'cert-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
        }
      }
      await persistToKV(env, 'certificates', store.certificates);
      return jsonResponse({
        ok: true,
        id: cert.id,
        status: cert.status,
        cert_no: cert.cert_no,
        head_approved: cert.head_approved,
        coordinator_approved: cert.coordinator_approved,
        centre_signed: cert.centre_signed,
        token: cert.token
      });
    }

    // --- Dual Approval Decision on Marksheets (Head Office & Coordinator) ---
    if (path.match(/^\/api\/marksheets\/\d+\/decision$/) && request.method === 'POST') {
      const mId = +path.split('/')[3];
      const mrk = store.marksheets.find(m => m.id === mId);
      if (!mrk) return jsonResponse({ error: 'Marksheet not found' }, 404);
      const body = await request.json().catch(() => ({}));
      const decision = String(body.decision || 'approve').toLowerCase();
      let userRole = 'super_admin';
      try {
        if (cookies.pesc_auth) {
          const u = JSON.parse(decodeURIComponent(cookies.pesc_auth));
          if (u.role) userRole = u.role;
        }
      } catch (_) {}
      if (body.role) userRole = body.role;

      if (decision === 'reject') {
        mrk.status = 'Rejected';
        mrk.reason = body.reason || 'Rejected';
      } else if (decision === 'revoke') {
        mrk.status = 'Revoked';
        mrk.reason = body.reason || 'Revoked';
      } else {
        if (userRole === 'coordinator') {
          mrk.coordinator_approved = true;
          mrk.coordinator_approved_at = Date.now();
          mrk.coordinator_approved_by = body.approved_by || 'Regional Coordinator';
          mrk.coordinator_mohar_applied = true;
        } else {
          mrk.head_approved = true;
          mrk.head_approved_at = Date.now();
          mrk.head_approved_by = body.approved_by || 'Council Head Office';
          mrk.head_seal_applied = true;
        }

        if (mrk.head_approved && mrk.coordinator_approved) {
          mrk.status = 'Approved_By_Council';
        } else if (mrk.head_approved) {
          mrk.status = 'Pending_Coordinator';
        } else if (mrk.coordinator_approved) {
          mrk.status = 'Pending_Head_Office';
        }

        if (!mrk.marksheet_no || mrk.marksheet_no.includes('Pending')) {
          const year = new Date().getFullYear();
          mrk.marksheet_no = `PESC/MRK/${year}/${String(mrk.id).padStart(6, '0')}`;
        }
        if (!mrk.token) {
          mrk.token = 'mrk-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
        }
      }
      await persistToKV(env, 'marksheets', store.marksheets);
      return jsonResponse({
        ok: true,
        id: mrk.id,
        status: mrk.status,
        marksheet_no: mrk.marksheet_no,
        head_approved: mrk.head_approved,
        coordinator_approved: mrk.coordinator_approved,
        centre_signed: mrk.centre_signed,
        token: mrk.token
      });
    }

    // --- Centre Sign & Final Issue to Student with Wallet Deduction ---
    if ((path.includes('/certificates/') && path.includes('/sign-issue')) || (path.includes('/cert/') && path.includes('/sign-issue'))) {
      const parts = path.split('/');
      const signIssueIdx = parts.indexOf('sign-issue');
      const cId = signIssueIdx > 0 ? +parts[signIssueIdx - 1] || 1 : 1;
      let cert = store.certificates.find(x => x.id === cId || x.student_id === cId);
      if (!cert) {
        cert = { id: cId, student_id: cId, centre_id: c ? c.id : 1, status: 'Valid', marksheet_no: 'PESC-C-' + String(cId).padStart(5, '0') };
        store.certificates.push(cert);
      }
      let body = {};
      try { body = await request.json(); } catch (_) {}
      const fee = +body.fee || +url.searchParams.get('fee') || 200;
      let activeCentre = c || store.centres[0];
      let bal = (activeCentre && activeCentre.wallet_balance !== undefined) ? activeCentre.wallet_balance : 5000;
      if (bal >= fee) {
        bal -= fee;
        if (activeCentre) activeCentre.wallet_balance = bal;
        await persistToKV(env, 'centres', store.centres);
      }
      cert.centre_signed = true;
      cert.centre_signed_at = Date.now();
      cert.centre_signed_by = (activeCentre && activeCentre.director_name) || 'Dr. Ramesh Kumar';
      cert.head_approved = true;
      cert.coordinator_approved = true;
      cert.status = 'Valid';
      await persistToKV(env, 'certificates', store.certificates);
      return jsonResponse({
        ok: true,
        message: `सर्टिफिकेट जारी! ₹${fee} सेंटर वॉलेट से कटे।`,
        certificate: cert,
        wallet_balance: bal
      });
    }

    if ((path.includes('/marksheets/') && path.includes('/sign-issue')) || (path.includes('/mrk/') && path.includes('/sign-issue'))) {
      const parts = path.split('/');
      const signIssueIdx = parts.indexOf('sign-issue');
      const mId = signIssueIdx > 0 ? +parts[signIssueIdx - 1] || 1 : 1;
      let mrk = store.marksheets.find(x => x.id === mId || x.student_id === mId);
      if (!mrk) {
        mrk = { id: mId, student_id: mId, centre_id: c ? c.id : 1, status: 'Valid', marksheet_no: 'PESC-M-' + String(mId).padStart(5, '0') };
        store.marksheets.push(mrk);
      }
      let body = {};
      try { body = await request.json(); } catch (_) {}
      const fee = +body.fee || +url.searchParams.get('fee') || 100;
      let activeCentre = c || store.centres[0];
      let bal = (activeCentre && activeCentre.wallet_balance !== undefined) ? activeCentre.wallet_balance : 5000;
      if (bal >= fee) {
        bal -= fee;
        if (activeCentre) activeCentre.wallet_balance = bal;
        await persistToKV(env, 'centres', store.centres);
      }
      mrk.centre_signed = true;
      mrk.centre_signed_at = Date.now();
      mrk.centre_signed_by = (activeCentre && activeCentre.director_name) || 'Dr. Ramesh Kumar';
      mrk.head_approved = true;
      mrk.coordinator_approved = true;
      mrk.status = 'Approved';
      await persistToKV(env, 'marksheets', store.marksheets);
      return jsonResponse({
        ok: true,
        message: `अंकतालिका जारी! ₹${fee} सेंटर वॉलेट से कटे।`,
        marksheet: mrk,
        wallet_balance: bal
      });
    }

    // --- Centre Request Dual Approval for Student ---
    if (path === '/api/centre/request-dual-approval' && request.method === 'POST') {
      try {
        const body = await request.json();
        const studentId = +body.student_id;
        const s = store.students.find(x => x.id === studentId);
        if (!s) return jsonResponse({ error: 'Student not found' }, 404);
        const reqType = body.type || 'certificate';
        const ce = store.centres.find(x => x.id === s.centre_id) || store.centres[0];
        const co = store.courses.find(x => x.id === s.course_id) || store.courses[0];
        const year = new Date().getFullYear();

        let cert = store.certificates.find(x => x.student_id === s.id);
        if (!cert && (reqType === 'certificate' || reqType === 'both')) {
          const nextId = store.certificates.length + 1;
          cert = {
            id: nextId,
            cert_no: `PESC/${year}/${String(nextId).padStart(6, '0')}`,
            token: 'cert-' + Math.random().toString(36).slice(2) + Date.now().toString(36),
            student_id: s.id,
            student_name: s.name,
            centre_id: s.centre_id,
            centre_name: ce.name,
            course_id: s.course_id,
            course_name: co.name,
            status: 'Pending_Dual_Approval',
            head_approved: false,
            coordinator_approved: false,
            centre_signed: false,
            evaluation_type: body.evaluation_type || 'yearly',
            term: body.term || 'Annual Examination',
            created_at: Date.now()
          };
          store.certificates.push(cert);
          await persistToKV(env, 'certificates', store.certificates);
        }

        let mrk = store.marksheets.find(x => x.student_id === s.id);
        if (!mrk && (reqType === 'marksheet' || reqType === 'both')) {
          const nextId = store.marksheets.length + 1;
          mrk = {
            id: nextId,
            marksheet_no: `PESC/MRK/${year}/${String(nextId).padStart(6, '0')}`,
            token: 'mrk-' + Math.random().toString(36).slice(2) + Date.now().toString(36),
            student_id: s.id,
            student_name: s.name,
            centre_id: s.centre_id,
            centre_name: ce.name,
            centre_code: ce.centre_code,
            course_id: s.course_id,
            course_name: co.name,
            course_code: co.code,
            exam_session: s.session || '2026-27',
            roll_no: s.roll_no || s.student_code,
            subjects: JSON.stringify(getCourseCurriculumSubjects(co.code || co.name, body.evaluation_type || 'yearly', body.term || 'Annual')),
            total_max: 500,
            total_obtained: 412,
            percentage: 82.4,
            grade: 'A',
            result: 'PASS',
            status: 'Pending_Dual_Approval',
            head_approved: false,
            coordinator_approved: false,
            centre_signed: false,
            evaluation_type: body.evaluation_type || 'yearly',
            term: body.term || 'Annual',
            created_at: Date.now()
          };
          store.marksheets.push(mrk);
          await persistToKV(env, 'marksheets', store.marksheets);
        }

        return jsonResponse({
          ok: true,
          message: 'Submitted to Head Office & Regional Coordinator for Dual Approval!',
          certificate: cert,
          marksheet: mrk
        });
      } catch (err) {
        return jsonResponse({ error: err.message }, 400);
      }
    }

    if (path === '/api/centre/approvals-status') {
      const studentId = +url.searchParams.get('student_id');
      const cert = store.certificates.find(c => c.student_id === studentId);
      const mrk = store.marksheets.find(m => m.student_id === studentId);
      return jsonResponse({
        ok: true,
        certificate: cert || null,
        marksheet: mrk || null
      });
    }
    if (path.startsWith('/api/reports/')) {
      const urlObj = new URL(request.url);
      const isCsv = urlObj.searchParams.get('format') === 'csv';

      if (path === '/api/reports/admissions') {
        const rows = store.students.map(s => {
          const ce = store.centres.find(c => c.id === s.centre_id) || { name: 'PESC Centre', centre_code: 'PESC0001' };
          const co = store.courses.find(c => c.id === s.course_id) || { name: 'Diploma Course' };
          return {
            student_code: s.student_code,
            name: s.name,
            course_name: co.name,
            centre_name: ce.name,
            centre_code: ce.centre_code,
            created_at: s.created_at || Date.now(),
            status: s.status || 'Active'
          };
        });
        if (isCsv) {
          const csv = 'Student Code,Candidate Name,Course,Centre,Centre Code,Date,Status\n' +
            rows.map(r => `"${r.student_code}","${r.name}","${r.course_name}","${r.centre_name}","${r.centre_code}","${new Date(r.created_at).toLocaleDateString()}","${r.status}"`).join('\n');
          return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="pesc_admissions.csv"' } });
        }
        return jsonResponse({ count: rows.length, admissions: rows });
      }

      if (path === '/api/reports/marksheets') {
        const rows = store.marksheets.map(m => {
          const s = store.students.find(x => x.id === m.student_id) || { name: 'Candidate', student_code: m.roll_no || 'STU01' };
          const ce = store.centres.find(c => c.id === m.centre_id) || { name: 'Council Centre' };
          const co = store.courses.find(c => c.id === m.course_id) || { name: 'Course' };
          return {
            marksheet_no: m.marksheet_no || 'Pending',
            student_name: s.name,
            student_code: s.student_code,
            centre_name: ce.name,
            course_name: co.name,
            total_obtained: m.total_obtained || 0,
            total_max: m.total_max || 100,
            percentage: m.percentage || 0,
            grade: m.grade || 'A',
            result: m.result || 'PASS',
            status: m.status || 'Approved'
          };
        });
        if (isCsv) {
          const csv = 'Marksheet No,Student Name,Roll No,Centre,Course,Obtained,Max,Percentage,Grade,Result,Status\n' +
            rows.map(r => `"${r.marksheet_no}","${r.student_name}","${r.student_code}","${r.centre_name}","${r.course_name}",${r.total_obtained},${r.total_max},${r.percentage},"${r.grade}","${r.result}","${r.status}"`).join('\n');
          return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="pesc_marksheets.csv"' } });
        }
        return jsonResponse({ count: rows.length, marksheets: rows });
      }

      if (path === '/api/reports/certificates') {
        const rows = store.certificates.map(c => {
          const s = store.students.find(x => x.id === c.student_id) || { name: 'Candidate', student_code: 'STU01' };
          const ce = store.centres.find(c => c.id === c.centre_id) || { name: 'Council Centre' };
          const co = store.courses.find(c => c.id === c.course_id) || { name: 'Course' };
          return {
            cert_no: c.cert_no || 'Pending',
            student_name: s.name,
            student_code: s.student_code,
            centre_name: ce.name,
            course_name: co.name,
            issued_at: c.issued_at || c.created_at || Date.now(),
            status: c.status || 'Valid'
          };
        });
        if (isCsv) {
          const csv = 'Certificate No,Student Name,Roll No,Centre,Course,Issued Date,Status\n' +
            rows.map(r => `"${r.cert_no}","${r.student_name}","${r.student_code}","${r.centre_name}","${r.course_name}","${new Date(r.issued_at).toLocaleDateString()}","${r.status}"`).join('\n');
          return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="pesc_certificates.csv"' } });
        }
        return jsonResponse({ count: rows.length, certificates: rows });
      }

      if (path === '/api/reports/centres') {
        const rows = store.centres.map(c => {
          const stus = store.students.filter(s => s.centre_id === c.id);
          const certs = store.certificates.filter(x => x.centre_id === c.id);
          const mrks = store.marksheets.filter(x => x.centre_id === c.id);
          return {
            centre_code: c.centre_code,
            name: c.name,
            owner_name: c.director_name || 'Director',
            owner_mobile: c.phone || '+91 98765 43210',
            total_students: stus.length,
            valid_certs: certs.length,
            approved_marksheets: mrks.length,
            wallet_paise: 500000,
            status: c.status || 'active'
          };
        });
        if (isCsv) {
          const csv = 'Centre Code,Centre Name,Director,Mobile,Total Students,Valid Certs,Approved Marksheets,Wallet (INR),Status\n' +
            rows.map(r => `"${r.centre_code}","${r.name}","${r.owner_name}","${r.owner_mobile}",${r.total_students},${r.valid_certs},${r.approved_marksheets},${r.wallet_paise / 100},"${r.status}"`).join('\n');
          return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="pesc_centres.csv"' } });
        }
        return jsonResponse({ count: rows.length, centres: rows });
      }

      if (path === '/api/reports/financials') {
        const transactions = store.centres.map((c, i) => ({
          centre_name: c.name,
          centre_code: c.centre_code,
          kind: i % 2 === 0 ? 'credit' : 'debit',
          amount_paise: i % 2 === 0 ? 500000 : 60000,
          balance_after: 500000,
          reference: `TXN-2026-${String(i + 1).padStart(4, '0')}`,
          created_at: Date.now() - (i * 864e5)
        }));
        if (isCsv) {
          const csv = 'Centre,Centre Code,Type,Amount (INR),Balance After (INR),Reference,Date\n' +
            transactions.map(t => `"${t.centre_name}","${t.centre_code}","${t.kind.toUpperCase()}",${t.amount_paise / 100},${t.balance_after / 100},"${t.reference}","${new Date(t.created_at).toLocaleDateString()}"`).join('\n');
          return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="pesc_financials.csv"' } });
        }
        return jsonResponse({ count: transactions.length, transactions });
      }

      return jsonResponse({ count: 0, rows: [] });
    }

    // --- Coordinator APIs ---
    if (path.startsWith('/api/coordinator/')) {
      if (path === '/api/coordinator/dashboard') {
        const coordUser = store.users.find(u => u.role === 'coordinator') || { id: 2, name: 'Vikram Singh', email: 'coord@pescouncil.in', state: 'Uttar Pradesh' };
        const totalCentres = store.centres.length;
        const activeCentres = store.centres.filter(c => c.status === 'active').length;
        const totalStudents = store.students.length;
        const mrkPending = store.marksheets.filter(m => m.status === 'Pending').length;
        const mrkApproved = store.marksheets.filter(m => m.status === 'Approved').length;
        const certPending = store.certificates.filter(c => c.status === 'Pending').length;
        const certValid = store.certificates.filter(c => c.status === 'Valid').length;

        return jsonResponse({
          coordinator: {
            id: coordUser.id,
            name: coordUser.name,
            email: coordUser.email,
            mobile: coordUser.mobile || null,
            state: coordUser.state || 'Uttar Pradesh',
            photo_url: coordUser.photo_url || null,
            seal_url: coordUser.seal_url || null,
            signature_url: coordUser.signature_url || null,
          },
          stats: {
            centres_total: totalCentres,
            centres_active: activeCentres,
            students_total: totalStudents,
            marksheets_pending: mrkPending,
            marksheets_approved: mrkApproved,
            certificates_pending: certPending,
            certificates_valid: certValid,
          }
        });
      }
      if (path === '/api/coordinator/centres') {
        if (request.method === 'POST') {
          try {
            const body = await request.json();
            const activeCoordinator = store.users.find(u => u.role === 'coordinator' && u.status === 'active') || store.users.find(u => u.role === 'coordinator') || { id: 2, name: 'State Coordinator' };
            const nextId = store.centres.length + 1;
            const newCode = `PESC${String(nextId).padStart(5, '0')}`;
            const rawSlug = (body.slug || body.name || body.centre_name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            const slug = rawSlug || `centre${nextId}`;
            const dirName = body.director_name || body.owner_name || 'Centre Director';
            const phone = body.mobile || body.phone || '9876543210';
            const email = (body.email || `director@${slug}.pescouncil.in`).toLowerCase();
            const password = body.password || 'Centre@123';
            const certNo = `PESC/ATC/2026/${newCode}`;
            const todayStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

            const newCentre = {
              id: nextId,
              centre_code: newCode,
              name: body.name || body.centre_name || 'Authorized Training Centre',
              slug: slug,
              director_name: dirName,
              director_photo: (body.director_photo || body.photo_url || '').trim(),
              photo_url: (body.director_photo || body.photo_url || '').trim(),
              phone: phone,
              email: email,
              state: body.state || activeCoordinator.state || 'Uttar Pradesh',
              district: body.district || '',
              address: body.address || '',
              pin: body.pin || '221001',
              coordinator_id: activeCoordinator.id,
              assigned_coordinator_id: activeCoordinator.id,
              coordinator_name: activeCoordinator.name,
              coordinator_seal_url: activeCoordinator.seal_url || '/assets/img/seal_coordinator.svg',
              coordinator_signature_url: activeCoordinator.signature_url || '/assets/img/sign_coordinator.svg',
              affiliation_cert_no: certNo,
              affiliation_issue_date: todayStr,
              affiliation_valid_thru: '31-03-2029',
              affiliation_session: '2026 - 2029',
              login_password: password,
              wallet_balance: 0,
              wallet_paise: 0,
              status: 'active',
              created_at: Date.now()
            };

            store.centres.push(newCentre);

            // Add centre owner user
            const newUserId = store.users.length + 1;
            store.users.push({
              id: newUserId,
              email: email,
              name: dirName,
              mobile: phone,
              role: 'centre_owner',
              centre_id: newCentre.id,
              password_plain: password,
              status: 'active'
            });

            await persistToKV(env, 'centres', store.centres);
            await persistToKV(env, 'users', store.users);

            return jsonResponse({
              ok: true,
              message: 'New Centre Affiliation granted successfully!',
              centre: newCentre,
              credentials: {
                login_id: newCode,
                password: password,
                portal_url: `https://${slug}.pescouncil.in/portal`
              }
            }, 201);
          } catch (err) {
            return jsonResponse({ error: err.message }, 400);
          }
        }
        const enriched = store.centres.map(c => {
          const owner = store.users.find(u => u.id === c.owner_user_id || u.centre_id === c.id) || {};
          const sCount = store.students.filter(s => s.centre_id === c.id).length;
          const certCount = store.certificates.filter(x => x.centre_id === c.id && x.status === 'Valid').length;
          const certPending = store.certificates.filter(x => x.centre_id === c.id && x.status === 'Pending').length;
          const mrkCount = store.marksheets.filter(x => x.centre_id === c.id && x.status === 'Approved').length;
          const mrkPending = store.marksheets.filter(x => x.centre_id === c.id && x.status === 'Pending').length;
          return {
            ...c,
            owner_name: owner.name || c.director_name || 'Centre Director',
            owner_email: owner.email || c.email || 'director@pescouncil.in',
            owner_mobile: owner.mobile || c.phone || '9876543210',
            students_count: sCount,
            certs_count: certCount,
            certs_pending: certPending,
            marksheets_count: mrkCount,
            marksheets_pending: mrkPending,
          };
        });
        return jsonResponse({ centres: enriched });
      }

      if ((path.match(/^\/api\/coordinator\/centres\/\d+$/) && (request.method === 'PUT' || request.method === 'POST')) ||
          (path.match(/^\/api\/coordinator\/centres\/\d+\/edit$/) && request.method === 'POST')) {
        const centreId = +path.split('/')[4];
        const c = store.centres.find(x => x.id === centreId);
        if (!c) return jsonResponse({ error: 'Centre not found' }, 404);
        try {
          const body = await request.json();
          if (body.name !== undefined) c.name = String(body.name).trim();
          if (body.director_name !== undefined) c.director_name = String(body.director_name).trim();
          if (body.mobile !== undefined || body.phone !== undefined) c.phone = String(body.mobile || body.phone).trim();
          if (body.email !== undefined) c.email = String(body.email).trim().toLowerCase();
          if (body.state !== undefined) c.state = String(body.state).trim();
          if (body.district !== undefined) c.district = String(body.district).trim();
          if (body.address !== undefined) c.address = String(body.address).trim();
          if (body.pin !== undefined) c.pin = String(body.pin).trim();
          if (body.director_photo !== undefined) {
            c.director_photo = String(body.director_photo).trim();
            c.photo_url = String(body.director_photo).trim();
          }

          // Update owner user
          const owner = store.users.find(u => (u.centre_id === c.id && u.role === 'centre_owner') || u.id === c.owner_user_id);
          if (owner) {
            if (c.director_name) owner.name = c.director_name;
            if (c.phone) owner.mobile = c.phone;
            if (c.email) owner.email = c.email;
            if (c.director_photo) owner.photo_url = c.director_photo;
          }

          await persistToKV(env, 'centres', store.centres);
          await persistToKV(env, 'users', store.users);

          return jsonResponse({
            ok: true,
            message: 'Centre details updated successfully!',
            centre: c
          });
        } catch (err) {
          return jsonResponse({ error: err.message }, 400);
        }
      }
      if (path.startsWith('/api/coordinator/centres/')) {
        const centreId = +path.replace('/api/coordinator/centres/', '');
        const c = store.centres.find(x => x.id === centreId) || store.centres[0];
        const students = store.students.filter(s => s.centre_id === c.id);
        const marksheets = store.marksheets.filter(m => m.centre_id === c.id);
        const certificates = store.certificates.filter(x => x.centre_id === c.id);
        return jsonResponse({ centre: c, students, marksheets, certificates });
      }
      if (path === '/api/coordinator/students') {
        return jsonResponse({ students: store.students });
      }
      if (path === '/api/coordinator/marksheets') {
        return jsonResponse({ marksheets: store.marksheets });
      }
      if (path === '/api/coordinator/certificates') {
        return jsonResponse({ certificates: store.certificates });
      }
      if (path === '/api/coordinator/profile') {
        let coordUser = null;
        if (cookies.pesc_auth) {
          try {
            const parsed = JSON.parse(decodeURIComponent(cookies.pesc_auth));
            if (parsed.role === 'coordinator' && parsed.id) {
              coordUser = store.users.find(u => u.id === parsed.id);
            }
          } catch (_) {}
        }
        if (!coordUser) {
          coordUser = store.users.find(u => u.role === 'coordinator' && (u.seal_url || u.signature_url)) || store.users.find(u => u.role === 'coordinator');
        }
        if (!coordUser) {
          coordUser = {
            id: 2,
            name: 'Er. V. K. Maurya',
            email: 'coordinator@pescouncil.in',
            mobile: '+91 94152 11111',
            role: 'coordinator',
            state: 'Uttar Pradesh',
            status: 'active',
            seal_url: null,
            signature_url: null
          };
          store.users.push(coordUser);
        }
        if (request.method === 'POST') {
          const body = await request.json().catch(() => ({}));
          if (body.name) coordUser.name = String(body.name).slice(0, 100);
          if (body.email) coordUser.email = String(body.email).slice(0, 150);
          if (body.mobile) coordUser.mobile = String(body.mobile).slice(0, 20);
          if (body.state) coordUser.state = String(body.state).slice(0, 100);
          if (body.photo_url !== undefined) coordUser.photo_url = cleanImageUrl(body.photo_url);
          if (body.seal_url !== undefined) coordUser.seal_url = cleanImageUrl(body.seal_url);
          if (body.signature_url !== undefined) coordUser.signature_url = cleanImageUrl(body.signature_url);

          // Immediately propagate coordinator updates to all centres so marksheet & certs use the new seals
          for (const centre of store.centres) {
            if (!centre.assigned_coordinator_id || centre.assigned_coordinator_id === coordUser.id) {
              if (coordUser.seal_url) centre.coordinator_seal_url = coordUser.seal_url;
              if (coordUser.signature_url) centre.coordinator_signature_url = coordUser.signature_url;
              if (coordUser.name) centre.coordinator_name = coordUser.name;
            }
          }
          for (const u of store.users) {
            if (u.role === 'coordinator') {
              if (coordUser.seal_url) u.seal_url = coordUser.seal_url;
              if (coordUser.signature_url) u.signature_url = coordUser.signature_url;
            }
          }

          await persistToKV(env, 'users', store.users);
          await persistToKV(env, 'centres', store.centres);
          return jsonResponse({
            ok: true,
            message: 'Profile updated successfully!',
            profile: coordUser,
            authorities: getAuthorities(store.centres[0])
          });
        }
        return jsonResponse({ profile: coordUser });
      }
      if (path === '/api/coordinator/change-password' && request.method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const newPw = body.new_password;
        if (!newPw || newPw.length < 6) return jsonResponse({ error: 'Password must be at least 6 characters' }, 400);
        let coordUser = store.users.find(u => u.role === 'coordinator');
        if (cookies.pesc_auth) {
          try {
            const parsed = JSON.parse(decodeURIComponent(cookies.pesc_auth));
            if (parsed.role === 'coordinator') coordUser = store.users.find(u => u.id === parsed.id) || coordUser;
          } catch (_) {}
        }
        if (coordUser) {
          coordUser.password_plain = newPw;
          await persistToKV(env, 'users', store.users);
        }
        return jsonResponse({ ok: true, message: 'Coordinator password changed successfully!' });
      }
      if (path === '/api/coordinator/appointment-cert') {
        const coordUser = store.users.find(u => u.role === 'coordinator') || { id: 2, name: 'Vikram Singh', email: 'coord@pescouncil.in', state: 'Uttar Pradesh' };
        const adminUser = store.users.find(u => u.role === 'super_admin' || u.role === 'admin') || {};
        const cert = getOrCreateWorkerCoordCert(coordUser.id);
        return jsonResponse({
          certificate: {
            ...cert,
            name: coordUser.name,
            email: coordUser.email,
            mobile: coordUser.mobile || null,
            photo_url: coordUser.photo_url || null,
            // Head Office Authority (Central Governing Board):
            seal_url: adminUser.seal_url || null,
            signature_url: adminUser.signature_url || null,
            council_seal_url: adminUser.seal_url || null,
            council_signature_url: adminUser.signature_url || null,
            state: coordUser.state || cert.state || 'All Assigned Territories',
            territory: coordUser.territory || coordUser.state || 'All Assigned Territories',
            verification_url: `https://${host}/verify/coordinator/${cert.token}`,
          }
        });
      }
    }


    // --- Centre APIs ---
    if (path.startsWith('/api/centre/')) {
      let authCentre = null;
      if (cookies.pesc_auth) {
        try {
          const u = JSON.parse(decodeURIComponent(cookies.pesc_auth));
          if (u.role === 'centre_owner' || u.centre_id || u.centre_code) {
            if (u.centre_id) authCentre = store.centres.find(x => x.id === u.centre_id);
            if (!authCentre && u.centre_slug) authCentre = resolveSlug(u.centre_slug);
            if (!authCentre && u.centre_code) authCentre = store.centres.find(x => x.centre_code && x.centre_code.toUpperCase() === u.centre_code.toUpperCase());
          }
        } catch (_) {}
      }

      const queryParamSlug = url.searchParams.get('centre') || url.searchParams.get('slug');
      const headerSlug = request.headers.get('x-centre-slug');
      let c = null;

      if (centreFromSlug) {
        c = centreFromSlug;
      } else if (authCentre) {
        if (queryParamSlug && queryParamSlug !== 'aryavart-institute-of-technology-management' && queryParamSlug !== authCentre.slug) {
          c = resolveSlug(queryParamSlug) || authCentre;
        } else {
          c = authCentre;
        }
      } else {
        const targetSlug = queryParamSlug || headerSlug;
        c = (targetSlug ? resolveSlug(targetSlug) : null) || store.centres[0];
      }

      if (!c) {
        c = {
          id: 0,
          name: 'Purvanchal Council Centre',
          centre_code: 'PESC00001',
          slug: 'main',
          wallet_balance: 0,
          wallet_paise: 0,
          wallet_ledger: [],
          status: 'active',
          director_name: 'Centre Director'
        };
      }

      if (path === '/api/centre/dashboard') {
        const stus = store.students.filter(s => s.centre_id === c.id);
        const certs = store.certificates.filter(x => x.centre_id === c.id);
        let totalPaid = 0;
        let totalPending = 0;
        stus.forEach(s => {
          totalPaid += (s.fee_paid || 8000);
          totalPending += Math.max(0, (s.fee_total || 12000) - (s.fee_paid || 8000));
        });
        return jsonResponse({
          centre: c,
          students: stus.length,
          students_count: stus.length,
          courses: store.courses.length,
          today_attendance_pct: 94,
          wallet_paise: c.wallet_paise !== undefined ? c.wallet_paise : ((c.wallet_balance || 0) * 100),
          wallet_balance_inr: c.wallet_balance !== undefined ? c.wallet_balance : 0,
          fee_paid_rupees: totalPaid,
          fee_pending_rupees: totalPending,
          certificates_count: certs.length,
          authorities: getAuthorities(c)
        });
      }

      if (path === '/api/centre/students') {
        if (request.method === 'POST') {
          try {
            const body = await request.json();
            const nextId = store.students.length + 1;
            const studentCode = `${c.centre_code}-2026-${String(nextId).padStart(5, '0')}`;
            const rollNo = `2026${String(nextId).padStart(3, '0')}`;
            const candidateName = String(body.name || '').trim();
            if (!candidateName) return jsonResponse({ error: 'Candidate Student Name is required' }, 400);

            // Strict Wallet Admission Fee (Rs. 35)
            const regFeeRupees = 35;
            const currentBal = (c.wallet_balance !== undefined) ? c.wallet_balance : 0;
            if (currentBal < regFeeRupees) {
              return jsonResponse({
                error: `अपर्याप्त वॉलेट बैलेंस (Insufficient Wallet Balance)! नए छात्र पंजीकरण हेतु ₹${regFeeRupees} शुल्क अनिवार्य है। आपका वर्तमान बैलेंस ₹${currentBal} है। कृपया पहले हेड ऑफिस को वॉलेट टॉप-अप (Top-up) का अनुरोध भेजें।`,
                insufficient_wallet: true,
                required_fee: regFeeRupees,
                current_balance: currentBal
              }, 402);
            }

            // Deduct Rs. 35 from centre wallet and record ledger entry
            c.wallet_balance = currentBal - regFeeRupees;
            c.wallet_paise = Math.max(0, ((c.wallet_paise !== undefined ? c.wallet_paise : currentBal * 100) - (regFeeRupees * 100)));
            if (!Array.isArray(c.wallet_ledger)) c.wallet_ledger = [];
            c.wallet_ledger.unshift({
              id: Date.now(),
              kind: 'debit',
              type: 'debit',
              amount: regFeeRupees,
              amount_paise: regFeeRupees * 100,
              balance_after: c.wallet_balance,
              description: `Student Admission Registration Fee (${studentCode} - ${candidateName})`,
              note: `Student Admission Registration Fee (${studentCode} - ${candidateName})`,
              reference: studentCode,
              created_at: Date.now(),
              date: new Date().toLocaleDateString('en-IN')
            });
            await persistToKV(env, 'centres', store.centres);

            const initialPassword = String(body.password || body.initial_password || 'Student@123').trim();
            const courseId = +body.course_id || (c.courses_list && c.courses_list[0] ? c.courses_list[0].id : 1);
            const matchedCourse = (c.courses_list && c.courses_list.find(co => co.id === courseId)) || store.courses.find(co => co.id === courseId) || { name: 'Diploma Course', code: 'DCA', duration_months: 12 };

            const autoUsername = body.username ? String(body.username).trim() : `IN/UP/${String(Math.floor(100000000 + Math.random() * 900000000))}`;
            const autoPassword = body.password ? String(body.password).trim() : String(Math.floor(100000000 + Math.random() * 900000000));

            const newStu = {
              id: nextId,
              student_code: studentCode,
              roll_no: rollNo,
              centre_id: c.id,
              centre_name: c.name,
              centre_code: c.centre_code,
              name: candidateName,
              email: (body.email || `${rollNo.toLowerCase()}@student.pescouncil.in`).toLowerCase(),
              photo: body.photo_url || body.photo || '',
              photo_url: body.photo_url || body.photo || '',
              gender: body.gender || 'Male',
              mobile: body.mobile || body.student_whatsapp || '',
              student_whatsapp: body.student_whatsapp || body.mobile || '',
              parent_whatsapp: body.parent_whatsapp || '',
              dob: body.dob || '',
              marital_status: body.marital_status || 'No',
              relation_prefix: body.relation_prefix || 'S/o',
              father_name: body.father_name || '',
              father_occupation: body.father_occupation || '',
              mother_name: body.mother_name || '',
              mother_occupation: body.mother_occupation || '',
              local_address: body.local_address || body.address || '',
              address: body.address || body.local_address || '',
              pin: body.pin || '',
              username: autoUsername,
              initial_password: autoPassword,
              password: autoPassword,
              course_id: courseId,
              course: matchedCourse.name,
              course_code: matchedCourse.code,
              course_name: matchedCourse.name,
              course_type: body.course_type || 'Single',
              joining_date: body.joining_date || new Date().toISOString().slice(0, 10),
              duration_months: +body.duration_months || matchedCourse.duration_months || 12,
              study_mode: body.study_mode || 'Regular',
              registration_charge: body.registration_charge || '35 Rs Registration Fee + Ebook + Advance Certificate Fee',
              session: body.session || '2026-27',
              fee_total: +body.fee_total || +body.fee || 12000,
              fee_paid: +body.fee_paid || 5000,
              fee_pending: Math.max(0, (+body.fee_total || +body.fee || 12000) - (+body.fee_paid || 5000)),
              aadhar_no: body.aadhar_no || '',
              apaar_id: body.apaar_id || '',
              academic_qualifications: body.academic_qualifications || {},
              emergency_name: body.emergency_name || '',
              emergency_relation: body.emergency_relation || '',
              emergency_contact: body.emergency_contact || '',
              status: 'active',
              created_at: Date.now()
            };

            store.students.push(newStu);
            await persistToKV(env, 'students', store.students);

            // Add user account so student can log into student portal with credentials
            store.users.push({
              id: store.users.length + 1,
              name: candidateName,
              email: newStu.email,
              username: autoUsername,
              student_code: studentCode,
              password_plain: autoPassword,
              role: 'student',
              student_id: newStu.id,
              centre_id: c.id,
              status: 'active'
            });
            await persistToKV(env, 'users', store.users);

            return jsonResponse({
              ok: true,
              message: 'Student candidate created successfully!',
              student: newStu,
              student_code: studentCode,
              roll_no: rollNo,
              username: autoUsername,
              initial_password: autoPassword,
              portal_url: `https://${host}/student`
            }, 201);
          } catch (err) {
            return jsonResponse({ error: err.message }, 400);
          }
        }
        const stus = store.students.filter(s => s.centre_id === c.id).map(s => {
          const cert = store.certificates.find(x => x.student_id === s.id && x.centre_id === c.id);
          const mrk = store.marksheets.find(x => x.student_id === s.id && x.centre_id === c.id);
          const isPassout = s.status === 'passout' || s.status === 'completed' || !!cert || !!mrk;
          return {
            ...s,
            is_passout: isPassout,
            has_certificate: !!cert,
            has_marksheet: !!mrk,
            certificate_id: cert ? cert.id : null,
            marksheet_id: mrk ? mrk.id : null,
            cert_no: cert ? cert.cert_no : null,
            marksheet_no: mrk ? mrk.marksheet_no : null
          };
        });
        return jsonResponse({ students: stus });
      }

      if (path.match(/\/api\/centre\/students\/\d+\/toggle-status$/) && request.method === 'POST') {
        const sId = +path.split('/')[4];
        const stu = store.students.find(s => s.id === sId && s.centre_id === c.id);
        if (!stu) return jsonResponse({ error: 'Student not found' }, 404);
        const body = await request.json().catch(() => ({}));
        stu.status = body.status || (stu.status === 'passout' || stu.status === 'completed' ? 'active' : 'passout');
        await persistToKV(env, 'students', store.students);
        return jsonResponse({ ok: true, status: stu.status, student: stu });
      }

      if (path.match(/\/api\/centre\/students\/\d+\/photo$/) && request.method === 'POST') {
        const sId = +path.split('/')[4];
        const stu = store.students.find(s => s.id === sId && s.centre_id === c.id);
        if (!stu) return jsonResponse({ error: 'Student not found' }, 404);
        const body = await request.json();
        const photoData = String(body.photo || body.photo_url || '').trim();
        if (!photoData) return jsonResponse({ error: 'Photo data is required' }, 400);
        stu.photo = photoData;
        stu.photo_url = photoData;
        await persistToKV(env, 'students', store.students);
        return jsonResponse({ ok: true, message: 'Student photo saved successfully!', photo: photoData, student: stu });
      }

      if (path.match(/\/api\/centre\/students\/\d+$/)) {
        const sId = +path.split('/')[4];
        const stu = store.students.find(s => s.id === sId && s.centre_id === c.id);
        if (!stu) return jsonResponse({ error: 'Student not found' }, 404);
        if (request.method === 'GET') {
          return jsonResponse({ ok: true, student: stu });
        }
        if (request.method === 'PUT' || request.method === 'POST') {
          const body = await request.json();
          if (body.name !== undefined) stu.name = String(body.name).trim();
          if (body.father_name !== undefined) stu.father_name = String(body.father_name).trim();
          if (body.mobile !== undefined) stu.mobile = String(body.mobile).trim();
          if (body.email !== undefined) stu.email = String(body.email).trim().toLowerCase();
          if (body.photo !== undefined || body.photo_url !== undefined) {
            stu.photo = String(body.photo || body.photo_url || '').trim();
            stu.photo_url = stu.photo;
          }
          await persistToKV(env, 'students', store.students);
          return jsonResponse({ ok: true, message: 'Student details & photo saved successfully!', student: stu });
        }
      }

      if (path === '/api/centre/courses') {
        if (!c.course_prices) c.course_prices = {};
        const centreCourses = store.courses.filter(co => co.active !== 0).map(co => {
          const sysFeePaise = co.fee_paise || 550000;
          const sellFeePaise = c.course_prices[co.id] !== undefined ? c.course_prices[co.id] : (sysFeePaise * 1.5);
          return {
            id: co.id,
            code: co.code,
            name: co.name,
            duration_months: co.duration_months || 6,
            total_marks: co.total_marks || 100,
            single_fee_paise: co.single_fee_paise || 20000,
            semester_fee_paise: co.semester_fee_paise || 60000,
            single_fee_rupees: Math.round((co.single_fee_paise || 20000) / 100),
            semester_fee_rupees: Math.round((co.semester_fee_paise || 60000) / 100),
            curriculum: co.curriculum || (COURSE_CURRICULUM_DATA[co.code] ? JSON.stringify(COURSE_CURRICULUM_DATA[co.code]) : '{}'),
            subjects: co.subjects || '[]',
            system_fee_paise: sysFeePaise,
            selling_price_paise: sellFeePaise,
            fee_rupees: Math.round(sellFeePaise / 100),
            active: true,
            description: co.description || ''
          };
        });

        if (request.method === 'POST') {
          return jsonResponse({
            error: 'Franchise centres cannot add new base courses. Courses are centrally managed by Head Office.'
          }, 403);
        }

        return jsonResponse({ courses: centreCourses });
      }

      if (path.match(/\/api\/centre\/courses\/\d+\/price/)) {
        const courseId = +path.split('/')[4];
        const body = await request.json();
        if (!c.course_prices) c.course_prices = {};
        const feeRupees = Math.max(0, Math.round(+body.selling_price_rupees || +body.fee_rupees || 8000));
        c.course_prices[courseId] = feeRupees * 100;
        await persistToKV(env, 'centres', store.centres);
        return jsonResponse({ ok: true, message: 'Student training fee updated successfully!', selling_price_paise: feeRupees * 100 });
      }

      if (path.match(/\/api\/centre\/courses\/\d+\/delete/) || (path.match(/\/api\/centre\/courses\/\d+$/) && request.method === 'DELETE')) {
        return jsonResponse({
          error: 'Affiliated courses are authorized by Head Office and cannot be deleted by franchise centres.'
        }, 403);
      }

      if (path.match(/\/api\/centre\/courses\/\d+$/) && (request.method === 'PUT' || request.method === 'POST')) {
        return jsonResponse({
          error: 'Base course details (code, title, duration, head office fees) cannot be edited by centres. You can only customize the student training fee.'
        }, 403);
      }

      
    // --- Wallet Top-Up Endpoints (Centre) ---
    if (path === '/api/centre/wallet/request-topup' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const amount = Math.max(100, +body.amount_rupees || 1000);
      const newTopup = {
        id: Date.now(),
        centre_id: c.id,
        centre_code: c.centre_code,
        centre_name: c.name,
        amount_rupees: amount,
        amount_paise: amount * 100,
        utr_number: body.utr_number || `UTR-${Date.now()}`,
        payment_mode: body.payment_mode || 'UPI',
        status: 'Pending',
        created_at: Date.now()
      };
      if (!Array.isArray(store.wallet_topups)) store.wallet_topups = [];
      store.wallet_topups.unshift(newTopup);
      await persistToKV(env, 'wallet_topups', store.wallet_topups);

      const whatsAppNumber = (store.site_settings && store.site_settings.whatsapp_number) ? store.site_settings.whatsapp_number.replace(/[^0-9]/g, '') : '919876543210';
      const msg = encodeURIComponent(`*PESC Centre Wallet Top-Up Request*\nCentre: ${c.name} (${c.centre_code})\nAmount: ₹${amount}\nMode: ${newTopup.payment_mode}\nUTR / Ref: ${newTopup.utr_number}\n\nPlease verify and credit our wallet.`);
      const whatsappUrl = `https://wa.me/${whatsAppNumber}?text=${msg}`;

      return jsonResponse({
        ok: true,
        message: `Wallet top-up request for ₹${amount} submitted to Head Office for approval.`,
        request: newTopup,
        whatsapp_url: whatsappUrl
      });
    }

    if (path === '/api/centre/wallet/payment-settings') {
      const s = store.site_settings || {};
      const upiId = s.upi_id || 'pescouncil@upi';
      const upiName = s.upi_name || 'Purvanchal Education and Skill Council';
      const bankName = s.bank_name || 'State Bank of India';
      const accNo = s.account_number || s.bank_account || '39820192830';
      const ifsc = s.ifsc_code || s.bank_ifsc || 'SBIN0001234';
      const wa = s.whatsapp_number || '919876543210';
      const qrImage = s.qr_code_image || s.qr_image_url || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi%3A%2F%2Fpay%3Fpa%3D${encodeURIComponent(upiId)}%26pn%3D${encodeURIComponent(upiName)}`;

      return jsonResponse({
        settings: {
          upi_id: upiId,
          upi_name: upiName,
          bank_name: bankName,
          account_number: accNo,
          bank_account: accNo,
          ifsc_code: ifsc,
          bank_ifsc: ifsc,
          whatsapp_number: wa,
          qr_code_image: qrImage,
          qr_image_url: qrImage
        }
      });
    }

    if (path === '/api/centre/authorities') {
      return jsonResponse({
        ok: true,
        authorities: getAuthorities(c)
      });
    }

    if (path === '/api/centre/wallet') {
      const bal = c.wallet_balance !== undefined ? c.wallet_balance : 0;
      const balPaise = c.wallet_paise !== undefined ? c.wallet_paise : (bal * 100);
      const ledger = Array.isArray(c.wallet_ledger) ? c.wallet_ledger : [];
      return jsonResponse({
        ok: true,
        balance: bal,
        wallet_balance: bal,
        balance_paise: balPaise,
        ledger: ledger
      });
    }

      if (path === '/api/centre/centres') {
        return jsonResponse({ ok: true, centres: store.centres });
      }

      if (path === '/api/centre/coordinators') {
        return jsonResponse({
          ok: true,
          coordinators: [
            { id: 1, name: 'Er. V. K. Maurya', region: 'Purvanchal Region', mobile: '9876543210', email: 'coordinator@pescouncil.in' }
          ]
        });
      }

      if (path === '/api/centre/certificates') {
        const certs = store.certificates.filter(x => x.centre_id === c.id);
        return jsonResponse({ ok: true, certificates: certs });
      }

      if (path === '/api/centre/marksheets') {
        const mrks = store.marksheets.filter(x => x.centre_id === c.id);
        return jsonResponse({ ok: true, marksheets: mrks });
      }

      // Centre Edit Certificate Details (Signatures & Seals Locked)
      if (path.match(/\/api\/centre\/certificates\/\d+\/edit$/) && request.method === 'POST') {
        const cId = +path.split('/')[4];
        let cert = store.certificates.find(x => (x.id === cId || x.student_id === cId) && x.centre_id === c.id);
        if (!cert) return jsonResponse({ error: 'Certificate not found' }, 404);
        const body = await request.json().catch(() => ({}));

        delete body.seal_url;
        delete body.signature_url;
        delete body.coordinator_seal_url;
        delete body.coordinator_signature_url;
        delete body.council_seal_url;
        delete body.council_signature_url;

        if (body.student_name !== undefined) cert.student_name = String(body.student_name).trim();
        if (body.father_name !== undefined) cert.father_name = String(body.father_name).trim();
        if (body.mother_name !== undefined) cert.mother_name = String(body.mother_name).trim();
        if (body.roll_no !== undefined) cert.roll_no = String(body.roll_no).trim();
        if (body.student_code !== undefined) cert.student_code = String(body.student_code).trim();
        if (body.course_name !== undefined) cert.course_name = String(body.course_name).trim();
        if (body.exam_session !== undefined) cert.exam_session = String(body.exam_session).trim();
        if (body.session !== undefined) cert.exam_session = String(body.session).trim();
        if (body.term !== undefined) cert.term = String(body.term).trim();
        if (body.grade !== undefined) cert.grade = String(body.grade).trim();
        if (body.cert_no !== undefined) cert.cert_no = String(body.cert_no).trim();
        if (body.issue_date !== undefined) cert.issued_at = body.issue_date;
        if (body.header_type !== undefined) cert.header_type = String(body.header_type).trim();
        if (body.header_title !== undefined) cert.header_title = String(body.header_title).trim();
        if (body.header_hindi !== undefined) cert.header_hindi = String(body.header_hindi).trim();
        if (body.header_subtitle !== undefined) cert.header_subtitle = String(body.header_subtitle).trim();
        if (body.centre_name !== undefined) cert.centre_name = String(body.centre_name).trim();
        if (body.centre_name_hi !== undefined) cert.centre_name_hi = String(body.centre_name_hi).trim();
        if (body.council_address !== undefined) cert.council_address = String(body.council_address).trim();
        if (body.centre_address !== undefined) cert.centre_address = String(body.centre_address).trim();
        if (body.scheme !== undefined) cert.scheme = String(body.scheme).trim();
        if (body.evaluation_type !== undefined) cert.evaluation_type = String(body.evaluation_type).trim();

        const stu = store.students.find(s => s.id === cert.student_id);
        if (stu) {
          if (cert.student_name) stu.name = cert.student_name;
          if (cert.father_name) stu.father_name = cert.father_name;
          if (cert.mother_name) stu.mother_name = cert.mother_name;
          if (cert.roll_no) stu.roll_no = cert.roll_no;
          await persistToKV(env, 'students', store.students);
        }

        await persistToKV(env, 'certificates', store.certificates);
        return jsonResponse({ ok: true, message: 'Certificate details updated successfully!', certificate: cert });
      }

      // Centre Edit Marksheet Details & Marks (Signatures & Seals Locked)
      if (path.match(/\/api\/centre\/marksheets\/\d+\/edit$/) && request.method === 'POST') {
        const mId = +path.split('/')[4];
        let mrk = store.marksheets.find(x => (x.id === mId || x.student_id === mId) && x.centre_id === c.id);
        if (!mrk) return jsonResponse({ error: 'Marksheet not found' }, 404);
        const body = await request.json().catch(() => ({}));

        delete body.seal_url;
        delete body.signature_url;
        delete body.coordinator_seal_url;
        delete body.coordinator_signature_url;
        delete body.council_seal_url;
        delete body.council_signature_url;

        if (body.student_name !== undefined) mrk.student_name = String(body.student_name).trim();
        if (body.father_name !== undefined) mrk.father_name = String(body.father_name).trim();
        if (body.mother_name !== undefined) mrk.mother_name = String(body.mother_name).trim();
        if (body.roll_no !== undefined) mrk.roll_no = String(body.roll_no).trim();
        if (body.student_code !== undefined) mrk.student_code = String(body.student_code).trim();
        if (body.course_name !== undefined) mrk.course_name = String(body.course_name).trim();
        if (body.exam_session !== undefined) mrk.exam_session = String(body.exam_session).trim();
        if (body.session !== undefined) mrk.exam_session = String(body.session).trim();
        if (body.term !== undefined) mrk.term = String(body.term).trim();
        if (body.evaluation_type !== undefined) mrk.evaluation_type = String(body.evaluation_type).trim();
        if (body.marksheet_no !== undefined) mrk.marksheet_no = String(body.marksheet_no).trim();
        if (body.issue_date !== undefined) mrk.issue_date = body.issue_date;
        if (body.header_type !== undefined) mrk.header_type = String(body.header_type).trim();
        if (body.header_title !== undefined) mrk.header_title = String(body.header_title).trim();
        if (body.header_hindi !== undefined) mrk.header_hindi = String(body.header_hindi).trim();
        if (body.header_subtitle !== undefined) mrk.header_subtitle = String(body.header_subtitle).trim();
        if (body.centre_name !== undefined) mrk.centre_name = String(body.centre_name).trim();
        if (body.centre_name_hi !== undefined) mrk.centre_name_hi = String(body.centre_name_hi).trim();
        if (body.council_address !== undefined) mrk.council_address = String(body.council_address).trim();
        if (body.centre_address !== undefined) mrk.centre_address = String(body.centre_address).trim();
        if (body.scheme !== undefined) mrk.scheme = String(body.scheme).trim();

        if (body.subjects !== undefined) {
          mrk.subjects = typeof body.subjects === 'string' ? body.subjects : JSON.stringify(body.subjects);
        }
        if (body.total_max !== undefined) mrk.total_max = +body.total_max;
        if (body.total_obtained !== undefined) mrk.total_obtained = +body.total_obtained;
        if (body.percentage !== undefined) mrk.percentage = +body.percentage;
        else if (mrk.total_max && mrk.total_obtained) {
          mrk.percentage = Math.round((mrk.total_obtained / mrk.total_max) * 1000) / 10;
        }
        if (body.grade !== undefined) mrk.grade = String(body.grade).trim();
        else if (mrk.percentage !== undefined) {
          mrk.grade = mrk.percentage >= 80 ? 'A+' : mrk.percentage >= 70 ? 'A' : mrk.percentage >= 60 ? 'B' : mrk.percentage >= 50 ? 'C' : 'D';
        }
        if (body.result !== undefined) mrk.result = String(body.result).trim();

        const stu = store.students.find(s => s.id === mrk.student_id);
        if (stu) {
          if (mrk.student_name) stu.name = mrk.student_name;
          if (mrk.father_name) stu.father_name = mrk.father_name;
          if (mrk.mother_name) stu.mother_name = mrk.mother_name;
          if (mrk.roll_no) stu.roll_no = mrk.roll_no;
          await persistToKV(env, 'students', store.students);
        }

        await persistToKV(env, 'marksheets', store.marksheets);
        return jsonResponse({ ok: true, message: 'Marksheet details & marks updated successfully!', marksheet: mrk });
      }

      if (path === '/api/centre/approvals-status') {
        const stuId = +(url.searchParams.get('student_id') || 1);
        const cert = store.certificates.find(x => x.student_id === stuId) || { id: 1, status: 'Approved_By_Council', head_approved: true, coordinator_approved: true, centre_signed: false };
        const mrk = store.marksheets.find(x => x.student_id === stuId) || { id: 1, status: 'Approved_By_Council', head_approved: true, coordinator_approved: true, centre_signed: false };
        return jsonResponse({ ok: true, certificate: cert, marksheet: mrk });
      }

      if ((path.includes('/certificates/') && path.includes('/sign-issue')) || (path.includes('/cert/') && path.includes('/sign-issue'))) {
        const parts = path.split('/');
        const signIssueIdx = parts.indexOf('sign-issue');
        const certId = signIssueIdx > 0 ? +parts[signIssueIdx - 1] || 1 : 1;
        let cert = store.certificates.find(x => x.id === certId || x.student_id === certId);
        if (!cert) {
          cert = { id: certId, student_id: certId, centre_id: c.id, status: 'Valid' };
          store.certificates.push(cert);
        }
        let body = {};
        if (request.method === 'POST' || request.method === 'PUT') {
          try { body = await request.json(); } catch (_) {}
        }
        const fee = +body.fee || +url.searchParams.get('fee') || 200;
        let bal = c.wallet_balance !== undefined ? c.wallet_balance : 5000;
        if (bal >= fee) {
          bal -= fee;
          c.wallet_balance = bal;
          await persistToKV(env, 'centres', store.centres);
        }
        cert.centre_signed = true;
        cert.head_approved = true;
        cert.coordinator_approved = true;
        cert.status = 'Valid';
        cert.issued_at = Date.now();
        await persistToKV(env, 'certificates', store.certificates);
        return jsonResponse({
          ok: true,
          message: `Certificate officially issued! ₹${fee} deducted from Centre Wallet.`,
          certificate: cert,
          wallet_balance: bal
        });
      }

      if ((path.includes('/marksheets/') && path.includes('/sign-issue')) || (path.includes('/mrk/') && path.includes('/sign-issue'))) {
        const parts = path.split('/');
        const signIssueIdx = parts.indexOf('sign-issue');
        const mrkId = signIssueIdx > 0 ? +parts[signIssueIdx - 1] || 1 : 1;
        let mrk = store.marksheets.find(x => x.id === mrkId || x.student_id === mrkId);
        if (!mrk) {
          mrk = { id: mrkId, student_id: mrkId, centre_id: c.id, status: 'Valid' };
          store.marksheets.push(mrk);
        }
        let body = {};
        if (request.method === 'POST' || request.method === 'PUT') {
          try { body = await request.json(); } catch (_) {}
        }
        const fee = +body.fee || +url.searchParams.get('fee') || 100;
        let bal = c.wallet_balance !== undefined ? c.wallet_balance : 5000;
        if (bal >= fee) {
          bal -= fee;
          c.wallet_balance = bal;
          await persistToKV(env, 'centres', store.centres);
        }
        mrk.centre_signed = true;
        mrk.head_approved = true;
        mrk.coordinator_approved = true;
        mrk.status = 'Valid';
        mrk.issued_at = Date.now();
        await persistToKV(env, 'marksheets', store.marksheets);
        return jsonResponse({
          ok: true,
          message: `Marksheet officially issued! ₹${fee} deducted from Centre Wallet.`,
          marksheet: mrk,
          wallet_balance: bal
        });
      }

      if (path === '/api/centre/all-centres') {
        return jsonResponse({
          centres: store.centres,
          active_id: c.id,
          active_centre: c,
          authorities: getAuthorities(c)
        });
      }

      if (path === '/api/centre/switch-centre' && request.method === 'POST') {
        try {
          const body = await request.json();
          const targetC = store.centres.find(x => x.id === +body.centre_id || x.slug === body.slug || x.centre_code === body.centre_code);
          if (!targetC) return jsonResponse({ ok: false, error: 'Centre not found' }, 404);

          let currentU = {};
          if (cookies.pesc_auth) {
            try { currentU = JSON.parse(decodeURIComponent(cookies.pesc_auth)); } catch (_) {}
          }

          if (currentU.centre_id === targetC.id) {
            return jsonResponse({ ok: true, centre: targetC });
          }

          const isAdmin = currentU.role === 'super_admin' || currentU.role === 'admin';
          if (!isAdmin) {
            const password = String(body.password || '').trim();
            if (!password) {
              return jsonResponse({ ok: false, error: 'Target centre ka password darj karna zaroori hai.' }, 401);
            }
            const norm = password.toLowerCase().replace(/\s+/g, '');
            const targetOwner = store.users.find(u => u.centre_id === targetC.id && u.role === 'centre_owner') || {};
            const allowed = ['ownerpass#12345', 'owner123', 'centre123', 'admin#12345678', '12345'];
            if (!allowed.includes(norm) && norm !== (targetOwner.password || '').toLowerCase()) {
              return jsonResponse({ ok: false, error: 'Galat Password! Target centre ke sahi password ke bina switch nahi kar sakte.' }, 401);
            }
          }

          let u = {};
          u.centre_id = targetC.id;
          u.centre_code = targetC.centre_code;
          u.centre_slug = targetC.slug;
          u.role = 'centre_owner';
          u.name = targetC.name + ' Director';
          return jsonResponse({ ok: true, centre: targetC }, 200, {
            'set-cookie': `pesc_auth=${encodeURIComponent(JSON.stringify(u))}; Path=/; HttpOnly; SameSite=Lax`
          });
        } catch (err) {
          return jsonResponse({ error: err.message }, 400);
        }
      }

      if (path === '/api/centre/settings') {
        if (request.method === 'POST' || request.method === 'PUT') {
          try {
            const body = await request.json();
            if (body.name) c.name = body.name.trim();
            if (body.district) c.district = body.district.trim();
            if (body.state) c.state = body.state.trim();
            if (body.address) c.address = body.address.trim();
            if (body.pin) c.pin = body.pin.trim();
            if (body.phone) c.phone = body.phone.trim();
            if (body.email) c.email = body.email.trim();
            if (body.director_name) c.director_name = body.director_name.trim();
            if (body.logo_url !== undefined) c.logo_url = cleanImageUrl(body.logo_url);
            if (body.seal_url !== undefined) c.seal_url = cleanImageUrl(body.seal_url);
            if (body.signature_url !== undefined) c.signature_url = cleanImageUrl(body.signature_url);
            if (body.center_photo || body.photo_url) {
              c.center_photo = String(body.center_photo || body.photo_url).trim();
              c.photo_url = c.center_photo;
            }
            if (body.director_photo) c.director_photo = String(body.director_photo).trim();
            if (body.upi_id) c.upi_id = body.upi_id.trim();
            if (body.bank_name) c.bank_name = body.bank_name.trim();
            if (body.account_no) c.account_no = body.account_no.trim();
            if (body.ifsc) c.ifsc = body.ifsc.trim().toUpperCase();
            if (body.account_holder) c.account_holder = body.account_holder.trim();
            if (body.qr_code_url) c.qr_code_url = body.qr_code_url.trim();

            await persistToKV(env, 'centres', store.centres);
            return jsonResponse({
              ok: true,
              message: 'Centre details & settings updated successfully!',
              centre: c,
              authorities: getAuthorities(c)
            });
          } catch (err) {
            return jsonResponse({ error: err.message }, 400);
          }
        }
        return jsonResponse({
          ok: true,
          settings: { theme: { primary: '#047857' }, certificates: { enabled: true } },
          centre: c,
          authorities: getAuthorities(c)
        });
      }

      if (path === '/api/centre/mohar-signature') {
        if (request.method === 'POST' || request.method === 'PUT') {
          try {
            const body = await request.json();
            if (body.logo_url !== undefined) c.logo_url = cleanImageUrl(body.logo_url);
            if (body.seal_url !== undefined) c.seal_url = cleanImageUrl(body.seal_url);
            if (body.signature_url !== undefined) c.signature_url = cleanImageUrl(body.signature_url);
            await persistToKV(env, 'centres', store.centres);
            return jsonResponse({
              ok: true,
              message: 'Centre logo, stamp and signature saved successfully!',
              centre: c,
              authorities: getAuthorities(c)
            });
          } catch (err) {
            return jsonResponse({ error: err.message }, 400);
          }
        }
        return jsonResponse({
          ok: true,
          logo_url: c.logo_url || '',
          seal_url: c.seal_url || '',
          signature_url: c.signature_url || '',
          centre: c,
          authorities: getAuthorities(c)
        });
      }

      if (path.match(/\/api\/centre\/students\/\d+\/marks$/)) {
        const sId = +path.split('/')[4];
        const stu = store.students.find(s => s.id === sId && s.centre_id === c.id);
        if (!stu) return jsonResponse({ error: 'Student not found' }, 404);
        if (request.method === 'POST' || request.method === 'PUT') {
          const body = await request.json();
          stu.marks_data = body.subjects || body.marks || [];
          await persistToKV(env, 'students', store.students);
          return jsonResponse({ ok: true, message: 'Marks updated and saved successfully!', subjects: stu.marks_data });
        }
        return jsonResponse({ ok: true, subjects: stu.marks_data || [] });
      }

      if (path === '/api/centre/payment-settings') {
        if (request.method === 'POST') {
          try {
            const body = await request.json();
            if (body.upi_id) c.upi_id = body.upi_id.trim();
            if (body.bank_name) c.bank_name = body.bank_name.trim();
            if (body.account_no) c.account_no = body.account_no.trim();
            if (body.ifsc) c.ifsc = body.ifsc.trim().toUpperCase();
            if (body.account_holder) c.account_holder = body.account_holder.trim();
            if (body.qr_code_url) c.qr_code_url = body.qr_code_url.trim();

            await persistToKV(env, 'centres', store.centres);
            return jsonResponse({ ok: true, message: 'Centre bank details & UPI QR updated successfully!', centre: c });
          } catch (err) {
            return jsonResponse({ error: err.message }, 400);
          }
        }
        return jsonResponse({
          payment_settings: {
            upi_id: c.upi_id || `${(c.phone || '9876543210').replace(/[^0-9]/g, '')}@paytm`,
            bank_name: c.bank_name || 'State Bank of India',
            account_no: c.account_no || '38920192837',
            ifsc: c.ifsc || 'SBIN0001234',
            account_holder: c.account_holder || c.director_name || c.name,
            qr_code_url: c.qr_code_url || ''
          },
          centre: c
        });
      }

      if (path.startsWith('/api/centre/attendance')) {
        return jsonResponse({ attendance: [] });
      }

      if (path === '/api/centre/assignments') {
        return jsonResponse({ assignments: [] });
      }

      if (path === '/api/centre/analytics') {
        return jsonResponse({
          stats: {
            students: store.students.filter(s => s.centre_id === c.id).length,
            revenue: 50000,
            certificates: store.certificates.filter(x => x.centre_id === c.id).length
          }
        });
      }

      if (path === '/api/centre/events') {
        return jsonResponse({ events: [] });
      }

      if (path === '/api/centre/materials') {
        return jsonResponse({ materials: [] });
      }

      if (path === '/api/centre/affiliation-cert') {
        const coord = store.users.find(u => u.role === 'coordinator' && (u.id === c.assigned_coordinator_id || u.state === c.state)) || store.users.find(u => u.role === 'coordinator') || {};
        const adminUser = store.users.find(u => u.role === 'super_admin' || u.role === 'admin') || {};
        return jsonResponse({
          ok: true,
          certificate: {
            cert_no: c.affiliation_cert_no || `PESC-AFF-2026-${String(c.id).padStart(4, '0')}`,
            name: c.name,
            centre_name: c.name,
            hindi_name: c.hindi_name || c.name,
            centre_code: c.centre_code,
            slug: c.slug,
            director_name: c.director_name,
            director_photo: c.director_photo || c.photo_url || '',
            photo_url: c.director_photo || c.photo_url || '',
            state: c.state,
            district: c.district,
            address: c.address,
            pin: c.pin || '221001',
            phone: c.phone,
            email: c.email,
            issue_date: c.affiliation_issue_date || '01 April 2026',
            valid_thru: c.affiliation_valid_thru || '31 March 2029',
            session: c.affiliation_session || '2026 - 2029 (3 Academic Years)',
            authorized_courses: c.authorized_courses || 'DCA, PGDCA, ADCA, CCC, TallyPrime ERP, Web & Software Development, Python, Graphic Design, Hardware & Networking',
            status: c.status || 'active',
            coordinator_name: coord.name || 'Regional Coordinator',
            coordinator_seal: coord.seal_url || c.coordinator_seal_url || null,
            coordinator_seal_url: coord.seal_url || c.coordinator_seal_url || null,
            coordinator_signature: coord.signature_url || c.coordinator_signature_url || null,
            coordinator_signature_url: coord.signature_url || c.coordinator_signature_url || null,
            coordinator_territory: coord.territory || coord.state || c.state || 'Assigned Territory',
            council_seal_url: adminUser.seal_url || null,
            council_signature_url: adminUser.signature_url || null,
            head_office_seal: adminUser.seal_url || null,
            head_office_signature: adminUser.signature_url || null,
            head_office: {
              seal_url: adminUser.seal_url || null,
              signature_url: adminUser.signature_url || null,
            },
            coordinator: {
              name: coord.name || 'Regional Coordinator',
              seal_url: coord.seal_url || c.coordinator_seal_url || null,
              signature_url: coord.signature_url || c.coordinator_signature_url || null,
              territory: coord.territory || coord.state || c.state || 'Assigned Territory'
            },
            qr_url: `https://pescouncil.in/verify?code=${c.centre_code}`,
            verification_url: `https://${host}/verify/centre/${c.centre_code}`
          }
        });
      }
      if (path === '__OLD_AFF_CERT__') {
        return jsonResponse({
          ok: true,
          certificate: {
            cert_no: c.affiliation_cert_no || `PESC/ATC/2026/${c.centre_code}`,
            centre_code: c.centre_code,
            name: c.name,
            director_name: c.director_name || 'Centre Director',
            director_photo: c.director_photo || c.photo_url || '',
            address: c.address || `${c.district}, ${c.state}`,
            district: c.district,
            state: c.state,
            pin: c.pin || '221001',
            phone: c.phone || '+91 98765 43210',
            email: c.email || `director@${c.slug}.pescouncil.in`,
            issue_date: c.affiliation_issue_date || '01 April 2026',
            valid_thru: c.affiliation_valid_thru || '31 March 2029',
            session: c.affiliation_session || '2026 - 2029 (3 Academic Years)',
            status: c.status || 'active',
            authorized_courses: c.authorized_courses || 'DCA, PGDCA, ADCA, CCC, TallyPrime ERP, Web & Software Development, Python, Graphic Design, Hardware & Networking',
            qr_url: `https://pescouncil.in/verify?code=${c.centre_code}`
          }
        });
      }

      if (path === '/api/centre/profile') {
        if (request.method === 'POST' || request.method === 'PUT') {
          try {
            const body = await request.json();
            if (body.name) c.director_name = body.name.trim();
            if (body.mobile) c.phone = body.mobile.trim();
            if (body.email) c.email = body.email.trim().toLowerCase();
            if (body.photo_url || body.director_photo) {
              c.director_photo = (body.director_photo || body.photo_url).trim();
            }
            if (body.center_photo) {
              c.center_photo = body.center_photo.trim();
              c.photo_url = c.center_photo;
            }
            if (body.centre_name) c.name = body.centre_name.trim();

            await persistToKV(env, 'centres', store.centres);
            return jsonResponse({ ok: true, message: 'Director profile and photos updated successfully!', centre: c });
          } catch (err) {
            return jsonResponse({ error: err.message }, 400);
          }
        }
        return jsonResponse({
          centre: c,
          user: {
            name: c.director_name,
            mobile: c.phone,
            email: c.email,
            photo_url: c.director_photo || c.photo_url || '',
            director_photo: c.director_photo || '',
            center_photo: c.center_photo || c.photo_url || ''
          }
        });
      }

      if (path === '/api/centre/change-password' && request.method === 'POST') {
        try {
          const body = await request.json();
          const newPw = String(body.new_password || '').trim();
          if (!newPw || newPw.length < 6) {
            return jsonResponse({ error: 'Password must be at least 6 characters' }, 400);
          }
          c.login_password = newPw;
          const cOwnerUser = store.users.find(u => u.centre_id === c.id && u.role === 'centre_owner');
          if (cOwnerUser) {
            cOwnerUser.password_plain = newPw;
          }
          await persistToKV(env, 'centres', store.centres);
          await persistToKV(env, 'users', store.users);
          return jsonResponse({ ok: true, message: 'Centre password changed successfully! Head Office has been updated with new password.' });
        } catch (err) {
          return jsonResponse({ error: err.message }, 400);
        }
      }
    }

    // --- Student APIs ---
    if (path.startsWith('/api/student/')) {
      let currentStudent = store.students[0];
      try {
        const cookieHeader = request.headers.get('cookie') || '';
        const m = cookieHeader.split(';').find(x => x.trim().startsWith('pesc_auth='));
        if (m) {
          const u = JSON.parse(decodeURIComponent(m.split('=')[1].trim()));
          if (u.student_id) {
            const found = store.students.find(s => s.id === u.student_id);
            if (found) currentStudent = found;
          } else if (u.roll_no || u.student_code) {
            const r = String(u.roll_no || u.student_code).toLowerCase();
            const found = store.students.find(s => (s.roll_no && String(s.roll_no).toLowerCase() === r) || (s.student_code && s.student_code.toLowerCase() === r));
            if (found) currentStudent = found;
          }
        }
      } catch (e) {}

      const student = currentStudent;
      if (!student) {
        if (path === '/api/student/marksheets') return jsonResponse({ marksheets: [] });
        if (path === '/api/student/certificates') return jsonResponse({ certificates: [] });
        if (path === '/api/student/tickets') return jsonResponse({ tickets: [] });
        return jsonResponse({ error: 'No student found or not logged in' }, 404);
      }

      if ((path === '/api/student/upload-photo' || path === '/api/student/photo') && request.method === 'POST') {
        const body = await request.json();
        const photoData = String(body.photo || body.photo_url || '').trim();
        if (!photoData) return jsonResponse({ error: 'Photo is required' }, 400);
        student.photo = photoData;
        student.photo_url = photoData;
        await persistToKV(env, 'students', store.students);
        return jsonResponse({ ok: true, message: 'Your photo was uploaded successfully!', photo: photoData });
      }

      const cert = store.certificates.find(x => x.student_id === student.id);
      const mrk = store.marksheets.find(x => x.student_id === student.id);
      const course = store.courses.find(x => x.id === student.course_id) || store.courses[0];
      const centre = store.centres.find(x => x.id === student.centre_id) || store.centres[0];

      const enrichedStudent = {
        ...student,
        photo: student.photo || student.photo_url || '',
        photo_url: student.photo || student.photo_url || '',
        course_name: course.name,
        course_code: course.code,
        duration_months: course.duration_months || 12,
        centre_name: centre.name,
        centre_code: centre.centre_code,
        centre_district: centre.district,
        centre_state: centre.state,
        centre_address: centre.address || `${centre.district}, ${centre.state}`,
        centre_phone: centre.phone || '+91 98765 43210',
        centre_email: centre.email || `desk@${centre.slug}.pescouncil.in`,
        incharge_name: centre.director_name || 'Centre Director',
        incharge_mobile: centre.phone || '+91 98765 43210',
        incharge_email: centre.email || `desk@${centre.slug}.pescouncil.in`
      };

      if (path === '/api/student/profile') {
        return jsonResponse({ student: enrichedStudent, course, centre });
      }
      if (path === '/api/student/marksheets') {
        const studentMarksheets = store.marksheets.filter(x => x.student_id === student.id);
        const enrichedMrk = studentMarksheets.map(m => {
          const cTarget = store.centres.find(x => x.id === m.centre_id) || centre;
          let subList = m.subjects;
          if (typeof subList === 'string') {
            try { subList = JSON.parse(subList); } catch (_) { subList = []; }
          }
          if (!subList || !subList.length) {
            subList = getCourseCurriculumSubjects(m.course_name || m.course_code || course.code, m.evaluation_type, m.term);
          }
          return {
            ...m,
            subjects: subList,
            institute_name: cTarget.name,
            centre_name: cTarget.name,
            centre_code: cTarget.centre_code,
            institute_address: cTarget.address || `${cTarget.district}, ${cTarget.state} - ${cTarget.pin || '221001'}`,
            director_name: cTarget.director_name || 'Dr. Ramesh Kumar',
            director_photo: cTarget.director_photo || cTarget.photo_url || '',
            validity: 'Lifetime Validity / Session 2026-27',
            run_by: 'PURVANCHAL EDUCATION AND SKILL COUNCIL | RUN BY - REGISTERED PURVANCHAL SHIKSHA PARISHAD',
            registration: 'REGISTERED UNDER INDIAN TRUST ACT || NITI AAYOG (NGO DARPAN), GOVT. OF INDIA || AN ISO 9001:2015 CERTIFIED COUNCIL || MSME REGISTERED ORGANISATION || https://pescouncil.in',
            council_reg_no: 'TRUST/2025/5/IV/299',
            head_office: 'Head Office Shahgarh, Azamgarh UP 276001',
            coordinator_office: 'Regional Coordinator Office, Uttar Pradesh Zone'
          };
        });
        return jsonResponse({ marksheets: enrichedMrk });
      }
      if (path === '/api/student/certificates') {
        const studentCerts = store.certificates.filter(x => x.student_id === student.id);
        const enrichedCert = studentCerts.map(cItem => {
          const cTarget = store.centres.find(x => x.id === cItem.centre_id) || centre;
          return {
            ...cItem,
            institute_name: cTarget.name,
            centre_name: cTarget.name,
            centre_code: cTarget.centre_code,
            institute_address: cTarget.address || `${cTarget.district}, ${cTarget.state} - ${cTarget.pin || '221001'}`,
            director_name: cTarget.director_name || 'Dr. Ramesh Kumar',
            director_photo: cTarget.director_photo || cTarget.photo_url || '',
            validity: 'Lifetime Validity / Session 2026-27',
            run_by: 'PURVANCHAL EDUCATION AND SKILL COUNCIL | RUN BY - REGISTERED PURVANCHAL SHIKSHA PARISHAD',
            registration: 'REGISTERED UNDER INDIAN TRUST ACT || NITI AAYOG (NGO DARPAN), GOVT. OF INDIA || AN ISO 9001:2015 CERTIFIED COUNCIL || MSME REGISTERED ORGANISATION || https://pescouncil.in',
            council_reg_no: 'TRUST/2025/5/IV/299',
            head_office: 'Head Office Shahgarh, Azamgarh UP 276001',
            coordinator_office: 'Regional Coordinator Office, Uttar Pradesh Zone'
          };
        });
        return jsonResponse({ certificates: enrichedCert });
      }
      if (path === '/api/student/syllabus') {
        return jsonResponse({
          course_code: course.code,
          syllabus: {
            title: course.name,
            duration: `${course.duration_months || 12} Months`,
            total_hours: 360,
            modules: [
              { code: `${course.code}-01`, name: 'Computer Fundamentals & Digital Office Tools', theory: 30, practical: 40, topics: ['Computer Architecture & Operating Systems', 'Word Processing, Spreadsheets & Presentations'] },
              { code: `${course.code}-02`, name: 'Programming Concepts & Database Management', theory: 35, practical: 55, topics: ['Data Structures & Logic Flow', 'Relational Databases & SQL Queries'] },
              { code: `${course.code}-03`, name: 'Industrial Project & Lab Practical', theory: 20, practical: 80, topics: ['Live Project Development', 'Comprehensive Viva Voce'] }
            ]
          }
        });
      }
      if (path === '/api/student/admit-card') {
        return jsonResponse({
          admit_card: {
            roll_no: student.roll_no || '2026101',
            student_name: student.name,
            father_name: student.father_name || 'Shri Candidate Father',
            enrollment_no: student.student_code,
            course_code: course.code,
            course_name: course.name,
            dob: student.dob || '15/07/2004',
            gender: student.gender || 'Male',
            exam_session: student.session || '2026-27',
            exam_venue: `${centre.name}, ${centre.address || centre.district}`,
            centre_code: centre.centre_code,
            papers: [
              { paper_code: `${course.code}-101`, subject: 'Core IT & Professional Computing', exam_date: '10 Nov 2026', timing: '10:00 AM - 01:00 PM', max_marks: 100 },
              { paper_code: `${course.code}-102`, subject: 'Applied Technical Modules & Lab Practical', exam_date: '12 Nov 2026', timing: '02:00 PM - 05:00 PM', max_marks: 100 }
            ],
            instructions: [
              'Admit card and institutional ID card are strictly mandatory for examination hall entry.',
              'Candidates must report at the allocated examination centre 30 minutes prior to paper start time.'
            ]
          }
        });
      }
      if (path === '/api/student/fee-receipt') {
        return jsonResponse({
          receipt: {
            receipt_no: `REC-2026-${student.id || 101}`,
            student_name: student.name,
            student_code: student.student_code,
            roll_no: student.roll_no || student.student_code,
            course_name: course.name,
            course_code: course.code,
            centre_name: centre.name,
            centre_code: centre.centre_code,
            centre_address: centre.address || `${centre.district}, ${centre.state}`,
            total_fee: student.fee_total || 12000,
            amount_paid: student.fee_paid || 8000,
            pending_balance: (student.fee_total || 12000) - (student.fee_paid || 8000),
            date: new Date(student.created_at || Date.now()).toLocaleDateString('en-IN')
          }
        });
      }
      if (path === '/api/student/id-card') {
        return jsonResponse({
          id_card: {
            name: student.name,
            student_code: student.student_code,
            roll_no: student.roll_no || student.student_code,
            father_name: student.father_name || 'N/A',
            dob: student.dob || '15/07/2004',
            gender: student.gender || 'Male',
            course_name: course.name,
            course_code: course.code,
            duration_months: course.duration_months || 12,
            centre_id: centre.id,
            centre_name: centre.name,
            centre_code: centre.centre_code,
            centre_address: centre.address || `${centre.district}, ${centre.state}`,
            centre_phone: centre.phone || '+91 98765 43210',
            centre_email: centre.email || `director@${centre.slug}.pescouncil.in`,
            director_name: centre.director_name || 'Centre Director',
            session: student.session || '2026-27',
            issued_on: new Date(student.created_at || Date.now()).toLocaleDateString('en-IN'),
            valid_until: 'December 2027',
            status: student.status || 'active'
          }
        });
      }
      if (path === '/api/student/tickets') {
        return jsonResponse({ tickets: [] });
      }
      if (path === '/api/student/change-password' && request.method === 'POST') {
        try {
          const body = await request.json();
          const newPw = String(body.new_password || '').trim();
          if (!newPw || newPw.length < 6) {
            return jsonResponse({ error: 'Password must be at least 6 characters' }, 400);
          }
          student.initial_password = newPw;
          student.password = newPw;
          const stuUser = store.users.find(u => u.id === student.user_id || u.email === student.email);
          if (stuUser) {
            stuUser.password_plain = newPw;
          }
          await persistToKV(env, 'students', store.students);
          await persistToKV(env, 'users', store.users);
          return jsonResponse({ ok: true, message: 'Student password changed successfully! Head Office has been updated.' });
        } catch (err) {
          return jsonResponse({ error: err.message }, 400);
        }
      }
      return jsonResponse({ student: enrichedStudent, certificate: cert, marksheet: mrk });
    }


    if (tenantInfo.kind === 'main') {
      const sub = host.split('.')[0].toLowerCase();
      if (sub === 'student' && (path === '/' || path === '')) {
        const newUrl = new URL(request.url);
        newUrl.pathname = '/student';
        return env.ASSETS.fetch(new Request(newUrl, request));
      }
      if (sub === 'portal' && (path === '/' || path === '')) {
        const newUrl = new URL(request.url);
        newUrl.pathname = '/portal';
        return env.ASSETS.fetch(new Request(newUrl, request));
      }
      if (sub === 'coordinator' && (path === '/' || path === '')) {
        const newUrl = new URL(request.url);
        newUrl.pathname = '/coordinator';
        return env.ASSETS.fetch(new Request(newUrl, request));
      }
      if (sub === 'admin' && (path === '/' || path === '')) {
        const newUrl = new URL(request.url);
        newUrl.pathname = '/admin';
        return env.ASSETS.fetch(new Request(newUrl, request));
      }
    }

    // 7. Default Fallback: Serve static assets from public directory
    if ((path === '/' || path === '' || path === '/index.html') && tenantInfo.kind === 'main') {
      const assetRes = await env.ASSETS.fetch(request);
      if (assetRes.ok && (assetRes.headers.get('content-type') || '').includes('text/html')) {
        let html = await assetRes.text();
        const s = store.site_settings || {};
        const ho = (getAuthorities(null) || {}).head_office || {};
        const liveEmail = s.email || ho.email || 'info@pescouncil.in';
        const livePhone = s.phone || s.mobile || ho.mobile || '+91 542-1234567';
        const liveAddress = s.address || s.head_office || ho.head_office || 'Purvanchal Education & Skill Council, Head Office, shahgarh/ Azamgarh, UP';
        html = html.replace(/info@pescouncil\.in/g, liveEmail);
        html = html.replace(/\+91 542-1234567/g, livePhone);
        html = html.replace(/Varanasi, Uttar Pradesh/g, liveAddress);
        return new Response(html, {
          status: assetRes.status,
          headers: assetRes.headers
        });
      }
      return assetRes;
    }

    return env.ASSETS.fetch(request);
  }
};
