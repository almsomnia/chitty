<script setup lang="ts">
import type { ButtonProps } from "#ui/types"

const props = withDefaults(
   defineProps<{
      prompt?: string
      positiveButtonLabel?: string
      positiveButtonVariant?: ButtonProps["variant"]
      positiveButtonColor?: ButtonProps["color"]
      positiveButtonIcon?: string
      negativeButtonLabel?: string
      negativeButtonVariant?: ButtonProps["variant"]
      negativeButtonColor?: ButtonProps["color"]
      negativeButtonIcon?: string
   }>(),
   {
      prompt: "Confirm action?",
      positiveButtonLabel: "Confirm",
      positiveButtonVariant: "solid",
      positiveButtonColor: "primary",
      positiveButtonIcon: "lucide:check",
      negativeButtonLabel: "Cancel",
      negativeButtonVariant: "soft",
      negativeButtonColor: "neutral",
      negativeButtonIcon: "lucide:x",
   }
)

const emit = defineEmits<{
   negative: []
   positive: []
}>()
</script>

<template>
   <div class="flex flex-col items-center justify-center gap-4">
      <div class="mt-2">
         <Icon
            name="lucide:alert-circle"
            class="text-toned size-12"
         />
      </div>
      <p class="text-sm">
         {{ props.prompt }}
      </p>
      <div class="flex items-center gap-2 w-full mt-4">
         <UButton
            :icon="props.negativeButtonIcon"
            :color="props.negativeButtonColor"
            :variant="props.negativeButtonVariant"
            block
            class="flex-1"
            @click="() => emit('negative')"
         >
            {{ props.negativeButtonLabel }}
         </UButton>
         <UButton
            :icon="props.positiveButtonIcon"
            block
            class="flex-1"
            :color="props.positiveButtonColor"
            :variant="props.positiveButtonVariant"
            @click="() => emit('positive')"
         >
            {{ props.positiveButtonLabel }}
         </UButton>
      </div>
   </div>
</template>
