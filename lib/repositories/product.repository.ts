import { BaseRepository } from './base.repository';
import { Product, Category, LocalizedString, CreateProductDTO, UpdateProductDTO } from '@/lib/types/domain';
import { Database } from '@/lib/supabase/types';

type ProductRow = Database['public']['Tables']['products']['Row'];
type CategoryRow = Database['public']['Tables']['categories']['Row'];

type ProductWithCategory = ProductRow & {
  categories: CategoryRow | null;
};

export class ProductRepository extends BaseRepository {
  protected tableName = 'products';

  private toDomain(row: ProductWithCategory): Product {
    return {
      id: row.id,
      slug: row.slug,
      category: row.categories
        ? {
            id: row.categories.id,
            slug: row.categories.slug as Category['slug'],
            name: row.categories.name as unknown as LocalizedString,
            displayOrder: row.categories.display_order,
          }
        : null,
      name: row.name as unknown as LocalizedString,
      description: row.description as unknown as LocalizedString | null,
      priceXof: row.price_xof,
      images: row.images,
      isAvailable: row.is_available,
      isFeatured: row.is_featured,
      stockNote: row.stock_note,
      metaTitle: row.meta_title as unknown as LocalizedString | null,
      metaDescription: row.meta_description as unknown as LocalizedString | null,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  private selectWithCategory() {
    return this.supabase.from('products').select('*, categories(*)');
  }

  async findAll(): Promise<Product[]> {
    try {
      const { data, error } = await this.selectWithCategory()
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) this.handleError(error, 'findAll');
      return (data ?? []).map((row) => this.toDomain(row as unknown as ProductWithCategory));
    } catch (e) {
      if (e instanceof Error && e.name === 'RepositoryError') throw e;
      this.handleError(e, 'findAll');
    }
  }

  async findBySlug(slug: string): Promise<Product | null> {
    try {
      const { data, error } = await this.selectWithCategory()
        .eq('slug', slug)
        .eq('is_available', true)
        .single();

      if (error && error.code === 'PGRST116') return null;
      if (error) this.handleError(error, 'findBySlug');
      return data ? this.toDomain(data as unknown as ProductWithCategory) : null;
    } catch (e) {
      if (e instanceof Error && e.name === 'RepositoryError') throw e;
      this.handleError(e, 'findBySlug');
    }
  }

  async findFeatured(limit: number = 6): Promise<Product[]> {
    try {
      const { data, error } = await this.selectWithCategory()
        .eq('is_available', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) this.handleError(error, 'findFeatured');
      return (data ?? []).map((row) => this.toDomain(row as unknown as ProductWithCategory));
    } catch (e) {
      if (e instanceof Error && e.name === 'RepositoryError') throw e;
      this.handleError(e, 'findFeatured');
    }
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    try {
      const { data, error } = await this.selectWithCategory()
        .eq('is_available', true)
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false });

      if (error) this.handleError(error, 'findByCategory');
      return (data ?? []).map((row) => this.toDomain(row as unknown as ProductWithCategory));
    } catch (e) {
      if (e instanceof Error && e.name === 'RepositoryError') throw e;
      this.handleError(e, 'findByCategory');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private get db() { return this.supabase as any; }

  async create(dto: CreateProductDTO): Promise<Product> {
    try {
      const { data, error } = await this.db
        .from('products')
        .insert({
          slug: dto.slug,
          category_id: dto.categoryId,
          name: dto.name,
          description: dto.description,
          price_xof: dto.priceXof,
          images: dto.images,
          is_available: dto.isAvailable,
          is_featured: dto.isFeatured,
          stock_note: dto.stockNote,
          meta_title: dto.metaTitle,
          meta_description: dto.metaDescription,
        })
        .select('*, categories(*)')
        .single();

      if (error) this.handleError(error, 'create');
      return this.toDomain(data as ProductWithCategory);
    } catch (e) {
      if (e instanceof Error && e.name === 'RepositoryError') throw e;
      this.handleError(e, 'create');
    }
  }

  async update(id: string, dto: UpdateProductDTO): Promise<Product> {
    try {
      const updateData: Record<string, unknown> = {};
      if (dto.slug !== undefined) updateData.slug = dto.slug;
      if (dto.categoryId !== undefined) updateData.category_id = dto.categoryId;
      if (dto.name !== undefined) updateData.name = dto.name;
      if (dto.description !== undefined) updateData.description = dto.description;
      if (dto.priceXof !== undefined) updateData.price_xof = dto.priceXof;
      if (dto.images !== undefined) updateData.images = dto.images;
      if (dto.isAvailable !== undefined) updateData.is_available = dto.isAvailable;
      if (dto.isFeatured !== undefined) updateData.is_featured = dto.isFeatured;
      if (dto.stockNote !== undefined) updateData.stock_note = dto.stockNote;
      if (dto.metaTitle !== undefined) updateData.meta_title = dto.metaTitle;
      if (dto.metaDescription !== undefined) updateData.meta_description = dto.metaDescription;

      const { data, error } = await this.db
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select('*, categories(*)')
        .single();

      if (error) this.handleError(error, 'update');
      return this.toDomain(data as ProductWithCategory);
    } catch (e) {
      if (e instanceof Error && e.name === 'RepositoryError') throw e;
      this.handleError(e, 'update');
    }
  }

  async softDelete(id: string): Promise<void> {
    try {
      const { error } = await this.db
        .from('products')
        .update({ is_available: false })
        .eq('id', id);

      if (error) this.handleError(error, 'softDelete');
    } catch (e) {
      if (e instanceof Error && e.name === 'RepositoryError') throw e;
      this.handleError(e, 'softDelete');
    }
  }
}
