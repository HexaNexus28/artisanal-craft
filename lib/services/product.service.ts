import { ProductRepository } from '@/lib/repositories/product.repository';
import { CategoryRepository } from '@/lib/repositories/category.repository';
import { Product } from '@/lib/types/domain';
import { Result, ok, err } from '@/lib/types/result';
import { AppError, NotFoundError } from '@/lib/types/errors';
import type { Locale } from '@/lib/i18n/config';

/* eslint-disable @typescript-eslint/no-unused-vars */
export class ProductService {
  constructor(
    private repo: ProductRepository,
    private categoryRepo: CategoryRepository
  ) {}

  async getFeaturedProducts(_locale: Locale): Promise<Result<Product[]>> {
    try {
      const products = await this.repo.findFeatured();
      return ok(products);
    } catch (e) {
      return err(new AppError(e instanceof Error ? e.message : 'Failed to fetch featured products'));
    }
  }

  async getAllProducts(_locale: Locale): Promise<Result<Product[]>> {
    try {
      const products = await this.repo.findAll();
      return ok(products);
    } catch (e) {
      return err(new AppError(e instanceof Error ? e.message : 'Failed to fetch products'));
    }
  }

  async getProductBySlug(slug: string, _locale: Locale): Promise<Result<Product>> {
    try {
      const product = await this.repo.findBySlug(slug);
      if (!product) return err(new NotFoundError(`Product not found: ${slug}`));
      return ok(product);
    } catch (e) {
      return err(new AppError(e instanceof Error ? e.message : 'Failed to fetch product'));
    }
  }

  async getProductsByCategory(categorySlug: string, _locale: Locale): Promise<Result<Product[]>> {
    try {
      const category = await this.categoryRepo.findBySlug(categorySlug);
      if (!category) return err(new NotFoundError(`Category not found: ${categorySlug}`));
      const products = await this.repo.findByCategory(category.id);
      return ok(products);
    } catch (e) {
      return err(new AppError(e instanceof Error ? e.message : 'Failed to fetch products by category'));
    }
  }
}
