import { createServerClient } from '@/lib/supabase/server';
import { ProductRepository } from '@/lib/repositories/product.repository';
import { CategoryRepository } from '@/lib/repositories/category.repository';
import { OrderRepository } from '@/lib/repositories/order.repository';
import { ConfigRepository } from '@/lib/repositories/config.repository';
import { ProductService } from '@/lib/services/product.service';
import { OrderService } from '@/lib/services/order.service';
import { AIService } from '@/lib/services/ai.service';
import { WhatsAppService } from '@/lib/services/whatsapp.service';

export function getContainer() {
  const supabase = createServerClient();

  const productRepo = new ProductRepository(supabase);
  const categoryRepo = new CategoryRepository(supabase);
  const orderRepo = new OrderRepository(supabase);
  const configRepo = new ConfigRepository(supabase);

  return {
    productService: new ProductService(productRepo, categoryRepo),
    orderService: new OrderService(orderRepo, productRepo),
    aiService: new AIService(),
    whatsappService: new WhatsAppService(configRepo),
  };
}
