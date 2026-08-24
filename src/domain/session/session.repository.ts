import SessionEntity from "../entities/session.entity";
import UserId from "../user/value-objects/user-id.vo";

export interface SessionRepository {
    save(session: SessionEntity): Promise<void>;

    deleteByUserId(userId: UserId): Promise<void>;
}

export default SessionRepository;
