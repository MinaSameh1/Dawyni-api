"""Formats needed data from folder."""
import csv
import json


def move_data() -> None:
    """Format needed data from folder."""
    with open("drugs/MarketingStatus.txt", encoding="utf8") as market_status,\
            open("drugs/Products.txt", encoding="utf8") as products, \
            open('Output.csv', "w", encoding="utf8") as outfile:
        products_file = csv.reader(products, delimiter="\t")
        mrkt_stat = csv.reader(market_status, delimiter="\t")
        writer = csv.writer(outfile)
        writer.writerow([
            "drug_name",
            "form",
            "active_ingredient",
            "strength",
            "status"
        ])
        # Skip first row as its headers
        next(products_file)
        next(mrkt_stat)
        for line in products_file:
            line_mrkt = next(mrkt_stat)
            data: list = []
            if line[0] == line_mrkt[1]:
                data = [
                    line[5],
                    get_item(line[2]),
                    line[6],
                    get_item(line[3]),
                    get_market_status(int(line_mrkt[0]))
                ]
            else:
                data = [
                    line[5],
                    line[2],
                    line[6],
                    line[3],
                    "Unknown"
                ]
            writer.writerow(data)


def get_item(items: str) -> str:
    """Return items that have ; as str."""
    item_to_be_returned: list = []
    for item in items.split(';'):
        item_to_be_returned.append(item)
    return json.dumps(item_to_be_returned)


def get_market_status(status_code: int) -> str:
    """Get the status_code in string."""
    if status_code == 1:
        return "Prescription"
    if status_code == 2:
        return "Over-the-counter"
    if status_code == 3:
        return "Discontinued"
    if status_code == 4:
        return "None"
    return "Unknown"


if __name__ == "__main__":
    move_data()
