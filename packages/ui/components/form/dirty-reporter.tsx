
import React from "react"

interface DirtyReporterProps {
    isDefaultValue: boolean
    onDirtyChange?: (dirty: boolean) => void
}

export const DirtyReporter = ({ isDefaultValue, onDirtyChange }: DirtyReporterProps) => {
    React.useEffect(() => {
        onDirtyChange?.(!isDefaultValue)
    }, [isDefaultValue, onDirtyChange])

    return null
}