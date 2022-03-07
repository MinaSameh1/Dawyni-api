"""Moves and shapes data from csv files  to store in mongodb."""
import logging
import sys

import pandas as pd
from pymongo import MongoClient
from pymongo.database import Database


def get_db() -> Database:
    """
    Responsible for database connection and document creation.

    @return MongoClient
    """
    con_string: str = "mongodb://" + \
        "127.0.0.1:27017/" + \
        "?directConnection=true&serverSelectionTimeoutMS=2000"

    client = MongoClient(con_string)

    # Create the db
    return client["drugs_db"]


def get_marketing_status(status: int) -> str:
    """
    Get marketing status depending on code.

    @param `status` (int): The Code we want to get status of,
    usually between 0 and 4.
    1 -> Prescription
    2 -> Over-the-counter
    3 -> Discontinued
    Default/Anything else -> Awaiting Approval

    @return Returns `str` of code.
    """
    if status == 1:
        return "Prescription"
    if status == 2:
        return "Over-the-counter"
    if status == 3:
        return "Discontinued"
    return "Awaiting Approval"


def main():
    """Handle everything function aka main."""
    logging.basicConfig(filename='move_data.log', level=logging.DEBUG)
    logging.debug("------- Starting -----------------------------------------")
    try:
        with(
             open(
                    "drugs/Products.txt", "r", encoding="utf8"
                ) as prods,
             open(
                    "drugs/MarketingStatus.txt", "r", encoding="utf8"
                ) as market_stat_file,
             open(
                    "BackupData.csv", "w", encoding="utf8"
                )
             ):
            products = pd.read_csv(prods, delimiter="\t")
            market_stat = pd.read_csv(market_stat_file, delimiter="\t")
            for index, row in enumerate(products):
                if market_stat.loc[index][1] == row[index][0]:
                    stat: str = get_marketing_status(market_stat.loc[index][2])
                print(f"{index}: ", row)
    except IOError as error:
        print("Failed to open files: %s" % error.strerror)
        logging.error("Failed to open files: %s", error.strerror)
    sys.exit(0)


if __name__ == "__main__":
    main()
