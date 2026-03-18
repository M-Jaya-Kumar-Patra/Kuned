export function passwordChangedEmail(name: string) {

  return `
    <div style="font-family: Arial, sans-serif">

      <h2>Password Changed Successfully</h2>

      <p>Hello ${name},</p>

      <p>Your password was changed successfully.</p>

      <p>If you did not make this change, please reset your password immediately.</p>

      <br/>

      <p>Kuned Security Team</p>

    </div>
  `;

}