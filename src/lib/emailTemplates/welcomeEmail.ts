export function welcomeEmail(name: string) {

  return `
    <div style="font-family: Arial, sans-serif">

      <h2>Welcome to Kuned 🎉</h2>

      <p>Hello ${name},</p>

      <p>Your account has been created successfully.</p>

      <p>You can now start buying and selling items.</p>

      <br/>

      <p>Best regards,<br/>Kuned Team</p>

    </div>
  `;

}