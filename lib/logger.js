import { fromJson } from "winston-config";
import winston from "winston";

const loggerConfig = {
  default: {
    console: {
      level: "debug",
      colorize: true,
      timestamp: true,
      label: "tbd",
    },
    file: {
      level: "debug",
      filename: "log/audits.log",
      timestamp: true,
      label: "tbd",
      json: false,
      maxsize: 500000,
      maxFiles: 10,
    },
  },
};

fromJson(loggerConfig, (err) => {
  if (err) throw err;
});

export default winston.createLogger({
  level: "debug",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "log/audits.log" }),
  ],
});
