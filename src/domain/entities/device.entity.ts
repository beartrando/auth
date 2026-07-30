import Id from "../value-objects/id.vo";
import DeviceId from "../value-objects/device-id.vo";

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
