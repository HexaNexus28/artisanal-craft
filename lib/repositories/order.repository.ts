import { BaseRepository } from './base.repository';
import { Order, Product } from '@/lib/types/domain';
import { Database } from '@/lib/supabase/types';

type OrderRow = Database['public']['Tables']['orders']['Row'];

export class OrderRepository extends BaseRepository {
  protected tableName = 'orders';

  private toDomain(row: OrderRow): Order {
    return {
      id: row.id,
      productId: row.product_id,
      productSnapshot: row.product_snapshot as unknown as Product,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      note: row.note,
      status: row.status as Order['status'],
      createdAt: new Date(row.created_at),
    };
  }

  async create(data: {
    productId: string;
    productSnapshot: Product;
    customerName?: string | null;
    customerPhone?: string | null;
    note?: string | null;
  }): Promise<Order> {
    try {
      const insertData = {
        product_id: data.productId,
        product_snapshot: JSON.parse(JSON.stringify(data.productSnapshot)),
        customer_name: data.customerName ?? null,
        customer_phone: data.customerPhone ?? null,
        note: data.note ?? null,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: row, error } = await (this.supabase as any)
        .from('orders')
        .insert(insertData)
        .select('*')
        .single();

      if (error) this.handleError(error, 'create');
      return this.toDomain(row as OrderRow);
    } catch (e) {
      if (e instanceof Error && e.name === 'RepositoryError') throw e;
      this.handleError(e, 'create');
    }
  }
}
