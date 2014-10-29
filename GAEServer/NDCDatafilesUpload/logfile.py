#
# Copyright: 	Kellerberrin 2014
# Author:	James McCulloch
#
import logging

LoggerName = "AppLogger"

def setupfilelogging(LogFileName):
    """Set up Python logging to console and log file"""

    Logger = logging.getLogger(LoggerName)
    Logger.setLevel(logging.INFO)

# Create a console log

    ConsoleLog = logging.StreamHandler()
    ConsoleLog.setLevel(logging.DEBUG)

# Create a logging format and add to the logging streams

    formatter = logging.Formatter(fmt='%(asctime)s - %(levelname)s - %(module)s - %(message)s')

    LogFormat = logging.Formatter('%(asctime)s - %(levelname)s - %(module)s - %(message)s')
    ConsoleLog.setFormatter(LogFormat)

# Add the console log stream to the logger

    Logger.addHandler(ConsoleLog)

    FileLog = logging.FileHandler(LogFileName)
    FileLog.setLevel(logging.DEBUG)
    FileLog.setFormatter(LogFormat)

    Logger.addHandler(FileLog)

    return Logger


def getAppLogger():

    return logging.getLogger(LoggerName)