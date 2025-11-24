<script setup lang="ts">
import { $userSchema } from "#shared/utils/validation-schemas/users"

const props = withDefaults(
   defineProps<{
      loading?: Ref<boolean>
      data?: Model.User
   }>(),
   {
      loading: () => shallowRef(false)
   }
)

const emit = defineEmits<{
   submit: [value: Omit<InferSchema<typeof schema>, "password_confirmation">]
}>()

const schema = $userSchema.update

const state = ref<InferSchema<typeof schema>>({
   name: "",
   email: "",
})

onMounted(() => {
   if (props.data) {
      Object.keys(props.data).forEach((key) => {
         // @ts-ignore
         state.value[key] = props.data[key]
      })
   }
})

async function onSubmit(e: FormSubmitEvent<typeof state.value>) {
   emit("submit", e.data)
}

const mask = reactive({
   password: true,
   password_confirmation: true
})

const loading = computed(() => props.loading.value)
</script>

<template>
   <UForm
      :schema
      :state
      @submit="onSubmit"
      class="space-y-4"
   >
      <UFormField
         name="name"
         label="Name"
      >
         <UInput
            v-model="state.name"
            class="w-full"
            placeholder="User name"
            :loading
         />
      </UFormField>
      <UFormField
         name="email"
         label="Email"
      >
         <UInput
            v-model="state.email"
            placeholder="name@email.com"
            class="w-full"
            :loading
         />
      </UFormField>
      <div class="flex items-center justify-end">
         <UButton
            type="submit"
            icon="lucide:check"
            :loading
         >
            Submit
         </UButton>
      </div>
   </UForm>
</template>
