<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="View Option" :required="true" name="view_option">
      <USelect
        :options="transactionViewOptions"
        placeholder="View Option"
        v-model="state.view_option"
      />
    </UFormGroup>

    <UButton type="submit" :loading="pending" :disabled="pending">
      Submit
    </UButton>
  </UForm>
</template>

<script setup>
import { z } from "zod";
import { transactionViewOptions } from "~/constants";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { toastSuccess, toastError } = useAppToast();
const pending = ref(false);

const schema = z.object({
  view_option: z.string(),
});

const state = ref({
  view_option: user.value?.user_metadata?.view_option,
});

const onSubmit = async () => {
  pending.value = true;

  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        view_option: state.value.view_option,
      },
    });

    if (error) {
      throw error;
      return;
    }

    toastSuccess("Settings updated");
  } catch (error) {
    toastError("Error updating settings", error.message);
  } finally {
    pending.value = false;
  }
};
</script>