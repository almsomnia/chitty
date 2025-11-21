type GetArgs = {
   page?: string
   per_page?: string
}

export function userService(db: DB) {
   const model = db.query.users

   return {
      get: async (args: GetArgs = {}) => {
         const page = (args.page && Number(args.page)) || undefined
         const perPage = (args.per_page && Number(args.per_page)) || undefined

         const offset = page && perPage ? (page - 1) * perPage : undefined
         const limit = perPage

         // const count = db.$count()

         const result = await model.findMany({
            limit,
            offset,
            columns: {
               password: false,
            },
         })
         return result
      },

      find: async (id: string | number) => {
         const result = await model.findFirst({
            where: (users, { eq }) => eq(users.id, Number(id)),
            columns: {
               password: false
            }
         })

         return result
      },
   }
}
