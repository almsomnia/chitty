<script setup lang="ts" generic="T">
const props = withDefaults(
   defineProps<{
      rows: T[]
      columns: TableColumn<T>[]
      total: number
      from?: number
      to?: number
      loading?: boolean
   }>(),
   {
      total: 0,
   }
)

const page = defineModel<number>("page", { required: false, default: 1 })
const perPage = defineModel<number>("perPage", { required: false, default: 10 })

const perPageOptions = computed(() => {
   const values = [5, 10, 20, 50]
   return values.map((v) => ({
      label: `${v} per page`,
      value: v,
   }))
})

const from = computed(() => {
   return props.from ?? (page.value - 1) * perPage.value + 1
})

const to = computed(() => {
   return props.to ?? (page.value - 1) * perPage.value + perPage.value
})
</script>

<template>
   <div class="flex flex-col">
      <div
         v-if="$slots.header"
         class="border-b border-accented pb-4 px-3.5"
      >
         <slot name="header" />
      </div>
      <UTable
         :data="props.rows"
         :columns="props.columns"
         :loading="props.loading"
      />
      <div
         class="flex items-center justify-between border-t border-default pt-4"
      >
         <div class="">
            <span class="text-sm text-muted">
               {{ from }}-{{ to < props.total ? to : props.total }} of {{ props.total }}
            </span>
         </div>
         <div class="flex items-center gap-2">
            <USelect
               v-model="perPage"
               :items="perPageOptions"
               :ui="{ content: 'min-w-fit' }"
            />
            <UPagination
               v-model:page="page"
               :total="props.total"
               :items-per-page="perPage"
               :sibling-count="1"
               show-edges
            />
         </div>
      </div>
   </div>
</template>
