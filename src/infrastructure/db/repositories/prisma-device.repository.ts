import {PrismaClient} from "@prisma/client";

import DeviceRepository from "../../../domain/repositories/device.repository";
import DeviceEntity from "../../../domain/entities/device.entity";

import Id from "../../../domain/value-objects/id.vo";
import DeviceId from "../../../domain/value-objects/device-id.vo";

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

        return new DeviceEntity(
            new Id(device.id),

            new Id(device.userId),
            new DeviceId(device.deviceId),

            device.createdAt,
        );
    }

    async save(
        device: DeviceEntity,
    ): Promise<void> {

        await this.prisma.device.upsert({
            where: {
                id: device.id.value,
            },
            create: {
                id: device.id.value,

                userId: device.userId.value,
                deviceId: device.deviceId.value,
            },
            update: {
                userId: device.userId.value,
                deviceId: device.deviceId.value,
            },
        });
    }
}

export default PrismaDeviceRepository;