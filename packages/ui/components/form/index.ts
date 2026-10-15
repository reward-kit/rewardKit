import { createFormHook } from "@tanstack/react-form-nextjs"
import { fieldContext, formContext } from "./form-context"
import { TextField } from "./fields/text.field"
import { SelectField } from "./fields/select.field"
import { SubmitButton } from "./elements/submit.button"
import { TextareaField } from "./fields/textarea.field"
import { MultiSelectField } from "./fields/multiselect.field"
import { SwitchField } from "./fields/switch.field"
import { RadioField } from "./fields/radio.field"
import { CommandAvatarField } from "./fields/command.field"

export const { useAppForm } = createFormHook({
    fieldComponents: { TextField, SelectField, TextareaField, MultiSelectField, SwitchField, RadioField, CommandAvatarField },
    formComponents: { SubmitButton },
    fieldContext,
    formContext,
})