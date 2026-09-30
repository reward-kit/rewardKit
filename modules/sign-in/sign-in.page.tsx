import { SignInForm } from "./form/sign-in.form"
import { Image } from "@rewardkit/packages/ui/components/image"
import { H1, Paragraph } from "@rewardkit/packages/ui/components/typography"
import { Suspense } from "react"

export default async function SignInPage() {

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-sm space-y-8">
                <div className="space-y-1 flex justify-center flex-col items-center mb-10 text-center">
                    <Image src={"/svg/rewardkit.svg"} priority className="w-32 mb-8" alt="RewardKit" />
                    <H1 className="text-xl">Login into RewardKit</H1>
                    <Paragraph className="text-muted-foreground">Simple affliate platform</Paragraph>
                </div>

                <Suspense fallback={<div className="h-40" />}>
                    <SignInForm />
                </Suspense>
            </div>
        </main>
    )
}