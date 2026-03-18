export const withdrawalEmail = ({
  name,
  email,
  amount,
  bankName,
  accountNumber,
  ifsc,
  accountHolderName,
}: {
  name: string;
  email: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  accountHolderName: string;
}) => {
  return `
    <h2>🚨 New Withdrawal Request</h2>

    <p><strong>User:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>

    <hr/>

    <p><strong>Amount:</strong> ₹${amount}</p>

    <h3>Bank Details</h3>
    <p><strong>Account Holder:</strong> ${accountHolderName}</p>
    <p><strong>Bank Name:</strong> ${bankName}</p>
    <p><strong>Account Number:</strong> ${accountNumber}</p>
    <p><strong>IFSC:</strong> ${ifsc}</p>

    <hr/>
    <p>⚠️ Please process manually.</p>
  `;
};