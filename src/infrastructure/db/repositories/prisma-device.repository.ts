import {PrismaClient} from "@prisma/client";

import DeviceRepository from "../../../domain/repositories/device.repository";
import DeviceEntity from "../../../domain/entities/device.entity";
import DeviceId from "../../../domain/value-objects/device-id.vo";
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

        return DeviceDbMapper.toEntity(device);
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
