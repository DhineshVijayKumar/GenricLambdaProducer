const logEvents = (status: string, data?: any) => {
    console.log(`STATUS: ${status} | ${new Date().toISOString()} ${data ? ' | DATA: ' + JSON.stringify(data) : ''}`);
};

export { logEvents };
