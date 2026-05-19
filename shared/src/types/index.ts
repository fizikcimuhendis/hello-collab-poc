/**
 * Shared type definitions for HelloCollab
 */

export interface TabContext {
  theme: 'default' | 'dark' | 'contrast';
  teamId: string;
  channelId: string;
  userId: string;
}

export interface MessageExtensionRequest {
  commandId: string;
  parameters: Record<string, string>;
  botMessagePreviewAction?: string;
}

export interface GraphPermission {
  scope: string;
  type: 'delegated' | 'application';
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  justification: string;
}

export interface DemoScenario {
  title: string;
  description: string;
  steps: string[];
  expectedOutcome: string;
}
