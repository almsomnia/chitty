<script setup lang="ts" generic="M extends boolean = false">
import type { GetItemKeys, GetModelValue, SelectItem } from "#ui/types"

const props = withDefaults(
   defineProps<{
      labelKey?: GetItemKeys<SelectItem[]>
      valueKey?: string
      placeholder?: string
      multiple?: M
   }>(),
   {
      labelKey: "value",
      valueKey: "value",
   }
)

const model = defineModel<GetModelValue<typeof options, string, M>>({
   required: true,
})

const options: SelectItem[] = [
   {
      value: "LOW",
      chip: { color: "neutral" },
   },
   {
      value: "MEDIUM",
      chip: { color: "warning" },
   },
   {
      value: "HIGH",
      chip: { color: "error" },
   },
]
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
