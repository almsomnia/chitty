<script setup lang="ts" generic="M extends boolean = false">
import type { GetItemKeys, GetModelValue, SelectItem } from "#ui/types"

const props = withDefaults(
   defineProps<{
      labelKey?: GetItemKeys<SelectItem[]>
      valueKey?: string
      placeholder?: string
      multiple?: M
      loading?: boolean
   }>(),
   {
      labelKey: "label",
      valueKey: "value",
      placeholder: "Status",
   }
)

const appStore = useAppStore()

const model = defineModel<GetModelValue<typeof options.value, string, M>>({
   required: true,
})
const options = ref<SelectItem[]>([])
const localLoading = shallowRef(false)

async function fetchData() {
   localLoading.value = true
   try {
      const response = await $api(`/api/statuses`, {
         method: "get",
      })
      options.value = response.data.map((item) => {
         return {
            label: item.name,
            value: item.id,
         }
      })
   } catch (e) {
      appStore.notify({
         title: "Error",
         description: "Failed to fetch statuses",
         color: "error",
      })
   } finally {
      localLoading.value = false
   }
}

onMounted(async () => {
   await fetchData()
})
</script>

<template>
   <USelect
      v-model="model"
      :items="options"
      :label-key="props.labelKey"
      :value-key="props.valueKey"
      :placeholder="props.placeholder"
   />
</template>
