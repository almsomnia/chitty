<script setup lang="ts">
import type { UpdateTaskSchema } from "~~/shared/utils/validation-schemas/tasks"

const props = defineProps<{
   data: Model.Task | Ref<Model.Task>
}>()

const emit = defineEmits<{
   refresh: [data: Model.Task]
}>()

const localData = ref<Model.Task>(unref(props.data))
watch(
   () => unref(props.data),
   (val) => {
      localData.value = val
   }
)

const appStore = useAppStore()
const dayjs = useDayjs()

const isPastDueDate = computed(() => {
   if (!localData.value.due_date) return 0
   const now = dayjs()
   const dueDate = dayjs(localData.value.due_date)
   return now.diff(dueDate) > 0
})

const editMode = shallowRef(false)

async function onUpdate(values: UpdateTaskSchema) {
   try {
      const res = await $api<API.Response<Model.Task>>(
         `/api/tasks/${localData.value.id}`,
         {
            method: "put",
            body: values,
         }
      )
      localData.value = res.data
      appStore.notify({
         title: res.meta.message,
         color: "success",
      })
      editMode.value = false
      emit("refresh", res.data)
   } catch (e) {}
}
</script>

<template>
   <div
      v-if="!editMode"
      class="grid grid-cols-3 gap-8 relative items-start"
   >
      <div class="col-span-2 w-4/5 mx-auto">
         <div class="space-y-4">
            <h2 class="text-2xl font-semibold text-pretty">
               {{ localData.title }}
            </h2>
            <p class="text-toned text-pretty">
               {{ localData.description }}
            </p>
         </div>
      </div>
      <UCard
         variant="outline"
         class="text-sm sticky top-0"
         :ui="{
            header: 'p-4 sm:px-4',
         }"
      >
         <template #header>
            <div class="flex items-center justify-between">
               <span class="text-muted text-sm">
                  Created
                  {{ dayjs(localData.created_at).format("DD MMM YYYY") }}
               </span>
               <div class="flex items-center gap-1">
                  <UTooltip text="Edit">
                     <UButton
                        @click="editMode = true"
                        icon="lucide:edit"
                        size="sm"
                        variant="link"
                        color="neutral"
                     />
                  </UTooltip>
                  <UTooltip text="Delete">
                     <UButton
                        icon="lucide:trash"
                        size="sm"
                        variant="link"
                        color="error"
                     />
                  </UTooltip>
               </div>
            </div>
         </template>
         <div class="space-y-4">
            <div class="flex gap-4">
               <div class="w-1/3 text-toned font-medium">Status</div>
               <div class="flex-1">
                  <UBadge
                     :color="$resolveTaskStatusColor(localData.status)"
                     variant="subtle"
                  >
                     {{ localData.status.name }}
                  </UBadge>
               </div>
            </div>
            <div class="flex gap-4">
               <div class="w-1/3 text-toned font-medium">Priority</div>
               <div class="flex-1">
                  <UBadge
                     :color="$resolveTaskPriorityColor(localData.priority)"
                     variant="subtle"
                  >
                     {{ localData.priority }}
                  </UBadge>
               </div>
            </div>
            <div class="flex gap-4">
               <div class="w-1/3 text-toned font-medium">Assignee</div>
               <div class="flex-1">
                  <UUser
                     v-if="localData.assignee"
                     :name="localData.assignee.name"
                     :description="localData.assignee.email"
                     :avatar="{
                        text: localData.assignee.name.charAt(0),
                     }"
                  />
                  <span
                     v-else
                     class="italic text-toned"
                  >
                     Unassigned
                  </span>
               </div>
            </div>
            <div class="flex gap-4">
               <div class="w-1/3 text-toned font-medium">Due Date</div>
               <div class="flex-1">
                  <div v-if="localData.due_date">
                     <p
                        :class="[isPastDueDate ? 'text-error' : 'text-default']"
                     >
                        {{
                           dayjs(localData.due_date).format(
                              "DD MMM YYYY HH:mm"
                           )
                        }}
                     </p>
                     <span
                        v-if="isPastDueDate"
                        class="text-xs text-error"
                     >
                        Overdue by
                        {{
                           dayjs
                              .duration({
                                 milliseconds: dayjs(localData.due_date).diff(
                                    dayjs()
                                 ),
                              })
                              .humanize(false)
                        }}
                     </span>
                  </div>
                  <span
                     v-else
                     class="text-toned italic"
                  >
                     No due date set
                  </span>
               </div>
            </div>
         </div>
      </UCard>
   </div>
   <FormTask
      v-else
      :data="localData"
      @submit="onUpdate"
   >
      <template #actions>
         <UButton
            label="Cancel"
            icon="lucide:x"
            variant="link"
            color="neutral"
            @click="editMode = false"
         />
      </template>
   </FormTask>
</template>
