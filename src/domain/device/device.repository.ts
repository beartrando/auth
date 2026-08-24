import DeviceEntity from "../entities/device.entity";
import DeviceId from "../value-objects/device/device-id.vo";

export interface DeviceRepository {
    findByDeviceId(deviceId: DeviceId): Promise<DeviceEntity | null>;

    // findByUserId(userId: ProfileId): Promise<ProfileEntity[]>;

    // create(device: ProfileEntity): Promise<void>;

    save(device: DeviceEntity): Promise<void>;
}

export default DeviceRepository;
