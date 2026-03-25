import { createStaticClient } from '@/lib/supabase/static';
import { ProductRepository } from '@/lib/repositories/product.repository';
import { CategoryRepository } from '@/lib/repositories/category.repository';
import { ProductService } from '@/lib/services/product.service';

// Build-time container — no cookies dependency
// Use this in generateStaticParams and generateMetadata
export function getStaticContainer() {
  const supabase = createStaticClient();

  const productRepo = new ProductRepository(supabase);
  const categoryRepo = new CategoryRepository(supabase);

  return {
    productService: new ProductService(productRepo, categoryRepo),
  };
}
