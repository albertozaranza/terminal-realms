/**
 * Região explorável do mundo. Definida de forma data-driven em content/.
 */
export interface Region {
  id: string;

  name: string;

  minLevel: number;

  maxLevel: number;

  enemyPool: string[];

  bossId: string;
}
