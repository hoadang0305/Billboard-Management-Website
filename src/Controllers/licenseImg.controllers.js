const licenseImgServices = require("../Services/licenseImg.services")

const getImgLicense = async (req, res) => {
    try {
        const imageId = req.params.id
        if (!imageId) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The Imageid is required'
            })
        }
        const img = await licenseImgServices.getLicenseImg(imageId);
        res.contentType(img.data.contentType);
        res.send(img.data.data);
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }

}

module.exports = {
    getImgLicense
}