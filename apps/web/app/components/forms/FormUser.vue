<script setup lang="ts">
import { $userSchema } from "#shared/utils/validation-schemas/users"

const props = withDefaults(
   defineProps<{
      loading?: Ref<boolean>
   }>(),
   {
      loading: () => shallowRef(false)
   }
)

const emit = defineEmits<{
   submit: [value: Omit<InferSchema<typeof schema>, "password_confirmation">]
}>()

const schema = $userSchema.create

const state = ref<InferSchema<typeof schema>>({
   name: "",
   email: "",
   password: "",
   password_confirmation: ""
})

async function onSubmit(e: FormSubmitEvent<typeof state.value>) {
   const { password_confirmation, ...payload } = e.data
   emit("submit", payload)
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
      <UFormField
         name="password"
         label="Password"
      >
         <UInput
            v-model="state.password"
            placeholder="min 8 characters"
            class="w-full"
            :type="mask.password ? 'password' : 'text'"
            :ui="{ trailing: 'pe-1' }"
            :loading
         >
            <template #trailing>
               <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="mask.password ? 'lucide:eye' : 'lucide:eye-off'"
                  @click="mask.password = !mask.password"
               />
            </template>
         </UInput>
      </UFormField>
      <UFormField
         name="password_confirmation"
         label="Password Confirmation"
      >
         <UInput
            v-model="state.password_confirmation"
            placeholder="min 8 characters"
            class="w-full"
            :type="mask.password_confirmation ? 'password' : 'text'"
            :ui="{ trailing: 'pe-1' }"
            :loading
         >
            <template #trailing>
               <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="mask.password_confirmation ? 'lucide:eye' : 'lucide:eye-off'"
                  @click="mask.password_confirmation = !mask.password_confirmation"
               />
            </template>
         </UInput>
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
