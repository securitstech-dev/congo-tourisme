import { Injectable } from '@nestjs/common';
import { PaymentProvider, PaymentResponse } from './payment-provider.interface';

@Injectable()
export class AirtelMomoProvider implements PaymentProvider {
  async processPayment(amount: number, phoneNumber: string, description: string): Promise<PaymentResponse> {
    console.log(`Processing Airtel Money payment of ${amount} FCFA for ${phoneNumber}`);
    
    // Simuler un appel API Airtel
    return {
      success: true,
      transactionId: `AIRTEL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      message: 'Demande de paiement Airtel Money envoyée.',
      status: 'PENDING',
    };
  }

  async checkStatus(transactionId: string): Promise<PaymentResponse> {
    // Simuler la vérification du statut
    return {
      success: true,
      transactionId,
      message: 'Paiement Airtel Money confirmé.',
      status: 'SUCCESS',
    };
  }
}
