export const timeSince = (date: number): string => {
  // @ts-ignore
  const seconds = Math.floor((Date.now() - date) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return `${Math.floor(interval)} years ago`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return `${Math.floor(interval)} months ago`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return `${Math.floor(interval)}d ago`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return `${Math.floor(interval)}h ago`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    return `${Math.floor(interval)}m ago`;
  }

  const secondsAgo = Math.floor(seconds);

  if (secondsAgo < 10) {
    return "just now";
  }

  return `${secondsAgo}s ago`;
};
