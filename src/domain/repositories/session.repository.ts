import SessionEntity from "../entities/session.entity";
import Id from "../value-objects/id.vo";

export interface SessionRepository {
    save(session: SessionEntity): Promise<void>;

    deleteByUserId(userId: Id): Promise<void>;
}

export default SessionRepository;
