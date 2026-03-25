import { BaseRepository } from './base.repository';
import { Category, LocalizedString } from '@/lib/types/domain';
import { Database } from '@/lib/supabase/types';

type CategoryRow = Database['public']['Tables']['categories']['Row'];

export class CategoryRepository extends BaseRepository {
  protected tableName = 'categories';

  private toDomain(row: CategoryRow): Category {
    return {
      id: row.id,
      slug: row.slug as Category['slug'],
      name: row.name as unknown as LocalizedString,
      displayOrder: row.display_order,
    };
  }

  async findAll(): Promise<Category[]> {
    try {
      const { data, error } = await this.supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) this.handleError(error, 'findAll');
      return (data ?? []).map((row) => this.toDomain(row));
    } catch (e) {
      if (e instanceof Error && e.name === 'RepositoryError') throw e;
      this.handleError(e, 'findAll');
    }
  }

  async findBySlug(slug: string): Promise<Category | null> {
    try {
      const { data, error } = await this.supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error && error.code === 'PGRST116') return null;
      if (error) this.handleError(error, 'findBySlug');
      return data ? this.toDomain(data) : null;
    } catch (e) {
      if (e instanceof Error && e.name === 'RepositoryError') throw e;
      this.handleError(e, 'findBySlug');
    }
  }
}
