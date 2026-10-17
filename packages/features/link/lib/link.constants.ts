import { URL_PARAMETER, type UrlParameter } from "@rewardkit/packages/types/program/program.schema"

// how each supported parameter is shown in the picker
export const PARAM_LABELS: Record<UrlParameter, string> = {
    [URL_PARAMETER.REF]: "?ref=",
    [URL_PARAMETER.VIA]: "?via=",
    [URL_PARAMETER.AFF]: "?aff=",
}

export type ParamOption = { value: UrlParameter; label: string }

// constant: every supported parameter, used as the fallback
export const ALL_PARAM_OPTIONS: ParamOption[] = Object.values(URL_PARAMETER).map((value) => ({
    value,
    label: PARAM_LABELS[value],
}))

// the subset a program allows, or everything when none are configured
export const getParamOptions = (urlParams?: UrlParameter[] | null): ParamOption[] =>
    urlParams?.length
        ? ALL_PARAM_OPTIONS.filter((o) => urlParams.includes(o.value))
        : ALL_PARAM_OPTIONS

export const isUrlParameter = (value: string): value is UrlParameter =>
    (Object.values(URL_PARAMETER) as string[]).includes(value)

export const buildLinkPreview = (websiteUrl: string | undefined, urlParam: string, code: string) => {
    const base = (websiteUrl ?? "").replace(/\/+$/, "")
    return `${base}/?${urlParam}=${code.trim()}`
}