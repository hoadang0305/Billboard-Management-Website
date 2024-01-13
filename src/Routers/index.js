const PointRouter = require("./point.routes");
const WardRouter = require("./ward.routes");
const DistrictRouter = require("./district.routes");
const PositionTypeRouter = require("./positionType.routes");
const PanelTypeRouter = require("./panelType.routes");
const AdsFormRouter = require("./adsForm.routes");
const PanelRouter = require("./panel.routes");
const ReportTypeRouter = require("./reportType.routes");
const ReportRouter = require("./report.routes");
const ReportImgRouter = require("./reportImg.routes");
const UserRouter = require("./user.routes");
const OtpRouter = require('./otp.routes');
const controlWardDistrictRouter = require('./controlward_district.routes');
const { authLogin } = require('../Middleware/authMiddleware');
const reportStatisticsRouter = require('./reportStatistics.routes');
const controlPanelTypeRouter = require('./controlPanelType.routes');
const controlReportTypeRouter = require('./controlReportType.routes');
const RegistrationRouter = require('./registration.routes');


const routes = (app) => {
  // đường dẫn dùng cho citizen
  app.use("/api/point", PointRouter);
  app.use("/api/ward", WardRouter);
  app.use("/api/district", DistrictRouter);
  app.use("/api/positionType", PositionTypeRouter);
  app.use("/api/adsForm", AdsFormRouter);
  app.use("/api/panel", PanelRouter);
  app.use("/api/panelType", PanelTypeRouter);
  app.use("/api/reportType", ReportTypeRouter);
  app.use("/api/report", ReportRouter);
  app.use("/api/reportImg", ReportImgRouter);
  app.use('/api/user', UserRouter);
  app.use('/api/otp', OtpRouter);
  app.use('/api/controlWardDistrict', controlWardDistrictRouter);

  app.use('/api/reportStatistics', reportStatisticsRouter)

  app.use('/api/controlPanelType', controlPanelTypeRouter);
  app.use('/api/controlReportType', controlReportTypeRouter);
  app.use('/api/registration', RegistrationRouter);

  //
  app.get("/", (req, res) => {
    if (res.locals.auth == false) {
      res.render("viewUser/login", {
        layout: false
      });
    } else {
      res.render("index", {
        authUserRole: JSON.stringify(res.locals.authUser)
      });
    }
  });
};

module.exports = routes;
