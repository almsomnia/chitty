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

onMounted(() => {
   if (props.data) {
      for (const i in state.value) {
         if (i === "due_date" && props.data.due_date) {
            state.value.due_date = useDayjs()(props.data.due_date).format(
               "YYYY-MM-DD"
            )
         } else {
            // @ts-ignore
            state.value[i] = props.data[i]
         }
      }
   }
})
</script>

<template>
   <UForm
      :schema
      :state
      @submit="onSubmit"
      class="grid grid-cols-3 gap-4 items-start"
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
                  :maxrows="2"
                  autoresize
                  size="lg"
                  :ui="{
                     root: /* @tw */ 'w-full',
                     base: 'text-base',
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
                  :maxrows="16"
                  :ui="{
                     root: /* @tw */ 'w-full',
                  }"
               />
            </UFormField>
         </div>
      </div>
      <div class="space-y-4 sticky top-0">
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
            <UFieldGroup class="w-full">
               <SelectTaskPriority
                  v-model="state.priority"
                  class="w-full"
               />
               <UButton
                  icon="lucide:x"
                  color="neutral"
                  variant="outline"
                  size="sm"
                  :disabled="!state.priority"
                  @click="state.priority = undefined"
               />
            </UFieldGroup>
         </UFormField>
         <UFormField
            name="assignee_id"
            label="Assignee"
            hint="Optional"
         >
            <UFieldGroup class="w-full">
               <SelectUser
                  v-model="state.assignee_id"
                  class="w-full"
               />
               <UButton
                  icon="lucide:x"
                  variant="outline"
                  color="neutral"
                  size="sm"
                  :disabled="!state.assignee_id"
                  @click="state.assignee_id = undefined"
               />
            </UFieldGroup>
         </UFormField>
         <UFormField
            name="due_date"
            label="Due Date"
            hint="Optional"
         >
            <UFieldGroup class="w-full">
               <UInputDate
                  v-model="dueDateModel"
                  :ui="{
                     base: /* @tw */ 'w-full rounded-e-none',
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
                  icon="lucide:x"
                  variant="outline"
                  color="neutral"
                  size="sm"
                  :disabled="!state.due_date"
                  @click="state.due_date = undefined"
               />
            </UFieldGroup>
         </UFormField>
      </div>
      <div class="col-span-full flex items-center justify-end gap-2">
         <slot name="actions" />
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
