import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: `"Congo Tourisme" <${this.configService.get('MAIL_FROM')}>`,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Email sending failed:', error);
    }
  }

  async sendWelcomeEmail(email: string, name: string) {
    const subject = 'Bienvenue sur Congo Tourisme !';
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 12px;">
        <h1 style="color: #1A6B4A;">Bienvenue, ${name} !</h1>
        <p>Nous sommes ravis de vous compter parmi nous sur <strong>Congo Tourisme</strong>, la plateforme officielle pour découvrir le cœur de l'Afrique.</p>
        <p>Commencez dès maintenant à explorer nos offres et préparez votre prochain voyage.</p>
        <div style="margin-top: 30px;">
          <a href="${this.configService.get('FRONTEND_URL')}/explore" style="background: #1A6B4A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Explorer les offres</a>
        </div>
        <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">Securits Tech - Pointe-Noire, République du Congo</p>
      </div>
    `;
    await this.sendMail(email, subject, html);
  }

  async sendBookingConfirmation(email: string, bookingId: string, listingTitle: string, amount: number) {
    const subject = 'Confirmation de votre réservation - Congo Tourisme';
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 12px;">
        <h2 style="color: #1A6B4A;">Votre réservation est confirmée !</h2>
        <p>Merci pour votre confiance. Voici le récapitulatif de votre réservation :</p>
        <div style="background: #f9faf8; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Établissement :</strong> ${listingTitle}</p>
          <p><strong>Référence :</strong> ${bookingId}</p>
          <p><strong>Montant payé :</strong> ${amount.toLocaleString()} FCFA</p>
        </div>
        <p>L'opérateur a été notifié et prépare votre accueil.</p>
        <p style="margin-top: 30px;">Bon séjour au Congo !</p>
      </div>
    `;
    await this.sendMail(email, subject, html);
  }
}
