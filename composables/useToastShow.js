
export const useToastShow = (title, type, description = "") => {
    const toast = useToast();
    let icon;
    let color;

    switch (type) {
        case 'success':
            icon = "i-heroicons-check-circle";
            color = "green";
            break;
        case 'error':
            icon = "i-heroicons-exclamation-circle";
            color = "red";
            break;
        default:
            break;
    }

    toast.add({
        title,
        description,
        icon,
        color,
    });
}