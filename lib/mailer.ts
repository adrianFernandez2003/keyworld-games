import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendCodeEmail(to: string, code: string) {
  try {
    const data = await resend.emails.send({
      from: 'Keyworld Games <no-reply@keyworldgames.com>',
      to,
      subject: '¡Tu código de Keyworld Games 🎮!',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>🎮 ¡Gracias por tu compra en Keyworld Games!</h2>
          <p>Este es tu código único para canjear:</p>
          <div style="padding: 20px; background: #f4f4f4; border-radius: 8px; display: inline-block;">
            <h1 style="color: #4CAF50; letter-spacing: 2px;">${code}</h1>
          </div>
          <p>Por favor, guarda este código en un lugar seguro.</p>
          <p>¡Disfruta tu juego y gracias por confiar en nosotros!</p>
          <hr/>
          <p style="font-size: 12px; color: #888;">Este es un correo automático, no respondas a este mensaje.</p>
        </div>
      `,
    });

    console.log('✅ Email enviado correctamente:', data);
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    throw new Error('Error enviando el correo.');
  }
}
