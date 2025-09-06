export interface CreateResearchDocument {
  projectId: string;

  title: string;

  content: string;

  tags?: string[];
}
