const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function retry<T>(
    fn: () => Promise<T>,
    label: string,
    maxAttempts = 10,
    baseDelay = 5_000,
): Promise<T> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (err: any) {
            const delay = Math.min(baseDelay * 2 ** (attempt - 1), 60_000);

            if (attempt === maxAttempts) {
                console.error(`[${label}] Failed after ${maxAttempts} attempts.`);
                throw err;
            }

            console.warn(`[${label}] Attempt ${attempt} failed: ${err.message ?? err}. Retrying in ${delay / 1000}s...`);
            await wait(delay);
        }
    }

    throw new Error('Unreachable');
}
