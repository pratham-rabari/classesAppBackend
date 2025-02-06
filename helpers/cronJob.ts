const Sq = require('sequelize');
const models = require("./../models/index");
const moment = require('moment-timezone');
const cron = require('node-cron');


cron.schedule('*/10 * * * *', async () => {
    try {
      const now = new Date();

      // Create a new Date object and add 5 hours and 30 minutes
      const nowPlus5Hours30Minutes = new Date(now.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000);

      // Format the date and time
      const day = nowPlus5Hours30Minutes.getDate().toString().padStart(2, '0');
      const month = (nowPlus5Hours30Minutes.getMonth() + 1).toString().padStart(2, '0');
      const year = nowPlus5Hours30Minutes.getFullYear();

      const hours = nowPlus5Hours30Minutes.getHours().toString().padStart(2, '0');
      const minutes = nowPlus5Hours30Minutes.getMinutes().toString().padStart(2, '0');
      const seconds = nowPlus5Hours30Minutes.getSeconds().toString().padStart(2, '0');
      const milliseconds = nowPlus5Hours30Minutes.getMilliseconds().toString().padStart(3, '0');

      const formattedDate = `${year}-${month}-${day}`;
      const formattedTime = `${hours}:${minutes}:${seconds}`;
      const currentDateTime = `${formattedDate} ${formattedTime}`;

      // Update class statuses based on startDateTime and endClassTime
      let completed = await models.ClassSchedule.update(
        { status: 'Completed' },
        {
          where: {
            endClassTime: {
              [Sq.Op.lt]: currentDateTime
            },
            status: 'Continue' //remove
          }
        }
      );


      let current = await models.ClassSchedule.update(
        { status: 'Continue' },
        {
          where: {
            startDateTime: {
              [Sq.Op.lt]: currentDateTime, // Mark as Continue if startDateTime has passed
            },
            endClassTime: {
              [Sq.Op.gt]: currentDateTime // and endClassTime has not passed
            },
            status: 'Pending' // Only update Pending classes
          }
        }
      );
      let leftBehind = await models.ClassSchedule.update(
        { status: 'Completed' },
        {
          where: {
            startDateTime: {
              [Sq.Op.lt]: currentDateTime, // Mark as Continue if startDateTime has passed
            },
            endClassTime: {
              [Sq.Op.lt]: currentDateTime // and endClassTime has not passed
            },
            status: 'Pending' // Only update Pending classes
          }
        }
      );    
    } catch (error) {
      console.error('Error updating class statuses:', error);
    }
  });