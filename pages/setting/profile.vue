<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="Full Name" name="fullname" :required="true">
      <UInput v-model="state.fullname" placeholder="Full Name" />
    </UFormGroup>

    <UFormGroup
      label="Email"
      name="email"
      :required="true"
      help="You will receive a confirmation email on both the old and the new addresses if you modify the email address"
    >
      <UInput v-model="state.email" placeholder="Email" />
    </UFormGroup>

    <UButton type="submit" :loading="pending" :disabled="pending">
      Submit
    </UButton>
  </UForm>
</template>

<script setup>
import { z } from "zod";

const supabase = useSupabaseClient();
const { toastSuccess, toastError } = useAppToast();
const user = useSupabaseUser();
const pending = ref(false);

const schema = z.object({
  fullname: z.string(),
  email: z.string().email("Invalid email"),
});

const state = ref({
  fullname: user.value?.user_metadata?.fullname,
  email: user.value?.email,
});

const onSubmit = async () => {
  pending.value = true;

  try {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        fullname: state.value.fullname,
      },
      email: state.value.email,
    });

    if (error) {
      throw error;
      return;
    }

    toastSuccess("Profile updated", "Your profile has been updated");
  } catch (error) {
    toastError("Error updating profile", error.message);
  } finally {
    pending.value = false;
  }
};
</script>