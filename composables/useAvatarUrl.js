export const useAvatarUrl = () => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const getAvatarUrl = () => {
        const fileName = user.value?.user_metadata?.avatar_url;
        if (!fileName) return '/avatar-default.png'

        const { data } = supabase
            .storage
            .from('avatars')
            .getPublicUrl(fileName)

        return data.publicUrl;
    }

    const avatarUrl = ref()

    watch(user, () => avatarUrl.value = getAvatarUrl(), {
        immediate: true,
    })

    return {
        avatarUrl,
    }
}