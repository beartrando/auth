import {PrismaClient} from "@prisma/client";

import DeviceRepository from "../../../domain/device/device.repository";
import DeviceEntity from "../../../domain/device/device.entity";
import DeviceId from "../../../domain/device/value-objects/device-id.vo";
import DeviceDbMapper from "../mappers/device.mapper";

export class PrismaDeviceRepository implements DeviceRepository {

    constructor(
        private readonly prisma: PrismaClient,
    ) {
    }

    async findByDeviceId(
        deviceId: DeviceId,
    ): Promise<DeviceEntity | null> {

        const device = await this.prisma.device.findUnique({
            where: {
                deviceId: deviceId.value,
            },
        });

        if (!device) {
            return null;
        }

        return DeviceDbMapper.toDomain(device);
    }

    async save(
        device: DeviceEntity,
    ): Promise<void> {

        const deviceDb = DeviceDbMapper.toPersistence(device);

        const {
            id,
            userId,
            deviceId,
            ...update
        } = deviceDb;

        await this.prisma.device.upsert({
            where: {
                deviceId: deviceDb.deviceId,
            },
            create: deviceDb,
            update,
        });
    }
}

export default PrismaDeviceRepository;
