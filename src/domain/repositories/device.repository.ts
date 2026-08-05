import DeviceEntity from "../entities/device.entity";
import DeviceId from "../value-objects/device-id.vo";

export interface DeviceRepository {
    findByDeviceId(deviceId: DeviceId): Promise<DeviceEntity | null>;

    // findByUserId(userId: DeviceId): Promise<DeviceEntity[]>;

    // create(device: DeviceEntity): Promise<void>;

    save(device: DeviceEntity): Promise<void>;
}

export default DeviceRepository;
