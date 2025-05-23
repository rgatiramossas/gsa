#!/usr/bin/env node
import { execSync } from 'child_process';

console.log('Iniciando servidor com banco de dados MySQL externo...');
try {
  execSync('NODE_ENV=development tsx server/index-mysql.ts', { stdio: 'inherit' });
} catch (error) {
  console.error('Erro ao iniciar o servidor:', error);
  process.exit(1);
}