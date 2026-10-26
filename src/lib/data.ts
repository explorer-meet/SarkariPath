export type Exam = {
  id: string;
  name: string;
  organization: string;
  category: string;
  status: string;
  dateLabel: string;
  dateDetail: string;
  verified: boolean;
  sourceLabel: string;
  sourceUrl: string;
  isDemo: boolean;
};

export type StudyMaterial = {
  id: string;
  title: string;
  subject: string;
  detail: string;
  content: string;
  type: string;
  duration: string;
  premium: boolean;
  isDemo: boolean;
};

export const demoNotice = "Demo content - always confirm details with the official source";
