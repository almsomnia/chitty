<script setup lang="ts"></script>

<template>
   <UDashboardGroup
      unit="rem"
      storage="local"
   >
      <LayoutSidebar />
      <UDashboardPanel>
         <template #header>
            <LayoutHeader />
         </template>
         <template #body>
            <slot />
         </template>
      </UDashboardPanel>
   </UDashboardGroup>
</template>
