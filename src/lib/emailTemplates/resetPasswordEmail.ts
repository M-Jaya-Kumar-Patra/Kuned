export function resetPasswordEmail(resetUrl: string) {

  return `
    <div style="font-family: Arial">

      <h2>Reset Your Password</h2>

      <p>Click the link below to reset your password:</p>

      <a href="${resetUrl}">
        Reset Password
      </a>

      <p>This link expires in 15 minutes.</p>

    </div>
  `;

}