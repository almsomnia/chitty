<script setup lang="ts">
import { DetailTask, UBadge } from "#components"
import type { DropdownMenuItem, SelectProps } from "#ui/types"
import type { CreateTaskSchema } from "#shared/utils/validation-schemas/tasks"

const appStore = useAppStore()
const dayjs = useDayjs()

const query = ref<API.Query>({
   page: 1,
   per_page: 10,
   title: undefined,
   priority: undefined,
   status: undefined
})

const { data, pending, refresh } = await useLazyFetch(`/api/tasks`, {
   method: "get",
   query,
   transform: (res) => res.data,
   $fetch: $api as typeof $fetch,
   watch: false,
})

watchExcludable(query, () => refresh(), { exclude: ["title"] })
watchDebounced(
   () => query.value.title,
   () => refresh(),
   { debounce: 800, maxWait: 1000 }
)

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
      cell: ({ row }) =>
         h(UBadge, {
            variant: "subtle",
            color: $resolveTaskStatusColor(row.original.status),
            label: row.original.status.name,
         }),
      size: 128,
   },
   {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) =>
         h(UBadge, {
            variant: "subtle",
            color: $resolveTaskPriorityColor(row.original.priority),
            label: row.original.priority,
         }),
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
         if (!row.original.due_date) return ""
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
                  data: row.original,
               }),
               {
                  class: /* @tw */ "w-6xl",
               }
            )
         },
      },
   ]
}

const formLoading = shallowRef(false)
function onOpenForm(data?: Model.Task) {
   appStore.showDialog(
      "Task Form",
      h(resolveComponent("FormTask"), {
         loading: formLoading,
         onSubmit: async (values: CreateTaskSchema) => {
            try {
               formLoading.value = true
               const response = await createTask(values)
               appStore.notify({
                  title: "Success",
                  description: response.meta.message,
                  color: "success"
               })
               appStore.closeDialog()
               await refresh()
            } catch (e) {
               console.error(e)
               appStore.notify({
                  title: "Error",
                  description: "Failed to submit task",
                  color: "error"
               })
            } finally {
               formLoading.value = false
            }
         }
      }),
      {
         class: /* @tw */ "w-6xl"
      }
   )
}

async function createTask(payload: CreateTaskSchema) {
   return await $api(`/api/tasks`, {
      method: "post",
      body: payload
   })
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
            <div class="flex gap-4">
               <UInput
                  v-model="query.title"
                  icon="lucide:search"
                  placeholder="Search..."
                  class="w-3xs"
               />
               <div class="w-40 flex items-center gap-2">
                  <SelectTaskPriority
                     v-model="query.priority"
                     class="flex-1"
                     placeholder="Priority"
                  />
                  <UTooltip
                     v-if="!!query.priority"
                     text="Clear"
                  >
                     <UButton
                        color="neutral"
                        variant="link"
                        icon="lucide:x"
                        size="sm"
                        @click.stop="query.priority = undefined"
                     />
                  </UTooltip>
               </div>
               <div class="w-40 flex items-center gap-2">
                  <SelectStatus
                     v-model="query.status_id"
                     class="flex-1"
                     placeholder="Status"
                  />
                  <UTooltip
                     v-if="!!query.status_id"
                     text="Clear"
                  >
                     <UButton
                        color="neutral"
                        variant="link"
                        icon="lucide:x"
                        size="sm"
                        @click.stop="query.status_id = undefined"
                     />
                  </UTooltip>
               </div>
               <div class="flex-1 flex justify-end">
                  <UButton
                     label="New Task"
                     icon="lucide:plus"
                     @click="() => onOpenForm()"
                  />
               </div>
            </div>
         </template>
      </AppDataTable>
   </UCard>
</template>
