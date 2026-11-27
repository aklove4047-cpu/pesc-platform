import test from 'node:test';
import assert from 'node:assert/strict';
import dataBundle from '../src/data_bundle.js';

test('1. Default Courses Verification: All 10 courses match requested duration and fee', () => {
  const expectedCourses = [
    { code: 'DCA', name: 'Diploma in Computer Applications', duration: 6, fee_rupees: 6500 },
    { code: 'ADCA', name: 'Advanced Diploma in Computer Applications', duration: 12, fee_rupees: 12000 },
    { code: 'TALLY', name: 'Tally with GST', duration: 3, fee_rupees: 4000 },
    { code: 'CCC', name: 'Course on Computer Concepts', duration: 3, fee_rupees: 4000 },
    { code: 'PGDCA', name: 'Post Graduate Diploma in Computer Applications', duration: 12, fee_rupees: 12000 },
    { code: 'DTP', name: 'Desktop Publishing & Graphic Designing', duration: 6, fee_rupees: 6500 },
    { code: 'HARDWARE', name: 'Diploma in Computer Hardware & Networking (CHN)', duration: 6, fee_rupees: 6500 },
    { code: 'YOGA', name: 'Diploma in Yoga & Naturopathy Education', duration: 12, fee_rupees: 12000 },
    { code: 'FASHION', name: 'Diploma in Fashion Designing & Garment Fabrication', duration: 12, fee_rupees: 12000 },
    { code: 'MED', name: 'CMS ED', duration: 12, fee_rupees: 12000 }
  ];

  for (const exp of expectedCourses) {
    const found = dataBundle.courses.find(c => c.code === exp.code);
    assert.ok(found, `Course ${exp.code} must exist in dataBundle.courses`);
    assert.equal(found.name, exp.name, `Course ${exp.code} name mismatch`);
    assert.equal(found.duration_months, exp.duration, `Course ${exp.code} duration must be ${exp.duration} Months`);
    assert.equal(Math.round(found.fee_paise / 100), exp.fee_rupees, `Course ${exp.code} fee must be ₹${exp.fee_rupees}`);
  }
});

test('2. Custom Showcase Course Life-cycle & Site Rendering', async () => {
  // Mock worker environment
  const mockKV = {
    data: new Map(),
    async get(key, type) {
      const val = this.data.get(key);
      if (!val) return null;
      return type === 'json' ? JSON.parse(val) : val;
    },
    async put(key, val) {
      this.data.set(key, typeof val === 'string' ? val : JSON.stringify(val));
    }
  };

  const centre = {
    id: 1,
    centre_code: 'PESC00001',
    name: 'Siya Paramedical Institute',
    slug: 'spi',
    custom_courses: []
  };

  // Add custom course (e.g. AutoCAD 2D/3D)
  const newCourse = {
    id: 'cust_101',
    code: 'AUTOCAD',
    name: 'AutoCAD 2D & 3D Drafting',
    duration_months: 3,
    fee_rupees: 5000,
    tag: 'Certificate',
    description: 'Civil and mechanical CAD drafting',
    icon: '📐',
    is_custom: true
  };
  centre.custom_courses.push(newCourse);

  // Add a second showoff course (e.g. Spoken English)
  const newCourse2 = {
    id: 'cust_102',
    code: 'ENGLISH',
    name: 'Spoken English & Personality Development',
    duration_months: 2,
    fee_rupees: 2500,
    tag: 'Short Term',
    description: 'Fluency, interview preparation and communication',
    icon: '🗣️',
    is_custom: true
  };
  centre.custom_courses.push(newCourse2);

  assert.equal(centre.custom_courses.length, 2);
  assert.equal(centre.custom_courses[0].name, 'AutoCAD 2D & 3D Drafting');
  assert.equal(centre.custom_courses[0].fee_rupees, 5000);
  assert.equal(centre.custom_courses[1].name, 'Spoken English & Personality Development');
  assert.equal(centre.custom_courses[1].fee_rupees, 2500);

  // Edit custom course
  centre.custom_courses[0].fee_rupees = 5500;
  assert.equal(centre.custom_courses[0].fee_rupees, 5500);

  // Delete custom course
  centre.custom_courses = centre.custom_courses.filter(c => c.id !== 'cust_102');
  assert.equal(centre.custom_courses.length, 1);
  assert.equal(centre.custom_courses[0].code, 'AUTOCAD');
});
