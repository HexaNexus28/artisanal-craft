import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/types';
import { RepositoryError } from '@/lib/types/errors';

export abstract class BaseRepository {
  protected abstract tableName: string;

  constructor(protected supabase: SupabaseClient<Database>) {}

  protected handleError(error: unknown, context: string): never {
    throw new RepositoryError(
      `[${this.tableName}] ${context}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
