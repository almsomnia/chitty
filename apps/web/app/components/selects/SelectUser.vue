<script setup lang="ts" generic="M extends boolean = false">
import type { GetItemKeys, GetModelValue, SelectMenuItem } from "#ui/types"

const props = withDefaults(
   defineProps<{
      labelKey?: GetItemKeys<SelectMenuItem[]>
      valueKey?: string
      multiple?: M
      loading?: boolean
      placeholder?: string
   }>(),
   {
      labelKey: "label",
      valueKey: "value",
   }
)

const appStore = useAppStore()

const model = defineModel<GetModelValue<typeof options.value, string, M>>({
   required: true,
})
const options = ref<SelectMenuItem[]>([])
const localLoading = shallowRef(false)
const query = ref<Record<string, string | undefined>>({
   search: undefined,
})

async function fetchData() {
   localLoading.value = true
   try {
      const response = await $api(`/api/users/options`, {
         method: "get",
         query: query.value,
      })
      options.value = response.data.map((item) => {
         return {
            label: item.label,
            value: item.value,
            description: item.meta.email,
            avatar: {
               text: item.label.charAt(0),
            },
         }
      })
   } catch (e) {
      console.error(e)
      appStore.notify({
         title: "Error",
         description: "Failed to fetch user options",
         color: "error",
      })
   } finally {
      localLoading.value = false
   }
}

const loading = computed(() => props.loading || localLoading.value)

onMounted(async () => {
   await fetchData()
})
</script>

<template>
   <USelectMenu
      v-model="model"
      :items="options"
      :label-key="props.labelKey"
      :value-key="props.valueKey"
      :placeholder="props.placeholder"
      v-model:search-term="query.search"
      :loading
   />
</template>
