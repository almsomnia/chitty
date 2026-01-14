<script setup lang="ts">
import type { DropdownMenuItem } from "#ui/types"
import { type TableMeta } from "@tanstack/vue-table"
import type {
   CreateStatusSchema,
   UpdateStatusSchema,
} from "#shared/utils/validation-schemas/statuses"
import { useSortable } from "@vueuse/integrations/useSortable"
import { Icon } from "#components"
import FormStatus from "~/components/forms/status/FormStatus.vue"
import AppConfirmDialog from "~/components/app/AppConfirmDialog.vue"

const appStore = useAppStore()

const query = ref<API.Query>({
   page: 1,
   per_page: 10,
})

const { data, pending, refresh } = await useLazyFetch(`/api/statuses`, {
   method: "get",
   query,
   transform: (res) => res.data,
   default: () => [] as Model.Status[],
   $fetch: $api as typeof $fetch,
})

const columns: TableColumn<Model.Status>[] = [
   {
      id: "drag",
      meta: {
         class: {
            td: "ct--drag-handle w-12 cursor-grab",
         },
      },
      cell: ({ row }) => h(Icon, { name: "lucide:grip-horizontal" }),
   },
   {
      accessorKey: "name",
      header: "Name",
   },
   {
      accessorKey: "type",
      header: "Type",
   },
   {
      id: "actions",
      cell: ({ row }) => $renderTableActionsColumn(row, getRowItems),
   },
]

const meta: TableMeta<Model.Status> = {
   class: {
      tr: (row) => {
         return `ct--status-type-${row.original.type}`
      },
   },
}

function getRowItems(row: Row<Model.Status>): DropdownMenuItem[] {
   return [
      {
         label: "Edit",
         icon: "lucide:edit",
         onSelect: () => {
            openForm(row.original)
         },
      },
      {
         label: "Delete",
         icon: "lucide:trash",
         color: "error",
         onSelect: () => {
            appStore.showDialog(
               "Confirm Delete Status",
               h(AppConfirmDialog, {
                  positiveButtonColor: "error",
                  positiveButtonLabel: "Delete Status",
                  positiveButtonIcon: "lucide:trash",
                  onNegative: appStore.closeDialog,
                  onPositive: async () => {
                     const res = await $api(
                        `/api/statuses/${row.original.id}`,
                        {
                           method: "delete",
                        }
                     )
                     appStore.notify({
                        title: res.meta.message,
                        color: "info",
                     })
                     appStore.closeDialog()
                     refresh()
                  },
               })
            )
         },
      },
   ]
}

const loading = shallowRef(false)

function openForm(data?: Model.Status) {
   const component = FormStatus

   const submitHandler =
      data ?
         (values: UpdateStatusSchema) => onUpdate(data.id, values)
      :  (values: CreateStatusSchema) => onCreate(values)

   appStore.showDialog(
      "Status Form",
      h(component, {
         loading: loading,
         data,
         onSubmit: async (values: UpdateStatusSchema | CreateStatusSchema) => {
            const res = await submitHandler(values)
            appStore.notify({
               title: res.meta.message,
               color: "success",
            })
            appStore.closeDialog()
            refresh()
         },
      })
   )
}

async function onCreate(payload: CreateStatusSchema) {
   return await $api(`/api/statuses`, {
      method: "post",
      body: payload,
   })
}

async function onUpdate(id: number, payload: UpdateStatusSchema) {
   return await $api(`/api/statuses/${id}`, {
      method: "put",
      body: payload,
   })
}

useSortable(".ct--draggable-tbody", data, {
   animation: 150,
   handle: ".ct--drag-handle",
   ghostClass: /* @tw */ "opacity-40",
   chosenClass: /* @tw */ "[&_td.ct--drag-handle]:cursor-grabbing",
   dragClass: /* @tw */ "[&_td.ct--drag-handle]:cursor-grabbing",
   onMove: (ev: any) => {
      const draggedType = Array.from<string>(ev.dragged.classList)
         .filter((cls) => /^ct--status-type-.*$/.test(cls))
         .at(-1)
      const relatedType = Array.from<string>(ev.related.classList)
         .filter((cls) => /^ct--status-type-.*$/.test(cls))
         .at(-1)
      return draggedType === relatedType
   },
   onEnd: async (ev: any) => {
      await nextTick()
      const { newIndex, oldIndex } = ev
      if (newIndex == oldIndex) return
      const currentData = data.value[newIndex]
      if (!currentData) return
      const dataWithSameType = data.value.filter(
         (item) => item.type === currentData.type
      )

      const prevStatus = dataWithSameType[newIndex - 1]
      const nextStatus = dataWithSameType[newIndex + 1]

      const prevRank = prevStatus ? prevStatus.order : null
      const nextRank = nextStatus ? nextStatus.order : null

      const newRank = lexorank.getRankBetween(prevRank, nextRank) as string
      currentData.order = newRank
      await onUpdate(currentData.id, {
         order: newRank,
         name: currentData.name,
         type: currentData.type,
      })
   },
})
</script>

<template>
   <UCard>
      <div class="border-b border-accented pb-4 px-3.5">
         <div class="flex items-center justify-end">
            <UButton
               icon="lucide:plus"
               label="New Status"
               @click="() => openForm()"
            />
         </div>
      </div>
      <UTable
         :data="data ?? []"
         :columns="columns"
         :loading="pending"
         :meta="meta"
         :ui="{
            tbody: 'ct--draggable-tbody',
         }"
      />
   </UCard>
</template>
