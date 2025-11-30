<script setup lang="ts">
import { $taskSchema } from "#shared/utils/validation-schemas/tasks"
import { CalendarDate } from "@internationalized/date"

const props = withDefaults(
   defineProps<{
      loading?: Ref<boolean>
      data?: Model.Task
   }>(),
   {
      loading: () => shallowRef(false),
   }
)

const emit = defineEmits<{
   submit: [value: InferSchema<typeof schema>]
}>()

const schema = $taskSchema.create

const state = ref<Partial<InferSchema<typeof schema>>>({
   title: undefined,
   description: undefined,
   status_id: undefined,
   assignee_id: undefined,
   due_date: undefined,
   priority: undefined,
})

async function onSubmit(e: FormSubmitEvent<typeof state.value>) {
   emit("submit", e.data as InferSchema<typeof schema>)
}

const inputDateRef = useTemplateRef("inputDateRef")

const loading = computed(() => props.loading.value)
const dueDateModel = computed({
   get: () => {
      if (!state.value.due_date) return undefined
      const date = new Date(state.value.due_date)
      return new CalendarDate(
         date.getFullYear(),
         date.getMonth() + 1,
         date.getDate()
      )
   },
   set: (value) => {
      state.value.due_date = value?.toString()
   },
})

</script>

<template>
   <UForm
      :schema
      :state
      @submit="onSubmit"
      class="grid grid-cols-3 gap-4"
   >
      <div class="col-span-2">
         <div class="space-y-4">
            <UFormField
               name="title"
               label="Title"
            >
               <UTextarea
                  v-model="state.title"
                  :rows="1"
                  autoresize
                  :ui="{
                     root: /* @tw */ 'w-full',
                  }"
               />
            </UFormField>
            <UFormField
               name="description"
               label="Description"
               hint="Optional"
            >
               <UTextarea
                  v-model="state.description"
                  :loading
                  :rows="3"
                  autoresize
                  :ui="{
                     root: /* @tw */ 'w-full',
                  }"
               />
            </UFormField>
         </div>
      </div>
      <div class="space-y-4">
         <UFormField
            name="status_id"
            label="Status"
         >
            <SelectStatus
               v-model="state.status_id"
               class="w-full"
            />
         </UFormField>
         <UFormField
            name="priority"
            label="Priority"
            hint="Optional"
         >
            <div class="flex items-center gap-2">
               <SelectTaskPriority
                  v-model="state.priority"
                  class="w-full"
               />
               <UButton
                  v-if="!!state.priority"
                  icon="lucide:x"
                  variant="link"
                  color="neutral"
                  size="sm"
                  @click="state.priority = undefined"
               />
            </div>
         </UFormField>
         <UFormField
            name="assignee_id"
            label="Assignee"
            hint="Optional"
         >
            <div class="flex items-center gap-2">
               <SelectUser
                  v-model="state.assignee_id"
                  class="w-full"
               />
               <UButton
                  v-if="!!state.assignee_id"
                  icon="lucide:x"
                  variant="link"
                  color="neutral"
                  size="sm"
                  @click="state.assignee_id = undefined"
               />
            </div>
         </UFormField>
         <UFormField
            name="due_date"
            label="Due Date"
            hint="Optional"
         >
            <div class="flex items-center gap-2">
               <UInputDate
                  v-model="dueDateModel"
                  :ui="{
                     base: /* @tw */ 'w-full',
                  }"
                  ref="inputDateRef"
               >
                  <template #trailing>
                     <UPopover :reference="inputDateRef?.inputsRef[3]?.$el">
                        <UButton
                           color="neutral"
                           variant="link"
                           icon="lucide:calendar"
                           size="sm"
                           class="px-0"
                        />
                        <template #content>
                           <UCalendar
                              v-model="dueDateModel"
                              class="p-2"
                           />
                        </template>
                     </UPopover>
                  </template>
               </UInputDate>
               <UButton
                  v-if="!!state.due_date"
                  icon="lucide:x"
                  variant="link"
                  color="neutral"
                  size="sm"
                  @click="state.due_date = undefined"
               />
            </div>
         </UFormField>
      </div>
      <div class="col-span-full flex items-center justify-end">
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
