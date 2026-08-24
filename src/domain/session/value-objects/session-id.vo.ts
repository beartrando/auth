import Id from "../../common/value-objects/id.vo";
import {randomUUID} from "crypto";

export class SessionId extends Id<SessionId> {
}

export default SessionId;
