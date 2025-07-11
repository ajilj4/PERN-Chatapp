
const axios = require('axios');

class EmailService {
  constructor() {
    this.serviceId = process.env.EMAILJS_SERVICE_ID;
    this.templateId = process.env.EMAILJS_UNIVERSAL_TEMPLATE_ID;
    this.publicKey = process.env.EMAILJS_PUBLIC_KEY;
  }

  async sendEmail(templateParams) {
    try {
      const payload = {
        service_id: this.serviceId,
        template_id: this.templateId,
        user_id: this.publicKey,
        template_params: templateParams,
      };

      const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('EmailJS Axios send failed:', error.response?.data || error.message);
      throw new Error('Failed to send email');
    }
  }

  async sendWelcomeEmail(email, name, message) {
    return await this.sendEmail({
      name,
      email,
      title: 'Welcome to AjilChat 🎉',
      message,
      optional_link: '',
      company_name: 'AjilChat',
    });
  }

  async sendOTPEmail(email, name, otp) {
    return await this.sendEmail({
      name,
      email,
      title: 'Your OTP Code',
      message: `Your OTP is <strong>${otp}</strong>. Do not share it with anyone.`,
      optional_link: '',
      company_name: 'AjilChat',
    });
  }

  async sendPasswordResetEmail(email, name, token) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const optional_link = `
      <div class="optional-link">
        <a href="${resetLink}">Reset Password</a>
      </div>`;

    return await this.sendEmail({
      name,
      email,
      title: 'Reset Your Password',
      message: `We received a request to reset your password. If you didn’t request this, you can ignore this email.`,
      optional_link,
      company_name: 'AjilChat',
    });
  }
}

module.exports = new EmailService();
