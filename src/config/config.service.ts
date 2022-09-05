import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  public get(key: string, throwOnMissing = true): string {
    const value = process.env[key] || this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`Configuration error - missing env.${key}`);
    }
    return value;
  }
}

const environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'local';
const envConfig = dotenv.parse(fs.readFileSync(`.env.${environment}`));
const configService = new ConfigService(envConfig);
export { configService };
