<template>
   <div
      class="fixed top-0 start-[calc(var(--sidebar-width)+(var(--spacing)*2))] end-0 z-20 m-2"
   >
      <LayoutHeader class="rounded-xl shadow-md" />
   </div>
   <div class="fixed start-0 inset-y-0 z-20 ms-2 my-2">
      <LayoutSidebar class="rounded-xl shadow-md h-full" />
   </div>
   <main
      class="main-height ms-[calc(var(--sidebar-width)+(var(--spacing)*2))] mt-[calc(var(--header-height)+(var(--spacing)*2))] p-4"
   >
      <slot />
   </main>
</template>

<style scoped>
.main-height {
   min-height: calc(100vh - var(--header-height) - (var(--spacing) * 2));
}
</style>
