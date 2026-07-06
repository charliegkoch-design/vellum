/**
 * Bayesian weighted rating: (v·R + m·C) / (v + m)
 * where v = number of votes, R = book's mean, C = site-wide mean,
 * m = minimum votes for confidence. Keeps a single 5-star vote from
 * out-ranking a well-loved book with 40 ratings.
 */
export const CONFIDENCE_VOTES = 4;

export function weightedScore(mean: number, votes: number, siteMean: number): number {
  if (votes === 0) return 0;
  return (votes * mean + CONFIDENCE_VOTES * siteMean) / (votes + CONFIDENCE_VOTES);
}

export function formatScore(n: number): string {
  return n.toFixed(2);
}

export function formatMean(n: number): string {
  return (Math.round(n * 10) / 10).toFixed(1);
}
