"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memberRemodel = {
    asmat: {},
    newAsmat: {
        params: {
            memberRegister(payload) {
                const { phoneNumb, name, gender, email, work, birthPlace, birthDate, address, city, posCode, idNumber, memberType, expiredDate, isActive } = payload;
                return {
                    telp: phoneNumb,
                    nama: name,
                    jenis_kelamin: gender,
                    email,
                    pekerjaan: work,
                    tempat_lahir: birthPlace,
                    tanggal_lahir: birthDate,
                    alamat: address,
                    kota: city,
                    kode_pos: posCode,
                    no_ktp: idNumber,
                    jenis_member: memberType,
                    tanggal_expired: expiredDate,
                    is_aktif: isActive
                };
            },
            memberType(payload) {
                return payload;
            },
            memberDetail(payload) {
                return {
                    telp: payload.phoneNumb
                };
            }
        },
        response: {
            memberRegister(payload) {
                if (payload.tiketux.status != 'OK') {
                    return { message: payload.tiketux?.pesan };
                }
                const { kode_member } = payload.tiketux.result;
                return { memberCode: kode_member };
            },
            memberType(payload) {
                if (payload.tiketux.status != 'OK') {
                    return { message: payload.tiketux?.pesan };
                }
                const remodelData = payload.tiketux.result.map(({ nama: name, kode: code }) => ({
                    name,
                    code
                }));
                return remodelData;
            },
            memberDetail(payload) {
                if (payload.tiketux.status != 'OK') {
                    return { message: payload.tiketux?.pesan };
                }
                const { no_telp, nama, email, expired, point, point_reward, kode_member, kode_jenis_member, jenis_member, verified_telp, verified_email } = payload.tiketux.result;
                return {
                    phoneNumb: no_telp,
                    name: nama,
                    email,
                    expired,
                    point,
                    pointReward: point_reward,
                    memberCode: kode_member,
                    memberCodeType: kode_jenis_member,
                    memberType: jenis_member,
                    verifiedPhoneNumb: verified_telp,
                    verifiedEmail: verified_email,
                };
            }
        }
    }
};
exports.default = memberRemodel;
//# sourceMappingURL=member.js.map