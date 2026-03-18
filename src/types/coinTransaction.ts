export type CoinTransaction = {
  _id: string
  userId: string
  amount: number
  coinType: "bonus" | "paid"
  transactionType: "earn" | "spend"
  source: string
  createdAt?: string
  updatedAt?: string
}