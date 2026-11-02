
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendResetEmailParams {
  email: string;
  resetUrl: string;
}

export async function sendResetPasswordEmail({
  email,
  resetUrl,
}: SendResetEmailParams) {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: "Reset your Forge password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
        <h2>Reset your Forge password</h2>

        <p>We received a request to reset your password.</p>

        <p>Click the button below to create a new password:</p>

        <a
          href="${resetUrl}"
          style="
            display: inline-block;
            padding: 12px 24px;
            background-color: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 6px;
          "
        >
          Reset Password
        </a>

        <p>This link expires in 15 minutes.</p>

        <p>If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    console.error("RESEND_EMAIL_ERROR:", error);
    throw new Error("Failed to send password reset email");
  }

  return data;
}
