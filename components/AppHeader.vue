<template>
  <div class="flex justify-between items-center mt-10">
    <NuxtLink to="/" class="text-xl font-bold">Finance Tracker</NuxtLink>
    <div>
      <UDropdown
        :items="items"
        :ui="{ item: { disabled: 'cursor-text select-text' }, width: 'w-64' }"
        v-if="user"
      >
        <UAvatar
          src="https://avatars.githubusercontent.com/u/739984?v=4"
          alt="Avatar"
        />
        <template #account="{ item }">
          <div class="text-left">
            <p class="font-bold text-black dark:text-white">
              Hi, {{ item.label }}
            </p>
          </div>
        </template>
        <template #item="{ item }">
          <div
            class="flex items-center justify-between w-full"
            @click="item.onClick"
          >
            <span class="truncate">{{ item.label }}</span>
            <UIcon
              :name="item.icon"
              class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
            />
          </div>
        </template>
      </UDropdown>
    </div>
  </div>
</template>
<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const items = [
  [
    {
      label: user.value?.email,
      slot: "account",
      disabled: true,
    },
  ],
  [
    {
      label: "Settings",
      icon: "i-heroicons-cog-8-tooth",
      onClick: () => console.log("Link to settings in the future"),
    },
    {
      label: "Sign out",
      icon: "i-heroicons-arrow-left-on-rectangle",
      onClick: async () => {
        await supabase.auth.signOut();
        return navigateTo("/login");
      },
    },
  ],
];
</script>