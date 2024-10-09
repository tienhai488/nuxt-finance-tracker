<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        {{ isEditing ? "Edit" : "Add" }} Transaction
      </template>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        ref="form"
        @submit="onSubmit"
      >
        <UFormGroup label="Type" required name="type">
          <USelect
            placeholder="Type"
            :options="types"
            v-model="state.type"
            :disabled="isEditing"
          />
        </UFormGroup>

        <UFormGroup label="Amount" required name="amount">
          <UInput type="number" v-model.number="state.amount" />
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

        <UButton
          type="submit"
          color="blue"
          variant="solid"
          label="Submit"
          :loading="isLoading"
        />
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup>
import { types, categories } from "~/constants";
import { z } from "zod";

const supabase = useSupabaseClient();

const props = defineProps({
  modelValue: Boolean,
  transaction: {
    type: Object,
    required: false,
  },
});

const isEditing = computed(() => !!props.transaction);

const emit = defineEmits(["update:modelValue", "saved"]);

const form = ref(null);

const isLoading = ref(false);

const { toastSuccess, toastError } = useAppToast();

const onSubmit = async () => {
  if (form.value.errors.length) return;

  isLoading.value = true;
  try {
    const { error } = await supabase
      .from("transactions")
      .upsert({ ...state.value, id: props.transaction?.id })
      .select();

    if (!error) {
      toastSuccess("Saved successfully.");
      isOpen.value = false;
      emit("saved");
      return;
    }

    throw error;
  } catch (error) {
    toastError("Save error.", error.message);
  } finally {
    isLoading.value = false;
  }
};

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) resetForm();
    emit("update:modelValue", value);
  },
});

const initState = isEditing.value
  ? {
      type: props.transaction.type,
      amount: props.transaction.amount,
      created_at: props.transaction.created_at.split("T")[0],
      category: props.transaction.category,
      description: props.transaction.description,
    }
  : {
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