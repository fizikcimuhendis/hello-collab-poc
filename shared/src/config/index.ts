/**
 * Configuration loader for HelloCollab applications
 */
import * as dotenv from 'dotenv';

dotenv.config();

export interface AppConfig {
  env: string;
  port: number;
  clientId: string;
  clientSecret: string;
  tenantId: string;
  botId: string;
  botPassword: string;
  teamsAppId: string;
}

export function loadConfig(): AppConfig {
  const requiredVars = [
    'CLIENT_ID',
    'CLIENT_SECRET',
    'TENANT_ID',
    'BOT_ID',
    'BOT_PASSWORD',
    'TEAMS_APP_ID',
  ];

  const missing = requiredVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!,
    tenantId: process.env.TENANT_ID!,
    botId: process.env.BOT_ID!,
    botPassword: process.env.BOT_PASSWORD!,
    teamsAppId: process.env.TEAMS_APP_ID!,
  };
}
