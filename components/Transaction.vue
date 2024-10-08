<template>
  <div
    class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 space-x-4 col-span-2"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-1">
        <UIcon :name="icon" :class="iconColor" />
        <div :class="iconColor">{{ transaction.description }}</div>
      </div>

      <div v-if="transaction.category">
        <UBadge color="white">{{ transaction.category }}</UBadge>
      </div>
    </div>

    <div class="flex items-start justify-end space-x-2">
      <div>{{ currency }}</div>
      <div>
        <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
          <UButton
            color="white"
            variant="ghost"
            trailing-icon="i-heroicons-ellipsis-horizontal"
            :loading="isLoading"
          />
        </UDropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  transaction: Object,
});

const emit = defineEmits(["delete"]);

const supabase = useSupabaseClient();

const { currency } = useCurrency(props.transaction.amount);

const { toastSuccess, toastError } = useAppToast();

const isLoading = ref(false);

const deleteTransaction = async () => {
  isLoading.value = true;
  try {
    await supabase.from("transactions").delete().eq("id", props.transaction.id);

    toastSuccess("Delete successfully.");

    emit("delete");
  } catch (error) {
    toastError("Delete error.", error.message);
  } finally {
    isLoading.value = false;
  }
};

const items = [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => console.log("Edit"),
    },
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: deleteTransaction,
    },
  ],
];

const isIncome = computed(() => props.transaction.type === "Income");

const icon = computed(() =>
  isIncome.value ? "i-heroicons-arrow-up-right" : "i-heroicons-arrow-down-right"
);

const iconColor = computed(() => (isIncome.value ? "green" : "red"));
</script>

<style scoped>
.green {
  @apply text-green-600 dark:text-green-400;
}
.red {
  @apply text-red-600 dark:text-red-400;
}
</style>