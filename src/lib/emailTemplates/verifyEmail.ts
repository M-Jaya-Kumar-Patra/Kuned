export const verifyEmail = (name: string, pin: string) => `
  <h2>Email Verification</h2>
  <p>Hello ${name},</p>
  <p>Your verification PIN is:</p>
  <h1>${pin}</h1>
  <p>This PIN expires in 10 minutes.</p>
`;