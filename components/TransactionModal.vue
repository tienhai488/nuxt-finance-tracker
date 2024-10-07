<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header> Add Transaction </template>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        ref="form"
        @submit="onSubmit"
      >
        <UFormGroup label="Type" required name="type">
          <USelect placeholder="Type" :options="types" v-model="state.type" />
        </UFormGroup>

        <UFormGroup label="amount" required name="amount">
          <UInput
            type="number"
            placeholder="Amount"
            v-model.number="state.amount"
          />
        </UFormGroup>

        <UFormGroup label="Date" required name="created_at">
          <UInput
            placeholder="Date"
            type="date"
            icon="i-heroicons-calendar"
            v-model="state.created_at"
          />
        </UFormGroup>

        <UFormGroup
          label="Category"
          required
          name="category"
          v-if="state.type === 'Expense'"
        >
          <USelect
            placeholder="Category"
            :options="categories"
            v-model="state.category"
          />
        </UFormGroup>

        <UFormGroup label="Description" required name="description">
          <UTextarea placeholder="Description" v-model="state.description" />
        </UFormGroup>

        <UButton type="submit" color="blue" variant="solid" label="Submit" />
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup>
import { types, categories } from "~/constants";
import { z } from "zod";

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const form = ref(null);

const onSubmit = async () => {
  if (form.value.errors.length) return;
};

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) resetForm();
    emit("update:modelValue", value);
  },
});

const initState = {
  type: undefined,
  amount: 0,
  created_at: undefined,
  category: undefined,
  description: undefined,
};

const state = ref({
  ...initState,
});

const resetForm = () => {
  Object.assign(state.value, initState);
  form.value.clear();
};

const defaultSchema = z.object({
  amount: z.number().gt(0, { message: "Amount must be greater than 0" }),
  created_at: z.string(),

  description: z.string(),
});

const incomeSchema = z.object({
  type: z.literal("Income"),
});

const expenseSchema = z.object({
  type: z.literal("Expense"),
  category: z.enum(categories),
});

const investmentSchema = z.object({
  type: z.literal("Investment"),
});

const savingSchema = z.object({
  type: z.literal("Saving"),
});

const schema = z.intersection(
  z.discriminatedUnion("type", [
    incomeSchema,
    expenseSchema,
    investmentSchema,
    savingSchema,
  ]),
  defaultSchema
);
</script>