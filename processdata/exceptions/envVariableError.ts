class EnvVarNotConfiguredError extends Error {
    constructor(message?: string) {
        super(message || 'Environment variable is not configured');
        this.name = 'EnvVarNotConfiguredError';
        Object.setPrototypeOf(this, EnvVarNotConfiguredError.prototype);
    }
}

export { EnvVarNotConfiguredError };