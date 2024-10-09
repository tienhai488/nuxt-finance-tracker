<template>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <UFormGroup
      label="Current avatar"
      class="w-full"
      help="This would be blank by default"
    >
      <UAvatar :src="avatarUrl" size="3xl" />
    </UFormGroup>

    <UFormGroup
      label="New avatar"
      class="w-full"
      name="avatar"
      :required="true"
      help="After choosing an image click Save to actually upload the new avatar"
    >
      <UInput type="file" ref="fileInput" />
    </UFormGroup>

    <UButton
      type="submit"
      color="blue"
      variant="solid"
      label="Save"
      :loading="pending"
      :disabled="pending"
    />
  </form>
</template>

<script setup>
import { z } from "zod";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { toastSuccess, toastError } = useAppToast();
const pending = ref(false);
const fileInput = ref();
const { avatarUrl } = useAvatarUrl();

const onSubmit = async () => {
  const file = fileInput.value.input.files[0];

  if (!file) {
    toastError("Select a file to upload first");
    return;
  }

  const ext = file.name.split(".").pop();
  const fileName = `${Math.random()}.${ext}`;

  try {
    pending.value = true;

    const currentAvatarUrl = user.value?.user_metadata?.avatar_url;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    const { errorUpdateUser } = await supabase.auth.updateUser({
      data: {
        avatar_url: fileName,
      },
    });

    if (errorUpdateUser) {
      throw error;
    }

    if (currentAvatarUrl) {
      const { error } = await supabase.storage
        .from("avatars")
        .remove([currentAvatarUrl]);
      if (error) throw error;
    }

    fileInput.value.input.value = null;

    toastSuccess("Avatar uploaded");
  } catch (error) {
    toastError("Error uploading avatar", error.message);
  } finally {
    pending.value = false;
  }
};
</script>