// import {Device} from "@prisma/client";
// import Id from "../../../domain/value-objects/id.vo";
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
//             new Id(device.id),
//             new Id(device.userId),
//             device.deviceId,
//             device.createdAt,
//             device.updatedAt,
//         );
//     }
// }
//
// export default DeviceDbMapper;
