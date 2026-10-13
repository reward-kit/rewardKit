import { createFormHook } from "@tanstack/react-form-nextjs"
import { fieldContext, formContext } from "./form-context"
import { TextField } from "./fields/text.field"
import { SelectField } from "./fields/select.field"
import { SubmitButton } from "./elements/submit.button"
import { TextareaField } from "./fields/textarea.field"

export const { useAppForm } = createFormHook({
    fieldComponents: { TextField, SelectField, TextareaField },
    formComponents: { SubmitButton },
    fieldContext,
    formContext,
})