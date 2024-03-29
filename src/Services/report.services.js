const Report = require('../Models/Report');
const reportTypeService = require('./reportType.services');
const wardService = require('./ward.services');
const nodemailer = require('nodemailer');
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSEMAIL
    }
});

const createReport = (idPanel, locate, newReport, imgId, district, ward, address) => {
    return new Promise(async (resolve, reject) => {
        try {
            const createReport = await Report.create({
                idPanel: idPanel,
                locate: locate,
                reportType: newReport.reportType,
                name: newReport.name,
                email: newReport.email,
                phone: newReport.phone,
                content: newReport.content,
                reportPicture: imgId,
                district: district,
                ward: ward,
                address: address,
                state: 0,
                actionHandler: "Chưa xử lí"
            })
            if (createReport) {
                const mailOptions = {
                    from: 'Admin Map Application',
                    to: createReport.email,
                    subject: 'Báo cáo đã được gửi thành công',
                    html: `
                    <h3>Xin chào ${createReport.name}</h3>
                    <p>Chúng tôi đã nhận được báo cáo của bạn. Báo cáo sẽ được xử lí và thông báo sau</p>
                    <table>
                        <tr>
                            <td><h4>Địa chỉ: </h4></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><h4>${createReport.address}</h4></td>
                        </tr>   
                        <tr>
                            <td><h4>Tình trạng xử lí: </h4></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td style="color: red;"><h4>Chưa xử lí</h4></td>
                        </tr>
                        <tr>
                            <td><h4>Cách thức xử lí: </h4></td>
                            <td></td>
                            <td></td>
                            <td></td><td style="color: red;"><h4>Chưa xử lí</h4></td>
                        </tr>
                    </table>
                    `
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        reject(error)
                    }
                })
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: createReport
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const getAllReport = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const report = await Report.find();
            if (!report) {
                reject({
                    status: 'ERR',
                    message: 'listReport is empty'
                })
            }
            const reportList = await Promise.all(
                report.map(async (rp) => {
                    const newRp = { ...rp.toObject() };
                    newRp.reportType = (await reportTypeService.getReportTypeName(newRp.reportType)).data;
                    return newRp
                })
            )
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: reportList

            })
        } catch (e) {
            reject(e)
        }
    })
}

const getReportbyId = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const report = Report.findOne({ _id: id });
            if (!report) {
                reject({
                    status: 'ERR',
                    message: 'reportId does not exist'
                })
            }
            else {
                resolve(report)
            }
        } catch (error) {
            reject(error)
        }
    })
}

const getReportByWard = async (wardName) => {
    try {

        const reports = await Report.find({ ward: wardName });

        console.log(reports)
        return {
            status: 'OK',
            message: 'SUCCESS',
            data: reports,
        };
    } catch (error) {
        return {
            status: 'ERR',
            message: error.message,
        };
    }
};

const getReportByDis = async (disName) => {
    try {
        const reports = await Report.find({ district: disName });

        return {
            status: 'OK',
            message: 'SUCCESS',
            data: reports,
        };
    } catch (error) {
        return {
            status: 'ERR',
            message: error.message,
        };
    }
};

const getReportByWardAndDis = async (wardName, disName) => {
    try {
        const reports = await Report.find({ ward: wardName, district: disName });

        return {
            status: 'OK',
            message: 'SUCCESS',
            data: reports,
        };
    } catch (error) {
        return {
            status: 'ERR',
            message: error.message,
        };
    }
};

const getReportByEmail = async (email) => {
    try {
        const reports = await Report.find({ email: email });

        return {
            status: 'OK',
            message: 'SUCCESS',
            data: reports,
        };
    } catch (error) {
        return {
            status: 'ERR',
            message: error.message,
        };
    }
};

const getReportByWardAndDisAndEmail = async (wardName, disName, email) => {
    try {
        const reports = await Report.find({ ward: wardName, district: disName, email: email });

        return {
            status: 'OK',
            message: 'SUCCESS',
            data: reports,
        };
    } catch (error) {
        return {
            status: 'ERR',
            message: error.message,
        };
    }
};

const updateReport = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkReport = await Report.findOne({
                _id: id
            })
            if (checkReport === null) {
                reject('The Report is not defined');
            }
            const updatedReport = await Report.findByIdAndUpdate(id, data, { new: true })

            let color, status
            if (data.state == '1') {
                color = 'yellow';
                status = "Đang xử lí";
            } else if (data.state == '2') {
                color = 'green';
                status = "Đã xử lí";
            }
            const mailOptions = {
                from: 'Admin Map Application',
                to: updatedReport.email,
                subject: 'Cập nhập tình trạng báo cáo',
                html: `
                <h3>Xin chào ${updatedReport.name}</h3>
                <p>Báo cáo của bạn đã được xem xét. Dưới đây là tình trạng báo cáo của bạn</p>
                <table>
                    <tr>
                        <td><h4>Địa chỉ: </h4></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><h4>${updatedReport.address}</h4></td>
                    </tr>   
                    <tr>
                        <td><h4>Tình trạng xử lí: </h4></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td style="color: ${color};"><h4>${status}</h4></td>
                    </tr>
                    <tr>
                        <td><h4>Cách thức xử lí: </h4></td>
                        <td></td>
                        <td></td>
                        <td></td><td style="color: ${color};"><h4>${data.actionHandler}</h4></td>
                    </tr>
                </table>
                `
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    reject(error)
                }
            })
            resolve({
                status: 'OK',
                message: 'Update Report success',
                data: updatedReport
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getReportbyId,
    createReport,
    getAllReport,
    getReportByWard,
    getReportByDis,
    getReportByWardAndDis,
    getReportByEmail,
    getReportByWardAndDisAndEmail,
    updateReport
}