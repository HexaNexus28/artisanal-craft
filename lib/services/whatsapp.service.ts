import { ConfigRepository } from '@/lib/repositories/config.repository';
import { ShopConfig } from '@/lib/types/domain';
import { Result, ok, err } from '@/lib/types/result';
import { AppError } from '@/lib/types/errors';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export class WhatsAppService {
  constructor(private configRepo: ConfigRepository) {}

  async getWhatsAppUrl(message: string): Promise<Result<string>> {
    try {
      const config = await this.configRepo.getAll();
      return ok(buildWhatsAppUrl(config.whatsappNumber, message));
    } catch (e) {
      return err(new AppError(e instanceof Error ? e.message : 'Failed to build WhatsApp URL'));
    }
  }

  async getConfig(): Promise<Result<ShopConfig>> {
    try {
      const config = await this.configRepo.getAll();
      return ok(config);
    } catch (e) {
      return err(new AppError(e instanceof Error ? e.message : 'Failed to fetch config'));
    }
  }
}
