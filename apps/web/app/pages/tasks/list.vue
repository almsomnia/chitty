<script setup lang="ts">
import { DetailTask, UBadge } from "#components"
import type { DropdownMenuItem } from "#ui/types"

const appStore = useAppStore()
const dayjs = useDayjs()

const query = ref<API.Query>({
   page: 1,
   per_page: 10,
})

const { data, pending, refresh } = await useLazyFetch(`/api/tasks`, {
   method: "get",
   query,
   transform: (res) => res.data,
   $fetch: $api as typeof $fetch,
})

const columns: TableColumn<Model.Task>[] = [
   {
      accessorKey: "id",
      header: "Task ID",
      cell: ({ row }) => `#${row.original.id}`,
   },
   {
      accessorKey: "title",
      header: "Title",
      meta: {
         class: {
            td: /* @tw */ "w-xs",
         },
      },
      cell: ({ row }) =>
         h("div", { class: /* @tw */ "truncate w-xs" }, row.original.title),
   },
   {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => h(
         UBadge,
         {
            variant: "subtle",
            color: $resolveTaskStatusColor(row.original.status),
            label: row.original.status.name
         }
      ),
      size: 128,
   },
   {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) =>
         h(
            UBadge,
            {
               variant: "subtle",
               color: $resolveTaskPriorityColor(row.original.priority),
               label: row.original.priority
            },
         ),
   },
   {
      accessorKey: "assignee",
      header: "Assignee",
      cell: ({ row }) => row.original.assignee?.name,
   },
   {
      accessorKey: "due_date",
      header: "Due Date",
      cell: ({ row }) => {
         const now = dayjs()
         const dueDate = dayjs(row.original.due_date)
         const isPastDueDate = now.diff(dueDate) > 0
         const classList = isPastDueDate ? /* @tw */ "text-error" : ""

         return h(
            "span",
            { class: classList },
            dueDate.format("DD MMM YYYY HH:mm")
         )
      },
   },
   {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) =>
         dayjs(row.original.created_at).format("DD MMM YYYY HH:mm"),
   },
   {
      id: "actions",
      cell: ({ row }) => $renderTableActionsColumn(row, getRowItems),
   },
]

function getRowItems(row: Row<Model.Task>): DropdownMenuItem[] {
   return [
      {
         label: "Details",
         icon: "lucide:eye",
         onSelect: () => {
            appStore.showDialog(
               `Task #${row.original.id}`,
               h(DetailTask, {
                  data: row.original
               }),
               {
                  class: /* @tw */ "w-6xl",
               }
            )
         },
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
      ></AppDataTable>
   </UCard>
</template>
