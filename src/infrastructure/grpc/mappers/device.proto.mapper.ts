// import {Device} from "@prisma/client";
// import ProfileId from "../../../domain/value-objects/id.vo";
// import * as authProto from "../../../contracts/proto/auth";
// export class DeviceDbMapper {
//     static to(device: ProfileEntity): Device {
//         return {
//             device.id.value,
//             device.userId.value,
//             device.deviceId,
//             device.createdAt,
//             device.updatedAt,
//         };
//     }
//
//     static from(device: Device): ProfileEntity {
//         return new ProfileEntity(
//             new ProfileId(device.id),
//             new ProfileId(device.userId),
//             device.deviceId,
//             device.createdAt,
//             device.updatedAt,
//         );
//     }
// }
//
// export default DeviceDbMapper;
