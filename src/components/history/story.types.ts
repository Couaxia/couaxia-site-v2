export type StoryCharacter = "couaxia" | "hylda" | "cita" | "natsu" | "myo" | "avadora";

export interface StoryTextBlock { type: "text"; text: string; }
export interface StoryImportantBlock { type: "important"; text: string; }
export interface StoryDialogueBlock {
  type: "dialogue";
  character: StoryCharacter;
  name: string;
  lines: string[];
}
export type StoryContent = StoryTextBlock | StoryImportantBlock | StoryDialogueBlock;

export interface StoryPage {
  id: string;
  title?: string;
  subtitle?: string;
  content: StoryContent[];
  image?: string;
  imageAlt?: string;
  messages: string[];
}

export interface StoryAnnexePage {
  id: string;
  title?: string;
  subtitle?: string;
  content: StoryContent[];
  image?: string;
  imageAlt?: string;
}

export interface StoryAnnexe {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  icon: string;
  pages: StoryAnnexePage[];
  messages: string[];
}

export interface StoryChapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
  pages: StoryPage[];
  annexes?: StoryAnnexe[];
}
