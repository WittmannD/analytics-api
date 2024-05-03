import { format, transports } from 'winston';
import { WinstonModule } from 'nest-winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston/dist/winston.utilities';
import 'winston-daily-rotate-file';

export const WinstonLoggerServiceFactory = (appName: string) =>
  WinstonModule.createLogger({
    transports: [
      // let's log errors into its own file
      new transports.DailyRotateFile({
        filename: `logs/error.log`,
        level: 'error',
        format: format.combine(format.timestamp(), format.json()),

        datePattern: 'YYYY-MM-DD',
        zippedArchive: false,
        maxFiles: '30d',
      }),
      // logging all level
      new transports.DailyRotateFile({
        filename: `logs/combined.log`,
        format: format.combine(
          format.timestamp(),
          format.ms(),
          nestWinstonModuleUtilities.format.nestLike(appName, {
            prettyPrint: true,
          }),
        ),

        datePattern: 'YYYY-MM-DD',
        zippedArchive: false,
        maxFiles: '30d',
      }),
      // we also want to see logs in our console
      new transports.Console({
        format: format.combine(
          format.cli(),
          format.splat(),
          format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike(appName, {
            colors: true,
            prettyPrint: true,
          }),
        ),
      }),
    ],
  });
