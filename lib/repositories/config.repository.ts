import { BaseRepository } from './base.repository';
import { ShopConfig } from '@/lib/types/domain';
import { Database } from '@/lib/supabase/types';

type ConfigRow = Database['public']['Tables']['shop_config']['Row'];

export class ConfigRepository extends BaseRepository {
  protected tableName = 'shop_config';

  async getAll(): Promise<ShopConfig> {
    try {
      const { data, error } = await this.supabase
        .from('shop_config')
        .select('*');

      if (error) this.handleError(error, 'getAll');

      const rows = (data ?? []) as ConfigRow[];
      const configMap = new Map<string, string>();
      for (const row of rows) {
        configMap.set(row.key, row.value);
      }

      return {
        whatsappNumber: configMap.get('whatsapp_number') ?? '+22890000000',
        availabilityNote: configMap.get('availability_note') ?? '',
        shopName: configMap.get('shop_name') ?? 'Adodi Studio',
        maxConcurrentOrders: parseInt(configMap.get('max_concurrent_orders') ?? '5', 10),
      };
    } catch (e) {
      if (e instanceof Error && e.name === 'RepositoryError') throw e;
      this.handleError(e, 'getAll');
    }
  }
}
