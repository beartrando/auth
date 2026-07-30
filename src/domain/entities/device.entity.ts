import Id from "../value-objects/id";
import DeviceId from "../value-objects/device-id";

export class DeviceEntity {
    constructor(
        readonly id: Id,

        readonly userId: Id,
        readonly deviceId: DeviceId,

        readonly createdAt: Date,
    ) {
    }
}

export default DeviceEntity;
