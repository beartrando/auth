import * as healthProto from "../../contracts/proto/common/health";
import messageService, {MessageService} from "../../infrastructure/message/message.service";
import dbService, {DbService} from "../../infrastructure/db/db.service";
import jobService, {JobService} from "../../infrastructure/job/job.service";
import config from "../../infrastructure/app/config";
import logger from "@shared/logger";

export class HealthUseCase {
    constructor(
        private readonly dbService: DbService,
        private readonly messageService: MessageService,
        private readonly jobService: JobService,
    ) {
    }

    private toHealthStatus(ok: boolean): healthProto.HealthStatus {
        return ok
            ? healthProto.HealthStatus.HEALTH_STATUS_OK
            : healthProto.HealthStatus.HEALTH_STATUS_FAIL;
    }

    async execute(): Promise<healthProto.HealthReport> {
        const [dbOk, messageOk, jobOk] = await Promise.all([this.dbService.check(), this.messageService.check(), this.jobService.check()]);

        const components = {
            db: dbOk,
            message: messageOk,
            job: jobOk,
        };

        return {
            service: config.appName,
            status: this.toHealthStatus(
                Object.values(components).every(Boolean),
            ),
            components: Object.fromEntries(
                Object.entries(components).map(([name, ok]) => [
                    name,
                    this.toHealthStatus(ok),
                ]),
            ),
            timestamp: new Date(),
        };
    }
}

const healthUseCase = new HealthUseCase(dbService, messageService, jobService);

export default healthUseCase;

