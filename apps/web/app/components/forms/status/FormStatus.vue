<script setup lang="ts">
import { $statusSchema } from "#shared/utils/validation-schemas/statuses"
import { $enumStatusType } from "#shared/utils/$enumStatusType"

const props = withDefaults(
   defineProps<{
      loading?: Ref<boolean>
      data?: Model.Status
   }>(),
   {
      loading: () => shallowRef(false),
   }
)

const emit = defineEmits<{
   submit: [InferSchema<typeof schema>]
}>()

const schema = $statusSchema.create

const typeOptions = Object.entries($enumStatusType).map(([k, v]) => ({
   label: k,
   value: v,
}))

const state = ref<InferSchema<typeof schema>>({
   name: "",
   type: "IDLE",
   order: "",
})

const loading = computed(() => props.loading.value)

async function onSubmit(e: FormSubmitEvent<typeof state.value>) {
   emit("submit", e.data)
}

onMounted(() => {
   if (props.data) {
      Object.keys(state.value).forEach((key) => {
         // @ts-ignore
         state.value[key] = props.data[key]
      })
   }
})
</script>

<template>
   <UForm
      :schema
      :state
      @submit="onSubmit"
      class="grid grid-cols-2 gap-4"
   >
      <UFormField
         name="name"
         label="Name"
      >
         <UInput
            v-model="state.name"
            class="w-full"
            placeholder="Status name"
            :loading
         />
      </UFormField>
      <UFormField
         name="type"
         label="type"
      >
         <USelect
            v-model="state.type"
            :items="typeOptions"
            label-key="label"
            value-key="value"
            class="w-full"
         />
      </UFormField>
      <div class="col-span-full flex items-center justify-end">
         <UButton
            type="submit"
            label="Submit"
            icon="lucide:check"
            :loading
         />
      </div>
   </UForm>
</template>
