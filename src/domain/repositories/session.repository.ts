import SessionEntity from "../entities/session.entity";
import Id from "../value-objects/id";

export interface SessionRepository {
    findById(
        id: Id,
    ): Promise<SessionEntity | null>;

    findByUserId(
        userId: Id,
    ): Promise<SessionEntity[]>;

    save(
        session: SessionEntity,
    ): Promise<void>;

    deleteByUserId(
        userId: Id,
    ): Promise<void>;
}

export default SessionRepository;
