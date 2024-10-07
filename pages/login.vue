<template>
  <UCard v-if="!success">
    <template #header> Sign-in to Finance Tracker </template>
    <form class="space-y-4" @submit.prevent="handleSignIn">
      <UFormGroup
        label="Email"
        name="email"
        :required="true"
        help="You will receive an email with the confirmation link"
      >
        <UInput
          type="email"
          placeholder="Email"
          v-model="email"
          :required="true"
        />
      </UFormGroup>

      <UButton
        type="submit"
        variant="solid"
        color="blue"
        label="Sign In"
        :loading="pending"
        :disabled="pending"
      />
    </form>
  </UCard>
  <UCard v-else>
    <template #header> Email has been sent </template>

    <div class="text-center">
      <p class="mb-4">
        We have sent an email to <strong>{{ email }}</strong> with a link to
        sign-in.
      </p>
      <p><strong>Important:</strong> The link will expire in 5 minutes.</p>
    </div>
  </UCard>
</template>

<script setup>
const supabase = useSupabaseClient();
const success = ref(false);
const email = ref("");
const pending = ref(false);

useRedirectIfAuthenticated();

const handleSignIn = async () => {
  pending.value = true;

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: "http://localhost:3000/confirm",
      },
    });

    if (error) {
      useToastShow("Error authentication.", "error", error.message);
    } else {
      success.value = true;
    }
  } finally {
    pending.value = false;
  }
};
</script>