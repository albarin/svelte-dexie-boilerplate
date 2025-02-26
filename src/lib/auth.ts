import { db } from '$lib/db';
import type { SyncState } from 'dexie-cloud-addon';

export const login = async () => {
  await db.cloud.login();
};

export const logout = async () => {
  await db.cloud.logout({ force: true });
};

export const inSync = (syncState: SyncState) => {
  return syncState.phase === 'in-sync' || syncState.phase === 'offline' || syncState.phase === 'initial';
}
