type TrustUser = {
  createdAt: Date | string;
  totalSales: number;
  totalReports: number;
};

export function calculateTrustScore(user: TrustUser) {

  const accountAge =
    (Date.now() - new Date(user.createdAt).getTime()) /
    (1000 * 60 * 60 * 24 * 365);

  let score =
    50 +
    user.totalSales * 3 +
    accountAge * 5 -
    user.totalReports * 4;

  score = Math.max(0, Math.min(100, score));

  return Math.round(score);
}