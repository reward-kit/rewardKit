// app/onboarding/page.tsx
"use client"

import { useOrganization, useOrganizationList, useSession } from "@clerk/nextjs"
import { useDebounce } from "@rewardkit/hooks/useDebounce"
import { buildCurrencyOptions } from "@rewardkit/lib/amount/currency"
import { toSubdomain, validateSubdomain } from "@rewardkit/lib/domain"
import { useCheckSubdomain, useProgram } from "@rewardkit/packages/features/program/hooks/useProgram"
import { PROGRAM_COMMISSION_TYPE, type ProgramResource } from "@rewardkit/packages/types/program/program.schema"
import { normalizeWebsiteUrl, ZWebsiteUrl } from "@rewardkit/packages/types/website/website.schema"
import { Button } from "@rewardkit/packages/ui/components/button"
import { ChipSelectInput } from "@rewardkit/packages/ui/components/input/chip-select.input"
import { CommandAvatarInput } from "@rewardkit/packages/ui/components/input/command.avatar.input"
import { SelectInput } from "@rewardkit/packages/ui/components/input/select.input"
import { TextInput } from "@rewardkit/packages/ui/components/input/text.input"
import { H2, Small } from "@rewardkit/packages/ui/components/typography"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

type CommissionType = (typeof PROGRAM_COMMISSION_TYPE)[keyof typeof PROGRAM_COMMISSION_TYPE]

const CURRENCY_OPTIONS = buildCurrencyOptions()

const TYPE_OPTIONS = [
    { value: PROGRAM_COMMISSION_TYPE.PERCENTAGE, label: "Percentage" },
    { value: PROGRAM_COMMISSION_TYPE.FIXED, label: "Fixed amount" },
]

export const ProgramStep = () => {
    const { organization, isLoaded } = useOrganization()

    // Decide the mode once, on first load. Creating a program activates its org, and the form
    // must not flip to edit mode or remount in the middle of the submit.
    const [mode, setMode] = useState<"create" | "edit" | null>(null)
    useEffect(() => {
        if (isLoaded && mode === null) setMode(organization ? "edit" : "create")
    }, [isLoaded, organization, mode])

    // only fetch in edit mode: in create mode there is nothing to load
    const { program, isLoading } = useProgram({ enabled: mode === "edit" })

    if (!mode || (mode === "edit" && isLoading)) return null // or a skeleton

    return <ProgramForm program={mode === "edit" ? program : undefined} />
}

const ProgramForm = ({ program }: { program?: ProgramResource }) => {
    const isEdit = !!program?.id
    const router = useRouter()
    const { setActive } = useOrganizationList()
    const { session } = useSession()
    const { handleCreate, handleUpdate, create, isUpdating } = useProgram({ enabled: false })
    const formRef = useRef<HTMLFormElement>(null)
    const [isFilled, setIsFilled] = useState(false)

    // initial values come from the program in edit mode, and are empty in create mode
    const [currency, setCurrency] = useState(program?.currency ?? "USD")
    const [commissionType, setCommissionType] = useState<CommissionType>(
        (program?.commissionType as CommissionType) ?? PROGRAM_COMMISSION_TYPE.PERCENTAGE
    )
    const [commissionError, setCommissionError] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [websiteError, setWebsiteError] = useState<string | null>(null)

    const [subdomain, setSubdomain] = useState(program?.subdomain ?? "")
    const [subdomainEdited, setSubdomainEdited] = useState(false)
    const [subdomainTouched, setSubdomainTouched] = useState(false)
    const subdomainError = validateSubdomain(subdomain)
    const debounced = useDebounce(subdomain, 400)
    // an existing program's own subdomain would report "taken", so never check in edit mode
    const check = useCheckSubdomain(!isEdit && !subdomainError && debounced === subdomain ? debounced : "")
    const checkWebsite = (raw: string) => {
        if (!raw.trim()) return setWebsiteError(null) // `required` already handles empty
        const result = ZWebsiteUrl.safeParse(normalizeWebsiteUrl(raw))
        setWebsiteError(result.success ? null : (result.error.issues[0]?.message ?? "Enter a valid website"))
    }

    const isPercentage = commissionType === PROGRAM_COMMISSION_TYPE.PERCENTAGE
    const syncValidity = () => setIsFilled(formRef.current?.checkValidity() ?? false)

    useEffect(syncValidity)

    const validateCommission = (raw: string) => {
        if (raw === "") return setCommissionError(null)
        const n = Number(raw)
        if (n < 0) return setCommissionError("Commission can't be negative")
        if (isPercentage && n > 100) return setCommissionError("Percentage can't be more than 100")
        setCommissionError(null)
    }

    const availabilityError =
        !isEdit && !subdomainError && debounced === subdomain && check.isAvailable === false
            ? check.reason === "reserved"
                ? "This name is reserved"
                : "This subdomain is already taken"
            : null

    const displayedSubdomainError = (subdomainTouched ? subdomainError : null) ?? availabilityError

    const subdomainReady =
        isEdit || (!subdomainError && debounced === subdomain && !check.isChecking && check.isAvailable === true)

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setSubdomainTouched(true)

        if (!subdomainReady) {
            setError(subdomainError ?? availabilityError ?? "Wait for the subdomain availability check to finish")
            return
        }

        const data = new FormData(e.currentTarget)
        const website = ZWebsiteUrl.safeParse(normalizeWebsiteUrl(String(data.get("websiteUrl") ?? "")))
        if (!website.success) {
            setWebsiteError(website.error.issues[0]?.message ?? "Enter a valid website")
            return
        }
        const text = (key: string) => String(data.get(key) ?? "").trim()
        const productName = text("productName")

        const fields = {
            productName,
            name: `${productName}'s affiliate program`,
            currency,
            websiteUrl: website.data,
            commissionType,
            commissionValue: Number(text("commissionValue")),
        }

        // EDIT: update the program that is already there. The subdomain isn't sent
        if (program?.id) {
            const result = await handleUpdate({ programId: program.id, program: fields })
            if (result) router.push("/onboarding/integration")
            return
        }

        // CREATE: also creates the org, which we then activate
        const result = await handleCreate({ program: { ...fields, subdomain: subdomain.toLowerCase() } })
        if (result?.program) {
            await setActive?.({ organization: result.program.orgId })
            await session?.reload()
            window.history.replaceState(null, "", "/onboarding/program")
            router.push("/onboarding/integration")
        }
    }

    return (
        <form ref={formRef} onInput={syncValidity} onSubmit={handleSubmit} className="space-y-10 max-w-lg p-8 mx-auto">
            <div className="space-y-2">
                <Small>1/2</Small>
                <H2>Set up your program details</H2>
                <Small>These basics define how partners join and get rewarded. You can adjust anytime.</Small>
            </div>

            <div className="space-y-6">
                <TextInput
                    suffix="'s affiliate program"
                    name="productName"
                    label="Program name"
                    placeholder="Acme"
                    autoComplete="off"
                    defaultValue={program?.productName ?? ""}
                    required
                    onChange={(value) => {
                        if (!isEdit && !subdomainEdited) setSubdomain(toSubdomain(value))
                    }}
                />

                <TextInput
                    prefix="https://"
                    name="websiteUrl"
                    type="text"
                    inputMode="url"
                    autoComplete="off"
                    label="Default landing page URL"
                    placeholder="acme.com"
                    defaultValue={program?.websiteUrl?.replace(/^https?:\/\//, "") ?? ""}
                    onBlur={(e) => checkWebsite(e.currentTarget.value)}
                    onChange={() => websiteError && setWebsiteError(null)}
                    isError={!!websiteError}
                    errorMessage={websiteError ?? undefined}
                    required
                />

                <TextInput
                    label="Choose your subdomain for your partner portal"
                    suffix=".rewardkit.com"
                    name="subdomain"
                    value={subdomain}
                    disabled={isEdit} // the subdomain is the org slug, so it's fixed once created
                    onChange={(value) => {
                        setSubdomainEdited(true)
                        setSubdomainTouched(true)
                        setSubdomain(value.toLowerCase())
                    }}
                    onBlur={() => setSubdomainTouched(true)}
                    isLoading={!isEdit && !subdomainError && check.isChecking}
                    autoComplete="off"
                    isError={!!displayedSubdomainError}
                    errorMessage={displayedSubdomainError ?? undefined}
                    required
                />

                <ChipSelectInput
                    label="Currency"
                    options={[
                        { label: "USD", value: "USD" },
                        { label: "EUR", value: "EUR" },
                        { label: "GBP", value: "GBP" },
                        { label: "CHF", value: "CHF" },
                        { label: "INR", value: "INR" },
                    ]}
                    value={currency}
                    onChange={setCurrency}
                    required
                    renderOther={({ value, onChange, close }) => (
                        <CommandAvatarInput
                            options={CURRENCY_OPTIONS}
                            value={value}
                            placeholder="Select currency"
                            onChange={(v) => {
                                onChange(v)
                                close()
                            }}
                        />
                    )}
                />

                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Set your commission rate</span>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <TextInput
                                key={commissionType}
                                name="commissionValue"
                                type="number"
                                inputMode="decimal"
                                step="any"
                                min={0.01}
                                max={isPercentage ? 100 : undefined}
                                placeholder="0"
                                autoComplete="off"
                                suffix={isPercentage ? "%" : currency}
                                // only prefill while the type is unchanged: "20%" must never turn into "20 USD"
                                defaultValue={
                                    program && commissionType === program.commissionType
                                        ? String(program.commissionValue)
                                        : undefined
                                }
                                onChange={validateCommission}
                                isError={!!commissionError}
                                errorMessage={commissionError ?? undefined}
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <SelectInput
                                options={TYPE_OPTIONS}
                                value={commissionType}
                                onChange={(type) => {
                                    if (!type) return
                                    setCommissionType(type as CommissionType)
                                    setCommissionError(null)
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {create.isError && <p className="text-sm text-destructive">{create.error.message}</p>}

            <Button
                type="submit"
                isLoading={create.isPending || isUpdating}
                disabled={create.isPending || isUpdating || !isFilled || !subdomainReady || !!commissionError || !!websiteError}
                size="lg"
                className="w-full"
            >
                Next
            </Button>
        </form>
    )
}