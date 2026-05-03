import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseStorageService {
  private supabase: SupabaseClient;
  private readonly logger = new Logger(SupabaseStorageService.name);

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');
    
    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    } else {
      this.logger.warn('Supabase URL or Key is missing. Storage will not work.');
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'general') {
    const fileName = `${Date.now()}-${file.originalname}`;
    const path = `${folder}/${fileName}`;

    const { data, error } = await this.supabase.storage
      .from('congo-tourisme-storage') // Nom du bucket à créer dans Supabase
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      this.logger.error(`Supabase Upload Error: ${error.message}`);
      throw error;
    }

    // Récupérer l'URL publique
    const { data: { publicUrl } } = this.supabase.storage
      .from('congo-tourisme-storage')
      .getPublicUrl(path);

    return {
      url: publicUrl,
      secure_url: publicUrl, // Pour compatibilité avec l'ancien code Cloudinary
      public_id: path,
    };
  }
}
