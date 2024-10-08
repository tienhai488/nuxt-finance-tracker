<template>
  <div class="grid grid-cols-6 gap-8">
    <UVerticalNavigation :links="links" class="col-span-2" />
    <div class="col-span-4">
      <NuxtPage />
    </div>
  </div>
</template>
  
  <script setup>
const links = [
  {
    label: "Profile",
    to: "/setting/profile",
    icon: "i-heroicons-user-circle",
  },
  {
    label: "Avatar",
    to: "/setting/avatar",
    icon: "i-heroicons-wrench",
  },
  {
    label: "View Option",
    to: "/setting/view-option",
    icon: "i-heroicons-adjustments-horizontal",
  },
];
</script>