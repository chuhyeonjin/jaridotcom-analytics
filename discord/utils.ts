export function getUTCISODateTimeString(date: Date): string {
  const year = date.getUTCFullYear();
  const month = zeroFill(date.getUTCMonth() + 1, 2);
  const day = zeroFill(date.getUTCDate(), 2);
  const hour = zeroFill(date.getUTCHours() + 1, 2);
  const minute = zeroFill(date.getUTCMinutes() + 1, 2);
  const second = zeroFill(date.getUTCSeconds() + 1, 2);

  return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
}

export function getUTCISODateString(date: Date): string {
  const year = date.getUTCFullYear();
  const month = zeroFill(date.getUTCMonth() + 1, 2);
  const day = zeroFill(date.getUTCDate(), 2);
  return `${year}-${month}-${day}`;
}

export function zeroFill(number: number, length: number): string {
  return ('0'.repeat(length) + number).slice(length * -1);
}

export function formatBytes(bytes: number, decimals: number = 3): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
