export function loginAlertEmail(name: string) {

  return `
    <div style="font-family: Arial, sans-serif">

      <h2>New Login Detected</h2>

      <p>Hello ${name},</p>

      <p>Your account was just logged in successfully.</p>

      <p>If this was you, you can safely ignore this email.</p>

      <p>If you did NOT login, please reset your password immediately.</p>

      <br/>

      <p>Kuned Security Team</p>

    </div>
  `;

}