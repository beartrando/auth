import {Device} from "@prisma/client";
import Id from "../../../domain/value-objects/id.vo";
import DeviceEntity from "../../../domain/entities/device.entity";
import DeviceId from "../../../domain/value-objects/device-id.vo";

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
            new Id(device.id),
            new Id(device.userId),
            new DeviceId(device.deviceId),
            device.createdAt,
            device.updatedAt,
        );
    }
}

export default DeviceDbMapper;
