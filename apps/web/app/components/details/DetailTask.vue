<script setup lang="ts">
const props = defineProps<{
   data: Model.Task
}>()

const dayjs = useDayjs()

const isPastDueDate = computed(() => {
   if (!props.data.due_date) return 0
   const now = dayjs()
   const dueDate = dayjs(props.data.due_date)
   return now.diff(dueDate) > 0
})
</script>

<template>
   <div class="grid grid-cols-3 gap-4">
      <div class="col-span-2">
         <div class="space-y-4">
            <h2 class="text-2xl font-semibold text-pretty">
               {{ props.data.title }}
            </h2>
            <p class="text-toned text-pretty">
               {{ props.data.description }}
            </p>
         </div>
      </div>
      <div class="text-sm">
         <div class="space-y-4">
            <div class="flex gap-4">
               <div class="w-1/3 text-toned font-medium">Status</div>
               <div class="flex-1">
                  <UBadge
                     :color="$resolveTaskStatusColor(props.data.status)"
                     variant="subtle"
                  >
                     {{ props.data.status.name }}
                  </UBadge>
               </div>
            </div>
            <div class="flex gap-4">
               <div class="w-1/3 text-toned font-medium">Priority</div>
               <div class="flex-1">
                  <UBadge
                     :color="$resolveTaskPriorityColor(props.data.priority)"
                     variant="subtle"
                  >
                     {{ props.data.priority }}
                  </UBadge>
               </div>
            </div>
            <div class="flex gap-4">
               <div class="w-1/3 text-toned font-medium">Assignee</div>
               <div class="flex-1">
                  <UUser
                     v-if="props.data.assignee"
                     :name="props.data.assignee.name"
                     :description="props.data.assignee.email"
                     :avatar="{
                        text: props.data.assignee.name.charAt(0),
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
                  <div v-if="props.data.due_date">
                     <p
                        :class="[isPastDueDate ? 'text-error' : 'text-default']"
                     >
                        {{
                           dayjs(props.data.due_date).format(
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
                                 milliseconds: dayjs(props.data.due_date).diff(
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
      </div>
   </div>
</template>
