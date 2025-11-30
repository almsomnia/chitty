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

   type Option<
      M extends undefined | Record<string, any> = undefined,
      V extends any = number
   > = {
      label: string
      value: V
   } & (M extends Record<string, any> ? { meta: M } : never)
}
