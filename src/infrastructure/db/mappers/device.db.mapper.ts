import {Device} from "@prisma/client";
import DeviceEntity from "../../../domain/device/device.entity";
import DeviceId from "../../../domain/device/value-objects/device-id.vo";
import UserId from "../../../domain/user/value-objects/user-id.vo";
import DeviceDeviceId from "../../../domain/device/value-objects/device-device-id.vo";

type DeviceSaveData = Omit<
    Device,
    "createdAt" | "updatedAt"
>;

export class DeviceDbMapper {
    static toPersistence(device: DeviceEntity): DeviceSaveData {
        return {
            id: device.id.value,
            userId: device.userId.value,
            deviceId: device.deviceId.value,
            // createdAt: device.createdAt,
            // updatedAt: device.updatedAt,
        };
    }

    static toDomain(device: Device): DeviceEntity {
        return new DeviceEntity(
            new DeviceId(device.id),
            new UserId(device.userId),
            new DeviceDeviceId(device.deviceId),
            device.createdAt,
            device.updatedAt,
        );
    }
}

export default DeviceDbMapper;
