import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const exams = [
  {
    id: "demo-ssc-cgl",
    name: "Combined Graduate Level",
    organization: "Staff Selection Commission",
    category: "SSC",
    status: "Coming soon",
    dateLabel: "Dates to be announced",
    dateDetail: "Check the official notice before making plans.",
    verified: false,
    sourceLabel: "Official SSC website",
    sourceUrl: "https://ssc.gov.in/",
    isDemo: true,
  },
  {
    id: "demo-upsc-cse",
    name: "Civil Services Examination",
    organization: "Union Public Service Commission",
    category: "UPSC",
    status: "Notification",
    dateLabel: "Sample listing",
    dateDetail: "Demo entry — official dates have not been added.",
    verified: false,
    sourceLabel: "Official UPSC website",
    sourceUrl: "https://upsc.gov.in/",
    isDemo: true,
  },
  {
    id: "demo-ibps-po",
    name: "Probationary Officers",
    organization: "Institute of Banking Personnel Selection",
    category: "Banking",
    status: "Applications open",
    dateLabel: "Sample listing",
    dateDetail: "Demo entry — verify dates with the recruiting body.",
    verified: false,
    sourceLabel: "Official IBPS website",
    sourceUrl: "https://www.ibps.in/",
    isDemo: true,
  },
];

const materials = [
  {
    id: "constitution-basics",
    title: "The Constitution: a quick revision",
    subject: "Indian Polity",
    detail: "Fundamental rights, duties and key terms",
    content: [
      "Fundamental Rights\nPart III of the Constitution of India contains Fundamental Rights. These include equality, freedom, protection against exploitation, freedom of religion, cultural and educational rights, and constitutional remedies.",
      "Directive Principles\nPart IV sets out the Directive Principles of State Policy. They guide lawmaking and governance but are not enforceable by courts in the same way as Fundamental Rights.",
      "Fundamental Duties\nArticle 51A in Part IVA lists Fundamental Duties. Examples include respecting the Constitution and protecting the natural environment.",
      "Quick check\nWhere are Fundamental Rights found? Part III.\nWhere are Directive Principles found? Part IV.\nWhere are Fundamental Duties found? Part IVA.",
    ].join("\n\n"),
    type: "Notes",
    duration: "12 min read",
    premium: false,
    isDemo: true,
  },
  {
    id: "number-series",
    title: "Number series: learn the patterns",
    subject: "Quantitative aptitude",
    detail: "Worked examples with a short practice set",
    content: [
      "A method for number series\nCompare consecutive terms. Check differences, ratios, squares, and alternating patterns before choosing an answer.",
      "Worked example\n2, 5, 10, 17, 26, ?\nThe differences are 3, 5, 7, 9. The next difference is 11, so the next term is 37.",
      "Practice: find the next term\n1. 4, 8, 12, 16, ?\n2. 3, 6, 12, 24, ?\n3. 1, 4, 9, 16, ?\n4. 2, 5, 10, 17, ?\n5. 81, 27, 9, ?\n6. 7, 14, 21, 28, ?\n7. 1, 3, 6, 10, ?\n8. 5, 10, 20, 40, ?\n9. 10, 20, 35, 55, ?\n10. 100, 90, 80, 70, ?\n11. 2, 6, 18, 54, ?\n12. 1, 8, 27, 64, ?\n13. 50, 45, 40, 35, ?\n14. 2, 4, 8, 14, ?\n15. 1, 2, 4, 7, 11, ?",
      "Answers and patterns\n1. 20 (+4)\n2. 48 (multiply by 2)\n3. 25 (squares)\n4. 26 (differences 3, 5, 7, 9)\n5. 3 (divide by 3)\n6. 35 (+7)\n7. 15 (differences 2, 3, 4, 5)\n8. 80 (multiply by 2)\n9. 80 (differences 10, 15, 20, 25)\n10. 60 (-10)\n11. 162 (multiply by 3)\n12. 125 (cubes)\n13. 30 (-5)\n14. 22 (differences 2, 4, 6, 8)\n15. 16 (differences 1, 2, 3, 4, 5)",
    ].join("\n\n"),
    type: "Practice",
    duration: "15 questions",
    premium: false,
    isDemo: true,
  },
  {
    id: "daily-brief",
    title: "Your daily revision brief",
    subject: "General awareness",
    detail: "A sample capsule for your daily study routine",
    content: [
      "Demo revision brief - not current news\nThis is an illustrative revision template, not a live current-affairs feed. The PRO badge is a preview label only; this demo content is available without payment.",
      "Today's revision routine\nChoose one verified report from an official institution. Record the date, institution, subject, and three key facts. Separate confirmed facts from commentary.",
      "Connect the topic to the syllabus\nFor an economy report, review the meaning of inflation and the role of the Reserve Bank of India. For an environment report, revise biodiversity and conservation.",
      "Recall exercise\nClose the source and write a two-sentence summary. Reopen it to check your facts. Do not treat these example prompts as recent announcements.",
    ].join("\n\n"),
    type: "Current affairs",
    duration: "8 min read",
    premium: true,
    isDemo: true,
  },
  {
    id: "reading-comprehension",
    title: "Reading comprehension: build a method",
    subject: "English",
    detail: "A repeatable approach to passages and questions",
    content: [
      "A repeatable reading method\nRead the question, identify the passage's main idea, then locate supporting evidence. Distinguish what the author states from what you assume.",
      "Practice passage\nA village library began opening for an extra hour each evening. Volunteers helped readers find books and kept a weekly record of visits. After two months, evening visits increased. The librarian noted that this change did not prove that longer hours alone caused the increase; the volunteers may also have helped.",
      "Questions\n1. What change did the library make?\n2. Who helped readers find books?\n3. What did volunteers record?\n4. How long was the observation period?\n5. What happened to evening visits?\n6. Did the librarian claim proof of a single cause?\n7. What other factor may have helped?\n8. Is the passage mainly about a library or a hospital?\n9. Does the passage give an exact visitor count?\n10. What is a suitable title?",
      "Suggested answers\n1. It opened for an extra evening hour.\n2. Volunteers.\n3. Weekly visits.\n4. Two months.\n5. They increased.\n6. No.\n7. Help from volunteers.\n8. A library.\n9. No; do not invent a number.\n10. Longer Library Hours and Reader Visits.",
    ].join("\n\n"),
    type: "Practice",
    duration: "10 questions",
    premium: false,
    isDemo: true,
  },
];

const questions = [
  {
    id: "constitution",
    prompt: "Which part of the Constitution of India contains the Fundamental Rights?",
    explanation: "Fundamental Rights are set out in Part III of the Constitution of India.",
    options: ["Part II", "Part III", "Part IV", "Part IVA"],
    correctIndex: 1,
  },
  {
    id: "parliament",
    prompt: "A Money Bill can be introduced in which House of Parliament?",
    explanation: "A Money Bill can be introduced only in the Lok Sabha, on the President's recommendation.",
    options: ["Lok Sabha only", "Rajya Sabha only", "Either House", "A joint sitting only"],
    correctIndex: 0,
  },
  {
    id: "directive-principles",
    prompt: "The Directive Principles of State Policy are contained in:",
    explanation: "The Directive Principles of State Policy are contained in Part IV.",
    options: ["Part II", "Part III", "Part IV", "Part V"],
    correctIndex: 2,
  },
];

async function main() {
  for (const exam of exams) {
    await prisma.exam.upsert({
      where: { id: exam.id },
      update: exam,
      create: exam,
    });
  }

  for (const material of materials) {
    await prisma.studyMaterial.upsert({
      where: { id: material.id },
      update: material,
      create: material,
    });
  }

  for (const { options, correctIndex, ...question } of questions) {
    await prisma.quizQuestion.upsert({
      where: { id: question.id },
      update: {
        ...question,
        isDemo: true,
        options: {
          deleteMany: {},
          create: options.map((label, sortOrder) => ({
            id: `${question.id}-option-${sortOrder + 1}`,
            label,
            sortOrder,
            isCorrect: sortOrder === correctIndex,
          })),
        },
      },
      create: {
        ...question,
        isDemo: true,
        options: {
          create: options.map((label, sortOrder) => ({
            id: `${question.id}-option-${sortOrder + 1}`,
            label,
            sortOrder,
            isCorrect: sortOrder === correctIndex,
          })),
        },
      },
    });
  }

  console.log(`Seeded ${exams.length} demo exams, ${materials.length} study materials, and ${questions.length} quiz questions.`);
}

main()
  .catch((error) => {
    console.error("Database seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
