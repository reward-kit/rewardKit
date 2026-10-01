// permission.middleware.ts
import { NextResponse } from "next/server";
import { type MiddlewareFunction } from "next-zod-route";
import { z } from "zod";
import { type AuthContext } from "../routes/authed.route";
import { permissionsMetadataSchema } from "../types/permission.middleware.type";

type PermissionsMetadata = z.infer<typeof permissionsMetadataSchema>;

const forbidden = (message: string) =>
    NextResponse.json({ error: "Forbidden", message }, { status: 403 });

export const permissionCheckMiddleware: MiddlewareFunction = async ({
    next,
    metadata,
    ctx,
}) => {
    const meta = metadata as PermissionsMetadata | undefined;
    const requiredPermissions = meta?.requiredPermissions;
    // Allow access if route requires no specific scopes
    if (!requiredPermissions || requiredPermissions.length === 0) {
        return next();
    }

    const authCtx = ctx as AuthContext | undefined;
    const userPermissions: string[] = authCtx?.permissions ?? [];

    // Allow wildcard permissions for session users or full-access API keys
    if (userPermissions.includes("*")) {
        return next();
    }

    // Verify all required route permissions exist in user permissions
    const hasAllPermissions = requiredPermissions.every((perm: string) =>
        userPermissions.includes(perm)
    );

    if (!hasAllPermissions) {
        return forbidden("You do not have the required scope permissions for this action");
    }

    return next();
};