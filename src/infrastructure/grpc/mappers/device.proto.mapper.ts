// import {Device} from "@prisma/client";
// import DeviceId from "../../../domain/value-objects/id.vo";
// import * as authProto from "../../../contracts/proto/auth";
// export class DeviceDbMapper {
//     static to(device: DeviceEntity): Device {
//         return {
//             device.id.value,
//             device.userId.value,
//             device.deviceId,
//             device.createdAt,
//             device.updatedAt,
//         };
//     }
//
//     static from(device: Device): DeviceEntity {
//         return new DeviceEntity(
//             new DeviceId(device.id),
//             new DeviceId(device.userId),
//             device.deviceId,
//             device.createdAt,
//             device.updatedAt,
//         );
//     }
// }
//
// export default DeviceDbMapper;
