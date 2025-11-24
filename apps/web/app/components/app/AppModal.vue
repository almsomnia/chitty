<script setup lang="ts">
const props = withDefaults(
   defineProps<{
      title: string
   }>(),
   {
      title: "Modal",
   }
)
const open = defineModel<boolean>({ required: true })
</script>

<template>
   <UModal
      v-model:open="open"
      :title="props.title"
      dismissible
   >
      <template #body>
         <slot />
      </template>
   </UModal>
</template>
