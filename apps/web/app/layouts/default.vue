<template>
   <LayoutHeader class="fixed top-0 inset-x-0 w-full border-b border-muted z-20" />
   <LayoutSidebar class="fixed start-0 inset-y-0 h-full border-e border-muted z-20" />
   <main class="main-height ms-(--sidebar-width) mt-(--header-height) p-4 bg-muted">
      <slot />
   </main>
</template>

<style scoped>
.main-height {
   min-height: calc(100vh - var(--header-height));
}
</style>
