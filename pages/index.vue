<template>
  <div>
    <section class="flex justify-between items-center mb-10">
      <h1 class="text-4xl font-extrabold">Summary</h1>
      <div>
        <USelectMenu v-model="selectedView" :options="transactionViewOptions" />
      </div>
    </section>

    <section
      class="grid grid-cols-1 sm:grid-cols-2 sm:gap-16 lg:grid-cols-4 mb-10"
    >
      <Trend
        color="green"
        title="Income"
        :amount="4000"
        :last-amount="3000"
        :loading="false"
      />
      <Trend
        color="red"
        title="Income"
        :amount="4000"
        :last-amount="3000"
        :loading="false"
      />
      <Trend
        color="red"
        title="Income"
        :amount="4000"
        :last-amount="3000"
        :loading="false"
      />
      <Trend
        color="green"
        title="Income"
        :amount="4000"
        :last-amount="3000"
        :loading="true"
      />
    </section>
  </div>
</template>

<script setup>
import { transactionViewOptions } from "~/constants";
const selectedView = ref(transactionViewOptions[1]);
</script>