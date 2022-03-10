"""Moves and shapes data from csv files  to store in mongodb."""
import logging
import sys

import pandas as pd
from pymongo import MongoClient
from pymongo.collection import Collection


def get_db() -> Collection:
    """
    Responsible for database connection and document creation.

    @return MongoClient
    """
    con_string: str = (
        "mongodb://"
        + "127.0.0.1:27017/"
        + "?directConnection=true&serverSelectionTimeoutMS=2000"
    )

    client = MongoClient(con_string)

    # Create the db
    db = client["Pharm"]
    return db["drugs"]


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
    logging.basicConfig(filename="move_data.log", level=logging.DEBUG)
    logging.debug("------- Starting -----------------------------------------")
    try:
        with (
            open("drugs/Products.txt", "r", encoding="utf8") as prods,
            open(
                "drugs/MarketingStatus.txt", "r", encoding="utf8"
            ) as market_stat_file,
            open("BackupData.csv", "w", encoding="utf8"),
        ):
            products = pd.read_table(prods)
            market_stat = pd.read_table(market_stat_file)
            mongo = get_db()
            db_rows: list[dict] = []
            for index, row in products.iterrows():
                if market_stat.loc[index][1] == row[0]:
                    stat: str = get_marketing_status(market_stat.loc[index][2])
                else:
                    stat: str = get_marketing_status(4)
                """
                This is how I will model the data:
                {
                    DrugName: string
                    Form: [{}]
                    Strength: []
                    ActiveIngredient: [{}]
                    stats: string
                }
                """
                # Create a dict object how we want it.
                unclean = str(row[2]).replace(" ", "")
                form: list = []
                for item in unclean.split(";"):
                    form.append(item)
                unclean = str(row[6])
                ingredients: list = []
                for item in unclean.split(";"):
                    ingredients.append(item)
                # Delete this
                unclean = None
                del unclean
                db_row = {
                    "drug_name": row[5],
                    "form": form,
                    "strength": str(row[3]),
                    "active_ingredients": ingredients,
                    "status": stat,
                }
                db_rows.append(db_row)
                # Insert many every 1k rows to make it faster
                if len(db_rows) == 1000:
                    mongo.insert_many(db_rows)
                    db_rows = []
                sys.stdout.write("\033[K" + "Index: " + str(index) + "\r")
            sys.stdout.write("\n")
    except IOError as error:
        print("Failed to open files: %s" % error.strerror)
        logging.error("Failed to open files: %s", error.strerror)
    sys.exit(0)


if __name__ == "__main__":
    main()
