import nodemailer from "nodemailer";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

// Create transporter for nodemailer
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Generate unsubscribe token
export const generateUnsubscribeToken = (email) => {
  const secret = process.env.NEWSLETTER_SUBSCRIBE_SECRET;
  return crypto.createHmac("sha256", secret).update(email).digest("hex");
};

// Send subscription confirmation email
export const sendConfirmationEmail = async (email, unsubscribeLink) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Gamify Team" <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: "Welcome to Gamify! Level Up Your Productivity - 🎮 ",
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Gamify</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f9fafb;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header with gradient -->
        <div style="background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Welcome to Gamify!</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0; font-size: 16px;">Where Productivity Meets Play</p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 30px 20px;">
            <!-- Welcome Message -->
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="background-color: #f3f4f6; border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 40px;">🎯</span>
                </div>
                <h2 style="color: #1f2937; margin: 0 0 15px; font-size: 24px;">Ready to Level Up?</h2>
                <p style="color: #6b7280; line-height: 1.6; margin: 0;">
                    Thank you for joining our community of productivity champions. You've just taken the first step toward transforming your workflow into an engaging adventure!
                </p>
            </div>
            
            <!-- Benefits Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px;">
                <div style="background-color: #fdf2f8; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; margin-bottom: 10px;">🏆</div>
                    <h3 style="color: #1f2937; margin: 0 0 8px; font-size: 16px;">Earn Achievements</h3>
                    <p style="color: #6b7280; margin: 0; font-size: 14px;">Unlock badges as you complete tasks</p>
                </div>
                <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; margin-bottom: 10px;">📊</div>
                    <h3 style="color: #1f2937; margin: 0 0 8px; font-size: 16px;">Track Progress</h3>
                    <p style="color: #6b7280; margin: 0; font-size: 14px;">Visual analytics for your productivity journey</p>
                </div>
                <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; margin-bottom: 10px;">🤝</div>
                    <h3 style="color: #1f2937; margin: 0 0 8px; font-size: 16px;">Join Challenges</h3>
                    <p style="color: #6b7280; margin: 0; font-size: 14px;">Compete with our community</p>
                </div>
                <div style="background-color: #fffbeb; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; margin-bottom: 10px;">🎁</div>
                    <h3 style="color: #1f2937; margin: 0 0 8px; font-size: 16px;">Exclusive Content</h3>
                    <p style="color: #6b7280; margin: 0; font-size: 14px;">Tips, tricks, and early access</p>
                </div>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin-bottom: 30px;">
                <a href="https://yourgamifyapp.com/dashboard" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                    Start Your Journey
                </a>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
            <p style="color: #6b7280; margin: 0 0 15px; font-size: 14px;">
                You're receiving this email because you signed up for updates from Gamify.
            </p>
            <div style="margin-bottom: 15px;">
                <a href="${unsubscribeLink}" style="color: #ef4444; text-decoration: none; font-size: 14px;">
                    Unsubscribe from our newsletter
                </a>
            </div>
            <div style="margin-bottom: 15px;">
                <a href="https://twitter.com/gamify" style="display: inline-block; margin: 0 10px;"><span style="font-size: 20px;">🐦</span></a>
                <a href="https://discord.gg/gamify" style="display: inline-block; margin: 0 10px;"><span style="font-size: 20px;">🎮</span></a>
                <a href="https://github.com/gamify" style="display: inline-block; margin: 0 10px;"><span style="font-size: 20px;">💻</span></a>
            </div>
            <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                &copy; ${new Date().getFullYear()} Gamify Platform. All rights reserved.<br>
                123 Productivity Lane, Suite 456, San Francisco, CA 94107
            </p>
        </div>
    </div>
</body>
</html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
};

// Send newsletter to all subscribers
export const sendBulkNewsletter = async (
  subscribers,
  subject,
  content,
  unsubscribeLinkGenerator
) => {
  const transporter = createTransporter();

  for (const subscriber of subscribers) {
    const unsubscribeLink = unsubscribeLinkGenerator(subscriber.email);

    const mailOptions = {
      from: `"Gamify Team" <${process.env.EMAIL_USERNAME}>`,
      to: subscriber.email,
      subject: subject,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gamify Newsletter</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f9fafb;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); padding: 25px 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">Gamify Update</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0; font-size: 14px;">Your Monthly Productivity Adventure</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px 20px;">
            ${content}
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
            <p style="color: #6b7280; margin: 0 0 15px; font-size: 14px;">
                You're receiving this email because you subscribed to Gamify newsletter.
            </p>
            <a href="${unsubscribeLink}" style="color: #ef4444; text-decoration: none; font-size: 14px;">
                Unsubscribe
            </a>
            <p style="color: #9ca3af; margin: 15px 0 0; font-size: 12px;">
                &copy; ${new Date().getFullYear()} Gamify Platform
            </p>
        </div>
    </div>
</body>
</html>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(`Failed to send to ${subscriber.email}:`, error);
    }
  }
};
