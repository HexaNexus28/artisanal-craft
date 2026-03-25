import { OrderRepository } from '@/lib/repositories/order.repository';
import { ProductRepository } from '@/lib/repositories/product.repository';
import { Order, OrderInput } from '@/lib/types/domain';
import { Result, ok, err } from '@/lib/types/result';
import { AppError, NotFoundError } from '@/lib/types/errors';

export class OrderService {
  constructor(
    private orderRepo: OrderRepository,
    private productRepo: ProductRepository
  ) {}

  async createWhatsAppOrder(
    productId: string,
    customerInfo?: Partial<OrderInput>
  ): Promise<Result<Order>> {
    try {
      const product = await this.productRepo.findBySlug(productId);
      if (!product) {
        return err(new NotFoundError(`Product not found: ${productId}`));
      }

      const order = await this.orderRepo.create({
        productId: product.id,
        productSnapshot: product,
        customerName: customerInfo?.customerName ?? null,
        customerPhone: customerInfo?.customerPhone ?? null,
        note: customerInfo?.note ?? null,
      });

      return ok(order);
    } catch (e) {
      return err(new AppError(e instanceof Error ? e.message : 'Failed to create order'));
    }
  }
}
