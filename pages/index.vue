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
        :amount="incomeTotal"
        :last-amount="previousIncomeTotal"
        :loading="isLoading"
      />
      <Trend
        color="red"
        title="Expense"
        :amount="expenseTotal"
        :last-amount="previousExpenseTotal"
        :loading="isLoading"
      />
      <Trend
        color="red"
        title="Investments"
        :amount="4000"
        :last-amount="4500"
        :loading="isLoading"
      />
      <Trend
        color="green"
        title="Saving"
        :amount="2500"
        :last-amount="3000"
        :loading="isLoading"
      />
    </section>

    <section class="flex items-center justify-between mb-10">
      <div>
        <h2 class="text-2xl font-extrabold">Transactions</h2>
        <div class="text-gray-500 dark:text-gray-400">
          You have {{ incomeCount }} incomes and {{ expenseCount }} expenses
          this period
        </div>
      </div>
      <div>
        <TransactionModal v-model="isOpen" @saved="refreshTransactionsAll" />

        <UButton
          icon="i-heroicons-plus-circle"
          color="white"
          variant="solid"
          label="Add"
          @click="isOpen = true"
        />
      </div>
    </section>

    <section v-if="!isLoading">
      <div v-for="(transactions, date) in byDate" :key="date" class="mb-10">
        <DailyTransactionSummary :date="date" :transactions="transactions" />
        <Transaction
          v-for="transaction in transactions"
          :key="transaction.id"
          :transaction="transaction"
          @delete="refreshTransactionsAll"
          @edited="refreshTransactionsAll"
        />
      </div>
    </section>
    <section v-else>
      <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
    </section>
  </div>
</template>

<script setup>
useHead({
  title: "Dashboard",
});

import { transactionViewOptions } from "~/constants";

const user = useSupabaseUser();
const selectedView = ref(
  user.value?.user_metadata?.transaction_view_option ??
    transactionViewOptions[1]
);
const { current, previous } = useSelectedTimePeriod(selectedView);
const isOpen = ref(false);

const {
  transactions: {
    grouped: { byDate },
    incomeCount,
    expenseCount,
    incomeTotal,
    expenseTotal,
  },
  isLoading,
  refreshTransactions: refreshTransactionsCurrent,
} = useFetchTransactions(current);
await refreshTransactionsCurrent();

const {
  transactions: {
    incomeTotal: previousIncomeTotal,
    expenseTotal: previousExpenseTotal,
  },
  refreshTransactions: refreshTransactionsPrevious,
} = useFetchTransactions(previous);
await refreshTransactionsPrevious();

const refreshTransactionsAll = async () => {
  await refreshTransactionsCurrent();
  await refreshTransactionsPrevious();
};
</script>