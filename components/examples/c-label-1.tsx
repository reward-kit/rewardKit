import { Field } from "@rewardkit/packages/ui/components/field"
import { Input } from "@rewardkit/packages/ui/components/input"
import { Label } from "@rewardkit/packages/ui/components/label"

export function Pattern() {
  return (
    <Field className="w-full max-w-xs">
      <Label htmlFor="label-demo-username">Username</Label>
      <Input id="label-demo-username" placeholder="Enter your username…" />
    </Field>
  )
}