const { Resend } = require('resend');

class EmailService {
  constructor() {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY');
    }
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.fromAddress = `"Chat" <onboarding@resend.dev>`; // adjust as needed
  }


  async sendEmail(to, subject, html) {
    try {
      const result = await this.resend.emails.send({
        from: this.fromAddress,
        to,
        subject,
        html,
      });
      console.log('✅ Resend response:', result);
      return result;
    } catch (err) {
      console.error('❌ Resend send failed:', err);
      throw new Error('Failed to send email');
    }
  }

  async sendWelcomeEmail(email, name) {
    const message = `
  Welcome aboard, ${name}!  
  At ThisChat you can:<br>
  • Start private or group conversations  <br>
  • Share photos, videos, and voice notes  <br>
  • Customize your profile and status  <br>
  • Explore topic-based chat rooms  <br><br>

  If you ever need help, just reply to this email or visit our Help Center. Happy chatting!
`;
    const subject = 'Welcome to AjilChat 🎉';
    const html = `
      <h1>Hello ${name},</h1>
      <p>${message}</p>
      <p>— The AjilChat Team</p>
    `;
    return this.sendEmail(email, subject, html);
  }

  async sendOTPEmail(email, name, otp) {
    console.log(email, name, otp)
    const subject = 'Your OTP Code';
    const html = `
      <h1>Hi ${name},</h1>
      <p>Your OTP is <strong>${otp}</strong>. Do not share it with anyone.</p>
      <p>This code will expire in 10 minutes.</p>
      <p>— The AjilChat Team</p>
    `;
    return this.sendEmail(email, subject, html);
  }

  async sendPasswordResetEmail(email, name, token) {
    const subject = 'Reset Your Password';
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const html = `
      <h1>Hi ${name},</h1>
      <p>We received a request to reset your password. Click the link below to proceed:</p>
      <p><a href="${resetLink}">Reset Password</a></p>
      <p>If you didn’t request this, you can safely ignore this email.</p>
      <p>— The AjilChat Team</p>
    `;
    return this.sendEmail(email, subject, html);
  }
}

module.exports = new EmailService();
