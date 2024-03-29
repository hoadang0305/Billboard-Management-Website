const District = require("../Models/District");
const Ward = require("../Models/Ward")

const createDistrict = (newDistrict) => {
    return new Promise(async (resolve, reject) => {
        try {
            const disName = newDistrict.disName;
            const checkDistrictName = await District.findOne({
                disName: disName,
            });
            if (checkDistrictName !== null) {
                resolve({
                    status: "ERR",
                    message: "The District is already",
                });
            }

            if (checkDistrictName === null) {
                let disId;
                const cleanedNamedis = disName.trim();
                const withoutPrefixdis = cleanedNamedis.replace("Quận ", "")
                if (withoutPrefixdis.length > 2) {
                    disId = 'Q' + withoutPrefixdis.split(' ').map(word => word[0]).join('');
                }
                else {
                    disId = 'Q' + (withoutPrefixdis.length === 2 ? withoutPrefixdis : '0' + withoutPrefixdis)
                }
                console.log(disId);
                const newDistrict = await District.create({
                    disId: disId,
                    disName: disName,
                });
                if (newDistrict) {
                    resolve({
                        status: "OK",
                        message: "SUCCESS",
                        data: newDistrict,
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getDistrictName = (disId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkDistric = await District.findOne({
                disId: disId,
            });
            if (checkDistric == null) {
                reject({
                    status: "ERR",
                    message: "The disId not found",
                });
            } else {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: checkDistric.disName,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const updateDistrict = (disId, districtName) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(districtName);
            const checkDisName = await District.findOne({
                disName: districtName
            });
            console.log(checkDisName);
            if (checkDisName !== null) {
                resolve({
                    status: "ERR",
                    message: "District Name is already in use"
                })
            }
            const updatedDistrict = await District.findOneAndUpdate(
                { disId: disId },
                districtName,
                { new: true }
            );
            resolve({
                status: 'OK',
                message: 'Update District success',
                data: updatedDistrict
            });
        } catch (e) {
            reject(e);
        }
    });
};

const deleteDistrict = (disId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Ward.deleteMany({ districtRefId: disId })
            await District.findOneAndDelete({ disId: disId });
            resolve({
                status: 'OK',
                message: 'Delete District success',
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllDis = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allDis = await District.find()
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allDis

            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDisById = (disId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkDistrict = await District.findOne({
                disId: disId,
            });
            if (checkDistrict == null) {
                reject({
                    status: "ERR",
                    message: "The dis not found",
                });
            } else {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: checkDistrict,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    createDistrict,
    getDistrictName,
    updateDistrict,
    deleteDistrict,
    getAllDis,
    getDisById
};
