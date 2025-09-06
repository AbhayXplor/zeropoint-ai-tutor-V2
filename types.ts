
export interface Assumption {
  assumption_id: string;
  assumption_text: string;
  prerequisite_concept: string;
  severity: 'Critical' | 'Helpful' | 'Advanced';
  explanation: string;
  confidence_score: number;
}

export interface Dependency {
  from: string;
  to: string;
  relationship: string;
}

export interface KnowledgeMap {
  target_concept: string;
  direct_prerequisites: string[];
  indirect_prerequisites: string[];
  dependency_chain: Dependency[];
}

export interface MicroLesson {
  prerequisite: string;
  title: string;
  duration: string;
  content: string;
  practice_question: string;
  practice_answer: string;
}

export interface GapTest {
  prerequisite: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface ZeroPointResponse {
  original_content: string;
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
  assumptions_detected: Assumption[];
  knowledge_map: KnowledgeMap;
  micro_lessons: MicroLesson[];
  gap_tests: GapTest[];
  learning_path: string[];
}