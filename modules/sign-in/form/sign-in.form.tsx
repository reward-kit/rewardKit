"use client"

import { useAuth, useSignIn } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Button } from "@rewardkit/packages/ui/components/button"
import { Image } from "@rewardkit/packages/ui/components/image"
import { Input } from "@rewardkit/packages/ui/components/input"
import { OtpInput } from "@rewardkit/packages/ui/components/otp-input"
import { Paragraph } from "@rewardkit/packages/ui/components/typography"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

const AFTER_SIGN_IN_URL = "/w"
const OTP_LENGTH = 6
const RESEND_COOLDOWN_SECONDS = 25

// Only allow same-origin redirects (prevents open-redirect abuse via ?redirect_url=)
const resolveRedirect = (raw: string | null) => {
    if (!raw) return AFTER_SIGN_IN_URL
    try {
        const url = new URL(raw, window.location.origin)
        if (url.origin !== window.location.origin) return AFTER_SIGN_IN_URL
        return url.pathname + url.search + url.hash
    } catch {
        return AFTER_SIGN_IN_URL
    }
}

export function SignInForm() {
    const { signIn, errors, fetchStatus } = useSignIn()
    const router = useRouter()
    const { isSignedIn } = useAuth()
    const searchParams = useSearchParams()
    const isFetching = fetchStatus === "fetching"
    const [email, setEmail] = useState<string | null>(null);
    const [step, setStep] = useState<"email" | "otp">("email")

    const [code, setCode] = useState("")
    const [cooldown, setCooldown] = useState(0)

    // Resend countdown
    useEffect(() => {
        if (cooldown <= 0) return
        const timer = setTimeout(() => setCooldown((c) => c - 1), 1000)
        return () => clearTimeout(timer)
    }, [cooldown])

    const handleBack = () => {
        signIn.reset()
        setStep("email")
        setCode("")
        setCooldown(0)
    }

    const finalize = async () => {
        const redirectUrl = resolveRedirect(searchParams.get("redirect_url"))

        await signIn.finalize({
            navigate: ({ session, decorateUrl }) => {
                // Session tasks (e.g. choose organization) still pending
                if (session?.currentTask) {
                    console.log(session.currentTask)
                    return
                }
                const url = decorateUrl(redirectUrl)
                if (url.startsWith("http")) {
                    window.location.href = url
                } else {
                    router.push(url)
                }
            },
        })
    }

    // Step 1: email only, then send a one-time code
    const handleSubmit = async (formData: FormData) => {
        const emailAddress = formData.get("email") as string

        const { error: createError } = await signIn.create({ identifier: emailAddress })
        if (createError) {
            console.error(JSON.stringify(createError, null, 2))
            return
        }

        const { error: sendError } = await signIn.emailCode.sendCode()
        if (sendError) {
            console.error(JSON.stringify(sendError, null, 2))
            return
        }

        setStep("otp")
        setCooldown(RESEND_COOLDOWN_SECONDS)
    }

    // Step 2: verify the code (auto-runs when all digits are entered or pasted)
    const handleVerify = async (value: string) => {
        if (value.length !== OTP_LENGTH || isFetching) return

        const { error } = await signIn.emailCode.verifyCode({ code: value })
        if (error) {
            console.error(JSON.stringify(error, null, 2))
            setCode("") // OtpInput refocuses the first box when cleared
            return
        }

        if (signIn.status === "complete") {
            await finalize()
        } else {
            console.error("Verification not complete:", signIn)
        }
    }

    const handleResend = async () => {
        if (cooldown > 0 || isFetching) return

        const { error } = await signIn.emailCode.sendCode()
        if (error) {
            console.error(JSON.stringify(error, null, 2))
            return
        }

        setCode("")
        setCooldown(RESEND_COOLDOWN_SECONDS)
    }

    // Google / Microsoft
    const handleSso = async (strategy: "oauth_google" | "oauth_microsoft") => {
        const { error } = await signIn.sso({
            strategy,
            redirectUrl: resolveRedirect(searchParams.get("redirect_url")),
            redirectCallbackUrl: "/sso-callback",
        })
        if (error) console.error(JSON.stringify(error, null, 2))
    }

    if (signIn.status === "complete" || isSignedIn) {
        return (
            <div className="flex items-center justify-center mt-18">
                <Paragraph className="font-medium tracking-tight text-sm">Please wait. Logging in you.</Paragraph>
            </div>
        )
    }
    // Code was sent, ask for it
    if (step === "otp" && signIn.status === "needs_first_factor") {
        const invalid = !!errors.fields.code

        return (
            <div className="space-y-8 flex flex-col items-center">
                <div className="space-y-0.5 text-center">
                    <Paragraph className="text-muted-foreground text-sm font-medium">We sent a verification code</Paragraph>
                    <Paragraph className="text-sm font-medium text-muted-foreground">
                        to <span className="text-foreground">{email}</span>
                    </Paragraph>
                </div>

                <form action={() => handleVerify(code)} className="space-y-4">
                    <div className="space-y-2">
                        <OtpInput
                            id="code"
                            length={OTP_LENGTH}
                            value={code}
                            onChange={setCode}
                            onComplete={handleVerify}
                            invalid={invalid}
                        />
                        {errors.fields.code && (
                            <p className="text-sm font-medium tracking-tight text-red-600">{errors.fields.code.longMessage}</p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        size={"lg"}
                        disabled={isFetching || code.length !== OTP_LENGTH}
                        className="w-full font-semibold"
                        isLoading={isFetching}
                    >
                        Verify
                    </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    {cooldown > 0 ? (
                        <>Resend code in {cooldown}s</>
                    ) : (
                        <>
                            Didn&apos;t get it?{" "}
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={isFetching}
                                className="font-medium text-foreground underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50"
                            >
                                Resend
                            </button>
                        </>
                    )}
                </p>

                <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center justify-center w-fit cursor-pointer bg-secondary p-2 rounded-full gap-1 self-center text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                    <ChevronLeft size={16} />
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-4">

            <form action={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="w-full"
                        placeholder="Email Address"
                        onChange={(e) => setEmail(e.target.value)}
                        variant={"lg"}
                    />
                    {errors.fields.identifier && (
                        <p className="text-sm font-medium tracking-tight text-red-600">{errors.fields.identifier.longMessage}</p>
                    )}
                </div>

                {errors.global?.[0] && (
                    <p className="text-sm font-medium tracking-tight text-red-600">{errors.global[0].longMessage}</p>
                )}

                <Button
                    type="submit"
                    size="lg"
                    disabled={isFetching || !email}
                    className="w-full relative"
                    isLoading={isFetching}
                >
                    Continue with email
                </Button>
            </form>

            <div className="grid grid-cols-2 gap-2">
                <Button
                    type="button"
                    size="lg"
                    onClick={() => handleSso("oauth_google")}
                    disabled={isFetching}
                    variant="secondary"
                    className="gap-3 text-muted-foreground"
                >
                    <Image src="/svg/google.svg" priority className="size-5" alt="Google" />
                    Google
                </Button>

                <Button
                    type="button"
                    size="lg"
                    onClick={() => handleSso("oauth_microsoft")}
                    disabled={isFetching}
                    variant="secondary"
                    className="gap-3 text-muted-foreground"
                >
                    <Image src="/svg/microsoft.svg" priority className="size-4.5" alt="Microsoft" />
                    Microsoft
                </Button>
            </div>


            <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="font-medium underline">
                    Sign up
                </Link>
            </p>
        </div>
    )
}