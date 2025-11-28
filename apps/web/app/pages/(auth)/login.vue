<script setup lang="ts">
definePageMeta({
   layout: false
})

const schema = zod.object({
   email: zod.email(),
   password: zod.string().min(8),
})

const state = ref<Partial<InferSchema<typeof schema>>>({
   email: undefined,
   password: undefined,
})

const authStore = useAuthStore()
const onSubmit = async (ev: FormSubmitEvent<InferSchema<typeof schema>>) => {
   const { data } = ev
   const response = await $api("/api/auth/login", {
      method: "post",
      body: data,
   })
   authStore.user = response.data
   await navigateTo("/")
}
</script>

<template>
   <div class="h-screen p-2">
      <div class="h-full grid grid-cols-2">
         <div class="h-full flex items-center justify-center">
            <UCard class="min-w-md">
               <template #header> Login </template>
               <UForm
                  :state="state"
                  :schema="schema"
                  class="space-y-4"
                  @submit="onSubmit"
               >
                  <UFormField name="email">
                     <UInput
                        v-model="state.email"
                        placeholder="Email"
                        class="w-full"
                     />
                  </UFormField>
                  <UFormField name="password">
                     <UInput
                        v-model="state.password"
                        type="password"
                        placeholder="Password"
                        class="w-full"
                     />
                  </UFormField>
                  <div class="flex items-center justify-end">
                     <UButton
                        type="submit"
                        trailing-icon="lucide:arrow-right"
                     >
                        Login
                     </UButton>
                  </div>
               </UForm>
            </UCard>
         </div>
      </div>
   </div>
</template>
