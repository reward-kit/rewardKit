import { ApiKey } from "./models/api-key.model";
import { Organization } from "./models/organization.model";
import { Program } from "./models/program.model";
import { User } from "./models/user.model";

export const db = {
    user: User,
    organization: Organization,
    program: Program,
    apiKey: ApiKey
}