import toast from "react-hot-toast";

export const doCopyText = (str: string) => {
    navigator.clipboard.writeText(str);
    toast.success("Copied.")
}