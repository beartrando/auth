import Id from "../value-objects/id.vo";
import DeviceId from "../value-objects/device/device-id.vo";

type DeviceEntityProps = {
    id?: Id;
    userId: Id;
    deviceId: DeviceId;
    createdAt?: Date;
    updatedAt?: Date;
};

export class DeviceEntity {
    constructor(
        readonly id: Id,
        readonly userId: Id,
        readonly deviceId: DeviceId,
        readonly createdAt: Date,
        readonly updatedAt: Date,
    ) {
    }

    static create(
        props: DeviceEntityProps,
    ): DeviceEntity {
        const now = new Date();

        return new DeviceEntity(
            props.id ?? Id.create(),
            props.userId,
            props.deviceId,
            props.createdAt ?? now,
            props.updatedAt ?? now,
        );
    }

}

export default DeviceEntity;
