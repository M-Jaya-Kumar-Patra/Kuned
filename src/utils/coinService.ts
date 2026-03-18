import User from "@/models/User";
import coinTransaction from "@/models/coinTransaction";

export async function spendCoins(
  userId: string,
  amount: number,
  source: string
) {

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  let remaining = amount;

  // Spend bonus coins first
  if (user.bonusCoins > 0) {

    const usedBonus = Math.min(user.bonusCoins, remaining);

    user.bonusCoins -= usedBonus;

    await coinTransaction.create({
      userId,
      amount: usedBonus,
      coinType: "bonus",
      transactionType: "spend",
      source
    });

    remaining -= usedBonus;
  }

  // Spend paid coins
  if (remaining > 0) {

    if (user.paidCoins < remaining) {
      throw new Error("Not enough coins");
    }

    user.paidCoins -= remaining;

    await coinTransaction.create({
      userId,
      amount: remaining,
      coinType: "paid",
      transactionType: "spend",
      source
    });
  }

  await user.save();

  return user;   // ⭐ ADD THIS
}


export async function earnCoins(
  userId: string,
  amount: number,
  coinType: "bonus" | "paid",
  source: string
) {

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (coinType === "bonus") {
    user.bonusCoins += amount;
  } else {
    user.paidCoins += amount;
  }

  await user.save();

  await coinTransaction.create({
    userId,
    amount,
    coinType,
    transactionType: "earn",
    source
  });
}