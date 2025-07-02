import { EnvVarNotConfiguredError } from '../exceptions/envVariableError';

const getEnv = (key: string) => {
    const value = process.env[key];
    if (!value) {
        throw new EnvVarNotConfiguredError(`Environment variable ${key} is not set`);
    }
    return value;
};

export const webhookUrl = (): string => getEnv('WebhookUrl');
export const logLevel = () => getEnv('LOG_LEVEL');
