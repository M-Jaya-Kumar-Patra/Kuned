import User from "@/models/User";

export async function rewardReferral(referralCode: string) {

  const referrer = await User.findOne({
    referralCode
  });

  if (!referrer) return;

  referrer.bonusCoins += 5;

  await referrer.save();
}