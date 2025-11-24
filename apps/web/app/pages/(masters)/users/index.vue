<script setup lang="ts">
import type { DropdownMenuItem } from '#ui/types'

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
      cell: ({ row }) => $renderTableActionsColumn(row, getRowItems)
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
         color: "error"
      },
   ]
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
      />
   </UCard>
</template>
