import UserId from "../user/value-objects/user-id.vo";
import DeviceDeviceId from "./value-objects/device-device-id.vo";
import DeviceId from "./value-objects/device-id.vo";

type DeviceEntityProps = {
    id?: DeviceId;
    userId: UserId;
    deviceId: DeviceDeviceId;
    createdAt?: Date;
    updatedAt?: Date;
};

export class DeviceEntity {
    constructor(
        readonly id: DeviceId,
        readonly userId: UserId,
        readonly deviceId: DeviceDeviceId,
        readonly createdAt: Date,
        readonly updatedAt: Date,
    ) {
    }

    static create(
        props: DeviceEntityProps,
    ): DeviceEntity {
        const now = new Date();

        return new DeviceEntity(
            props.id ?? DeviceId.create(),
            props.userId,
            props.deviceId,
            props.createdAt ?? now,
            props.updatedAt ?? now,
        );
    }

}

export default DeviceEntity;
