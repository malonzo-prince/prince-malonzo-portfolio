/** Best-effort protection per server instance; FormSubmit also filters abuse. */
export function createContactGuard({ limit = 5, windowMs = 600_000, now = Date.now } = {}) {
  const attempts = new Map<string, { count: number; expires: number }>();
  return (key: string) => {
    const timestamp = now();
    for (const [client, record] of attempts)
      if (record.expires <= timestamp) attempts.delete(client);
    const record = attempts.get(key);
    if (record && record.count >= limit)
      return Math.max(1, Math.ceil((record.expires - timestamp) / 1000));
    if (record) record.count += 1;
    else {
      if (attempts.size >= 2000) attempts.delete(attempts.keys().next().value!);
      attempts.set(key, { count: 1, expires: timestamp + windowMs });
    }
    return 0;
  };
}
