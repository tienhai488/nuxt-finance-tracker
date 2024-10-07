<template>
  <div>
    <div class="font-bold" :class="[color]">{{ title }}</div>

    <div class="text-2xl font-extrabold text-black dark:text-white mb-2">
      <USkeleton class="h-8 w-full" v-if="loading" />
      <div v-else>{{ currency }}</div>
    </div>

    <div>
      <USkeleton class="h-6 w-full" v-if="loading" />
      <div class="flex space-x-1 items-center text-sm" v-else>
        <UIcon
          :name="iconTrend"
          class="w-6 h-6"
          :class="trendingUp ? 'green' : 'red'"
        />
        <div class="text-gray-500 dark:text-gray-400">
          {{ percentTrend }} vs last period
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  color: String,
  title: String,
  amount: Number,
  lastAmount: Number,
  loading: Boolean,
});

const trendingUp = computed(() => props.amount >= props.lastAmount);

const iconTrend = computed(() =>
  trendingUp.value
    ? "i-heroicons-arrow-trending-up"
    : "i-heroicons-arrow-trending-down"
);

const percentTrend = computed(() => {
  if (props.amount == 0 || props.lastAmount == 0) return "∞%";

  const bigger = Math.max(props.amount, props.lastAmount);
  const lower = Math.min(props.amount, props.lastAmount);

  const percent = ((bigger - lower) / lower) * 100;

  return Math.round(percent * 100) / 100 + "%";
});

const currency = computed(() => {
  const { currency } = useCurrency(props.amount);

  return currency;
});
</script>

<style scoped>
.green {
  @apply text-green-600 dark:text-green-400;
}
.red {
  @apply text-red-600 dark:text-red-400;
}
</style>