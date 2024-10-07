export const useFetchTransactions = (period) => {
    const supabase = useSupabaseClient();

    const transactions = ref([]);

    const isLoading = ref(false);

    const income = computed(() =>
        transactions.value.filter((transaction) => transaction.type == "Income")
    );

    const expense = computed(() =>
        transactions.value.filter((transaction) => transaction.type == "Expense")
    );

    const incomeCount = computed(() => income.value.length);

    const expenseCount = computed(() => expense.value.length);

    const incomeTotal = computed(() =>
        income.value.reduce((sum, transaction) => sum + transaction.amount, 0)
    );

    const expenseTotal = computed(() =>
        expense.value.reduce((sum, transaction) => sum + transaction.amount, 0)
    );

    const transactionsGroupedByDate = computed(() => {
        let grouped = {};

        for (const transaction of transactions.value) {
            const date = transaction.created_at.split("T")[0];

            if (!grouped[date]) {
                grouped[date] = [];
            }

            grouped[date].push(transaction);
        }

        return grouped;
    });

    const fetchTransactions = async () => {
        isLoading.value = true;
        try {
            const { data } = await useAsyncData(`transactions-${period.value.from.toDateString()}-${period.value.to.toDateString()}`, async () => {
                const { data, error } = await supabase
                    .from("transactions")
                    .select()
                    .gte('created_at', period.value.from.toISOString())
                    .lte('created_at', period.value.to.toISOString())
                    .order("created_at", {
                        ascending: false,
                    });

                if (error) return [];

                return data;
            });

            return data.value;
        } finally {
            isLoading.value = false;
        }
    };

    const refreshTransactions = async () => {
        transactions.value = await fetchTransactions()

    };

    watch(period, async () => await refreshTransactions());

    return {
        transactions: {
            all: transactions,
            grouped: {
                byDate: transactionsGroupedByDate,
            },
            income,
            expense,
            incomeCount,
            expenseCount,
            incomeTotal,
            expenseTotal,
        },
        isLoading,
        refreshTransactions,
    };
}