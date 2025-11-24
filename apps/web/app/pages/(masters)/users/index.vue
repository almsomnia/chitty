<script setup lang="ts">
import type { DropdownMenuItem } from "#ui/types"
import type { CreateUserSchema } from "#shared/utils/validation-schemas/users"

const appStore = useAppStore()

const query = ref<API.Query>({
   page: 1,
   per_page: 5,
   search: 10,
})

const { data, pending, refresh } = await useLazyFetch(`/api/users`, {
   method: "get",
   query,
   transform: (res) => res.data,
   $fetch: $api as typeof $fetch,
})

const dayjs = useDayjs()
const columns: TableColumn<Model.User>[] = [
   {
      accessorKey: "name",
      header: "Name",
   },
   {
      accessorKey: "email",
      header: "Email",
   },
   {
      accessorKey: "created_at",
      header: "Created at",
      cell: ({ row }) =>
         dayjs(row.getValue("created_at")).format("DD MMM YYYY HH:mm"),
   },
   {
      id: "actions",
      cell: ({ row }) => $renderTableActionsColumn(row, getRowItems),
   },
]

function getRowItems(row: Row<Model.User>): DropdownMenuItem[] {
   return [
      {
         label: "Edit",
         icon: "lucide:edit",
         onSelect: () => {
            console.log(row.original.id)
         },
      },
      {
         label: "Delete",
         icon: "lucide:trash",
         color: "error",
      },
   ]
}

const loading = shallowRef(false)
function openForm(data?: Model.User) {
   appStore.showDialog(
      "User Form",
      h(
         resolveComponent("FormUser"),
         {
            loading: loading,
            onSubmit: async (values: Omit<CreateUserSchema, "password_confirmation">) => {
               const res = await $api(`/api/users`, {
                  method: "post",
                  body: values
               })
               appStore.notify({
                  title: "Success",
                  description: res.meta.message,
               })
               appStore.closeDialog()
               refresh()
            }
         }
      )
   )
}
</script>

<template>
   <UCard>
      <AppDataTable
         :rows="data?.data ?? []"
         :columns
         :total="data?.total ?? 0"
         :loading="pending"
         v-model:page="query.page"
         v-model:per-page="query.per_page"
      >
         <template #header>
            <div class="flex items-center justify-end">
               <UButton
                  icon="lucide:plus"
                  @click="() => openForm()"
               >
                  New User
               </UButton>
            </div>
         </template>
      </AppDataTable>
   </UCard>
</template>
