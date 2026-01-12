import { LexoRank } from "@dalet-oss/lexorank"

/**
 * Utility for handling LexoRank calculations.
 * LexoRank is a ranking system that allows for efficient reordering of items in a list.
 */
export const lexorank = {
   /**
    * Generates the initial rank for a new item.
    * Typically used when the list is empty.
    *
    * @returns {string} The middle rank string.
    */
   getInitialRank(raw?: boolean): string | LexoRank {
      const rank = LexoRank.middle()
      return raw ? rank : rank.toString()
   },

   /**
    * Calculates the rank between two existing ranks.
    * Used for reordering items.
    *
    * @param {string} [prev] - The rank of the item immediately preceding the new position.
    * @param {string} [next] - The rank of the item immediately following the new position.
    * @returns {string} The calculated rank string.
    */
   getRankBetween(prev?: string | null, next?: string | null, raw?: boolean): string | LexoRank {
      // If both are missing, return the middle rank (start of list or fresh list)
      if (!prev && !next) {
         const rank = LexoRank.middle()
         return raw ? rank : rank.toString()
      }

      // If inserted at the beginning (no previous item)
      if (!prev && next) {
         const rank = LexoRank.parse(next).genPrev()
         return raw ? rank : rank.toString()
      }

      // If inserted at the end (no next item)
      if (prev && !next) {
         const rank = LexoRank.parse(prev).genNext()
         return raw ? rank : rank.toString()
      }

      // If inserted between two items
      // We can safely assert non-null here because of the checks above
      const rank = LexoRank.parse(prev!).between(LexoRank.parse(next!))
      return raw ? rank : rank.toString()
   },

   getMultipleBetween(prev?: string | null, next?: string | null, count: number = 1, raw?: boolean) {
      let p = prev ? LexoRank.parse(prev) : LexoRank.middle()
      let n = next ? LexoRank.parse(next) : p.genNext()
      const ranks = p.multipleBetween(n, count)
      return raw ? ranks : ranks.map((r) => r.toString())
   }
}
