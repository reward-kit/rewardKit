"use client"

import { useProgram } from "@rewardkit/packages/features/program/hooks/useProgram"
import { Button } from "@rewardkit/packages/ui/components/button"
import { H2, Small } from "@rewardkit/packages/ui/components/typography"
import { useRouter } from "next/navigation"
import {
    CodeBlock,
    CodeBlockCopyButton,
    CodeBlockHeader,
    CodeBlockLanguage,
    CodeBlockTitle,
} from "@rewardkit/packages/ui/components/code-block/code-block"

export const IntegrateStep = () => {
    const router = useRouter()
    const { program } = useProgram()


    const code = `
<script
  defer
  data-program-id="${program?.id}"
  src="https://reward-kit.com/js/script.js">
</script>
    `
    return (
        <div className="space-y-10 max-w-lg p-8 mx-auto">
            <div className="space-y-2">
                <Small>2/2</Small>
                <H2>Add script to your website</H2>
                <Small>Paste the snippet in the {"<head>"} of your site. </Small>
            </div>

            <div>
                <CodeBlock code={code.trim()} language="html">
                    <CodeBlockHeader>
                        <CodeBlockTitle>index.html</CodeBlockTitle>
                        <CodeBlockLanguage />
                        <CodeBlockCopyButton className="ml-auto" />
                    </CodeBlockHeader>
                </CodeBlock>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <Button size="lg" variant="outline" className={"col-span-1"} onClick={() => router.push("/onboarding/program")}>Previous</Button>
                <div></div>
                <Button type="submit" size="lg" className="w-full col-span-1" onClick={() => router.push("/w/")}>
                    Finish
                </Button>
            </div>
        </div>
    )
}