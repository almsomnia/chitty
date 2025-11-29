declare namespace API {
   type Response<T> = {
      meta: {
         success: boolean
         message: string
         error: string
      }
      data: T
   }

   type Paginate<T> = {
      page: number
      per_page: number
      data: T
      from: number
      to: number
      total: number
   }

   type Query<T = Record<string, string | number>> = {
      page?: number
      per_page?: number
   } & Partial<T>
}
