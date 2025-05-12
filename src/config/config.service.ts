import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

export class ConfigService {
  private readonly envConfig: Record<string, string>;

  constructor() {
    const envFile = '.env';
    const envPath = path.resolve(process.cwd(), envFile);
    
    this.envConfig = {} as Record<string, string>;
    
    // Copier les variables d'environnement du processus
    for (const key in process.env) {
      if (process.env[key] !== undefined) {
        this.envConfig[key] = process.env[key] as string;
      }
    }
    
    // Essayer de charger depuis le fichier .env si disponible
    try {
      if (fs.existsSync(envPath)) {
        const envFileContent = dotenv.parse(fs.readFileSync(envPath));
        for (const key in envFileContent) {
          this.envConfig[key] = envFileContent[key];
        }
      }
    } catch (e) {
      console.warn(`Impossible de charger le fichier .env: ${e.message}`);
    }
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  get jwtSecret(): string {
    return this.get('JWT_SECRET') || 'default_jwt_secret';
  }

  get jwtExpires(): string {
    return this.get('JWT_EXPIRES') || '1d';
  }

  get dbHost(): string {
    return this.get('DB_HOST') || 'localhost';
  }

  get dbPort(): number {
    return parseInt(this.get('DB_PORT') || '3306', 10);
  }

  get dbUser(): string {
    return this.get('DB_USER') || 'root';
  }

  get dbPassword(): string {
    return this.get('DB_PASSWORD') || '';
  }

  get dbName(): string {
    return this.get('DB_NAME') || 'qvema_db';
  }
} 