import { browser } from '$app/environment';
import { db } from '$lib/db';
import type { Load } from '@sveltejs/kit';
import { toast } from 'svelte-sonner';

export const load: Load = async () => {
  if (browser) {
    await db.open();
  }
}