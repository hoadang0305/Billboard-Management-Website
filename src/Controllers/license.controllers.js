const licenseServices = require('../Services/license.services')
const licenseImgServices = require('../Services/licenseImg.services')

const createLicense = async (req, res) => {
    console.log(req.query);
    try {
        const file = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        }
        const imageId = (await licenseImgServices.sendLicenseImg(file)).data._id;
        const idPoint = req.query.point;
        const idPanel = req.query.panel;
        const { content, companyName, companyEmail, companyPhone, companyAddress, startDay, endDay } = req.body;
        console.log([idPoint, idPanel, content, imageId, companyName, companyEmail, companyPhone, companyAddress, startDay, endDay]);
        const response = await licenseServices.createLicense(idPoint, idPanel, content, imageId, companyName, companyEmail, companyPhone, companyAddress, startDay, endDay);
        if (response.status === "OK") {
            res.status(200).json(response)
        }
    } catch (error) {
        return res.status(404).json({
            message: error
        });
    }
}

const getAllLicense = async (req, res) => {
    try {
        const listLicense = await licenseServices.getAllLicense();
        res.status(200).json(listLicense);
    } catch (error) {
        return res.status(404).json({
            message: e
        });
    }
}

const getAcceptedLicenseByIdPanel = async (req, res) => {
    try {
        const idPanel = req.params.id
        const listLicense = await licenseServices.getAcceptedLicenseByIdPanel(idPanel);
        res.status(200).json(listLicense);
    } catch (error) {
        return res.status(404).json({
            message: e
        });
    }
}

const updateAccept = async (req, res) => {
    try {
        const { idLicense, accept } = req.body
        const response = await licenseServices.updateAccept(idLicense, accept);
        res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({
            message: e
        });
    }
}

const getLicenseByWardDis = async (req, res) => {
    try {
        const { wardName, districtName } = req.params;
        const listLicense = await licenseServices.getLicenseByWardDis(wardName, districtName);
        if (listLicense) {
            res.status(200).json(listLicense);
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const deleteLicense = async (req, res) => {
    try {
        const licenseId = req.params.id
        const response = await licenseServices.deleteLicense(licenseId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getLicenseByDis = async (req, res) => {
    try {
        const districtName = req.params.districtName;
        const listLicense = await licenseServices.getLicenseByDis(districtName);
        if (listLicense) {
            res.status(200).json(listLicense);
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const updateLicense = async (req, res) => {
    try {
        const licenseId = req.params.id
        const data = req.body
        if (!licenseId) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The licenseId is required'
            })
        }

        const response = await licenseServices.updateLicense(licenseId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createLicense,
    getAllLicense,
    getAcceptedLicenseByIdPanel,
    updateAccept,
    getLicenseByWardDis,
    deleteLicense,
    getLicenseByDis,
    updateLicense
}